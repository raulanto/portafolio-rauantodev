---
title: "Django REST Framework"
date: "2025-09-29"
description: "Django REST Framework: Modelos, Serializers, Vistas y Casos de Uso Complejos"
tags: ["Django", "Python",'restApi']
name: "restdjango "
author: "raulanto"
author_avatar: 'https://avatars.githubusercontent.com/u/74162376?v=4'
author_description: "Desarrollador Full Stack "
thumbnail: /neat.png
---


# Django REST Framework

## Modelos, Serializers, Vistas y Casos de Uso Complejos

## 1. MODELOS - Casos Complejos

### 1.1 Modelo Base Abstracto (para compartir campos comunes)

```python [core/models.py] 

from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()

class TimeStampedModel(models.Model):
    """Modelo abstracto con timestamps"""
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        abstract = True
        ordering = ['-created_at']

class AuditableModel(TimeStampedModel):
    """Modelo abstracto con auditoría"""
    created_by = models.ForeignKey(
        User, 
        on_delete=models.SET_NULL,
        null=True,
        related_name='%(class)s_created'
    )
    updated_by = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        related_name='%(class)s_updated'
    )
    
    class Meta:
        abstract = True
```

### 1.2 Modelos con Relaciones Complejas

```python [apps/ecommerce/models.py] 

from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator
from django.utils.text import slugify
from core.models import TimeStampedModel, AuditableModel

class Category(TimeStampedModel):
    """Categoría con jerarquía (auto-referencial)"""
    name = models.CharField(max_length=100)
    slug = models.SlugField(unique=True, blank=True)
    description = models.TextField(blank=True)
    parent = models.ForeignKey(
        'self',
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name='children'
    )
    is_active = models.BooleanField(default=True)
    image = models.ImageField(upload_to='categories/', blank=True, null=True)
    
    class Meta:
        verbose_name_plural = 'Categories'
        ordering = ['name']
    
    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)
    
    def __str__(self):
        return self.name
    
    @property
    def full_path(self):
        """Ruta completa de la categoría"""
        if self.parent:
            return f"{self.parent.full_path} > {self.name}"
        return self.name

class Product(AuditableModel):
    """Producto con múltiples características"""
    STATUS_CHOICES = [
        ('draft', 'Borrador'),
        ('active', 'Activo'),
        ('inactive', 'Inactivo'),
        ('out_of_stock', 'Sin Stock'),
    ]
    
    name = models.CharField(max_length=200)
    slug = models.SlugField(unique=True, blank=True)
    sku = models.CharField(max_length=50, unique=True)
    description = models.TextField()
    short_description = models.CharField(max_length=500, blank=True)
    
    # Relaciones
    category = models.ForeignKey(
        Category,
        on_delete=models.PROTECT,
        related_name='products'
    )
    tags = models.ManyToManyField('Tag', related_name='products', blank=True)
    
    # Precios e inventario
    price = models.DecimalField(max_digits=10, decimal_places=2)
    compare_price = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        null=True,
        blank=True,
        help_text='Precio antes del descuento'
    )
    cost = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        help_text='Costo del producto'
    )
    stock = models.IntegerField(default=0)
    min_stock = models.IntegerField(default=5)
    
    # Estado y configuración
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='draft'
    )
    is_featured = models.BooleanField(default=False)
    allow_backorder = models.BooleanField(default=False)
    
    # Dimensiones y peso
    weight = models.DecimalField(
        max_digits=6,
        decimal_places=2,
        null=True,
        blank=True,
        help_text='Peso en kg'
    )
    length = models.DecimalField(max_digits=6, decimal_places=2, null=True, blank=True)
    width = models.DecimalField(max_digits=6, decimal_places=2, null=True, blank=True)
    height = models.DecimalField(max_digits=6, decimal_places=2, null=True, blank=True)
    
    # SEO
    meta_title = models.CharField(max_length=70, blank=True)
    meta_description = models.CharField(max_length=160, blank=True)
    
    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['slug']),
            models.Index(fields=['sku']),
            models.Index(fields=['status']),
        ]
    
    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)
    
    def __str__(self):
        return self.name
    
    @property
    def is_on_sale(self):
        return self.compare_price and self.compare_price > self.price
    
    @property
    def discount_percentage(self):
        if self.is_on_sale:
            return int(((self.compare_price - self.price) / self.compare_price) * 100)
        return 0
    
    @property
    def needs_restock(self):
        return self.stock <= self.min_stock

class ProductImage(TimeStampedModel):
    """Imágenes del producto"""
    product = models.ForeignKey(
        Product,
        on_delete=models.CASCADE,
        related_name='images'
    )
    image = models.ImageField(upload_to='products/%Y/%m/')
    alt_text = models.CharField(max_length=200, blank=True)
    is_primary = models.BooleanField(default=False)
    order = models.IntegerField(default=0)
    
    class Meta:
        ordering = ['order', '-is_primary']
    
    def save(self, *args, **kwargs):
        # Si es la imagen principal, desmarcar las demás
        if self.is_primary:
            ProductImage.objects.filter(
                product=self.product,
                is_primary=True
            ).update(is_primary=False)
        super().save(*args, **kwargs)

class ProductVariant(TimeStampedModel):
    """Variantes del producto (tallas, colores, etc.)"""
    product = models.ForeignKey(
        Product,
        on_delete=models.CASCADE,
        related_name='variants'
    )
    name = models.CharField(max_length=100)
    sku = models.CharField(max_length=50, unique=True)
    price_adjustment = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        default=0,
        help_text='Ajuste al precio base'
    )
    stock = models.IntegerField(default=0)
    attributes = models.JSONField(
        default=dict,
        help_text='{"color": "Rojo", "size": "M"}'
    )
    
    def __str__(self):
        return f"{self.product.name} - {self.name}"
    
    @property
    def final_price(self):
        return self.product.price + self.price_adjustment

class Review(AuditableModel):
    """Reseñas de productos"""
    product = models.ForeignKey(
        Product,
        on_delete=models.CASCADE,
        related_name='reviews'
    )
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='reviews'
    )
    rating = models.IntegerField(
        validators=[MinValueValidator(1), MaxValueValidator(5)]
    )
    title = models.CharField(max_length=200)
    comment = models.TextField()
    is_verified_purchase = models.BooleanField(default=False)
    is_approved = models.BooleanField(default=False)
    helpful_count = models.IntegerField(default=0)
    
    class Meta:
        unique_together = ['product', 'user']
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.user.username} - {self.product.name} ({self.rating}★)"

class Tag(models.Model):
    """Etiquetas para productos"""
    name = models.CharField(max_length=50, unique=True)
    slug = models.SlugField(unique=True, blank=True)
    
    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)
    
    def __str__(self):
        return self.name

class Order(AuditableModel):
    """Orden de compra"""
    STATUS_CHOICES = [
        ('pending', 'Pendiente'),
        ('processing', 'Procesando'),
        ('shipped', 'Enviado'),
        ('delivered', 'Entregado'),
        ('cancelled', 'Cancelado'),
        ('refunded', 'Reembolsado'),
    ]
    
    PAYMENT_STATUS_CHOICES = [
        ('pending', 'Pendiente'),
        ('paid', 'Pagado'),
        ('failed', 'Fallido'),
        ('refunded', 'Reembolsado'),
    ]
    
    order_number = models.CharField(max_length=20, unique=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='orders')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    payment_status = models.CharField(
        max_length=20,
        choices=PAYMENT_STATUS_CHOICES,
        default='pending'
    )
    
    # Totales
    subtotal = models.DecimalField(max_digits=10, decimal_places=2)
    tax = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    shipping_cost = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    discount = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    total = models.DecimalField(max_digits=10, decimal_places=2)
    
    # Información de envío
    shipping_address = models.JSONField()
    billing_address = models.JSONField()
    
    # Notas
    customer_notes = models.TextField(blank=True)
    admin_notes = models.TextField(blank=True)
    
    # Tracking
    tracking_number = models.CharField(max_length=100, blank=True)
    shipped_at = models.DateTimeField(null=True, blank=True)
    delivered_at = models.DateTimeField(null=True, blank=True)
    
    def __str__(self):
        return f"Order {self.order_number}"
    
    def save(self, *args, **kwargs):
        if not self.order_number:
            import uuid
            self.order_number = f"ORD-{uuid.uuid4().hex[:8].upper()}"
        super().save(*args, **kwargs)

class OrderItem(models.Model):
    """Items de una orden"""
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='items')
    product = models.ForeignKey(Product, on_delete=models.PROTECT)
    variant = models.ForeignKey(
        ProductVariant,
        on_delete=models.PROTECT,
        null=True,
        blank=True
    )
    quantity = models.IntegerField(validators=[MinValueValidator(1)])
    unit_price = models.DecimalField(max_digits=10, decimal_places=2)
    total_price = models.DecimalField(max_digits=10, decimal_places=2)
    
    def save(self, *args, **kwargs):
        self.total_price = self.unit_price * self.quantity
        super().save(*args, **kwargs)
    
    def __str__(self):
        return f"{self.product.name} x {self.quantity}"
```

## 2. SERIALIZERS - Casos Complejos

### 2.1 Serializers Básicos y Anidados

```python [apps/ecommerce/serializers.py] 

from rest_framework import serializers
from .models import (
    Category, Product, ProductImage, ProductVariant,
    Review, Tag, Order, OrderItem
)
from django.contrib.auth import get_user_model

User = get_user_model()

# Serializer simple para referencias
class CategoryListSerializer(serializers.ModelSerializer):
    """Serializer simple para listas"""
    class Meta:
        model = Category
        fields = ['id', 'name', 'slug']

class CategoryDetailSerializer(serializers.ModelSerializer):
    """Serializer detallado con subcategorías"""
    children = serializers.SerializerMethodField()
    products_count = serializers.SerializerMethodField()
    full_path = serializers.ReadOnlyField()
    
    class Meta:
        model = Category
        fields = [
            'id', 'name', 'slug', 'description', 'parent',
            'children', 'full_path', 'products_count',
            'is_active', 'image', 'created_at'
        ]
    
    def get_children(self, obj):
        # Serializar subcategorías recursivamente
        children = obj.children.filter(is_active=True)
        return CategoryListSerializer(children, many=True).data
    
    def get_products_count(self, obj):
        return obj.products.filter(status='active').count()

class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = ['id', 'name', 'slug']

class ProductImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductImage
        fields = ['id', 'image', 'alt_text', 'is_primary', 'order']

class ProductVariantSerializer(serializers.ModelSerializer):
    final_price = serializers.ReadOnlyField()
    
    class Meta:
        model = ProductVariant
        fields = [
            'id', 'name', 'sku', 'price_adjustment',
            'final_price', 'stock', 'attributes'
        ]

class ReviewSerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField(read_only=True)
    user_avatar = serializers.SerializerMethodField()
    
    class Meta:
        model = Review
        fields = [
            'id', 'user', 'user_avatar', 'rating', 'title',
            'comment', 'is_verified_purchase', 'helpful_count',
            'created_at'
        ]
        read_only_fields = ['user', 'is_verified_purchase', 'helpful_count']
    
    def get_user_avatar(self, obj):
        request = self.context.get('request')
        if obj.user.avatar and request:
            return request.build_absolute_uri(obj.user.avatar.url)
        return None
    
    def create(self, validated_data):
        # Asignar el usuario automáticamente
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)

class ProductListSerializer(serializers.ModelSerializer):
    """Serializer optimizado para listados"""
    category = CategoryListSerializer(read_only=True)
    primary_image = serializers.SerializerMethodField()
    discount_percentage = serializers.ReadOnlyField()
    is_on_sale = serializers.ReadOnlyField()
    
    class Meta:
        model = Product
        fields = [
            'id', 'name', 'slug', 'sku', 'short_description',
            'price', 'compare_price', 'discount_percentage',
            'is_on_sale', 'category', 'primary_image',
            'is_featured', 'stock'
        ]
    
    def get_primary_image(self, obj):
        primary = obj.images.filter(is_primary=True).first()
        if primary:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(primary.image.url)
        return None

class ProductDetailSerializer(serializers.ModelSerializer):
    """Serializer completo para detalle"""
    category = CategoryDetailSerializer(read_only=True)
    category_id = serializers.PrimaryKeyRelatedField(
        queryset=Category.objects.all(),
        source='category',
        write_only=True
    )
    tags = TagSerializer(many=True, read_only=True)
    tag_ids = serializers.PrimaryKeyRelatedField(
        queryset=Tag.objects.all(),
        many=True,
        write_only=True,
        source='tags'
    )
    images = ProductImageSerializer(many=True, read_only=True)
    variants = ProductVariantSerializer(many=True, read_only=True)
    reviews = ReviewSerializer(many=True, read_only=True)
    
    # Campos calculados
    discount_percentage = serializers.ReadOnlyField()
    is_on_sale = serializers.ReadOnlyField()
    needs_restock = serializers.ReadOnlyField()
    
    # Estadísticas de reviews
    average_rating = serializers.SerializerMethodField()
    reviews_count = serializers.SerializerMethodField()
    
    # Información del creador
    created_by_username = serializers.CharField(
        source='created_by.username',
        read_only=True
    )
    
    class Meta:
        model = Product
        fields = [
            'id', 'name', 'slug', 'sku', 'description', 'short_description',
            'category', 'category_id', 'tags', 'tag_ids',
            'price', 'compare_price', 'cost', 'discount_percentage',
            'is_on_sale', 'stock', 'min_stock', 'needs_restock',
            'status', 'is_featured', 'allow_backorder',
            'weight', 'length', 'width', 'height',
            'meta_title', 'meta_description',
            'images', 'variants', 'reviews',
            'average_rating', 'reviews_count',
            'created_by_username', 'created_at', 'updated_at'
        ]
        read_only_fields = ['slug', 'created_at', 'updated_at']
    
    def get_average_rating(self, obj):
        reviews = obj.reviews.filter(is_approved=True)
        if reviews.exists():
            from django.db.models import Avg
            return reviews.aggregate(Avg('rating'))['rating__avg']
        return None
    
    def get_reviews_count(self, obj):
        return obj.reviews.filter(is_approved=True).count()
    
    def validate(self, attrs):
        # Validar que el precio sea mayor que el costo
        if attrs.get('price') and attrs.get('cost'):
            if attrs['price'] < attrs['cost']:
                raise serializers.ValidationError(
                    "El precio debe ser mayor que el costo"
                )
        
        # Validar compare_price
        compare_price = attrs.get('compare_price')
        price = attrs.get('price', self.instance.price if self.instance else None)
        if compare_price and price and compare_price <= price:
            raise serializers.ValidationError(
                "El precio de comparación debe ser mayor que el precio actual"
            )
        
        return attrs
    
    def create(self, validated_data):
        # Asignar el usuario que crea
        validated_data['created_by'] = self.context['request'].user
        return super().create(validated_data)

class OrderItemSerializer(serializers.ModelSerializer):
    product_name = serializers.CharField(source='product.name', read_only=True)
    product_image = serializers.SerializerMethodField()
    variant_name = serializers.CharField(source='variant.name', read_only=True)
    
    class Meta:
        model = OrderItem
        fields = [
            'id', 'product', 'product_name', 'product_image',
            'variant', 'variant_name', 'quantity',
            'unit_price', 'total_price'
        ]
        read_only_fields = ['total_price']
    
    def get_product_image(self, obj):
        primary = obj.product.images.filter(is_primary=True).first()
        if primary:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(primary.image.url)
        return None

class OrderListSerializer(serializers.ModelSerializer):
    """Serializer para listado de órdenes"""
    items_count = serializers.SerializerMethodField()
    
    class Meta:
        model = Order
        fields = [
            'id', 'order_number', 'status', 'payment_status',
            'total', 'items_count', 'created_at'
        ]
    
    def get_items_count(self, obj):
        return obj.items.count()

class OrderDetailSerializer(serializers.ModelSerializer):
    """Serializer detallado de orden"""
    items = OrderItemSerializer(many=True, read_only=True)
    user_email = serializers.CharField(source='user.email', read_only=True)
    
    class Meta:
        model = Order
        fields = [
            'id', 'order_number', 'user', 'user_email',
            'status', 'payment_status',
            'subtotal', 'tax', 'shipping_cost', 'discount', 'total',
            'shipping_address', 'billing_address',
            'customer_notes', 'admin_notes',
            'tracking_number', 'shipped_at', 'delivered_at',
            'items', 'created_at', 'updated_at'
        ]
        read_only_fields = ['order_number', 'user', 'created_at']

class OrderCreateSerializer(serializers.ModelSerializer):
    """Serializer para crear órdenes"""
    items = OrderItemSerializer(many=True)
    
    class Meta:
        model = Order
        fields = [
            'shipping_address', 'billing_address',
            'customer_notes', 'items'
        ]
    
    def validate_items(self, items):
        if not items:
            raise serializers.ValidationError("La orden debe tener al menos un item")
        
        # Validar stock disponible
        for item in items:
            product = item['product']
            quantity = item['quantity']
            
            if item.get('variant'):
                stock = item['variant'].stock
            else:
                stock = product.stock
            
            if stock < quantity:
                raise serializers.ValidationError(
                    f"Stock insuficiente para {product.name}"
                )
        
        return items
    
    def create(self, validated_data):
        items_data = validated_data.pop('items')
        
        # Calcular totales
        subtotal = sum(
            item['quantity'] * item['product'].price
            for item in items_data
        )
        tax = subtotal * 0.16  # 16% IVA
        shipping = 100  # Costo fijo de envío
        total = subtotal + tax + shipping
        
        # Crear orden
        order = Order.objects.create(
            user=self.context['request'].user,
            subtotal=subtotal,
            tax=tax,
            shipping_cost=shipping,
            total=total,
            **validated_data
        )
        
        # Crear items y actualizar stock
        for item_data in items_data:
            product = item_data['product']
            variant = item_data.get('variant')
            quantity = item_data['quantity']
            
            # Precio unitario
            if variant:
                unit_price = variant.final_price
                variant.stock -= quantity
                variant.save()
            else:
                unit_price = product.price
                product.stock -= quantity
                product.save()
            
            OrderItem.objects.create(
                order=order,
                product=product,
                variant=variant,
                quantity=quantity,
                unit_price=unit_price,
                total_price=unit_price * quantity
            )
        
        return order
```

## 3. VISTAS - Funciones vs Clases

### 3.1 Vistas Basadas en Funciones (FBV)

```python [apps/ecommerce/views_fbv.py] 

from rest_framework.decorators import (
    api_view, permission_classes, authentication_classes
)
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404
from .models import Product, Review, Order
from .serializers import (
    ProductListSerializer, ProductDetailSerializer,
    ReviewSerializer, OrderDetailSerializer
)

@api_view(['GET', 'POST'])
@permission_classes([AllowAny])
def product_list_create(request):
    """
    GET: Lista de productos con filtros
    POST: Crear nuevo producto (requiere autenticación)
    """
    if request.method == 'GET':
        products = Product.objects.filter(status='active')
        
        # Filtros
        category = request.query_params.get('category')
        if category:
            products = products.filter(category__slug=category)
        
        min_price = request.query_params.get('min_price')
        max_price = request.query_params.get('max_price')
        if min_price:
            products = products.filter(price__gte=min_price)
        if max_price:
            products = products.filter(price__lte=max_price)
        
        search = request.query_params.get('search')
        if search:
            products = products.filter(name__icontains=search)
        
        # Ordenamiento
        ordering = request.query_params.get('ordering', '-created_at')
        products = products.order_by(ordering)
        
        # Paginación manual
        from django.core.paginator import Paginator
        page_number = request.query_params.get('page', 1)
        paginator = Paginator(products, 20)
        page = paginator.get_page(page_number)
        
        serializer = ProductListSerializer(
            page,
            many=True,
            context={'request': request}
        )
        
        return Response({
            'count': paginator.count,
            'next': page.has_next() and page.next_page_number(),
            'previous': page.has_previous() and page.previous_page_number(),
            'results': serializer.data
        })
    
    elif request.method == 'POST':
        # Verificar autenticación
        if not request.user.is_authenticated:
            return Response(
                {'error': 'Autenticación requerida'},
                status=status.HTTP_401_UNAUTHORIZED
            )
        
        serializer = ProductDetailSerializer(
            data=request.data,
            context={'request': request}
        )
        
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET', 'PUT', 'PATCH', 'DELETE'])
@permission_classes([AllowAny])
def product_detail(request, slug):
    """
    GET: Detalle del producto
    PUT/PATCH: Actualizar producto (requiere autenticación)
    DELETE: Eliminar producto (requiere autenticación)
    """
    product = get_object_or_404(Product, slug=slug)
    
    if request.method == 'GET':
        serializer = ProductDetailSerializer(
            product,
            context={'request': request}
        )
        return Response(serializer.data)
    
    elif request.method in ['PUT', 'PATCH']:
        if not request.user.is_authenticated:
            return Response(
                {'error': 'Autenticación requerida'},
                status=status.HTTP_401_UNAUTHORIZED
            )
        
        partial = request.method == 'PATCH'
        serializer = ProductDetailSerializer(
            product,
            data=request.data,
            partial=partial,
            context={'request': request}
        )
        
        if serializer.is_valid():
            serializer.save(updated_by=request.user)
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    elif request.method == 'DELETE':
        if not request.user.is_authenticated:
            return Response(
                {'error': 'Autenticación requerida'},
                status=status.HTTP_401_UNAUTHORIZED
            )
        
        product.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def add_product_review(request, product_id):
    """Agregar reseña a un producto"""
    product = get_object_or_404(Product, id=product_id)
    
    # Verificar si el usuario ya dejó una reseña
    if Review.objects.filter(product=product, user=request.user).exists():
        return Response(
            {'error': 'Ya has dejado una reseña para este producto'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    serializer = ReviewSerializer(
        data=request.data,
        context={'request': request}
    )
    
    if serializer.is_valid():
        serializer.save(product=product, user=request.user)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def my_orders(request):
    """Obtener las órdenes del usuario autenticado"""
    orders = Order.objects.filter(user=request.user)
    
    # Filtro por estado
    status_filter = request.query_params.get('status')
    if status_filter:
        orders = orders.filter(status=status_filter)
    
    serializer = OrderListSerializer(orders, many=True)
    return Response(serializer.data)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def mark_review_helpful(request, review_id):
    """Marcar una reseña como útil"""
    review = get_object_or_404(Review, id=review_id)
    review.helpful_count += 1
    review.save()
    
    return Response({
        'message': 'Marcado como útil',
        'helpful_count': review.helpful_count
    })
```

### 3.2 Vistas Basadas en Clases (CBV) - APIView

```python
# apps/ecommerce/views_cbv.py
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.shortcuts import get_object_or_404
from .models import Product, Category, Order
from .serializers import (
    ProductListSerializer, ProductDetailSerializer,
    CategoryDetailSerializer, OrderCreateSerializer
)

class ProductListAPIView(APIView):
    """
    Vista basada en clase para listar y crear productos
    Permite mayor control sobre el comportamiento
    """
    permission_classes = [AllowAny]
    
    def get(self, request):
        """Listar productos con filtros"""
        products = Product.objects.filter(status='active').select_related(
            'category'
        ).prefetch_related('images', 'tags')
        
        # Aplicar filtros
        products = self.filter_queryset(products, request)
        
        # Serializar
        serializer = ProductListSerializer(
            products,
            many=True,
            context={'request': request}
        )
        
        return Response(serializer.data)
    
    def post(self, request):
        """Crear nuevo producto"""
        if not request.user.is_authenticated:
            return Response(
                {'error': 'Autenticación requerida'},
                status=status.HTTP_401_UNAUTHORIZED
            )
        
        serializer = ProductDetailSerializer(
            data=request.data,
            context={'request': request}
        )
        
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def filter_queryset(self, queryset, request):
        """Método auxiliar para filtrar"""
        # Filtro por categoría
        category = request.query_params.get('category')
        if category:
            queryset = queryset.filter(category__slug=category)
        
        # Filtro por precio
        min_price = request.query_params.get('min_price')
        max_price = request.query_params.get('max_price')
        if min_price:
            queryset = queryset.filter(price__gte=min_price)
        if max_price:
            queryset = queryset.filter(price__lte=max_price)
        
        # Búsqueda
        search = request.query_params.get('search')
        if search:
            from django.db.models import Q
            queryset = queryset.filter(
                Q(name__icontains=search) |
                Q(description__icontains=search)
            )
        
        # Solo productos destacados
        featured = request.query_params.get('featured')
        if featured == 'true':
            queryset = queryset.filter(is_featured=True)
        
        # Ordenamiento
        ordering = request.query_params.get('ordering', '-created_at')
        queryset = queryset.order_by(ordering)
        
        return queryset

class ProductDetailAPIView(APIView):
    """Vista para detalle de producto individual"""
    permission_classes = [AllowAny]
    
    def get_object(self, slug):
        """Obtener producto o 404"""
        return get_object_or_404(
            Product.objects.select_related('category', 'created_by')
                          .prefetch_related('images', 'variants', 'reviews', 'tags'),
            slug=slug
        )
    
    def get(self, request, slug):
        """Obtener detalle del producto"""
        product = self.get_object(slug)
        serializer = ProductDetailSerializer(
            product,
            context={'request': request}
        )
        return Response(serializer.data)
    
    def put(self, request, slug):
        """Actualizar producto completamente"""
        if not request.user.is_authenticated:
            return Response(
                {'error': 'Autenticación requerida'},
                status=status.HTTP_401_UNAUTHORIZED
            )
        
        product = self.get_object(slug)
        serializer = ProductDetailSerializer(
            product,
            data=request.data,
            context={'request': request}
        )
        
        if serializer.is_valid():
            serializer.save(updated_by=request.user)
            return Response(serializer.data)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def patch(self, request, slug):
        """Actualizar producto parcialmente"""
        if not request.user.is_authenticated:
            return Response(
                {'error': 'Autenticación requerida'},
                status=status.HTTP_401_UNAUTHORIZED
            )
        
        product = self.get_object(slug)
        serializer = ProductDetailSerializer(
            product,
            data=request.data,
            partial=True,
            context={'request': request}
        )
        
        if serializer.is_valid():
            serializer.save(updated_by=request.user)
            return Response(serializer.data)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def delete(self, request, slug):
        """Eliminar producto"""
        if not request.user.is_authenticated:
            return Response(
                {'error': 'Autenticación requerida'},
                status=status.HTTP_401_UNAUTHORIZED
            )
        
        product = self.get_object(slug)
        product.delete()
        
        return Response(status=status.HTTP_204_NO_CONTENT)

class CategoryTreeAPIView(APIView):
    """Vista para obtener árbol de categorías"""
    permission_classes = [AllowAny]
    
    def get(self, request):
        """Obtener todas las categorías raíz con sus hijos"""
        root_categories = Category.objects.filter(
            parent=None,
            is_active=True
        ).prefetch_related('children')
        
        serializer = CategoryDetailSerializer(
            root_categories,
            many=True,
            context={'request': request}
        )
        
        return Response(serializer.data)

class CreateOrderAPIView(APIView):
    """Vista para crear órdenes de compra"""
    permission_classes = [IsAuthenticated]
    
    def post(self, request):
        """Crear nueva orden"""
        serializer = OrderCreateSerializer(
            data=request.data,
            context={'request': request}
        )
        
        if serializer.is_valid():
            order = serializer.save()
            
            # Enviar email de confirmación (ejemplo)
            # send_order_confirmation_email(order)
            
            from .serializers import OrderDetailSerializer
            response_serializer = OrderDetailSerializer(
                order,
                context={'request': request}
            )
            
            return Response(
                response_serializer.data,
                status=status.HTTP_201_CREATED
            )
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
```

### 3.3 Vistas Basadas en Clases - GenericAPIView y Mixins

```python
# apps/ecommerce/views_generic.py
from rest_framework import generics, mixins
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.filters import SearchFilter, OrderingFilter
from django_filters.rest_framework import DjangoFilterBackend
from .models import Product, Review, Order
from .serializers import (
    ProductListSerializer, ProductDetailSerializer,
    ReviewSerializer, OrderListSerializer, OrderDetailSerializer
)
from .filters import ProductFilter

class ProductListCreateView(generics.ListCreateAPIView):
    """
    Vista genérica para listar y crear productos
    Combina ListAPIView + CreateAPIView
    """
    queryset = Product.objects.filter(status='active')
    permission_classes = [AllowAny]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_class = ProductFilter
    search_fields = ['name', 'description', 'sku']
    ordering_fields = ['price', 'created_at', 'name']
    ordering = ['-created_at']
    
    def get_serializer_class(self):
        """Usar diferentes serializers según la acción"""
        if self.request.method == 'POST':
            return ProductDetailSerializer
        return ProductListSerializer
    
    def get_queryset(self):
        """Optimizar consultas"""
        return super().get_queryset().select_related(
            'category'
        ).prefetch_related('images', 'tags')
    
    def perform_create(self, serializer):
        """Personalizar creación"""
        serializer.save(created_by=self.request.user)

class ProductRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    """
    Vista genérica para obtener, actualizar y eliminar producto
    Combina RetrieveAPIView + UpdateAPIView + DestroyAPIView
    """
    queryset = Product.objects.all()
    serializer_class = ProductDetailSerializer
    lookup_field = 'slug'
    
    def get_queryset(self):
        """Optimizar consultas"""
        return super().get_queryset().select_related(
            'category', 'created_by'
        ).prefetch_related('images', 'variants', 'reviews', 'tags')
    
    def get_permissions(self):
        """Permisos según el método"""
        if self.request.method == 'GET':
            return [AllowAny()]
        return [IsAuthenticated()]
    
    def perform_update(self, serializer):
        """Personalizar actualización"""
        serializer.save(updated_by=self.request.user)

class ReviewListCreateView(generics.ListCreateAPIView):
    """Vista para listar y crear reseñas de un producto"""
    serializer_class = ReviewSerializer
    permission_classes = [AllowAny]
    
    def get_queryset(self):
        """Filtrar reseñas por producto"""
        product_id = self.kwargs.get('product_id')
        return Review.objects.filter(
            product_id=product_id,
            is_approved=True
        ).select_related('user')
    
    def get_permissions(self):
        """POST requiere autenticación"""
        if self.request.method == 'POST':
            return [IsAuthenticated()]
        return [AllowAny()]
    
    def perform_create(self, serializer):
        """Asociar reseña con producto y usuario"""
        product_id = self.kwargs.get('product_id')
        serializer.save(
            product_id=product_id,
            user=self.request.user
        )

class MyOrdersListView(generics.ListAPIView):
    """Vista para listar órdenes del usuario autenticado"""
    serializer_class = OrderListSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [OrderingFilter]
    ordering_fields = ['created_at', 'total']
    ordering = ['-created_at']
    
    def get_queryset(self):
        """Solo órdenes del usuario autenticado"""
        return Order.objects.filter(
            user=self.request.user
        ).prefetch_related('items')

class OrderDetailView(generics.RetrieveAPIView):
    """Vista para detalle de una orden"""
    serializer_class = OrderDetailSerializer
    permission_classes = [IsAuthenticated]
    lookup_field = 'order_number'
    
    def get_queryset(self):
        """Solo órdenes del usuario autenticado"""
        return Order.objects.filter(
            user=self.request.user
        ).prefetch_related('items__product')
```

### 3.4 Vistas Basadas en Clases - ViewSets (La más completa)

```python
# apps/ecommerce/viewsets.py
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny, IsAdminUser
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter
from django.db.models import Avg, Count, Q
from .models import Product, Category, Review, Order
from .serializers import (
    ProductListSerializer, ProductDetailSerializer,
    CategoryListSerializer, CategoryDetailSerializer,
    ReviewSerializer, OrderListSerializer, OrderDetailSerializer,
    OrderCreateSerializer
)
from .filters import ProductFilter
from .permissions import IsOwnerOrReadOnly, IsAdminOrReadOnly

class ProductViewSet(viewsets.ModelViewSet):
    """
    ViewSet completo para Productos
    Proporciona automáticamente: list, create, retrieve, update, partial_update, destroy
    Más acciones personalizadas con @action
    """
    queryset = Product.objects.all()
    lookup_field = 'slug'
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_class = ProductFilter
    search_fields = ['name', 'description', 'sku']
    ordering_fields = ['price', 'created_at', 'name', 'stock']
    ordering = ['-created_at']
    
    def get_serializer_class(self):
        """Serializer según la acción"""
        if self.action == 'list':
            return ProductListSerializer
        return ProductDetailSerializer
    
    def get_queryset(self):
        """Optimizar consultas según la acción"""
        queryset = super().get_queryset()
        
        if self.action == 'list':
            queryset = queryset.select_related('category').prefetch_related('images')
        elif self.action == 'retrieve':
            queryset = queryset.select_related(
                'category', 'created_by'
            ).prefetch_related('images', 'variants', 'reviews__user', 'tags')
        
        return queryset
    
    def get_permissions(self):
        """Permisos según la acción"""
        if self.action in ['list', 'retrieve']:
            permission_classes = [AllowAny]
        elif self.action in ['create', 'update', 'partial_update', 'destroy']:
            permission_classes = [IsAuthenticated, IsAdminUser]
        else:
            permission_classes = [IsAuthenticated]
        
        return [permission() for permission in permission_classes]
    
    def perform_create(self, serializer):
        """Personalizar creación"""
        serializer.save(created_by=self.request.user)
    
    def perform_update(self, serializer):
        """Personalizar actualización"""
        serializer.save(updated_by=self.request.user)
    
    # Acciones personalizadas
    
    @action(detail=False, methods=['get'])
    def featured(self, request):
        """Obtener productos destacados"""
        products = self.get_queryset().filter(is_featured=True)[:10]
        serializer = self.get_serializer(products, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def on_sale(self, request):
        """Productos en oferta"""
        products = self.get_queryset().filter(
            compare_price__isnull=False
        ).filter(price__lt=models.F('compare_price'))
        
        serializer = self.get_serializer(products, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def low_stock(self, request):
        """Productos con bajo stock (solo admin)"""
        if not request.user.is_staff:
            return Response(
                {'error': 'No tienes permisos'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        products = self.get_queryset().filter(
            stock__lte=models.F('min_stock')
        )
        
        serializer = self.get_serializer(products, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['get'])
    def reviews(self, request, slug=None):
        """Obtener reseñas de un producto"""
        product = self.get_object()
        reviews = product.reviews.filter(is_approved=True)
        
        serializer = ReviewSerializer(
            reviews,
            many=True,
            context={'request': request}
        )
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated])
    def add_review(self, request, slug=None):
        """Agregar reseña a un producto"""
        product = self.get_object()
        
        # Verificar si ya existe reseña
        if Review.objects.filter(product=product, user=request.user).exists():
            return Response(
                {'error': 'Ya has dejado una reseña para este producto'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        serializer = ReviewSerializer(
            data=request.data,
            context={'request': request}
        )
        
        if serializer.is_valid():
            serializer.save(product=product, user=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated])
    def toggle_featured(self, request, slug=None):
        """Marcar/desmarcar producto como destacado (solo admin)"""
        if not request.user.is_staff:
            return Response(
                {'error': 'No tienes permisos'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        product = self.get_object()
        product.is_featured = not product.is_featured
        product.save()
        
        return Response({
            'message': 'Producto actualizado',
            'is_featured': product.is_featured
        })
    
    @action(detail=False, methods=['get'])
    def statistics(self, request):
        """Estadísticas de productos (solo admin)"""
        if not request.user.is_staff:
            return Response(
                {'error': 'No tienes permisos'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        from django.db.models import Sum, Avg
        
        stats = {
            'total_products': Product.objects.count(),
            'active_products': Product.objects.filter(status='active').count(),
            'low_stock_products': Product.objects.filter(
                stock__lte=models.F('min_stock')
            ).count(),
            'total_stock_value': Product.objects.aggregate(
                total=Sum(models.F('stock') * models.F('price'))
            )['total'],
            'average_price': Product.objects.aggregate(
                avg=Avg('price')
            )['avg'],
        }
        
        return Response(stats)

class CategoryViewSet(viewsets.ModelViewSet):
    """ViewSet para Categorías"""
    queryset = Category.objects.filter(is_active=True)
    lookup_field = 'slug'
    
    def get_serializer_class(self):
        if self.action == 'list':
            return CategoryListSerializer
        return CategoryDetailSerializer
    
    def get_queryset(self):
        queryset = super().get_queryset()
        
        if self.action == 'list':
            # Solo categorías raíz
            queryset = queryset.filter(parent=None)
        
        return queryset.prefetch_related('children')
    
    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            permission_classes = [AllowAny]
        else:
            permission_classes = [IsAuthenticated, IsAdminUser]
        
        return [permission() for permission in permission_classes]
    
    @action(detail=True, methods=['get'])
    def products(self, request, slug=None):
        """Obtener productos de una categoría"""
        category = self.get_object()
        products = Product.objects.filter(
            category=category,
            status='active'
        )
        
        serializer = ProductListSerializer(
            products,
            many=True,
            context={'request': request}
        )
        return Response(serializer.data)

class OrderViewSet(viewsets.ModelViewSet):
    """ViewSet para Órdenes"""
    permission_classes = [IsAuthenticated]
    lookup_field = 'order_number'
    
    def get_serializer_class(self):
        if self.action == 'create':
            return OrderCreateSerializer
        elif self.action == 'list':
            return OrderListSerializer
        return OrderDetailSerializer
    
    def get_queryset(self):
        """Solo órdenes del usuario (o todas si es admin)"""
        user = self.request.user
        
        if user.is_staff:
            return Order.objects.all()
        
        return Order.objects.filter(user=user)
    
    def create(self, request, *args, **kwargs):
        """Crear nueva orden"""
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        order = serializer.save()
        
        # Enviar notificación
        # send_order_notification(order)
        
        # Devolver con serializer de detalle
        response_serializer = OrderDetailSerializer(
            order,
            context={'request': request}
        )
        
        return Response(
            response_serializer.data,
            status=status.HTTP_201_CREATED
        )
    
    @action(detail=True, methods=['post'])
    def cancel(self, request, order_number=None):
        """Cancelar orden"""
        order = self.get_object()
        
        if order.status in ['shipped', 'delivered']:
            return Response(
                {'error': 'No se puede cancelar una orden ya enviada'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        order.status = 'cancelled'
        order.save()
        
        # Devolver stock
        for item in order.items.all():
            if item.variant:
                item.variant.stock += item.quantity
                item.variant.save()
            else:
                item.product.stock += item.quantity
                item.product.save()
        
        serializer = self.get_serializer(order)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def statistics(self, request):
        """Estadísticas de órdenes del usuario"""
        user = request.user
        orders = Order.objects.filter(user=user)
        
        from django.db.models import Sum, Count
        
        stats = {
            'total_orders': orders.count(),
            'total_spent': orders.filter(
                payment_status='paid'
            ).aggregate(total=Sum('total'))['total'] or 0,
            'orders_by_status': dict(
                orders.values('status').annotate(count=Count('id')).values_list('status', 'count')
            ),
        }
        
        return Response(stats)

class ReviewViewSet(viewsets.ModelViewSet):
    """ViewSet para Reseñas"""
    queryset = Review.objects.filter(is_approved=True)
    serializer_class = ReviewSerializer
    
    def get_queryset(self):
        queryset = super().get_queryset().select_related('user', 'product')
        
        # Filtrar por producto si se proporciona
        product_id = self.request.query_params.get('product_id')
        if product_id:
            queryset = queryset.filter(product_id=product_id)
        
        return queryset
    
    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            permission_classes = [AllowAny]
        elif self.action == 'create':
            permission_classes = [IsAuthenticated]
        else:
            permission_classes = [IsAuthenticated, IsOwnerOrReadOnly]
        
        return [permission() for permission in permission_classes]
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
    
    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated])
    def mark_helpful(self, request, pk=None):
        """Marcar reseña como útil"""
        review = self.get_object()
        review.helpful_count += 1
        review.save()
        
        return Response({
            'message': 'Marcado como útil',
            'helpful_count': review.helpful_count
        })
```

## 4. FILTROS PERSONALIZADOS

```python
# apps/ecommerce/filters.py
import django_filters
from .models import Product

class ProductFilter(django_filters.FilterSet):
    """Filtros avanzados para productos"""
    name = django_filters.CharFilter(lookup_expr='icontains')
    min_price = django_filters.NumberFilter(field_name='price', lookup_expr='gte')
    max_price = django_filters.NumberFilter(field_name='price', lookup_expr='lte')
    category = django_filters.CharFilter(field_name='category__slug')
    tags = django_filters.CharFilter(field_name='tags__slug', lookup_expr='iexact')
    is_featured = django_filters.BooleanFilter()
    in_stock = django_filters.BooleanFilter(method='filter_in_stock')
    on_sale = django_filters.BooleanFilter(method='filter_on_sale')
    
    class Meta:
        model = Product
        fields = ['name', 'status', 'category', 'is_featured']
    
    def filter_in_stock(self, queryset, name, value):
        if value:
            return queryset.filter(stock__gt=0)
        return queryset.filter(stock=0)
    
    def filter_on_sale(self, queryset, name, value):
        if value:
            return queryset.filter(
                compare_price__isnull=False
            ).filter(price__lt=models.F('compare_price'))
        return queryset
```

## 5. PERMISOS PERSONALIZADOS

```python
# apps/ecommerce/permissions.py
from rest_framework import permissions

class IsOwnerOrReadOnly(permissions.BasePermission):
    """
    Permiso personalizado: solo el propietario puede editar
    """
    def has_object_permission(self, request, view, obj):
        # Lectura permitida para todos
        if request.method in permissions.SAFE_METHODS:
            return True
        
        # Escritura solo para el propietario
        return obj.user == request.user

class IsAdminOrReadOnly(permissions.BasePermission):
    """
    Permiso: solo admin puede editar, todos pueden leer
    """
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True
        
        return request.user and request.user.is_staff

class IsOwnerOrAdmin(permissions.BasePermission):
    """
    Permiso: propietario o admin
    """
    def has_object_permission(self, request, view, obj):
        return obj.user == request.user or request.user.is_staff
```

## 6. URLS CONFIGURACIÓN

```python
# apps/ecommerce/urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .viewsets import (
    ProductViewSet, CategoryViewSet,
    OrderViewSet, ReviewViewSet
)
from .views_cbv import (
    ProductListAPIView, ProductDetailAPIView,
    CategoryTreeAPIView, CreateOrderAPIView
)
from . import views_fbv

# Router para ViewSets
router = DefaultRouter()
router.register(r'products', ProductViewSet, basename='product')
router.register(r'categories', CategoryViewSet, basename='category')
router.register(r'orders', OrderViewSet, basename='order')
router.register(r'reviews', ReviewViewSet, basename='review')

urlpatterns = [
    # ViewSets (opción recomendada)
    path('', include(router.urls)),
    
    # Alternativa: Vistas basadas en funciones
    # path('products/', views_fbv.product_list_create, name='product-list'),
    # path('products/<slug:slug>/', views_fbv.product_detail, name='product-detail'),
    
    # Alternativa: Vistas basadas en clases
    #
```

### Vistas Basadas en Funciones (FBV)

**Usar cuando:**

- Necesitas lógica simple y directa
- La vista es muy específica y no se reutilizará
- Prefieres código más explícito y fácil de seguir
- Estás comenzando con Django REST Framework

**Ventajas:**

- Más fáciles de entender para principiantes
- Código más explícito
- Menos "magia" detrás de escenas

**Desventajas:**

- Más código repetitivo
- Menos reutilizable

### APIView (Vistas Basadas en Clases)

**Usar cuando:**

- Necesitas control total sobre el comportamiento
- La lógica es compleja y específica
- Quieres organizar código por métodos HTTP

**Ventajas:**

- Más control que ViewSets
- Organización clara por método HTTP
- Bueno para lógica personalizada

**Desventajas:**

- Más código que ViewSets
- Menos automatización

### Generic Views / Mixins

**Usar cuando:**

- Necesitas operaciones CRUD estándar con algunas personalizaciones
- Quieres balance entre control y automatización
- Trabajas con modelos simples

**Ventajas:**

- Menos código que APIView
- Comportamiento estándar incluido
- Personalizable con mixins

**Desventajas:**

- Puede ser confuso combinar muchos mixins
- Menos flexible que APIView

### ViewSets (RECOMENDADO)

**Usar cuando:**

- Implementas una API REST completa para un modelo
- Necesitas todas las operaciones CRUD
- Quieres aprovechar routers automáticos
- El proyecto seguirá creciendo

**Ventajas:**

- Menos código
- Router automático
- Acciones personalizadas con @action
- Comportamiento consistente
- Más fácil de mantener

**Desventajas:**

- Más "mágico", requiere entender convenciones
- Puede ser excesivo para casos simples

## CONCLUSIÓN

Esta guía completa te proporciona todo lo necesario para construir APIs REST profesionales con Django. La estructura recomendada es:

1. **Para proyectos simples**: Usa FBV o Generic Views
2. **Para proyectos medianos/grandes**: Usa ViewSets (90% de los casos)
3. **Para casos muy específicos**: Usa APIView

**Recuerda**:

- Siempre optimiza queries con `select_related` y `prefetch_related`
- Usa serializers diferentes para list/detail
- Implementa paginación
- Cachea respuestas cuando sea posible
- Escribe tests para tu API
- Documenta tu API con drf-spectacular# Guía Completa Django REST Framework