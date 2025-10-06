---
title: "ORM de Django"
date: "2025-10-"
description: "Guía Avanzada del ORM de Django: Optimización y Buenas Prácticas."
tags: ["Django", "Python", "Web Development",'ORM']
name: "ORM de Django "
author: "raulanto"
author_avatar: 'https://avatars.githubusercontent.com/u/74162376?v=4'
author_description: "Desarrollador Full Stack"
thumbnail: /neat.png
---

# Guía Avanzada del ORM de Django: Optimización y Buenas Prácticas para APIs REST

## Introducción

El ORM (Object-Relational Mapping) de Django es una de las características más poderosas del framework, pero su uso inadecuado puede llevar a problemas graves de rendimiento, especialmente cuando trabajamos con millones de registros o APIs REST de alto tráfico. Esta guía cubre desde lo básico hasta técnicas avanzadas de optimización.

## 1. Fundamentos y Buenas Prácticas

### 1.1 Principios Básicos del ORM

El ORM de Django trabaja con el patrón de evaluación perezosa (lazy evaluation). Las consultas no se ejecutan hasta que realmente necesitas los datos.

```python
# NO se ejecuta la consulta todavía
usuarios = User.objects.filter(is_active=True)

# AQUÍ se ejecuta la consulta
for usuario in usuarios:
    print(usuario.username)
```

### 1.2 Buenas Prácticas Esenciales

**Siempre usa `select_related()` y `prefetch_related()`**

Estos métodos son cruciales para evitar el problema N+1:

```python
# ❌ MAL - Genera N+1 consultas
pedidos = Pedido.objects.all()
for pedido in pedidos:
    print(pedido.cliente.nombre)  # Consulta adicional por cada pedido

# ✅ BIEN - Una sola consulta con JOIN
pedidos = Pedido.objects.select_related('cliente').all()
for pedido in pedidos:
    print(pedido.cliente.nombre)
```

**Diferencia clave:**

- `select_related()`: Para relaciones ForeignKey y OneToOne (usa SQL JOIN)
- `prefetch_related()`: Para relaciones ManyToMany y reverse ForeignKey (usa consultas separadas)

```python
# select_related para FK
posts = Post.objects.select_related('autor', 'categoria')

# prefetch_related para M2M
posts = Post.objects.prefetch_related('etiquetas', 'comentarios')

# Combinados
posts = Post.objects.select_related('autor').prefetch_related('etiquetas')
```

## 2. Consultas Básicas Optimizadas

### 2.1 Selección de Campos con `only()` y `defer()`

```python
# Solo trae los campos necesarios
usuarios = User.objects.only('id', 'username', 'email')

# Excluye campos pesados
posts = Post.objects.defer('contenido_completo', 'metadata_json')
```

### 2.2 Uso de `values()` y `values_list()`

Cuando no necesitas instancias completas de modelos:

```python
# Retorna diccionarios
usuarios_dict = User.objects.values('id', 'username')
# [{'id': 1, 'username': 'juan'}, ...]

# Retorna tuplas
usuarios_tuple = User.objects.values_list('id', 'username')
# [(1, 'juan'), ...]

# Tuplas aplanadas
ids = User.objects.values_list('id', flat=True)
# [1, 2, 3, ...]
```

### 2.3 Conteo Eficiente

```python
# ❌ MAL - Trae todos los registros a memoria
count = len(User.objects.all())

# ✅ BIEN - Usa COUNT(*) en SQL
count = User.objects.count()

# Verificar existencia
# ❌ MAL
if User.objects.filter(email=email).count() > 0:
    
# ✅ BIEN
if User.objects.filter(email=email).exists():
    pass
```

## 3. Consultas Avanzadas

### 3.1 Anotaciones y Agregaciones

```python
from django.db.models import Count, Sum, Avg, F, Q, Prefetch

# Contar pedidos por cliente
clientes = Cliente.objects.annotate(
    total_pedidos=Count('pedido'),
    total_gastado=Sum('pedido__total')
)

# Usar F() para operaciones en la base de datos
Producto.objects.filter(stock__lt=F('stock_minimo'))

# Actualización atómica
Producto.objects.filter(id=producto_id).update(
    stock=F('stock') - cantidad
)
```

### 3.2 Consultas Complejas con Q

```python
from django.db.models import Q

# Búsqueda compleja
resultados = Producto.objects.filter(
    Q(nombre__icontains=query) | 
    Q(descripcion__icontains=query),
    Q(stock__gt=0) & Q(activo=True)
)

# Negación
productos = Producto.objects.exclude(
    Q(categoria__nombre='Descontinuado') | 
    Q(stock=0)
)
```

### 3.3 Prefetch Avanzado con `Prefetch()`

```python
from django.db.models import Prefetch

# Prefetch personalizado
autores = Autor.objects.prefetch_related(
    Prefetch(
        'libros',
        queryset=Libro.objects.filter(publicado=True).select_related('editorial'),
        to_attr='libros_publicados'
    )
)

for autor in autores:
    # Accede a libros_publicados directamente
    for libro in autor.libros_publicados:
        print(libro.titulo)
```

## 4. Optimización para Millones de Datos

### 4.1 Iteración Eficiente con `iterator()`

```python
# ❌ MAL - Carga todo en memoria
for usuario in User.objects.all():
    procesar_usuario(usuario)

# ✅ BIEN - Itera en chunks
for usuario in User.objects.iterator(chunk_size=2000):
    procesar_usuario(usuario)
```

### 4.2 Actualizaciones y Eliminaciones Masivas

```python
# ❌ MAL - Múltiples queries
for producto in Producto.objects.filter(categoria_id=5):
    producto.precio *= 1.1
    producto.save()

# ✅ BIEN - Una sola query
Producto.objects.filter(categoria_id=5).update(
    precio=F('precio') * 1.1
)

# Eliminación masiva eficiente
Producto.objects.filter(ultima_venta__lt='2020-01-01').delete()
```

### 4.3 Bulk Operations

```python
# Creación masiva
productos = [
    Producto(nombre=f'Producto {i}', precio=i*10)
    for i in range(10000)
]
Producto.objects.bulk_create(productos, batch_size=1000)

# Actualización masiva (Django 4.1+)
productos = Producto.objects.filter(categoria_id=5)
for producto in productos:
    producto.precio *= 1.1

Producto.objects.bulk_update(productos, ['precio'], batch_size=1000)
```

### 4.4 Paginación para Grandes Datasets

```python
from django.core.paginator import Paginator

# Paginación estándar
queryset = Producto.objects.all().order_by('id')
paginator = Paginator(queryset, 100)  # 100 por página
pagina = paginator.get_page(numero_pagina)

# Paginación cursor-based para mejor rendimiento
ultimo_id = request.GET.get('ultimo_id', 0)
productos = Producto.objects.filter(id__gt=ultimo_id).order_by('id')[:100]
```

### 4.5 Índices en la Base de Datos

```python
class Producto(models.Model):
    sku = models.CharField(max_length=50, db_index=True)
    nombre = models.CharField(max_length=200)
    precio = models.DecimalField(max_digits=10, decimal_places=2)
    
    class Meta:
        indexes = [
            models.Index(fields=['categoria', 'precio']),
            models.Index(fields=['-fecha_creacion']),
            # Índice parcial (PostgreSQL)
            models.Index(
                fields=['nombre'],
                name='activos_idx',
                condition=Q(activo=True)
            ),
        ]
```

## 5. Optimización de Modelos

### 5.1 Diseño Eficiente

```python
from django.db import models

class ProductoOptimizado(models.Model):
    # Usa campos apropiados
    sku = models.CharField(max_length=50, unique=True, db_index=True)
    precio = models.DecimalField(max_digits=10, decimal_places=2)
    
    # Evita blank=True, null=True en CharField
    descripcion = models.CharField(max_length=500, default='', blank=True)
    
    # Usa choices cuando sea apropiado
    ESTADO_CHOICES = [
        ('A', 'Activo'),
        ('I', 'Inactivo'),
        ('D', 'Descontinuado'),
    ]
    estado = models.CharField(max_length=1, choices=ESTADO_CHOICES, default='A')
    
    # Campos calculados denormalizados para consultas frecuentes
    total_ventas = models.IntegerField(default=0)
    rating_promedio = models.DecimalField(max_digits=3, decimal_places=2, default=0)
    
    class Meta:
        db_table = 'productos'
        ordering = ['-id']
        indexes = [
            models.Index(fields=['estado', 'precio']),
        ]
    
    def __str__(self):
        return self.sku
```

### 5.2 Managers Personalizados

```python
class ProductoActivoManager(models.Manager):
    def get_queryset(self):
        return super().get_queryset().filter(activo=True)
    
    def con_stock(self):
        return self.get_queryset().filter(stock__gt=0)
    
    def destacados(self):
        return self.get_queryset().filter(
            destacado=True
        ).select_related('categoria')

class Producto(models.Model):
    # ... campos ...
    
    objects = models.Manager()  # Manager por defecto
    activos = ProductoActivoManager()  # Manager personalizado

# Uso
productos_destacados = Producto.activos.destacados()
```

## 6. Optimización para Django REST Framework

### 6.1 Serializadores Optimizados

```python
from rest_framework import serializers

class CategoriaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Categoria
        fields = ['id', 'nombre']

class ProductoListSerializer(serializers.ModelSerializer):
    """Serializer ligero para listados"""
    categoria = CategoriaSerializer(read_only=True)
    
    class Meta:
        model = Producto
        fields = ['id', 'nombre', 'precio', 'categoria']

class ProductoDetailSerializer(serializers.ModelSerializer):
    """Serializer completo para detalle"""
    categoria = CategoriaSerializer(read_only=True)
    imagenes = ImagenSerializer(many=True, read_only=True)
    resenas = serializers.SerializerMethodField()
    
    class Meta:
        model = Producto
        fields = '__all__'
    
    def get_resenas(self, obj):
        # Usa prefetch_related definido en el viewset
        resenas = obj.resenas.all()[:5]
        return ResenaSerializer(resenas, many=True).data
```

### 6.2 ViewSets Optimizados

```python
from rest_framework import viewsets
from rest_framework.decorators import action
from django.utils.decorators import method_decorator
from django.views.decorators.cache import cache_page

class ProductoViewSet(viewsets.ModelViewSet):
    queryset = Producto.objects.all()
    
    def get_queryset(self):
        """Optimiza según la acción"""
        queryset = super().get_queryset()
        
        if self.action == 'list':
            # Para listados, trae solo lo necesario
            queryset = queryset.select_related('categoria').only(
                'id', 'nombre', 'precio', 'categoria__nombre'
            )
        elif self.action == 'retrieve':
            # Para detalle, trae todo con relaciones
            queryset = queryset.select_related(
                'categoria', 'marca'
            ).prefetch_related(
                'imagenes',
                Prefetch(
                    'resenas',
                    queryset=Resena.objects.select_related('usuario').filter(
                        aprobada=True
                    ).order_by('-fecha')[:10]
                )
            )
        
        return queryset
    
    def get_serializer_class(self):
        """Usa diferentes serializers según la acción"""
        if self.action == 'list':
            return ProductoListSerializer
        return ProductoDetailSerializer
    
    @method_decorator(cache_page(60 * 15))  # Cache 15 minutos
    @action(detail=False, methods=['get'])
    def destacados(self, request):
        """Endpoint optimizado para destacados"""
        productos = self.get_queryset().filter(
            destacado=True
        )[:20]
        serializer = self.get_serializer(productos, many=True)
        return Response(serializer.data)
```

### 6.3 Paginación Eficiente

```python
# settings.py
REST_FRAMEWORK = {
    'DEFAULT_PAGINATION_CLASS': 'rest_framework.pagination.LimitOffsetPagination',
    'PAGE_SIZE': 50,
}

# Paginación personalizada para grandes datasets
from rest_framework.pagination import CursorPagination

class ProductoPagination(CursorPagination):
    page_size = 100
    ordering = '-id'  # Importante: debe haber un orden único
    cursor_query_param = 'cursor'
```

### 6.4 Filtrado Optimizado

```python
from django_filters import rest_framework as filters

class ProductoFilter(filters.FilterSet):
    precio_min = filters.NumberFilter(field_name='precio', lookup_expr='gte')
    precio_max = filters.NumberFilter(field_name='precio', lookup_expr='lte')
    categoria = filters.CharFilter(field_name='categoria__slug')
    
    class Meta:
        model = Producto
        fields = ['categoria', 'marca', 'activo']

# En el viewset
class ProductoViewSet(viewsets.ModelViewSet):
    filterset_class = ProductoFilter
    search_fields = ['nombre', 'sku']
    ordering_fields = ['precio', 'fecha_creacion']
```

## 7. Trucos y Técnicas Avanzadas

### 7.1 Select For Update (Bloqueo Optimista)

```python
from django.db import transaction

@transaction.atomic
def procesar_pedido(pedido_id):
    # Bloquea el registro para evitar race conditions
    pedido = Pedido.objects.select_for_update().get(id=pedido_id)
    
    if pedido.estado == 'pendiente':
        pedido.estado = 'procesando'
        pedido.save()
        # Procesar...
```

### 7.2 Raw SQL cuando sea necesario

```python
# Para consultas muy específicas o complejas
productos = Producto.objects.raw(
    """
    SELECT p.*, COUNT(v.id) as total_ventas
    FROM productos p
    LEFT JOIN ventas v ON v.producto_id = p.id
    WHERE p.activo = true
    GROUP BY p.id
    HAVING COUNT(v.id) > 100
    ORDER BY total_ventas DESC
    LIMIT 50
    """
)

# O con cursor directo
from django.db import connection

with connection.cursor() as cursor:
    cursor.execute("SELECT id, nombre FROM productos WHERE ...")
    rows = cursor.fetchall()
```

### 7.3 Caché de Consultas

```python
from django.core.cache import cache

def get_productos_destacados():
    cache_key = 'productos_destacados'
    productos = cache.get(cache_key)
    
    if productos is None:
        productos = list(
            Producto.objects.filter(destacado=True)
            .select_related('categoria')
            .only('id', 'nombre', 'precio')[:20]
        )
        cache.set(cache_key, productos, 60 * 15)  # 15 minutos
    
    return productos
```

### 7.4 Consultas Condicionales

```python
from django.db.models import Case, When, Value, IntegerField

# Ordenamiento condicional
productos = Producto.objects.annotate(
    orden_custom=Case(
        When(destacado=True, then=Value(1)),
        When(oferta=True, then=Value(2)),
        default=Value(3),
        output_field=IntegerField(),
    )
).order_by('orden_custom', '-fecha_creacion')
```

### 7.5 Subconsultas con Subquery y OuterRef

```python
from django.db.models import Subquery, OuterRef

# Obtener el último pedido de cada cliente
ultimo_pedido = Pedido.objects.filter(
    cliente=OuterRef('pk')
).order_by('-fecha')

clientes = Cliente.objects.annotate(
    fecha_ultimo_pedido=Subquery(
        ultimo_pedido.values('fecha')[:1]
    ),
    total_ultimo_pedido=Subquery(
        ultimo_pedido.values('total')[:1]
    )
)
```

## 8. Monitoreo y Debugging

### 8.1 Django Debug Toolbar

```python
# settings.py
INSTALLED_APPS += ['debug_toolbar']
MIDDLEWARE += ['debug_toolbar.middleware.DebugToolbarMiddleware']

# Ver todas las consultas ejecutadas
from django.db import connection
print(len(connection.queries))
for query in connection.queries:
    print(query['sql'])
```

### 8.2 Logging de Consultas

```python
# settings.py
LOGGING = {
    'version': 1,
    'handlers': {
        'console': {
            'class': 'logging.StreamHandler',
        },
    },
    'loggers': {
        'django.db.backends': {
            'handlers': ['console'],
            'level': 'DEBUG',
        },
    },
}
```

### 8.3 Comando Personalizado para Análisis

```python
# management/commands/analizar_consultas.py
from django.core.management.base import BaseCommand
from django.db import connection
from django.test.utils import override_settings

class Command(BaseCommand):
    def handle(self, *args, **options):
        with override_settings(DEBUG=True):
            # Tu código aquí
            productos = Producto.objects.all()
            
            print(f"Consultas ejecutadas: {len(connection.queries)}")
            for i, query in enumerate(connection.queries, 1):
                print(f"\n{i}. {query['sql'][:200]}")
                print(f"   Tiempo: {query['time']}s")
```

## 9. Checklist de Optimización

✅ **Antes de Lanzar a Producción:**

1. Todas las consultas usan `select_related()` o `prefetch_related()` cuando acceden a relaciones
2. Índices creados en campos de búsqueda frecuente
3. Paginación implementada en todos los listados
4. `only()` y `defer()` usados donde sea apropiado
5. Operaciones masivas usan `bulk_create()` y `bulk_update()`
6. Caché implementado en consultas costosas
7. No hay consultas N+1 (verificado con Debug Toolbar)
8. ViewSets usan diferentes serializers para list/retrieve
9. Filtros y búsquedas optimizados con índices
10. `iterator()` usado para procesamiento de grandes volúmenes

## Conclusión

El ORM de Django es extremadamente poderoso, pero requiere conocimiento profundo para usarlo eficientemente. La clave está en:

- **Entender cómo se traducen las consultas a SQL**
- **Minimizar el número de queries**
- **Traer solo los datos necesarios**
- **Usar índices apropiadamente**
- **Implementar caché estratégicamente**

Con estas técnicas, puedes construir APIs REST que manejen millones de registros manteniendo tiempos de respuesta por debajo de 100ms.


::alert{type="success" title="Recuerda" description="La optimización prematura es mala, pero la ignorancia de optimización es peor. Mide siempre antes de optimizar, y optimiza solo lo que realmente impacta el rendimiento."}
::