---
title: "Django Channels"
date: "2025-10-08"
description: "Antes de empezar a escribir código, es fundamental entender por qué los Channels existen"
tags: [ "Arquitectura", "Web Development",'Django' ]

author: "raulanto"
author_avatar: 'https://avatars.githubusercontent.com/u/74162376?v=4'
author_description: "Desarrollador Full Stack"
thumbnail: "/blog/Django.png"
---

# Django Channels: Guía Completa y Práctica

## Entendiendo Qué Problema Resuelve Channels

::alert{type="warning"  description="Antes de empezar a escribir código, es fundamental entender por qué Channels existe. "}
::

Django fue diseñado para HTTP
tradicional, donde un cliente hace una petición y el servidor responde una sola vez. Imagina que estás construyendo una
aplicación de chat. Con HTTP tradicional, el navegador tendría que preguntar constantemente al servidor "¿hay mensajes
nuevos?" cada pocos segundos. Esto se llama polling y es increíblemente ineficiente. 

::alert{type="info"  description="Es como si estuvieras preguntando a tu buzón cada minuto si llegó una carta, en lugar de que el cartero simplemente toque tu puerta cuando llegue algo."}
::


Channels extiende Django para manejar protocolos que mantienen conexiones abiertas, específicamente WebSockets. Con
WebSockets, el servidor puede enviar información al cliente en cualquier momento sin que el cliente tenga que preguntar.
<span style="background:rgba(5, 117, 197, 0.2)">Es una conversación bidireccional y continua. Channels hace esto sin romper el modelo de Django que conoces y amas, simplemente añade nuevas capacidades encima.</span>

## Instalación y Librerías Necesarias

Comencemos instalando las librerías que necesitarás. La instalación correcta es crítica porque Channels tiene
dependencias específicas que deben trabajar juntas:



```bash
pip install channels==4.0.0
pip install channels-redis==4.1.0
pip install daphne==4.0.0
```

Permíteme explicarte qué hace cada una de estas librerías. Channels es el corazón del sistema, extiende Django para
soportar ASGI en lugar de solo WSGI. Channels-redis proporciona el backend de comunicación entre procesos que Channels
necesita para que diferentes instancias de tu aplicación puedan hablar entre sí. Imagina que tienes tres servidores
ejecutando tu aplicación y un usuario conectado al servidor A necesita recibir un mensaje de un usuario conectado al
servidor B. Redis actúa como el mensajero entre esos servidores. Finalmente, Daphne es el servidor ASGI que reemplaza el
servidor de desarrollo de Django tradicional para poder manejar conexiones WebSocket.

## Estructura del Proyecto: La Base Correcta

Voy a mostrarte cómo estructurar un proyecto de Django Channels de manera profesional. La organización correcta hace que
tu código sea mantenible y escalable.
::alert{type="info"  description="Imagina que estamos construyendo una aplicación de chat para equipos, similar a Slack pero simplificada:"}
::


```
proyecto_chat/
├── manage.py
├── config/
│   ├── __init__.py
│   ├── settings.py
│   ├── urls.py
│   ├── asgi.py          # Configuración ASGI (nueva)
│   └── wsgi.py          # Configuración WSGI (existente)
├── chat/
│   ├── __init__.py
│   ├── models.py        # Modelos de Sala, Mensaje, etc.
│   ├── views.py         # Vistas HTTP tradicionales
│   ├── consumers.py     # Los "views" para WebSocket (nuevo)
│   ├── routing.py       # URLs para WebSocket (nuevo)
│   ├── templates/
│   │   └── chat/
│   │       ├── sala.html
│   │       └── lista_salas.html
│   └── static/
│       └── chat/
│           └── js/
│               └── websocket.js
└── requirements.txt
```

La estructura es similar a un proyecto Django normal, pero nota los archivos nuevos. El archivo consumers.py es donde
viven tus manejadores de WebSocket, que son conceptualmente similares a las vistas pero para conexiones persistentes. El
archivo routing.py funciona como urls.py pero para rutas WebSocket. Y el archivo asgi.py es donde configuras cómo Django
maneja las conexiones ASGI.

## Configuración Paso a Paso

Empecemos configurando Django para usar Channels. Esta es probablemente la parte que más confunde a las personas, así
que voy a explicar cada línea con detalle.

Primero, en tu archivo de configuración, necesitas registrar Channels y configurar el backend de comunicación:



```python
# config/settings.py

INSTALLED_APPS = [
    'daphne',  # CRÍTICO: Daphne debe ir primero
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'channels',
    'chat',
]

# Esta línea le dice a Django que use ASGI en lugar de WSGI
ASGI_APPLICATION = 'config.asgi.application'

# Configuración del backend de canales
CHANNEL_LAYERS = {
    'default': {
        'BACKEND': 'channels_redis.core.RedisChannelLayer',
        'CONFIG': {
            "hosts": [('127.0.0.1', 6379)],
        },
    },
}
```

Déjame explicarte por qué Daphne debe ir primero en INSTALLED_APPS. Cuando ejecutas el comando runserver de Django,
Django busca en INSTALLED_APPS para ver qué aplicación debe manejar ese comando. Al poner Daphne primero, sobrescribe el
comportamiento predeterminado de runserver para usar el servidor ASGI en lugar del WSGI. Esto significa que tu servidor
de desarrollo ahora puede manejar tanto HTTP tradicional como WebSockets sin que tengas que ejecutar dos servidores
separados.

La configuración CHANNEL_LAYERS es donde especificas cómo se comunican diferentes instancias de tu aplicación. Redis
actúa como un sistema de mensajería pub-sub. Cuando un consumer envía un mensaje a un grupo, Redis se encarga de
distribuir ese mensaje a todos los consumers que están suscritos a ese grupo, incluso si están en servidores físicamente
diferentes.

Ahora configuremos el archivo ASGI, que es el equivalente de wsgi.py pero para el mundo asíncrono:



```python
# config/asgi.py

import os
from django.core.asgi import get_asgi_application
from channels.routing import ProtocolTypeRouter, URLRouter
from channels.auth import AuthMiddlewareStack
from channels.security.websocket import AllowedHostsOriginValidator

# Establecemos la configuración de Django antes de importar nada más
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')

# Inicializamos Django primero
django_asgi_app = get_asgi_application()

# Ahora podemos importar nuestro routing
from chat.routing import websocket_urlpatterns

# ProtocolTypeRouter es como el dispatcher principal
# Decide qué hacer según el tipo de protocolo que recibe
application = ProtocolTypeRouter({
    # HTTP tradicional usa la aplicación ASGI estándar de Django
    "http": django_asgi_app,
    
    # WebSocket usa nuestro routing personalizado
    "websocket": AllowedHostsOriginValidator(
        AuthMiddlewareStack(
            URLRouter(websocket_urlpatterns)
        )
    ),
})
```

Esta configuración es como un director de tráfico. Cuando llega una conexión, ProtocolTypeRouter la examina y decide qué
hacer. Si es HTTP normal, la pasa a Django tradicional. Si es WebSocket, la pasa por varias capas de middleware antes de
llegar a tu consumer. AllowedHostsOriginValidator verifica que la conexión viene de un origen permitido, similar a cómo
Django verifica ALLOWED_HOSTS para HTTP. AuthMiddlewareStack hace que request.user esté disponible en tus consumers,
exactamente como en las vistas normales.

## Creando los Modelos: La Base de Datos

Antes de manejar WebSockets, necesitamos modelos para almacenar nuestros datos. Esto es Django normal, pero lo incluyo
para que veas cómo todo se conecta:



```python
# chat/models.py

from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone

class Sala(models.Model):
    """
    Una sala de chat donde múltiples usuarios pueden conversar.
    """
    nombre = models.CharField(max_length=100, unique=True)
    descripcion = models.TextField(blank=True)
    creador = models.ForeignKey(
        User, 
        on_delete=models.CASCADE,
        related_name='salas_creadas'
    )
    creada_en = models.DateTimeField(auto_now_add=True)
    miembros = models.ManyToManyField(
        User,
        related_name='salas',
        blank=True
    )
    
    class Meta:
        ordering = ['-creada_en']
    
    def __str__(self):
        return self.nombre
    
    def usuarios_conectados(self):
        """
        Retorna el número de usuarios actualmente conectados a esta sala.
        Esto lo calcularemos usando Redis en el consumer.
        """
        # Este método será útil más adelante
        pass

class Mensaje(models.Model):
    """
    Un mensaje enviado en una sala de chat.
    """
    sala = models.ForeignKey(
        Sala,
        on_delete=models.CASCADE,
        related_name='mensajes'
    )
    autor = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='mensajes'
    )
    contenido = models.TextField()
    enviado_en = models.DateTimeField(default=timezone.now)
    editado = models.BooleanField(default=False)
    editado_en = models.DateTimeField(null=True, blank=True)
    
    class Meta:
        ordering = ['enviado_en']
    
    def __str__(self):
        return f"{self.autor.username}: {self.contenido[:50]}"
    
    def to_dict(self):
        """
        Convierte el mensaje a un diccionario para enviarlo por WebSocket.
        Este método es muy útil para serializar datos.
        """
        return {
            'id': self.id,
            'autor': self.autor.username,
            'autor_id': self.autor.id,
            'contenido': self.contenido,
            'enviado_en': self.enviado_en.isoformat(),
            'editado': self.editado,
        }
```

Nota el método to_dict en el modelo Mensaje. Esto es un patrón extremadamente útil cuando trabajas con WebSockets. En
lugar de usar Django REST Framework o serializers complejos para cada mensaje WebSocket, simplemente defines cómo tu
modelo se convierte a un diccionario JSON directamente en el modelo. Esto mantiene la lógica de serialización cerca de
los datos que está serializando.

## El Routing: URLs para WebSockets

Ahora necesitamos definir las rutas WebSocket, similar a como defines URLs para HTTP:



```python
# chat/routing.py

from django.urls import re_path
from . import consumers

websocket_urlpatterns = [
    re_path(r'ws/chat/(?P<nombre_sala>\w+)/$', consumers.ChatConsumer.as_asgi()),
]
```

Este routing es deliberadamente simple. Cuando un cliente se conecta a ws://tudominio.com/ws/chat/general/, Channels
extrae el nombre de la sala (en este caso "general") y lo pasa al consumer como un parámetro. Es exactamente como las
URLs de Django con parámetros capturados, solo que para WebSockets.

## El Consumer: El Corazón de Channels

Ahora llegamos a la parte más importante: el consumer. Un consumer es como una vista de Django, pero maneja una conexión
persistente en lugar de una petición única. Voy a crear un consumer completo con comentarios extensivos explicando cada
método:



```python
# chat/consumers.py

from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from django.contrib.auth.models import User
import json
from .models import Sala, Mensaje

class ChatConsumer(AsyncWebsocketConsumer):
    """
    Consumer que maneja las conexiones WebSocket para el chat.
    
    Este consumer maneja todo el ciclo de vida de una conexión WebSocket:
    conexión, recepción de mensajes, desconexión, y broadcast a otros usuarios.
    """
    
    async def connect(self):
        """
        Se ejecuta cuando un cliente intenta establecer una conexión WebSocket.
        
        Aquí decidimos si aceptar o rechazar la conexión, y configuramos
        la infraestructura necesaria para esta sesión.
        """
        # Extraemos el nombre de la sala de la URL
        self.nombre_sala = self.scope['url_route']['kwargs']['nombre_sala']
        
        # Creamos un nombre de grupo único para esta sala
        # Los grupos son la forma en que Channels permite broadcast
        self.grupo_sala = f'chat_{self.nombre_sala}'
        
        # Obtenemos el usuario de la sesión
        # AuthMiddlewareStack hace que esto esté disponible
        self.user = self.scope["user"]
        
        # Verificamos si el usuario está autenticado
        if not self.user.is_authenticated:
            # Rechazamos la conexión si no está autenticado
            await self.close()
            return
        
        # Verificamos que la sala existe
        sala_existe = await self.verificar_sala_existe()
        if not sala_existe:
            await self.close()
            return
        
        # Unimos este consumer al grupo de la sala
        # Esto significa que ahora recibiremos todos los mensajes
        # enviados a este grupo
        await self.channel_layer.group_add(
            self.grupo_sala,
            self.channel_name  # Identificador único de esta conexión
        )
        
        # Aceptamos la conexión WebSocket
        await self.accept()
        
        # Añadimos al usuario a la lista de usuarios en línea
        await self.agregar_usuario_online()
        
        # Notificamos a todos en la sala que este usuario se conectó
        await self.channel_layer.group_send(
            self.grupo_sala,
            {
                'type': 'usuario_unido',
                'username': self.user.username,
            }
        )
        
        # Enviamos el historial de mensajes al usuario que se conecta
        await self.enviar_historial_mensajes()
    
    async def disconnect(self, close_code):
        """
        Se ejecuta cuando el cliente cierra la conexión WebSocket.
        
        Es crítico limpiar los recursos aquí para evitar memory leaks.
        """
        # Removemos este consumer del grupo de la sala
        if hasattr(self, 'grupo_sala'):
            await self.channel_layer.group_discard(
                self.grupo_sala,
                self.channel_name
            )
            
            # Removemos al usuario de la lista de usuarios en línea
            await self.remover_usuario_online()
            
            # Notificamos a todos que este usuario se desconectó
            if hasattr(self, 'user') and self.user.is_authenticated:
                await self.channel_layer.group_send(
                    self.grupo_sala,
                    {
                        'type': 'usuario_salio',
                        'username': self.user.username,
                    }
                )
    
    async def receive(self, text_data):
        """
        Se ejecuta cuando recibimos un mensaje del cliente.
        
        Este es el handler principal para todos los mensajes entrantes.
        """
        try:
            # Parseamos el JSON recibido
            data = json.loads(text_data)
            tipo_mensaje = data.get('type', 'mensaje')
            
            # Manejamos diferentes tipos de mensajes
            if tipo_mensaje == 'mensaje':
                await self.manejar_mensaje_chat(data)
            elif tipo_mensaje == 'escribiendo':
                await self.manejar_escribiendo(data)
            elif tipo_mensaje == 'dejar_escribir':
                await self.manejar_dejar_escribir(data)
            else:
                # Tipo de mensaje desconocido
                await self.send(text_data=json.dumps({
                    'error': 'Tipo de mensaje desconocido'
                }))
                
        except json.JSONDecodeError:
            # El cliente envió JSON inválido
            await self.send(text_data=json.dumps({
                'error': 'JSON inválido'
            }))
    
    async def manejar_mensaje_chat(self, data):
        """
        Maneja un mensaje de chat normal.
        
        Guarda el mensaje en la base de datos y lo broadcast a todos
        los usuarios en la sala.
        """
        contenido = data.get('mensaje', '').strip()
        
        if not contenido:
            return
        
        # Guardamos el mensaje en la base de datos
        mensaje = await self.guardar_mensaje(contenido)
        
        # Broadcast el mensaje a todos en el grupo
        await self.channel_layer.group_send(
            self.grupo_sala,
            {
                'type': 'mensaje_chat',
                'mensaje': mensaje.to_dict(),
            }
        )
    
    async def manejar_escribiendo(self, data):
        """
        Maneja el evento cuando un usuario está escribiendo.
        
        Esto permite mostrar "Usuario está escribiendo..." a otros usuarios.
        """
        await self.channel_layer.group_send(
            self.grupo_sala,
            {
                'type': 'usuario_escribiendo',
                'username': self.user.username,
            }
        )
    
    async def manejar_dejar_escribir(self, data):
        """
        Maneja cuando un usuario deja de escribir.
        """
        await self.channel_layer.group_send(
            self.grupo_sala,
            {
                'type': 'usuario_dejo_escribir',
                'username': self.user.username,
            }
        )
    
    # Los siguientes métodos son handlers que responden a mensajes
    # enviados a través de channel_layer.group_send
    # El nombre del método debe coincidir con el 'type' del mensaje
    
    async def mensaje_chat(self, event):
        """
        Handler para mensajes de chat.
        Envía el mensaje al WebSocket del cliente.
        """
        await self.send(text_data=json.dumps({
            'type': 'mensaje',
            'mensaje': event['mensaje'],
        }))
    
    async def usuario_unido(self, event):
        """
        Handler para cuando un usuario se une a la sala.
        """
        await self.send(text_data=json.dumps({
            'type': 'usuario_unido',
            'username': event['username'],
        }))
    
    async def usuario_salio(self, event):
        """
        Handler para cuando un usuario sale de la sala.
        """
        await self.send(text_data=json.dumps({
            'type': 'usuario_salio',
            'username': event['username'],
        }))
    
    async def usuario_escribiendo(self, event):
        """
        Handler para el evento de escritura.
        No enviamos este evento de vuelta al usuario que está escribiendo.
        """
        if event['username'] != self.user.username:
            await self.send(text_data=json.dumps({
                'type': 'escribiendo',
                'username': event['username'],
            }))
    
    async def usuario_dejo_escribir(self, event):
        """
        Handler para cuando un usuario deja de escribir.
        """
        if event['username'] != self.user.username:
            await self.send(text_data=json.dumps({
                'type': 'dejar_escribir',
                'username': event['username'],
            }))
    
    # Métodos de base de datos
    # Usamos @database_sync_to_async para llamar código Django ORM
    # desde código asíncrono
    
    @database_sync_to_async
    def verificar_sala_existe(self):
        """
        Verifica si la sala existe en la base de datos.
        """
        return Sala.objects.filter(nombre=self.nombre_sala).exists()
    
    @database_sync_to_async
    def guardar_mensaje(self, contenido):
        """
        Guarda un mensaje en la base de datos.
        """
        sala = Sala.objects.get(nombre=self.nombre_sala)
        mensaje = Mensaje.objects.create(
            sala=sala,
            autor=self.user,
            contenido=contenido
        )
        return mensaje
    
    async def enviar_historial_mensajes(self):
        """
        Envía los últimos 50 mensajes de la sala al usuario que se conecta.
        """
        mensajes = await self.obtener_mensajes_recientes()
        
        await self.send(text_data=json.dumps({
            'type': 'historial',
            'mensajes': mensajes,
        }))
    
    @database_sync_to_async
    def obtener_mensajes_recientes(self):
        """
        Obtiene los últimos 50 mensajes de la sala.
        """
        sala = Sala.objects.get(nombre=self.nombre_sala)
        mensajes = sala.mensajes.select_related('autor').order_by('-enviado_en')[:50]
        # Invertimos para que estén en orden cronológico
        mensajes = reversed(mensajes)
        return [mensaje.to_dict() for mensaje in mensajes]
    
    @database_sync_to_async
    def agregar_usuario_online(self):
        """
        Marca al usuario como en línea en esta sala.
        Esto podría usar Redis para tracking en tiempo real.
        """
        # Implementación simplificada
        # En producción, usarías Redis sets para esto
        pass
    
    @database_sync_to_async
    def remover_usuario_online(self):
        """
        Remueve al usuario de la lista de usuarios en línea.
        """
        pass
```

Este consumer es el cerebro de tu sistema de chat en tiempo real. Déjame explicarte el flujo completo de lo que sucede
cuando un usuario envía un mensaje. Primero, el mensaje llega al método receive como JSON. El consumer parsea ese JSON y
determina qué tipo de mensaje es. Si es un mensaje de chat normal, llama a manejar_mensaje_chat, que guarda el mensaje
en la base de datos usando guardar_mensaje. Una vez guardado, usa channel_layer.group_send para enviar el mensaje a
todos los members del grupo de la sala. Channels entonces llama al método mensaje_chat en cada consumer conectado a ese
grupo, y cada consumer envía el mensaje a su cliente WebSocket individual.

La magia aquí está en los grupos. Cuando usas channel_layer.group_send, no te preocupas por qué consumers están
conectados o en qué servidor están. Channels y Redis manejan toda esa complejidad. Es como un sistema de
intercomunicación donde anuncias algo y todos los que están escuchando lo reciben automáticamente.

## Las Vistas HTTP: La Interfaz Tradicional

Aunque el chat usa WebSockets, aún necesitas vistas HTTP normales para mostrar la página y manejar la creación de salas:



```python
# chat/views.py

from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth.decorators import login_required
from django.http import JsonResponse
from .models import Sala, Mensaje

@login_required
def lista_salas(request):
    """
    Muestra todas las salas de chat disponibles.
    """
    salas = Sala.objects.all().prefetch_related('miembros')
    
    return render(request, 'chat/lista_salas.html', {
        'salas': salas,
    })

@login_required
def sala_chat(request, nombre_sala):
    """
    Muestra la interfaz de chat para una sala específica.
    """
    sala = get_object_or_404(Sala, nombre=nombre_sala)
    
    # Verificamos si el usuario es miembro
    if not sala.miembros.filter(id=request.user.id).exists():
        # Añadimos al usuario automáticamente
        sala.miembros.add(request.user)
    
    return render(request, 'chat/sala.html', {
        'sala': sala,
    })

@login_required
def crear_sala(request):
    """
    Crea una nueva sala de chat.
    """
    if request.method == 'POST':
        nombre = request.POST.get('nombre')
        descripcion = request.POST.get('descripcion', '')
        
        if nombre:
            sala, creada = Sala.objects.get_or_create(
                nombre=nombre,
                defaults={
                    'descripcion': descripcion,
                    'creador': request.user,
                }
            )
            
            if creada:
                sala.miembros.add(request.user)
            
            return redirect('sala_chat', nombre_sala=sala.nombre)
    
    return render(request, 'chat/crear_sala.html')
```

Estas vistas son Django completamente estándar. La única diferencia es que la vista sala_chat renderiza un template que
incluye JavaScript para conectarse al WebSocket. La separación de responsabilidades es clara: las vistas HTTP manejan la
autenticación, autorización, y servir el HTML inicial. Los consumers WebSocket manejan la comunicación en tiempo real
una vez que la página está cargada.

## El Frontend: Conectando con WebSockets

Ahora necesitamos el JavaScript que conecta con tu consumer. Este código vive en el navegador del usuario y maneja toda
la interacción WebSocket:



```javascript
// chat/static/chat/js/websocket.js

class ChatWebSocket {
    constructor(nombreSala, username) {
        this.nombreSala = nombreSala;
        this.username = username;
        this.socket = null;
        this.escribiendoTimeout = null;
        this.conectar();
    }

    conectar() {
        // Determinamos el protocolo correcto basado en HTTP o HTTPS
        const protocolo = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
        const host = window.location.host;
        const url = `${protocolo}//${host}/ws/chat/${this.nombreSala}/`;

        console.log('Conectando a:', url);

        // Creamos la conexión WebSocket
        this.socket = new WebSocket(url);

        // Configuramos los event handlers
        this.socket.onopen = this.onOpen.bind(this);
        this.socket.onmessage = this.onMessage.bind(this);
        this.socket.onclose = this.onClose.bind(this);
        this.socket.onerror = this.onError.bind(this);
    }

    onOpen(evento) {
        console.log('Conectado al servidor WebSocket');
        this.mostrarEstadoConexion('Conectado', 'success');
    }

    onMessage(evento) {
        // Recibimos un mensaje del servidor
        const data = JSON.parse(evento.data);

        // Manejamos diferentes tipos de mensajes
        switch (data.type) {
            case 'mensaje':
                this.mostrarMensaje(data.mensaje);
                break;
            case 'historial':
                this.cargarHistorial(data.mensajes);
                break;
            case 'usuario_unido':
                this.mostrarNotificacion(`${data.username} se unió a la sala`);
                break;
            case 'usuario_salio':
                this.mostrarNotificacion(`${data.username} salió de la sala`);
                break;
            case 'escribiendo':
                this.mostrarEscribiendo(data.username);
                break;
            case 'dejar_escribir':
                this.ocultarEscribiendo(data.username);
                break;
            case 'error':
                this.mostrarError(data.error);
                break;
        }
    }

    onClose(evento) {
        console.log('Desconectado del servidor');
        this.mostrarEstadoConexion('Desconectado', 'error');

        // Intentamos reconectar después de 3 segundos
        setTimeout(() => {
            console.log('Intentando reconectar...');
            this.conectar();
        }, 3000);
    }

    onError(error) {
        console.error('Error WebSocket:', error);
        this.mostrarError('Error de conexión con el servidor');
    }

    enviarMensaje(contenido) {
        if (this.socket.readyState === WebSocket.OPEN) {
            this.socket.send(JSON.stringify({
                type: 'mensaje',
                mensaje: contenido
            }));
        } else {
            this.mostrarError('No conectado al servidor');
        }
    }

    notificarEscribiendo() {
        // Enviamos notificación de que estamos escribiendo
        if (this.socket.readyState === WebSocket.OPEN) {
            this.socket.send(JSON.stringify({
                type: 'escribiendo'
            }));

            // Cancelamos cualquier timeout anterior
            clearTimeout(this.escribiendoTimeout);

            // Después de 3 segundos sin actividad, notificamos que dejamos de escribir
            this.escribiendoTimeout = setTimeout(() => {
                this.socket.send(JSON.stringify({
                    type: 'dejar_escribir'
                }));
            }, 3000);
        }
    }

    mostrarMensaje(mensaje) {
        const contenedorMensajes = document.getElementById('mensajes');
        const esPropio = mensaje.autor === this.username;

        const divMensaje = document.createElement('div');
        divMensaje.className = `mensaje ${esPropio ? 'propio' : 'ajeno'}`;

        const fecha = new Date(mensaje.enviado_en);
        const horaFormateada = fecha.toLocaleTimeString('es-MX', {
            hour: '2-digit',
            minute: '2-digit'
        });

        divMensaje.innerHTML = `
            <div class="mensaje-header">
                <strong>${mensaje.autor}</strong>
                <span class="mensaje-hora">${horaFormateada}</span>
            </div>
            <div class="mensaje-contenido">${this.escaparHTML(mensaje.contenido)}</div>
        `;

        contenedorMensajes.appendChild(divMensaje);

        // Scroll automático al último mensaje
        contenedorMensajes.scrollTop = contenedorMensajes.scrollHeight;
    }

    cargarHistorial(mensajes) {
        const contenedorMensajes = document.getElementById('mensajes');
        contenedorMensajes.innerHTML = ''; // Limpiamos mensajes anteriores

        mensajes.forEach(mensaje => {
            this.mostrarMensaje(mensaje);
        });
    }

    mostrarEscribiendo(username) {
        const contenedorEscribiendo = document.getElementById('usuarios-escribiendo');

        // Creamos o actualizamos el indicador
        let indicador = document.getElementById(`escribiendo-${username}`);
        if (!indicador) {
            indicador = document.createElement('span');
            indicador.id = `escribiendo-${username}`;
            indicador.textContent = `${username} está escribiendo...`;
            contenedorEscribiendo.appendChild(indicador);
        }
    }

    ocultarEscribiendo(username) {
        const indicador = document.getElementById(`escribiendo-${username}`);
        if (indicador) {
            indicador.remove();
        }
    }

    mostrarNotificacion(mensaje) {
        const contenedorMensajes = document.getElementById('mensajes');
        const divNotificacion = document.createElement('div');
        divNotificacion.className = 'notificacion-sistema';
        divNotificacion.textContent = mensaje;
        contenedorMensajes.appendChild(divNotificacion);
    }

    mostrarEstadoConexion(estado, tipo) {
        const indicadorEstado = document.getElementById('estado-conexion');
        if (indicadorEstado) {
            indicadorEstado.textContent = estado;
            indicadorEstado.className = `estado-${tipo}`;
        }
    }

    mostrarError(mensaje) {
        console.error('Error:', mensaje);
        alert(`Error: ${mensaje}`);
    }

    escaparHTML(texto) {
        const div = document.createElement('div');
        div.textContent = texto;
        return div.innerHTML;
    }
}

// Inicialización cuando carga la página
document.addEventListener('DOMContentLoaded', () => {
    // Obtenemos datos del template (ver sala.html)
    const nombreSala = document.getElementById('nombre-sala').value;
    const username = document.getElementById('username').value;

    // Creamos la instancia del WebSocket
    const chatWS = new ChatWebSocket(nombreSala, username);

    // Manejamos el envío de mensajes
    const formulario = document.getElementById('form-mensaje');
    const inputMensaje = document.getElementById('input-mensaje');

    formulario.addEventListener('submit', (e) => {
        e.preventDefault();

        const contenido = inputMensaje.value.trim();
        if (contenido) {
            chatWS.enviarMensaje(contenido);
            inputMensaje.value = '';
        }
    });

    // Notificamos cuando el usuario está escribiendo
    let timeoutEscribiendo;
    inputMensaje.addEventListener('input', () => {
        chatWS.notificarEscribiendo();
    });
});
```

Este código JavaScript es el otro extremo de la conversación con tu consumer. Cuando el usuario escribe un mensaje y
presiona enviar, este código empaqueta el mensaje en JSON y lo envía a través del WebSocket. El consumer lo recibe en su
método receive, lo procesa, lo guarda en la base de datos, y lo broadcast de vuelta. Cada instancia de ChatWebSocket en
cada navegador conectado recibe el mensaje en su método onMessage y lo muestra en la interfaz.

## El Template HTML

Finalmente, necesitamos el HTML que conecta todo:



```django
{# chat/templates/chat/sala.html #}
{% extends 'base.html' %}

{% block titulo %}Chat - {{ sala.nombre }}{% endblock %}

{% block contenido %}
<div class="contenedor-chat">
    {# Valores ocultos que JavaScript necesita #}
    <input type="hidden" id="nombre-sala" value="{{ sala.nombre }}">
    <input type="hidden" id="username" value="{{ request.user.username }}">
    
    <div class="header-chat">
        <h2>{{ sala.nombre }}</h2>
        <span id="estado-conexion" class="estado-desconectado">Conectando...</span>
    </div>
    
    <div id="mensajes" class="contenedor-mensajes">
        {# Los mensajes se cargarán dinámicamente vía WebSocket #}
    </div>
    
    <div id="usuarios-escribiendo" class="usuarios-escribiendo">
        {# Indicadores de "está escribiendo..." aparecerán aquí #}
    </div>
    
    <form id="form-mensaje" class="form-mensaje">
        <input 
            type="text" 
            id="input-mensaje" 
            placeholder="Escribe un mensaje..." 
            autocomplete="off"
            maxlength="500"
        >
        <button type="submit">Enviar</button>
    </form>
</div>
{% endblock %}

{% block javascript %}
<script src="{% static 'chat/js/websocket.js' %}"></script>
{% endblock %}
```

Este template es deliberadamente simple en el lado del servidor porque toda la interacción del chat sucede en el cliente
vía WebSocket. El servidor solo necesita renderizar la estructura inicial y dejar que JavaScript se encargue del resto.

## Probando el Sistema

Para ejecutar tu aplicación con Channels correctamente, necesitas asegurarte de que Redis esté corriendo y luego iniciar
el servidor:



```bash
# En una terminal, inicia Redis
redis-server

# En otra terminal, ejecuta las migraciones
python manage.py makemigrations
python manage.py migrate

# Crea un superusuario si no tienes uno
python manage.py createsuperuser

# Ejecuta el servidor de desarrollo
python manage.py runserver
```

Cuando visitas tu sitio ahora, Daphne está manejando tanto las peticiones HTTP tradicionales como las conexiones
WebSocket. Puedes abrir múltiples ventanas del navegador, iniciar sesión con diferentes usuarios, y ver cómo los
mensajes aparecen instantáneamente en todas las ventanas conectadas a la misma sala.

## Caso de Uso Avanzado: Notificaciones del Sistema

Déjame mostrarte cómo extender este sistema para enviar notificaciones desde otras partes de tu aplicación Django.
Imagina que tienes un sistema donde los administradores pueden enviar anuncios importantes a todos los usuarios
conectados:



```python
# notificaciones/consumers.py

class NotificacionesGlobalesConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.user = self.scope["user"]
        
        if not self.user.is_authenticated:
            await self.close()
            return
        
        # Cada usuario se une a su propio grupo de notificaciones
        self.grupo_usuario = f'notificaciones_usuario_{self.user.id}'
        
        await self.channel_layer.group_add(
            self.grupo_usuario,
            self.channel_name
        )
        
        # Todos los usuarios también se unen a un grupo global
        await self.channel_layer.group_add(
            'notificaciones_globales',
            self.channel_name
        )
        
        await self.accept()
    
    async def disconnect(self, close_code):
        if hasattr(self, 'grupo_usuario'):
            await self.channel_layer.group_discard(
                self.grupo_usuario,
                self.channel_name
            )
        
        await self.channel_layer.group_discard(
            'notificaciones_globales',
            self.channel_name
        )
    
    async def notificacion_global(self, event):
        """
        Handler para notificaciones que van a todos los usuarios.
        """
        await self.send(text_data=json.dumps({
            'type': 'notificacion',
            'titulo': event['titulo'],
            'mensaje': event['mensaje'],
            'prioridad': event.get('prioridad', 'normal'),
        }))
    
    async def notificacion_personal(self, event):
        """
        Handler para notificaciones específicas de este usuario.
        """
        await self.send(text_data=json.dumps({
            'type': 'notificacion_personal',
            'titulo': event['titulo'],
            'mensaje': event['mensaje'],
            'url': event.get('url'),
        }))
```

Ahora desde cualquier vista o señal de Django, puedes enviar notificaciones:



```python
# En cualquier vista o función
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync

def enviar_anuncio_global(request):
    """
    Vista que envía un anuncio a todos los usuarios conectados.
    """
    if not request.user.is_staff:
        return JsonResponse({'error': 'No autorizado'}, status=403)
    
    titulo = request.POST.get('titulo')
    mensaje = request.POST.get('mensaje')
    
    channel_layer = get_channel_layer()
    
    # Enviamos a todos los usuarios conectados
    async_to_sync(channel_layer.group_send)(
        'notificaciones_globales',
        {
            'type': 'notificacion_global',
            'titulo': titulo,
            'mensaje': mensaje,
            'prioridad': 'alta',
        }
    )
    
    return JsonResponse({'status': 'enviado'})

def notificar_usuario_especifico(usuario_id, titulo, mensaje, url=None):
    """
    Función helper para notificar a un usuario específico.
    Puede ser llamada desde signals, tareas de Celery, etc.
    """
    channel_layer = get_channel_layer()
    
    async_to_sync(channel_layer.group_send)(
        f'notificaciones_usuario_{usuario_id}',
        {
            'type': 'notificacion_personal',
            'titulo': titulo,
            'mensaje': mensaje,
            'url': url,
        }
    )
```
::alert{type="info"  description="Esta arquitectura te da una flexibilidad increíble. "}
::

Puedes enviar notificaciones en tiempo real desde cualquier parte de
tu aplicación Django, ya sean vistas, signals, comandos de management, o incluso tareas de Celery. <span style="background:rgba(5, 117, 197, 0.2)">El usuario recibe la notificación instantáneamente sin tener que refrescar la página o hacer polling.</span>

::alert{type="info"  description="Django Channels transforma completamente lo que puedes construir con Django."}
::


Ya no estás limitado al modelo tradicional
de petición-respuesta. Puedes crear experiencias verdaderamente interactivas y en tiempo real que rivalizan con
cualquier aplicación moderna. La clave está en entender que los consumers son el punto de entrada para conexiones
persistentes, los grupos permiten comunicación de broadcast eficiente, y la integración con el resto de Django permanece
limpia y natural.

