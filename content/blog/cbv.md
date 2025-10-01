---
title: "Ejemplo con Vistas Basadas en Clases (CBV)"
date: "2025-09-29"
description: "Explora cómo implementar vistas basadas en clases en Django para manejar solicitudes HTTP de manera eficiente."
tags: ["Django", "Python", "Web Development"]
name: "cbv"
---


Supongamos que tienes un modelo llamado `Articulo` y quieres crear un formulario para añadir nuevos artículos.


```python
# models.py
from django.db import models

class Articulo(models.Model):
    titulo = models.CharField(max_length=100)
    contenido = models.TextField()
```

## a) Usando CreateView (CBV)

Django ya trae vistas genéricas como `CreateView` que manejan GET (mostrar el formulario) y POST (procesar el formulario).


```python
# views.py
from django.views.generic.edit import CreateView
from .models import Articulo

class ArticuloCreateView(CreateView):
    model = Articulo
    fields = ['titulo', 'contenido']
    template_name = 'articulos/formulario.html'
    success_url = '/articulos/'  # Redirige tras éxito

    # Puedes sobreescribir el método post si necesitas lógica personalizada
    def post(self, request, *args, **kwargs):
        # Puedes acceder a los datos con request.POST
        return super().post(request, *args, **kwargs)
```

## b) Template para el formulario



```django
<!-- templates/articulos/formulario.html -->
<h2>Nuevo Artículo</h2>
<form method="post">
  {% csrf_token %}
  {{ form.as_p }}
  <button type="submit">Guardar</button>
</form>
```

## c) URL

```python
# urls.py
from .views import ArticuloCreateView
from django.urls import path

urlpatterns = [
    path('articulos/nuevo/', ArticuloCreateView.as_view(), name='articulo_nuevo'),
]
```

---

# 2. Ejemplo con Vistas Basadas en Funciones (FBV)



```python
# views.py
from django.shortcuts import render, redirect
from .models import Articulo
from .forms import ArticuloForm  # Asumimos que tienes un formulario

def articulo_nuevo(request):
    if request.method == 'POST':
        form = ArticuloForm(request.POST)
        if form.is_valid():
            form.save()
            return redirect('/articulos/')
    else:
        form = ArticuloForm()
    return render(request, 'articulos/formulario.html', {'form': form})
```



```python
# forms.py
from django import forms
from .models import Articulo

class ArticuloForm(forms.ModelForm):
    class Meta:
        model = Articulo
        fields = ['titulo', 'contenido']
```

El **template** es el mismo que el anterior.

---

# 3. Explicación del método POST en CBV

Cuando usas una CBV como `CreateView`, Django maneja el proceso:

- Si la petición es **GET**, muestra el formulario.
- Si es **POST**, valida el formulario:
    - Si es válido, guarda el objeto y redirige.
    - Si no, vuelve a mostrar el formulario con errores.

Si necesitas lógica personalizada (por ejemplo, modificar datos antes de guardar), puedes sobreescribir el método `form_valid()`:



```python
def form_valid(self, form):
    # Modifica el objeto antes de guardar
    form.instance.autor = self.request.user
    return super().form_valid(form)
```

---

# 4. Resumen de diferencias

||CBV (CreateView)|FBV|
|---|---|---|
|Código|Más corto y reutilizable|Más explícito y personalizable|
|Lógica POST|Automática, pero se puede sobrescribir|Debes manejar el POST manualmente|
|Formularios|Usa `fields` o un `form_class`|Usas el formulario directamente|

## 1. Define tu formulario personalizado



```python
# forms.py
from django import forms
from .models import Articulo

class ArticuloForm(forms.ModelForm):
    # Puedes agregar campos adicionales o personalizar widgets/validaciones
    resumen = forms.CharField(max_length=200, required=False, label='Resumen')

    class Meta:
        model = Articulo
        fields = ['titulo', 'contenido', 'resumen']
        widgets = {
            'contenido': forms.Textarea(attrs={'rows': 4, 'cols': 40}),
        }

    def clean_titulo(self):
        titulo = self.cleaned_data['titulo']
        if "prohibido" in titulo.lower():
            raise forms.ValidationError("No se permite la palabra 'prohibido' en el título.")
        return titulo
```

---

## 2. Usar el formulario personalizado en una CBV

Para vistas genéricas como `CreateView` o `UpdateView`, usa el atributo `form_class`:



```python
# views.py
from django.views.generic.edit import CreateView
from .models import Articulo
from .forms import ArticuloForm

class ArticuloCreateView(CreateView):
    model = Articulo
    form_class = ArticuloForm                  # <--- Aquí pasas tu form personalizado
    template_name = 'articulos/formulario.html'
    success_url = '/articulos/'
```

Esto hace que la vista use **tu formulario personalizado** en vez de uno generado automáticamente.

---

## 3. Usar el formulario personalizado en una FBV

Aquí simplemente creas una instancia de tu formulario y lo usas en la vista:



```python
# views.py
from django.shortcuts import render, redirect
from .forms import ArticuloForm

def articulo_nuevo(request):
    if request.method == 'POST':
        form = ArticuloForm(request.POST)
        if form.is_valid():
            form.save()
            return redirect('/articulos/')
    else:
        form = ArticuloForm()
    return render(request, 'articulos/formulario.html', {'form': form})
```


## 1. Formularios personalizados y lógica avanzada

### a) Campos adicionales y lógica fuera del modelo

Puedes agregar campos que no existen en el modelo, útiles para confirmaciones, filtros, uploads temporales, etc.



```python
class RegistroUsuarioForm(forms.ModelForm):
    password = forms.CharField(widget=forms.PasswordInput)
    confirmar_password = forms.CharField(widget=forms.PasswordInput)

    class Meta:
        model = Usuario
        fields = ['username', 'email', 'password']

    def clean(self):
        cleaned_data = super().clean()
        if cleaned_data.get('password') != cleaned_data.get('confirmar_password'):
            raise forms.ValidationError("Las contraseñas no coinciden.")
        return cleaned_data
```

### b) Validaciones personalizadas

Sobrescribe `clean_<campo>()` para validaciones por campo, o `clean()` para validaciones cruzadas.



```python
def clean_email(self):
    email = self.cleaned_data['email']
    if Usuario.objects.filter(email=email).exists():
        raise forms.ValidationError('Este email ya está registrado.')
    return email
```

### c) Widgets personalizados

Personaliza cómo se renderizan los campos en HTML:



```python
class MiForm(forms.ModelForm):
    class Meta:
        model = Articulo
        fields = ['titulo']
        widgets = {
            'titulo': forms.TextInput(attrs={'class': 'form-control', 'placeholder': 'Título'}),
        }
```

### d) Inicializar valores dinámicamente



```python
def __init__(self, *args, **kwargs):
    super().__init__(*args, **kwargs)
    self.fields['email'].initial = "ejemplo@correo.com"
```

---

## 2. Formularios anidados: Formsets e InlineFormsets

- **Formsets:** Grupo de formularios del mismo modelo.
- **InlineFormsets:** Formularios hijos relacionados (ej: varios autores para un libro).



```python
from django.forms import modelformset_factory, inlineformset_factory

AutorFormSet = modelformset_factory(Autor, fields=('nombre', 'email'))
LibroFormSet = inlineformset_factory(Editorial, Libro, fields=('titulo',))
```

---

# Vistas Basadas en Clases (CBV) Avanzadas

## 1. Extendiendo CBVs genéricas

Puedes sobrescribir métodos como `get_context_data`, `form_valid`, `dispatch`, etc.



```python
class ArticuloCreateView(CreateView):
    model = Articulo
    form_class = ArticuloForm
    template_name = 'articulos/formulario.html'

    def form_valid(self, form):
        form.instance.autor = self.request.user
        return super().form_valid(form)

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['extra'] = 'Dato extra'
        return context
```

## 2. Mixins personalizados

Puedes crear **Mixins** para reutilizar lógica entre varias CBV:



```python
class UsuarioStaffRequiredMixin:
    def dispatch(self, request, *args, **kwargs):
        if not request.user.is_staff:
            return redirect('no_autorizado')
        return super().dispatch(request, *args, **kwargs)

class VistaProtegida(UsuarioStaffRequiredMixin, ListView):
    model = Articulo
```

## 3. Métodos HTTP personalizados

Puedes manejar otros métodos además de GET y POST:



```python
class MiVista(View):
    def get(self, request, *args, **kwargs):
        # lógica GET
    def post(self, request, *args, **kwargs):
        # lógica POST
    def delete(self, request, *args, **kwargs):
        # lógica DELETE (útil para APIs)
```

## 4. CBVs con múltiples formularios



```python
class VistaMultiForm(View):
    def get(self, request, *args, **kwargs):
        form1 = Form1()
        form2 = Form2()
        return render(request, 'multi.html', {'form1': form1, 'form2': form2})

    def post(self, request, *args, **kwargs):
        form1 = Form1(request.POST)
        form2 = Form2(request.POST)
        if form1.is_valid() and form2.is_valid():
            # lógica
            return redirect('exito')
        return render(request, 'multi.html', {'form1': form1, 'form2': form2})
```

---

# Buenas prácticas avanzadas

- **Usa `form_class` en CBV** para mayor control.
- **Prefiere Mixins** para lógica reusable y DRY.
- **Sobrescribe sólo lo necesario**, usa `super()`.
- **Aprovecha los métodos de CBV**: `get_initial`, `get_form_kwargs`, `get_success_url`.
- **Utiliza formsets para formularios múltiples.**
- **Protege tus vistas** con mixins o decoradores (ej. `LoginRequiredMixin`).
- **Centraliza la lógica de validación en los formularios**, no en las vistas.

# 1. Formularios anidados (Formsets e InlineFormsets)

## a) ¿Qué son?

- **Formset:** Conjunto de formularios del mismo tipo (ej: varios emails de contacto).
- **InlineFormset:** Conjunto de formularios hijo relacionados a un modelo padre (ej: varios autores para un libro).

## b) Ejemplo práctico: InlineFormset

Supón que tienes un modelo `Libro` y cada libro puede tener varios `Comentario`.


```python
# models.py
class Libro(models.Model):
    titulo = models.CharField(max_length=100)

class Comentario(models.Model):
    libro = models.ForeignKey(Libro, on_delete=models.CASCADE)
    texto = models.TextField()
```

### En el form:

```python
from django.forms import inlineformset_factory
from .models import Libro, Comentario

ComentarioFormSet = inlineformset_factory(Libro, Comentario, fields=['texto'], extra=2)
```

### En la vista (CBV ejemplo):


```python
from django.views.generic.edit import UpdateView
from django.shortcuts import redirect, render
from .models import Libro
from .forms import ComentarioFormSet

class LibroUpdateView(UpdateView):
    model = Libro
    fields = ['titulo']
    template_name = 'libros/libro_form.html'

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        if self.request.POST:
            context['comentario_formset'] = ComentarioFormSet(self.request.POST, instance=self.object)
        else:
            context['comentario_formset'] = ComentarioFormSet(instance=self.object)
        return context

    def form_valid(self, form):
        context = self.get_context_data()
        comentario_formset = context['comentario_formset']
        if comentario_formset.is_valid():
            self.object = form.save()
            comentario_formset.instance = self.object
            comentario_formset.save()
            return redirect(self.get_success_url())
        else:
            return self.form_invalid(form)
```

### En el template:


```python
<form method="post">
  {% csrf_token %}
  {{ form.as_p }}
  {{ comentario_formset.management_form }}
  {% for subform in comentario_formset %}
      {{ subform.as_p }}
  {% endfor %}
  <button type="submit">Guardar</button>
</form>
```

---

# 2. Validaciones AJAX en formularios de Django

## a) ¿Qué es?

Permite validar campos o enviar formularios sin recargar la página, usando JavaScript para enviar datos al servidor y recibir respuestas JSON.

## b) Ejemplo: Validar si un título ya existe

### En la vista:


```python
from django.http import JsonResponse
from .models import Libro

def validar_titulo(request):
    titulo = request.GET.get('titulo', None)
    existe = Libro.objects.filter(titulo=titulo).exists()
    return JsonResponse({'existe': existe})
```

### En urls.py:


```python
path('ajax/validar-titulo/', views.validar_titulo, name='validar_titulo'),
```

### En el template (con JS):


```html
<input id="titulo" name="titulo" />
<span id="mensaje"></span>
<script>
document.getElementById('titulo').addEventListener('blur', function(){
    fetch(`/ajax/validar-titulo/?titulo=${this.value}`)
      .then(resp => resp.json())
      .then(data => {
          document.getElementById('mensaje').innerText = data.existe ? "Título ya existente" : "";
      });
});
</script>
```

---

# 3. Formularios embebidos (Formsets)

## a) ¿Qué es?

Permite manejar múltiples instancias de un mismo formulario en una sola página (por ejemplo, agregar varios emails de contacto).

## b) Ejemplo: Formset para emails

### En forms.py:


```python
from django import forms
from django.forms import formset_factory

class EmailForm(forms.Form):
    email = forms.EmailField()

EmailFormSet = formset_factory(EmailForm, extra=3)
```

### En la vista:


```python
def agregar_emails(request):
    if request.method == 'POST':
        formset = EmailFormSet(request.POST)
        if formset.is_valid():
            # Procesa los emails
            for form in formset:
                print(form.cleaned_data['email'])
            return redirect('exito')
    else:
        formset = EmailFormSet()
    return render(request, 'emails/formset.html', {'formset': formset})
```

### En el template:


```html
<form method="post">
  {% csrf_token %}
  {{ formset.management_form }}
  {% for form in formset %}
    {{ form.as_p }}
  {% endfor %}
  <button type="submit">Enviar</button>
</form>
```

---

# Resumen y buenas prácticas

- Usa **formsets** o **inlineformsets** para manejar varios formularios relacionados.
- Para validaciones AJAX, crea vistas que devuelvan JSON y usa JS para manejar respuestas.
- Siempre incluye `{{ formset.management_form }}` en el template para que funcione el formset.
- Puedes combinar AJAX para enviar todo el formset sin recargar la página (con `fetch` y FormData).