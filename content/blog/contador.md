---
title: "Contador de Visitas con Django"
date: "2025-09-29"
description: "Integra un contador de visitas en tu página web utilizando Django. Aprende a rastrear y mostrar el número "
tags: ["Django", "Python", "Web Development"]
name: "contador"
---


En este artículo vamos a analizar un sistema completo de contador de visitas implementado con **Django** y **Python**. Este sistema permite registrar y mostrar cuántas veces ha sido visitada una página específica durante el año actual.



## 🗄 El Modelo de Datos: `ContadorVisita`

Primero, veamos la estructura que almacena la información en la base de datos:
<br/>
```python
class ContadorVisita(models.Model):
    id = ShortUUIDField(unique=True, max_length=25, prefix="cat", 
                        alphabet="abcdefgh12345", primary_key=True)
    identificador = models.CharField(max_length=100, verbose_name="Idenficador", null=True)
    visitas = models.BigIntegerField(verbose_name="Visitas", null=True)
    year = models.CharField(max_length=4, verbose_name="Annio", null=True)
    createdat = models.DateTimeField(auto_now_add=True)
    updatedat = models.DateTimeField(null=True, blank=True)
    fk_user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
```
<br/>
### Campos del modelo:

| Campo | Tipo | Descripción |
|-------|------|-------------|
| **id** | ShortUUIDField | Identificador único autogenerado con prefijo "cat" |
| **identificador** | CharField | Nombre único de la página (ej: "pagina-principal") |
| **visitas** | BigIntegerField | Contador de visitas |
| **year** | CharField | Año del registro (ej: "2025") |
| **createdat** | DateTimeField | Fecha de creación del registro |
| **updatedat** | DateTimeField | Fecha de última actualización |
| **fk_user** | ForeignKey | Relación con el usuario propietario |


##  La Función Principal: `obtenerVisitas()`

Esta función es el corazón del sistema. Analicemos su funcionamiento paso a paso:

### Parámetros

- **`identifica`**: Identificador único de la página que queremos contar
- **`confondo`**: Controla si se devuelve HTML formateado ("SI") o cadena vacía

### Flujo de Ejecución

#### 1️⃣ **Obtener el año actual**

```python
date = datetime.now()
anio = date.strftime('%Y')
```

Se captura la fecha actual y se extrae el año en formato de 4 dígitos.

#### 2️⃣ **Buscar registro existente**

```python
Object_visitas = ContadorVisita.objects.filter(identificador=identifica, year=anio)
```

Busca si ya existe un registro para esa página en el año actual.

#### 3️⃣ **Actualizar o crear registro**

**Si el registro existe:**
```python
Object_visitas.update(visitas = F('visitas') + 1)
```
Incrementa el contador usando `F()` para evitar condiciones de carrera (race conditions).

**Si NO existe:**
```python
obj = ContadorVisita(identificador=identifica, visitas=1, year=anio, fk_user_id = 1)
obj.save()
```
Crea un nuevo registro comenzando en 1 visita.

#### 4️⃣ **Recuperar datos actualizados**

```python
datos_visita = ContadorVisita.objects.get(identificador=identifica, year=anio)
```

Obtiene el registro con los datos frescos.

#### 5️⃣ **Generar HTML de salida (opcional)**

Si `confondo == "SI"`, genera un HTML formateado:

```html
<div class="col-md-12 text-center">
    <h5>Esta página a sido visitada 
        <span class="text-highlight">X</span> veces en el año 
        <span class="text-highlight">YYYY</span>
    </h5>
</div>
```



##  La Vista en el Template

El fragmento HTML muestra cómo se integra en una plantilla Django:

```html
<section class="divider bg-theme-colored2 text-center" 
         style="background-color: #077ad8 !important;">
    <div class="container pt-50 pb-50">
        <div class="row">
            <div class="col-md-12 text-center section-typo-light">
                {% autoescape off %}
                {{visits}}
                {% endautoescape %}
            </div>
        </div>
    </div>
</section>
```

### Características:
- **Fondo azul** (`#077ad8`) para destacar la sección
- **Centrado** del contenido
- **`{% autoescape off %}`**: Permite renderizar el HTML generado por `obtenerVisitas()`
- **Padding** superior e inferior de 50px


##  Ventajas del Sistema

✅ **Separación por año**: Cada año comienza un nuevo contador  
✅ **Uso de F()**: Previene problemas de concurrencia en la base de datos  
✅ **Flexible**: Puede rastrear múltiples páginas con diferentes identificadores  
✅ **BigInteger**: Soporta millones de visitas sin problemas


##  Uso Ejemplo

```python
# En tu vista Django
def mi_pagina(request):
    visitas_html = obtenerVisitas("pagina-inicio", "SI")
    return render(request, 'template.html', {'visits': visitas_html})
```


##  Mejoras Sugeridas

1. **Validación del parámetro `confondo`**: Usar booleanos en lugar de strings
2. **Corrección ortográfica**: "a sido" → "ha sido"
3. **Manejo de excepciones**: Agregar try-except para casos edge
4. **Campo `updatedat`**: Actualizarlo automáticamente con `auto_now=True`
5. **Retornar datos estructurados**: En lugar de HTML, retornar un diccionario y formatear en el template





Este sistema proporciona una forma sencilla y efectiva de rastrear visitas a páginas web usando Django. Su diseño modular permite fácil integración en cualquier proyecto y puede extenderse para agregar funcionalidades como gráficos históricos, comparaciones entre años, o estadísticas por usuario.