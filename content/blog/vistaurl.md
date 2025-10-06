---
title: "Vistas y URLs en Django"
date: "2025-09-29"
description: "vistas y URLs en Django: Aprende a crear y gestionar vistas y rutas en tus aplicaciones web con Django."
tags: ["Django", "Python", "Web Development"]
name: "vistaurl "

author: "raulanto"
author_avatar: 'https://avatars.githubusercontent.com/u/74162376?v=4'
author_description: "Desarrollador Full Stack "
thumbnail: /neat.png 
---




## 1. ¿Qué es una vista en Django?

Una **vista** es una función o clase de Python que recibe una solicitud web (request) y devuelve una respuesta web (response). Normalmente, renderiza una plantilla, redirige, o responde con JSON.

---

## 2. Vistas Basadas en Funciones (FBV)

### Ejemplo básico



```python
from django.http import HttpResponse
from django.shortcuts import render, get_object_or_404

def saludo(request):
    return HttpResponse("¡Hola, mundo!")

def pagina_con_template(request):
    contexto = {'nombre': 'Raúl'}
    return render(request, 'miapp/saludo.html', contexto)
```

### Vista de detalle con acceso a parámetros



```python
def detalle_articulo(request, articulo_id):
    articulo = get_object_or_404(Articulo, pk=articulo_id)
    return render(request, 'miapp/detalle.html', {'articulo': articulo})
```

### Vista que procesa formularios



```python
from .forms import ContactoForm

def contacto(request):
    if request.method == "POST":
        form = ContactoForm(request.POST)
        if form.is_valid():
            form.save()
            return redirect('gracias')
    else:
        form = ContactoForm()
    return render(request, 'miapp/contacto.html', {'form': form})
```

---

## 3. Vistas Basadas en Clases (CBV)

Django incluye muchas clases para vistas genéricas (ListView, DetailView, CreateView, etc.), facilitando el CRUD y lógica repetitiva.

### Ejemplo básico



```python
from django.views import View
from django.http import HttpResponse

class SaludoView(View):
    def get(self, request):
        return HttpResponse("¡Hola desde una CBV!")
```

### Vistas genéricas para CRUD



```python
from django.views.generic import ListView, DetailView, CreateView
from .models import Articulo

class ArticuloListView(ListView):
    model = Articulo
    template_name = 'miapp/articulo_lista.html'
    context_object_name = 'articulos'

class ArticuloDetailView(DetailView):
    model = Articulo
    template_name = 'miapp/articulo_detalle.html'

class ArticuloCreateView(CreateView):
    model = Articulo
    fields = ['titulo', 'contenido']
    template_name = 'miapp/articulo_form.html'
    success_url = '/articulos/'
```

### Personalizando métodos



```python
class ArticuloListView(ListView):
    model = Articulo

    def get_queryset(self):
        # Solo artículos publicados
        return Articulo.objects.filter(publicado=True)

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['extra'] = 'valor adicional'
        return context
```

---

## 4. URLs: Cómo enlazar vistas

### urls.py básico

Python

```python
from django.urls import path
from . import views

urlpatterns = [
    path('', views.saludo, name='saludo'),
    path('articulo/<int:articulo_id>/', views.detalle_articulo, name='detalle_articulo'),
    path('contacto/', views.contacto, name='contacto'),
]
```

### URLs para CBV

Para usar CBV, debes usar `.as_view()`:



```python
from .views import SaludoView, ArticuloListView, ArticuloDetailView, ArticuloCreateView

urlpatterns = [
    path('saludo/', SaludoView.as_view(), name='saludo_cbv'),
    path('articulos/', ArticuloListView.as_view(), name='articulo_lista'),
    path('articulos/<int:pk>/', ArticuloDetailView.as_view(), name='articulo_detalle'),
    path('articulos/nuevo/', ArticuloCreateView.as_view(), name='articulo_nuevo'),
]
```

---

## 5. Casos de uso: ¿Cuándo usar FBV o CBV?

- **FBV** (Función):
    - Cuando la lógica es simple o muy personalizada.
    - Cuando necesitas mucho control sobre el flujo y el request.
- **CBV** (Clase):
    - Para CRUD rápido y repetitivo.
    - Cuando quieres reutilizar y extender vistas.
    - Cuando necesitas agregar mixins o herencia.

### Ejemplo de FBV vs CBV: Listar artículos

**FBV:**



```python
def lista_articulos(request):
    articulos = Articulo.objects.all()
    return render(request, 'miapp/articulo_lista.html', {'articulos': articulos})
```

**CBV:**



```python
from django.views.generic import ListView

class ArticuloListView(ListView):
    model = Articulo
    template_name = 'miapp/articulo_lista.html'
```

---

## 6. Buenas prácticas

- Usa **nombres descriptivos** para las vistas y URLs.
- Agrupa tus vistas en archivos separados si tu proyecto crece (`views_public.py`, `views_admin.py`, etc.).
- Usa **decoradores** (como `@login_required`) para proteger vistas FBV, y mixins (como `LoginRequiredMixin`) para CBV.
- Prefiere CBV para CRUD estándar y FBV para lógica muy personalizada.
- Define **namespace** en tus urls para proyectos grandes.
- Aprovecha la **herencia de CBV** para evitar repetición de código.

---

## 7. Decoradores y Mixins útiles

### Decoradores para FBV



```python
from django.contrib.auth.decorators import login_required

@login_required
def mi_vista_protegida(request):
    ...
```

### Mixins para CBV

```python
from django.contrib.auth.mixins import LoginRequiredMixin

class VistaProtegida(LoginRequiredMixin, View):
    ...
```


## 8. URLs avanzados

- **Incluye urls de otras apps:**

```python
    path('blog/', include('blog.urls'))
```

- **Uso de parámetros opcionales:**

 ```python
    path('articulo/<int:articulo_id>/', views.detalle_articulo)
```
**URL reversa:**
- En templates: `{% url 'detalle_articulo' articulo.id %}`
- En Python: `reverse('detalle_articulo', args=[articulo.id])`

---

## 9. Organización recomendada de archivos



```js
miapp/
│
├── views.py
├── views_admin.py
├── views_public.py
├── urls.py
```

---

## 10. Ejemplo completo


```
# views.py
from django.views.generic import ListView, DetailView
from .models import Articulo

class ArticuloListView(ListView):
    model = Articulo
    template_name = 'articulos/lista.html'

class ArticuloDetailView(DetailView):
    model = Articulo
    template_name = 'articulos/detalle.html'

# urls.py
from django.urls import path
from .views import ArticuloListView, ArticuloDetailView

urlpatterns = [
    path('articulos/', ArticuloListView.as_view(), name='articulo_lista'),
    path('articulos/<int:pk>/', ArticuloDetailView.as_view(), name='articulo_detalle'),
]
```