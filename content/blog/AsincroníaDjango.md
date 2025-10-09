---
title: "Asincronía y Tareas en Background en Django"
date: "2025-10-08"
description: "Aprende a manejar tareas en background y asincronía en Django para mejorar el rendimiento de tus aplicaciones web."
tags: [ "Arquitectura", "Web Development",'Django' ]

author: "raulanto"
author_avatar: 'https://avatars.githubusercontent.com/u/74162376?v=4'
author_description: "Desarrollador Full Stack"
thumbnail: "/blog/4015616_32a9_2.webp"
---

# Asincronía y Tareas en Background en Django: De lo Fundamental a lo Avanzado

Permíteme llevarte por un viaje que transformará tu comprensión de cómo Django puede manejar operaciones complejas y en
tiempo real. Vamos a construir este conocimiento capa por capa, empezando por entender por qué necesitamos estas
herramientas.

## El Problema Fundamental: Por Qué Necesitamos Asincronía

Imagina que tienes una tienda en línea. Cuando un cliente completa una compra, necesitas hacer varias cosas: procesar el
pago, enviar un email de confirmación, actualizar el inventario, generar una factura en PDF, y notificar al almacén. Si
hicieras todo esto de forma sincrónica, el cliente estaría esperando en la página de confirmación durante diez o quince
segundos mientras todas estas operaciones se completan una tras otra. Eso es una eternidad en la web moderna y
probablemente perderías clientes.

Aquí es donde entran tres conceptos cruciales que Django maneja de formas diferentes. Primero está la asincronía a nivel
de aplicación, que permite que tu servidor maneje múltiples peticiones simultáneamente sin bloquear. Segundo están las
tareas en background, que te permiten decirle al sistema "haz esto, pero no me hagas esperar por el resultado". Y
tercero está la comunicación en tiempo real, donde necesitas enviar datos del servidor al cliente sin que el cliente
tenga que preguntar constantemente "¿hay algo nuevo?".

## Django Channels: Rompiendo las Limitaciones de HTTP

Durante años, Django funcionó exclusivamente con WSGI, el estándar de Python para aplicaciones web. WSGI funciona
perfectamente para el modelo tradicional de petición-respuesta de HTTP: el cliente hace una pregunta, el servidor
responde, y se cierra la conexión. Pero este modelo tiene una limitación fundamental que se vuelve evidente cuando
quieres construir aplicaciones modernas como chats en vivo, notificaciones en tiempo real, o juegos multijugador.

### Entendiendo ASGI: La Evolución de Django

ASGI, que significa Asynchronous Server Gateway Interface, es la evolución de WSGI diseñada para el mundo asíncrono.
Piensa en WSGI como una conversación telefónica donde solo puedes hablar cuando la otra persona te llama, mientras que
ASGI es como tener una línea abierta donde ambas partes pueden hablar cuando quieran. Django Channels construye sobre
ASGI para dar a Django superpoderes de comunicación en tiempo real.

Déjame mostrarte cómo funciona esto en la práctica con un ejemplo real: un sistema de notificaciones en tiempo real para
una aplicación de comercio electrónico donde los vendedores reciben alertas instantáneas cuando hay una nueva venta.

Primero, necesitas configurar tu proyecto para usar ASGI. En tu archivo `asgi.py` base, configurarías el enrutamiento de
Channels:

```python
# myproject/asgi.py
import os
from django.core.asgi import get_asgi_application
from channels.routing import ProtocolTypeRouter, URLRouter
from channels.auth import AuthMiddlewareStack
from channels.security.websocket import AllowedHostsOriginValidator

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'myproject.settings')

# Esta es la aplicación ASGI estándar de Django para HTTP
django_asgi_app = get_asgi_application()

# Importamos nuestras rutas de WebSocket después de get_asgi_application
from notificaciones.routing import websocket_urlpatterns

# ProtocolTypeRouter decide qué hacer basándose en el tipo de conexión
application = ProtocolTypeRouter({
    # HTTP tradicional sigue funcionando normalmente
    "http": django_asgi_app,
    
    # Las conexiones WebSocket se manejan de forma diferente
    "websocket": AllowedHostsOriginValidator(
        AuthMiddlewareStack(
            URLRouter(websocket_urlpatterns)
        )
    ),
})
```

Ahora creemos un Consumer, que es el equivalente de una vista pero para WebSockets. Los Consumers manejan las conexiones
persistentes y pueden tanto recibir como enviar mensajes:

```python
# notificaciones/consumers.py
from channels.generic.websocket import AsyncWebsocketConsumer
import json

class NotificacionesConsumer(AsyncWebsocketConsumer):
    """
    Este Consumer maneja las conexiones WebSocket para notificaciones en tiempo real.
    Piensa en él como una vista que mantiene una conexión abierta en lugar de
    responder una sola vez y cerrar.
    """
    
    async def connect(self):
        """
        Se ejecuta cuando un cliente intenta conectarse vía WebSocket.
        Aquí decidimos si aceptar o rechazar la conexión.
        """
        # Obtenemos el ID del usuario de la sesión
        self.user = self.scope["user"]
        
        # Solo permitimos conexiones de usuarios autenticados
        if not self.user.is_authenticated:
            await self.close()
            return
        
        # Creamos un nombre de grupo único para este usuario
        # Los grupos permiten enviar mensajes a múltiples conexiones simultáneamente
        self.room_group_name = f'notificaciones_usuario_{self.user.id}'
        
        # Añadimos esta conexión al grupo del usuario
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name  # Este es el identificador único de esta conexión específica
        )
        
        # Aceptamos la conexión WebSocket
        await self.accept()
        
        # Enviamos un mensaje de bienvenida al conectarse
        await self.send(text_data=json.dumps({
            'type': 'connection_established',
            'message': 'Conectado al sistema de notificaciones'
        }))
    
    async def disconnect(self, close_code):
        """
        Se ejecuta cuando el cliente se desconecta.
        Es importante limpiar los recursos aquí.
        """
        # Removemos esta conexión del grupo
        if hasattr(self, 'room_group_name'):
            await self.channel_layer.group_discard(
                self.room_group_name,
                self.channel_name
            )
    
    async def receive(self, text_data):
        """
        Se ejecuta cuando recibimos un mensaje del cliente.
        En este caso, permitimos que el cliente marque notificaciones como leídas.
        """
        data = json.loads(text_data)
        
        if data.get('action') == 'marcar_leida':
            notificacion_id = data.get('notificacion_id')
            # Aquí iría la lógica para marcar como leída en la base de datos
            await self.actualizar_notificacion(notificacion_id)
    
    async def notificacion_nueva(self, event):
        """
        Este método se ejecuta cuando el grupo recibe un mensaje del tipo 'notificacion_nueva'.
        Es como un handler de eventos específico.
        """
        # Enviamos la notificación al WebSocket del cliente
        await self.send(text_data=json.dumps({
            'type': 'nueva_venta',
            'titulo': event['titulo'],
            'mensaje': event['mensaje'],
            'monto': event['monto'],
            'timestamp': event['timestamp']
        }))
    
    @database_sync_to_async
    def actualizar_notificacion(self, notificacion_id):
        """
        Usamos este decorador para llamar código síncrono (como Django ORM)
        desde un contexto asíncrono. Es crucial para mantener la compatibilidad.
        """
        from .models import Notificacion
        try:
            notificacion = Notificacion.objects.get(id=notificacion_id, usuario=self.user)
            notificacion.leida = True
            notificacion.save()
        except Notificacion.DoesNotExist:
            pass
```

El routing de WebSockets funciona similar a las URLs normales de Django:

```python
# notificaciones/routing.py
from django.urls import re_path
from . import consumers

websocket_urlpatterns = [
    re_path(r'ws/notificaciones/$', consumers.NotificacionesConsumer.as_asgi()),
]
```

Ahora viene la parte realmente interesante: cómo enviamos notificaciones desde cualquier parte de tu aplicación Django.
Cuando se crea una nueva venta, puedes notificar instantáneamente al vendedor:

```python
# ventas/views.py
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync
from django.utils import timezone

def procesar_venta(request):
    """
    Vista tradicional de Django que procesa una venta.
    Nota cómo podemos enviar mensajes a WebSockets desde aquí.
    """
    # ... lógica para crear la venta ...
    venta = Venta.objects.create(
        producto=producto,
        comprador=comprador,
        vendedor=vendedor,
        monto=monto
    )
    
    # Obtenemos acceso a la capa de canales
    channel_layer = get_channel_layer()
    
    # Enviamos una notificación al grupo del vendedor
    # Como estamos en código síncrono, usamos async_to_sync
    async_to_sync(channel_layer.group_send)(
        f'notificaciones_usuario_{vendedor.id}',
        {
            'type': 'notificacion_nueva',  # Esto llama al método notificacion_nueva del Consumer
            'titulo': 'Nueva venta realizada',
            'mensaje': f'Se vendió {producto.nombre}',
            'monto': str(monto),
            'timestamp': timezone.now().isoformat()
        }
    )
    
    return JsonResponse({'status': 'ok'})
```

En el frontend, conectar con este WebSocket :

```javascript
// static/js/notificaciones.js
class SistemaNotificaciones {
    constructor() {
        this.conectar();
    }

    conectar() {
        // Construimos la URL del WebSocket basada en el protocolo actual
        const protocolo = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
        const url = `${protocolo}//${window.location.host}/ws/notificaciones/`;

        this.socket = new WebSocket(url);

        this.socket.onopen = (e) => {
            console.log('Conectado al sistema de notificaciones');
        };

        this.socket.onmessage = (e) => {
            const data = JSON.parse(e.data);

            if (data.type === 'nueva_venta') {
                this.mostrarNotificacion(data);
                this.reproducirSonido();
            }
        };

        this.socket.onclose = (e) => {
            console.log('Desconectado. Reintentando en 3 segundos...');
            setTimeout(() => this.conectar(), 3000);
        };
    }

    mostrarNotificacion(data) {
        // Crear notificación visual
        const notificacion = document.createElement('div');
        notificacion.className = 'notificacion-popup';
        notificacion.innerHTML = `
            <h4>${data.titulo}</h4>
            <p>${data.mensaje}</p>
            <p class="monto">$${data.monto}</p>
        `;
        document.body.appendChild(notificacion);

        // Animación de entrada y salida
        setTimeout(() => notificacion.classList.add('mostrar'), 100);
        setTimeout(() => {
            notificacion.classList.remove('mostrar');
            setTimeout(() => notificacion.remove(), 300);
        }, 5000);
    }

    marcarComoLeida(notificacionId) {
        this.socket.send(JSON.stringify({
            action: 'marcar_leida',
            notificacion_id: notificacionId
        }));
    }
}

// Inicializar cuando cargue la página
document.addEventListener('DOMContentLoaded', () => {
    new SistemaNotificaciones();
});
```

Para que todo esto funcione, necesitas configurar un backend de canales en Redis. Django Channels necesita una forma de
comunicarse entre diferentes procesos y servidores, y Redis es perfecto para esto:

```python
# settings.py
INSTALLED_APPS = [
    'daphne',  # Debe ir primero para sobrescribir runserver
    'django.contrib.admin',
    # ... otras apps ...
    'channels',
]

ASGI_APPLICATION = 'myproject.asgi.application'

CHANNEL_LAYERS = {
    'default': {
        'BACKEND': 'channels_redis.core.RedisChannelLayer',
        'CONFIG': {
            "hosts": [('127.0.0.1', 6379)],
            # Configuración de retry para mayor resiliencia
            "capacity": 1500,  # Número máximo de mensajes en cola
            "expiry": 10,  # Tiempo de vida de mensajes en segundos
        },
    },
}
```

## Celery: El Trabajador Incansable de tu Aplicación

Mientras que Channels maneja comunicación en tiempo real, Celery se especializa en algo diferente pero igualmente
crucial: ejecutar tareas que pueden tomar mucho tiempo sin bloquear tu aplicación web. Volvamos al ejemplo de la tienda
en línea. Cuando un cliente compra algo, generar la factura en PDF, enviar emails, y procesar el pago pueden tomar
varios segundos cada uno. Con Celery, puedes responder al cliente inmediatamente y hacer todo ese trabajo pesado en
background.

Celery funciona con un concepto de trabajadores distribuidos. Imagina que tienes una cocina de restaurante: los
meseros (tus vistas de Django) toman las órdenes y las pasan a la cocina (Celery), donde múltiples cocineros (workers)
pueden trabajar en diferentes platos simultáneamente. Los meseros no esperan a que se cocine la comida, sino que
continúan tomando más órdenes.

Configuremos Celery en un proyecto Django de manera profesional:

```python
# myproject/celery.py
from celery import Celery
import os

# Establecemos la configuración de Django para Celery
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'myproject.settings')

# Creamos la aplicación de Celery
app = Celery('myproject')

# Leemos la configuración desde Django settings con el prefijo CELERY_
app.config_from_object('django.conf:settings', namespace='CELERY')

# Autodescubrimos tareas en todos los archivos tasks.py de nuestras apps
app.autodiscover_tasks()

@app.task(bind=True, ignore_result=True)
def debug_task(self):
    """
    Una tarea de prueba útil para verificar que Celery está funcionando.
    El parámetro bind=True nos da acceso a la instancia de la tarea.
    """
    print(f'Request: {self.request!r}')
```

Necesitas inicializar Celery cuando Django arranca:

```python
# myproject/__init__.py
from .celery import app as celery_app

__all__ = ('celery_app',)
```

En tu archivo de configuración, defines cómo Celery se conecta con el broker de mensajes. Redis es una excelente opción
por su simplicidad y velocidad:

```python
# settings.py
CELERY_BROKER_URL = 'redis://localhost:6379/0'
CELERY_RESULT_BACKEND = 'redis://localhost:6379/0'

# Serialización JSON es más segura que pickle
CELERY_ACCEPT_CONTENT = ['json']
CELERY_TASK_SERIALIZER = 'json'
CELERY_RESULT_SERIALIZER = 'json'

# Configuración de zona horaria
CELERY_TIMEZONE = 'America/Mexico_City'
CELERY_ENABLE_UTC = True

# Configuración de reintentos y timeouts
CELERY_TASK_ACKS_LATE = True  # Confirma tareas solo después de completarlas
CELERY_TASK_REJECT_ON_WORKER_LOST = True  # Reintenta si el worker muere
CELERY_WORKER_PREFETCH_MULTIPLIER = 1  # Un worker toma una tarea a la vez
```

Ahora creemos tareas reales para nuestro sistema de comercio electrónico:

```python
# ventas/tasks.py
from celery import shared_task, Task
from django.core.mail import send_mail
from django.template.loader import render_to_string
from django.utils import timezone
from datetime import timedelta
import logging

logger = logging.getLogger(__name__)

class CallbackTask(Task):
    """
    Clase base personalizada para tareas con manejo avanzado de errores.
    Esto te permite tener control fino sobre qué sucede cuando una tarea falla o tiene éxito.
    """
    def on_success(self, retval, task_id, args, kwargs):
        """Se ejecuta cuando la tarea se completa exitosamente"""
        logger.info(f'Tarea {task_id} completada con éxito')
    
    def on_failure(self, exc, task_id, args, kwargs, einfo):
        """Se ejecuta cuando la tarea falla después de todos los reintentos"""
        logger.error(f'Tarea {task_id} falló: {exc}')
        # Aquí podrías enviar una alerta al equipo de soporte

@shared_task(base=CallbackTask, bind=True, max_retries=3)
def enviar_email_confirmacion(self, venta_id):
    """
    Envía email de confirmación de compra.
    
    El decorador shared_task hace que esta función sea una tarea de Celery.
    bind=True nos da acceso a la instancia de la tarea (self).
    max_retries=3 intentará la tarea hasta 3 veces si falla.
    """
    try:
        from .models import Venta
        venta = Venta.objects.select_related('comprador', 'producto', 'vendedor').get(id=venta_id)
        
        # Generamos el HTML del email desde un template
        html_contenido = render_to_string('emails/confirmacion_compra.html', {
            'venta': venta,
            'comprador': venta.comprador,
            'producto': venta.producto,
        })
        
        send_mail(
            subject=f'Confirmación de compra - {venta.producto.nombre}',
            message='',  # Versión texto plano
            from_email='ventas@mitienda.com',
            recipient_list=[venta.comprador.email],
            html_message=html_contenido,
            fail_silently=False
        )
        
        # Actualizamos el estado en la base de datos
        venta.email_enviado = True
        venta.save(update_fields=['email_enviado'])
        
        logger.info(f'Email de confirmación enviado para venta {venta_id}')
        
    except Venta.DoesNotExist:
        logger.error(f'Venta {venta_id} no encontrada')
        # No reintentamos si la venta no existe
        return
        
    except Exception as exc:
        # Si hay un error, reintentamos con backoff exponencial
        logger.warning(f'Error enviando email para venta {venta_id}: {exc}')
        raise self.retry(exc=exc, countdown=60 * (2 ** self.request.retries))

@shared_task
def generar_factura_pdf(venta_id):
    """
    Genera una factura en PDF para la venta.
    Esta es una operación pesada que puede tardar varios segundos.
    """
    from .models import Venta
    from .utils import generador_pdf
    
    venta = Venta.objects.get(id=venta_id)
    
    # Esta operación puede ser lenta
    pdf_bytes = generador_pdf.crear_factura(venta)
    
    # Guardamos el PDF en el sistema de archivos o S3
    nombre_archivo = f'factura_{venta.numero}.pdf'
    venta.factura.save(nombre_archivo, pdf_bytes)
    
    logger.info(f'Factura generada para venta {venta_id}')

@shared_task
def actualizar_inventario(producto_id, cantidad):
    """
    Actualiza el inventario de un producto.
    Usamos select_for_update para evitar condiciones de carrera.
    """
    from django.db import transaction
    from .models import Producto
    
    with transaction.atomic():
        # select_for_update bloquea la fila hasta que termine la transacción
        producto = Producto.objects.select_for_update().get(id=producto_id)
        producto.stock -= cantidad
        producto.save(update_fields=['stock'])
        
        # Si el stock es bajo, notificamos al proveedor
        if producto.stock < producto.stock_minimo:
            notificar_stock_bajo.delay(producto_id)

@shared_task
def notificar_stock_bajo(producto_id):
    """
    Envía notificación cuando el stock está bajo.
    """
    from .models import Producto
    
    producto = Producto.objects.select_related('proveedor').get(id=producto_id)
    
    send_mail(
        subject=f'Stock bajo: {producto.nombre}',
        message=f'El producto {producto.nombre} tiene solo {producto.stock} unidades.',
        from_email='inventario@mitienda.com',
        recipient_list=[producto.proveedor.email],
    )

@shared_task
def procesar_venta_completa(venta_id):
    """
    Tarea orquestadora que coordina múltiples subtareas.
    Usamos Celery's chain para ejecutar tareas en secuencia.
    """
    from celery import chain
    
    # Creamos una cadena de tareas que se ejecutan en orden
    workflow = chain(
        enviar_email_confirmacion.s(venta_id),
        generar_factura_pdf.s(venta_id),
    )
    
    # Ejecutamos el workflow
    workflow.apply_async()
```

Ahora integramos estas tareas en nuestras vistas:

```python
# ventas/views.py
from django.shortcuts import render, redirect
from django.contrib.auth.decorators import login_required
from .tasks import procesar_venta_completa, enviar_email_confirmacion
from .models import Producto, Venta

@login_required
def crear_venta(request, producto_id):
    """
    Vista que maneja la creación de una venta.
    Nota cómo delegamos el trabajo pesado a Celery.
    """
    if request.method == 'POST':
        producto = Producto.objects.get(id=producto_id)
        
        # Creamos la venta inmediatamente
        venta = Venta.objects.create(
            producto=producto,
            comprador=request.user,
            vendedor=producto.vendedor,
            monto=producto.precio
        )
        
        # Delegamos todo el procesamiento a Celery
        # El usuario no tiene que esperar por esto
        procesar_venta_completa.delay(venta.id)
        
        # Respondemos inmediatamente
        return redirect('confirmacion_venta', venta_id=venta.id)
    
    return render(request, 'ventas/crear.html')
```

### Tareas Periódicas con Celery Beat

Celery Beat es el planificador de tareas de Celery, equivalente a un cron job pero mucho más flexible. Es perfecto para
tareas que necesitas ejecutar regularmente:

```python
# settings.py
from celery.schedules import crontab

CELERY_BEAT_SCHEDULE = {
    'enviar-reporte-diario': {
        'task': 'ventas.tasks.generar_reporte_diario',
        'schedule': crontab(hour=8, minute=0),  # Todos los días a las 8 AM
    },
    'limpiar-carritos-abandonados': {
        'task': 'ventas.tasks.limpiar_carritos_abandonados',
        'schedule': crontab(hour='*/2'),  # Cada 2 horas
    },
    'actualizar-estadisticas': {
        'task': 'analytics.tasks.actualizar_estadisticas',
        'schedule': 300.0,  # Cada 5 minutos (en segundos)
    },
}
```

Las tareas periódicas se definen igual que cualquier otra tarea:

```python
# ventas/tasks.py
@shared_task
def generar_reporte_diario():
    """
    Genera y envía un reporte diario de ventas por email.
    Se ejecuta automáticamente según el schedule definido.
    """
    from django.core.mail import EmailMessage
    from .models import Venta
    from datetime import date, timedelta
    import csv
    from io import StringIO
    
    ayer = date.today() - timedelta(days=1)
    ventas = Venta.objects.filter(
        fecha_creacion__date=ayer
    ).select_related('producto', 'comprador')
    
    # Creamos un CSV en memoria
    csv_file = StringIO()
    writer = csv.writer(csv_file)
    writer.writerow(['Producto', 'Comprador', 'Monto', 'Hora'])
    
    total = 0
    for venta in ventas:
        writer.writerow([
            venta.producto.nombre,
            venta.comprador.email,
            venta.monto,
            venta.fecha_creacion.strftime('%H:%M')
        ])
        total += venta.monto
    
    writer.writerow(['', '', f'Total: ${total}', ''])
    
    # Enviamos el email con el archivo adjunto
    email = EmailMessage(
        subject=f'Reporte de ventas - {ayer}',
        body=f'Ventas totales: ${total}\nTotal de transacciones: {ventas.count()}',
        from_email='reportes@mitienda.com',
        to=['gerencia@mitienda.com'],
    )
    
    csv_file.seek(0)
    email.attach(f'ventas_{ayer}.csv', csv_file.getvalue(), 'text/csv')
    email.send()
    
    logger.info(f'Reporte diario generado: {ventas.count()} ventas, total ${total}')

@shared_task
def limpiar_carritos_abandonados():
    """
    Elimina carritos de compra que no han sido utilizados en 7 días.
    También podría enviar emails de recordatorio antes de eliminar.
    """
    from .models import CarritoCompra
    from datetime import timedelta
    
    fecha_limite = timezone.now() - timedelta(days=7)
    carritos_viejos = CarritoCompra.objects.filter(
        ultima_modificacion__lt=fecha_limite,
        comprado=False
    )
    
    # Antes de eliminar, enviamos recordatorios
    for carrito in carritos_viejos:
        if carrito.usuario.email:
            enviar_recordatorio_carrito.delay(carrito.id)
    
    cantidad = carritos_viejos.count()
    carritos_viejos.delete()
    
    logger.info(f'Eliminados {cantidad} carritos abandonados')
```

## Integrando RabbitMQ: Cuando Redis No Es Suficiente

Redis es excelente para la mayoría de casos, pero cuando tu aplicación crece y necesitas garantías más fuertes de
entrega de mensajes, persistencia robusta, y enrutamiento complejo, RabbitMQ es la opción profesional. RabbitMQ es un
broker de mensajes completo que implementa el protocolo AMQP y ofrece características avanzadas que Redis no tiene.

La diferencia clave está en cómo manejan los mensajes. Redis es fundamentalmente una base de datos en memoria con
capacidades de pub/sub, mientras que RabbitMQ está diseñado desde cero como un sistema de mensajería con garantías de
entrega, persistencia en disco, y confirmaciones de recepción. Si un worker de Celery muere mientras procesa una tarea
con Redis, esa tarea probablemente se pierde. Con RabbitMQ, la tarea vuelve a la cola automáticamente.

Configurar Celery con RabbitMQ es sorprendentemente simple:

```python
# settings.py
CELERY_BROKER_URL = 'amqp://usuario:password@localhost:5672/vhost_produccion'

# Configuración específica de RabbitMQ
CELERY_RESULT_BACKEND = 'rpc://'  # Usamos RabbitMQ también para resultados

# Configuración de persistencia
CELERY_TASK_ALWAYS_EAGER = False  # No ejecutar tareas sincrónicamente en desarrollo
CELERY_TASK_EAGER_PROPAGATES = True  # Propagar excepciones en modo eager

# Configuración de enrutamiento avanzado
CELERY_TASK_ROUTES = {
    'ventas.tasks.enviar_email_*': {'queue': 'emails'},
    'ventas.tasks.generar_factura_*': {'queue': 'procesamiento_pesado'},
    'analytics.*': {'queue': 'analytics'},
}

# Prioridades de tareas
CELERY_TASK_DEFAULT_PRIORITY = 5
CELERY_TASK_INHERIT_PARENT_PRIORITY = True
```

Con RabbitMQ puedes crear workers especializados para diferentes tipos de tareas:

```bash
# Worker para emails - rápido y ligero
celery -A myproject worker -Q emails -c 10 --loglevel=info

# Worker para procesamiento pesado - menos concurrencia pero más recursos
celery -A myproject worker -Q procesamiento_pesado -c 2 --loglevel=info

# Worker general
celery -A myproject worker -Q celery -c 4 --loglevel=info
```

Esto te permite escalar diferentes partes de tu sistema independientemente. Si tienes un pico de emails pero no de
procesamiento PDF, solo escalas los workers de emails.

### Caso Real Complejo: Sistema de Procesamiento de Imágenes

Imaginemos que construyes una plataforma tipo Instagram donde los usuarios suben fotos que necesitan ser procesadas en
múltiples tamaños, aplicar filtros, extraer metadatos, y verificar contenido inapropiado usando IA. Este es un caso
perfecto para combinar todas estas tecnologías:

```python
# imagenes/tasks.py
from celery import shared_task, group, chain, chord
from PIL import Image
import io
import boto3
from django.core.files.base import ContentFile

@shared_task
def procesar_imagen_subida(imagen_id):
    """
    Tarea orquestadora que coordina todo el procesamiento de la imagen.
    Usa Celery's chord para ejecutar tareas en paralelo y luego una callback.
    """
    from .models import ImagenUsuario
    
    imagen = ImagenUsuario.objects.get(id=imagen_id)
    
    # Creamos un grupo de tareas que se ejecutan en paralelo
    procesamiento_paralelo = group(
        generar_thumbnails.s(imagen_id),
        extraer_metadatos.s(imagen_id),
        analizar_contenido.s(imagen_id),
    )
    
    # Chord ejecuta el grupo y luego una callback con todos los resultados
    workflow = chord(procesamiento_paralelo)(
        finalizar_procesamiento.s(imagen_id)
    )
    
    return workflow

@shared_task
def generar_thumbnails(imagen_id):
    """
    Genera múltiples versiones de la imagen en diferentes tamaños.
    """
    from .models import ImagenUsuario
    
    imagen = ImagenUsuario.objects.get(id=imagen_id)
    
    # Descargamos la imagen original
    imagen_pil = Image.open(imagen.archivo_original)
    
    tamaños = {
        'thumbnail': (150, 150),
        'medium': (640, 640),
        'large': (1080, 1080),
    }
    
    versiones_generadas = {}
    
    for nombre, tamaño in tamaños.items():
        # Creamos una copia y la redimensionamos
        img_copia = imagen_pil.copy()
        img_copia.thumbnail(tamaño, Image.Resampling.LANCZOS)
        
        # Guardamos en memoria
        buffer = io.BytesIO()
        img_copia.save(buffer, format='JPEG', quality=85, optimize=True)
        buffer.seek(0)
        
        # Subimos a S3 o guardamos localmente
        nombre_archivo = f'{imagen.id}_{nombre}.jpg'
        getattr(imagen, f'archivo_{nombre}').save(
            nombre_archivo,
            ContentFile(buffer.read()),
            save=False
        )
        
        versiones_generadas[nombre] = nombre_archivo
    
    imagen.save()
    
    logger.info(f'Thumbnails generados para imagen {imagen_id}')
    return versiones_generadas

@shared_task
def extraer_metadatos(imagen_id):
    """
    Extrae metadatos EXIF de la imagen.
    """
    from .models import ImagenUsuario
    from PIL.ExifTags import TAGS
    
    imagen = ImagenUsuario.objects.get(id=imagen_id)
    img = Image.open(imagen.archivo_original)
    
    metadatos = {}
    
    exif_data = img._getexif()
    if exif_data:
        for tag_id, value in exif_data.items():
            tag = TAGS.get(tag_id, tag_id)
            metadatos[tag] = str(value)
    
    # Guardamos metadatos
    imagen.metadatos = metadatos
    imagen.save(update_fields=['metadatos'])
    
    return metadatos

@shared_task(bind=True, max_retries=2)
def analizar_contenido(self, imagen_id):
    """
    Analiza la imagen con un servicio de IA para detectar contenido inapropiado.
    Esta tarea podría fallar por problemas de API, así que tiene reintentos.
    """
    from .models import ImagenUsuario
    import requests
    
    imagen = ImagenUsuario.objects.get(id=imagen_id)
    
    try:
        # Llamamos a un servicio de moderación de imágenes
        response = requests.post(
            'https://api.servicio-moderacion.com/analyze',
            files={'image': imagen.archivo_original.open('rb')},
            timeout=30
        )
        
        resultado = response.json()
        
        imagen.contenido_seguro = resultado['safe']
        imagen.confianza_analisis = resultado['confidence']
        imagen.save(update_fields=['contenido_seguro', 'confianza_analisis'])
        
        return resultado
        
    except requests.RequestException as exc:
        logger.warning(f'Error analizando imagen {imagen_id}: {exc}')
        raise self.retry(exc=exc, countdown=120)

@shared_task
def finalizar_procesamiento(resultados, imagen_id):
    """
    Callback que se ejecuta después de que todas las tareas paralelas terminen.
    Recibe los resultados de todas las tareas en el chord.
    """
    from .models import ImagenUsuario
    from channels.layers import get_channel_layer
    from asgiref.sync import async_to_sync
    
    imagen = ImagenUsuario.objects.get(id=imagen_id)
    imagen.procesamiento_completo = True
    imagen.save(update_fields=['procesamiento_completo'])
    
    # Notificamos al usuario vía WebSocket que su imagen está lista
    channel_layer = get_channel_layer()
    async_to_sync(channel_layer.group_send)(
        f'usuario_{imagen.usuario.id}',
        {
            'type': 'imagen_procesada',
            'imagen_id': imagen_id,
            'url_thumbnail': imagen.archivo_thumbnail.url,
        }
    )
    
    logger.info(f'Procesamiento completo para imagen {imagen_id}')
```

En la vista, simplemente inicias el procesamiento:

```python
# imagenes/views.py
from django.views.generic import CreateView
from .models import ImagenUsuario
from .tasks import procesar_imagen_subida

class SubirImagenView(CreateView):
    model = ImagenUsuario
    fields = ['archivo_original', 'descripcion']
    
    def form_valid(self, form):
        form.instance.usuario = self.request.user
        response = super().form_valid(form)
        
        # Iniciamos el procesamiento asíncrono
        procesar_imagen_subida.delay(self.object.id)
        
        return response
```

## Monitoreo y Debugging: Flower

Para producción, necesitas visibilidad sobre qué están haciendo tus workers. Flower es una herramienta web hermosa que
te da monitoreo en tiempo real de Celery:

```bash
# Instalar Flower
pip install flower

# Ejecutar Flower
celery -A myproject flower --port=5555
```

Flower te muestra tareas activas, historial de ejecuciones, tasas de éxito/fallo, tiempos de ejecución, y te permite
incluso revocar o reintentar tareas desde la interfaz web.

Esta arquitectura de asincronía y tasks en background transforma completamente lo que puedes construir con Django. Ya no
estás limitado a operaciones rápidas que completan en segundos. Puedes procesar videos, entrenar modelos de machine
learning, generar reportes masivos, y mantener comunicación en tiempo real con miles de usuarios simultáneos. La clave
está en entender cuándo usar cada herramienta: Channels para comunicación bidireccional en tiempo real, Celery para
trabajo pesado que puede hacerse eventualmente, y la combinación de ambos para crear experiencias de usuario fluidas
donde las operaciones largas no bloquean la interacción.