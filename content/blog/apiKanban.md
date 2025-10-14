---
title: "API REST Completa de Kanban con FastAPI"
date: "2025-10-15"
description: "Una guía completa para crear una API con autenticación JWT"
tags: ["Arquitectura", "Web Development",'FatAPI','python']
name: "apifirst"

author: "raulanto"
author_avatar: 'https://avatars.githubusercontent.com/u/74162376?v=4'
author_description: "Desarrollador Full Stack "
thumbnail: "/neat.png"
---
# API REST Completa de Kanban con FastAPI

## Introducción

En el desarrollo moderno de software, la gestión de tareas es fundamental. En este artículo, construiremos desde cero una **API RESTful completa** para un sistema Kanban, similar a Trello o Jira, pero con un enfoque educativo que te permitirá entender cada decisión arquitectónica.

### ¿Qué construiremos?

Una API que permita:

-  **Autenticación segura** con JWT y refresh tokens
-  **Gestión de usuarios** con permisos por usuario
-  **Tableros Kanban** personalizables
-  **Listas dinámicas** (Pendiente, En Progreso, Terminado, etc.)
-  **Tareas** con título, descripción, prioridad y posición
-  **Mover tareas** entre listas fácilmente
-  **Documentación automática** con Swagger/OpenAPI


::tip
**Lo que aprenderás**

- Arquitectura modular y escalable
- Async/await con SQLAlchemy
- Patrones de diseño (Repository, Dependency Injection)
- Seguridad con JWT
- Migraciones de base de datos
- Testing asíncrono
- Validaciones con Pydantic
::
---


## Arquitectura del Proyecto

### Principios de Diseño

Nuestra API sigue los principios **SOLID** y utiliza una arquitectura en capas:

```
┌─────────────────────────────────────────┐
│         API Layer (Endpoints)           │  ← Rutas HTTP
├─────────────────────────────────────────┤
│       Business Logic (Services)         │  ← Lógica de negocio
├─────────────────────────────────────────┤
│         Data Access (CRUD)              │  ← Operaciones DB
├─────────────────────────────────────────┤
│        Models & Schemas                 │  ← Definiciones
├─────────────────────────────────────────┤
│           Database                      │  ← SQLite/PostgreSQL
└─────────────────────────────────────────┘
```

### Estructura de Carpetas

```
kanban_api/
├── app/
│   ├── __init__.py
│   ├── main.py                    # Aplicación principal
│   ├── api/
│   │   ├── deps.py                # Dependencias compartidas
│   │   └── v1/
│   │       ├── endpoints/         # Rutas por recurso
│   │       │   ├── auth.py
│   │       │   ├── boards.py
│   │       │   ├── lists.py
│   │       │   └── tasks.py
│   │       └── router.py          # Router principal
│   ├── core/
│   │   ├── config.py              # Configuración
│   │   ├── security.py            # JWT & passwords
│   │   └── exceptions.py          # Excepciones custom
│   ├── db/
│   │   ├── base.py                # Base classes
│   │   ├── session.py             # Database session
│   │   └── models/                # SQLAlchemy models
│   ├── schemas/                   # Pydantic models
│   └── crud/                      # Database operations
├── alembic/                       # Migraciones
├── tests/                         # Tests
├── .env                           # Variables de entorno
└── requirements.txt               # Dependencias
```

**¿Por qué esta estructura?**

1. **Separación de responsabilidades**: Cada capa tiene un propósito claro
2. **Testeable**: Puedes testear cada capa independientemente
3. **Mantenible**: Fácil localizar y modificar código
4. **Escalable**: Agregar nuevos recursos es simple

---

## Stack Tecnológico

### Dependencias Principales

::code-collapse
```python 
# requirements.txt
aiosqlite==0.21.0
alembic==1.17.0
annotated-types==0.7.0
anyio==4.11.0
bcrypt==4.0.1
certifi==2025.10.5
charset-normalizer==3.4.3
click==8.3.0
colorama==0.4.6
dnspython==2.8.0
ecdsa==0.19.1
email-validator==2.3.0
fastapi==0.119.0
greenlet==3.2.4
h11==0.16.0
idna==3.11
jose==1.0.0
Mako==1.3.10
MarkupSafe==3.0.3
passlib==1.7.4
pyasn1==0.6.1
pydantic==2.12.0
pydantic-settings==2.11.0
pydantic_core==2.41.1
python-dotenv==1.1.1
python-jose==3.5.0
python-multipart==0.0.20
requests==2.32.5
rsa==4.9.1
six==1.17.0
sniffio==1.3.1
SQLAlchemy==2.0.44
starlette==0.48.0
typing-inspection==0.4.2
typing_extensions==4.15.0
urllib3==2.5.0
uvicorn==0.37.0

```
::


### ¿Por qué estas tecnologías?

**SQLAlchemy 2.0**: ORM más maduro de Python, soporte async/await nativo

**Pydantic**: Validación de datos ultra-rápida basada en type hints

**Alembic**: Sistema de migraciones robusto, versionamiento de DB

**python-jose**: Implementación completa de JWT

---

## Configuración Inicial

### 1. Gestión de Configuración

Usamos `pydantic-settings` para gestionar variables de entorno de forma tipada:

```python [app/core/config.py]
from pydantic_settings import BaseSettings
from functools import lru_cache

class Settings(BaseSettings):
    PROJECT_NAME: str = "Kanban API"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"
    
    # Database
    DATABASE_URL: str
    ASYNC_DATABASE_URL: str
    
    # Security
    SECRET_KEY: str
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7
    
    model_config = SettingsConfigDict(
        env_file=".env",
        case_sensitive=True
    )

@lru_cache()
def get_settings() -> Settings:
    return Settings()

settings = get_settings()
```
::tip
**Ventajas**:

-  Validación automática de tipos
-  Valores por defecto
-  Cache con `@lru_cache`
-  Fácil testing (puedes mockear settings)
::
### 2. Archivo .env

```env
PROJECT_NAME=Kanban API
DATABASE_URL=sqlite:///./kanban.db
ASYNC_DATABASE_URL=sqlite+aiosqlite:///./kanban.db
SECRET_KEY=tu-super-secreto-key-cambiar-en-produccion
ACCESS_TOKEN_EXPIRE_MINUTES=30
REFRESH_TOKEN_EXPIRE_DAYS=7
```

---

## Modelado de Datos

### Relaciones del Sistema

```
User (1) ──────┐
               │
               ├─> (N) Board (1) ──────┐
               │                        │
               │                        ├─> (N) List (1) ──────┐
               │                        │                       │
               │                        │                       ├─> (N) Task
               │                        │                       │
               │                        └───────────────────────┘
               │
               └─────────────────────────────────────────────────┘
```

### Modelos SQLAlchemy

**Base Class con Timestamps**

```python [app/db/base.py]

from sqlalchemy import Column, DateTime
from sqlalchemy.sql import func

class TimeStampedModel:
    created_at = Column(DateTime, default=func.now(), nullable=False)
    updated_at = Column(DateTime, default=func.now(), 
                       onupdate=func.now(), nullable=False)
```

**Modelo User**

```python [app/db/models/user.py]
from sqlalchemy import Column, Integer, String, Boolean
from sqlalchemy.orm import relationship

class User(Base, TimeStampedModel):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    username = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    is_active = Column(Boolean, default=True)
    
    # Relaciones
    boards = relationship("Board", back_populates="owner", 
                         cascade="all, delete-orphan")
```

**Modelo Board**

```python [app/db/models/board.py]
class Board(Base, TimeStampedModel):
    __tablename__ = "boards"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(200), nullable=False)
    description = Column(Text, nullable=True)
    owner_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    
    owner = relationship("User", back_populates="boards")
    lists = relationship("List", back_populates="board", 
                        cascade="all, delete-orphan")
```

**Modelo List (Estados/Columnas)**

```python [app/db/models/list.py]
class List(Base, TimeStampedModel):
    __tablename__ = "lists"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(100), nullable=False)
    position = Column(Integer, default=0)  # Para ordenar
    board_id = Column(Integer, ForeignKey("boards.id"), nullable=False)
    
    board = relationship("Board", back_populates="lists")
    tasks = relationship("Task", back_populates="list", 
                        cascade="all, delete-orphan")
```

**Modelo Task**

```python [app/db/models/task.py]
class TaskPriority(str, enum.Enum):
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    URGENT = "urgent"

class Task(Base, TimeStampedModel):
    __tablename__ = "tasks"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(200), nullable=False)
    description = Column(Text, nullable=True)
    position = Column(Integer, default=0)
    priority = Column(Enum(TaskPriority), default=TaskPriority.MEDIUM)
    list_id = Column(Integer, ForeignKey("lists.id"), nullable=False)
    
    list = relationship("List", back_populates="tasks")
```

### Schemas Pydantic

::tip
Los schemas definen cómo se serializa/deserializa la data:
::
```python [app/schemas/board.py]
from pydantic import BaseModel, Field
from datetime import datetime

class BoardBase(BaseModel):
    title: str = Field(..., min_length=1, max_length=200)
    description: str | None = None

class BoardCreate(BoardBase):
    pass

class BoardUpdate(BaseModel):
    title: str | None = Field(None, min_length=1, max_length=200)
    description: str | None = None

class BoardResponse(BoardBase):
    id: int
    owner_id: int
    created_at: datetime
    updated_at: datetime
    
    model_config = {"from_attributes": True}
```

**¿Por qué separar Create/Update/Response?**

- **BoardCreate**: Solo campos necesarios para crear
- **BoardUpdate**: Todos opcionales (PATCH)
- **BoardResponse**: Incluye campos generados (id, timestamps)

---

## Sistema de Autenticación

### JWT (JSON Web Tokens)

Implementamos un sistema completo con:

- Access tokens (30 minutos)
- Refresh tokens (7 días)
- Token rotation (seguridad)

### Hash de Passwords

```python [app/core/security.py]
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def verify_password(plain: str, hashed: str) -> bool:
    return pwd_context.verify(plain, hashed)

def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)
```
::tip
**¿Por qué bcrypt?**

- Algoritmo de hash lento intencionalmente
- Protección contra ataques de fuerza bruta
- Salt automático
::
### Creación de Tokens

```python [app/core/security.py]
from jose import jwt
from datetime import datetime, timedelta

def create_access_token(data: dict) -> str:
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(
        minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES
    )
    to_encode.update({"exp": expire, "type": "access"})
    
    return jwt.encode(
        to_encode, 
        settings.SECRET_KEY, 
        algorithm=settings.ALGORITHM
    )
```

### Endpoints de Autenticación

**Registro**

```python
@router.post("/register", response_model=UserResponse)
async def register(
    db: AsyncSession = Depends(get_db),
    user_in: UserCreate
) -> UserResponse:
    # Verificar email único
    user = await user_crud.get_by_email(db, email=user_in.email)
    if user:
        raise ConflictException("Email already registered")
    
    # Crear usuario
    user = await user_crud.create(db, obj_in=user_in)
    return user
```

**Login**

```python
@router.post("/login", response_model=Token)
async def login(
    db: AsyncSession = Depends(get_db),
    form_data: OAuth2PasswordRequestForm = Depends()
) -> Token:
    user = await user_crud.authenticate(
        db, email=form_data.username, password=form_data.password
    )
    if not user:
        raise UnauthorizedException("Incorrect email or password")
    
    # Crear tokens (sub debe ser string)
    access_token = create_access_token(data={"sub": str(user.id)})
    refresh_token = create_refresh_token(data={"sub": str(user.id)})
    
    return Token(
        access_token=access_token,
        refresh_token=refresh_token,
        token_type="bearer"
    )
```

**Refresh Token**

```python
@router.post("/refresh", response_model=Token)
async def refresh_token(
    db: AsyncSession = Depends(get_db),
    refresh_request: RefreshTokenRequest
) -> Token:
    # Verificar refresh token
    user_id = verify_refresh_token(refresh_request.refresh_token)
    
    # Verificar usuario
    user = await user_crud.get(db, id=user_id)
    if not user or not user.is_active:
        raise UnauthorizedException("User not found or inactive")
    
    # Token rotation: crear nuevos tokens
    new_access_token = create_access_token(data={"sub": str(user.id)})
    new_refresh_token = create_refresh_token(data={"sub": str(user.id)})
    
    return Token(
        access_token=new_access_token,
        refresh_token=new_refresh_token,
        token_type="bearer"
    )
```

### Dependencias de Autenticación

```python
# app/api/deps.py
from fastapi.security import OAuth2PasswordBearer

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/auth/login")

async def get_current_user(
    db: AsyncSession = Depends(get_db),
    token: str = Depends(oauth2_scheme)
) -> User:
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, 
                           algorithms=[settings.ALGORITHM])
        user_id_str: str = payload.get("sub")
        token_type: str = payload.get("type")
        
        if token_type != "access":
            raise UnauthorizedException("Invalid token type")
        
        user_id = int(user_id_str)
    except (JWTError, ValueError):
        raise UnauthorizedException()
    
    user = await user_crud.get(db, id=user_id)
    if not user:
        raise UnauthorizedException("User not found")
    
    return user
```

---

## CRUD Genérico

### Patrón Repository

Implementamos un CRUD genérico para evitar repetición:

```python [app/crud/base.py]
from typing import Generic, TypeVar, Type, List, Optional
from pydantic import BaseModel
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

ModelType = TypeVar("ModelType")
CreateSchemaType = TypeVar("CreateSchemaType", bound=BaseModel)
UpdateSchemaType = TypeVar("UpdateSchemaType", bound=BaseModel)

class CRUDBase(Generic[ModelType, CreateSchemaType, UpdateSchemaType]):
    def __init__(self, model: Type[ModelType]):
        self.model = model
    
    async def get(self, db: AsyncSession, id: int) -> Optional[ModelType]:
        result = await db.execute(
            select(self.model).filter(self.model.id == id)
        )
        return result.scalars().first()
    
    async def get_multi(
        self, db: AsyncSession, skip: int = 0, limit: int = 100
    ) -> List[ModelType]:
        result = await db.execute(
            select(self.model).offset(skip).limit(limit)
        )
        return result.scalars().all()
    
    async def create(
        self, db: AsyncSession, obj_in: CreateSchemaType
    ) -> ModelType:
        obj_in_data = jsonable_encoder(obj_in)
        db_obj = self.model(**obj_in_data)
        db.add(db_obj)
        await db.commit()
        await db.refresh(db_obj)
        return db_obj
    
    async def update(
        self, db: AsyncSession, db_obj: ModelType, obj_in: UpdateSchemaType
    ) -> ModelType:
        update_data = obj_in.model_dump(exclude_unset=True)
        for field, value in update_data.items():
            setattr(db_obj, field, value)
        
        db.add(db_obj)
        await db.commit()
        await db.refresh(db_obj)
        return db_obj
    
    async def remove(self, db: AsyncSession, id: int) -> ModelType:
        obj = await self.get(db, id)
        await db.delete(obj)
        await db.commit()
        return obj
```

### CRUD Específico

```python [app/crud/user.py]
class CRUDUser(CRUDBase[User, UserCreate, UserResponse]):
    async def get_by_email(
        self, db: AsyncSession, email: str
    ) -> Optional[User]:
        result = await db.execute(
            select(User).filter(User.email == email)
        )
        return result.scalars().first()
    
    async def create(
        self, db: AsyncSession, obj_in: UserCreate
    ) -> User:
        db_obj = User(
            email=obj_in.email,
            username=obj_in.username,
            hashed_password=get_password_hash(obj_in.password)
        )
        db.add(db_obj)
        await db.commit()
        await db.refresh(db_obj)
        return db_obj
    
    async def authenticate(
        self, db: AsyncSession, email: str, password: str
    ) -> Optional[User]:
        user = await self.get_by_email(db, email=email)
        if not user or not verify_password(password, user.hashed_password):
            return None
        return user

user = CRUDUser(User)
```
::tip
**Ventajas del patrón Repository:**

-  DRY (Don't Repeat Yourself)
-  Consistencia en todas las operaciones
-  Fácil de testear
-  Extensible para casos específicos
::
---

## Endpoints y Lógica de Negocio

### Endpoint de Boards

```python [app/api/v1/endpoints/boards.py]
@router.post("/", response_model=BoardResponse, status_code=201)
async def create_board(
    *,
    db: AsyncSession = Depends(get_db),
    board_in: BoardCreate,
    current_user: User = Depends(get_current_active_user)
) -> BoardResponse:
    """Crear un nuevo tablero"""
    board = await board_crud.create_with_owner(
        db, obj_in=board_in, owner_id=current_user.id
    )
    return board

@router.get("/", response_model=List[BoardResponse])
async def list_boards(
    db: AsyncSession = Depends(get_db),
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=100),
    current_user: User = Depends(get_current_active_user)
) -> List[BoardResponse]:
    """Listar tableros del usuario actual"""
    boards = await board_crud.get_by_owner(
        db, owner_id=current_user.id, skip=skip, limit=limit
    )
    return boards
```

### Endpoint de Tasks con Mover

```python [app/api/v1/endpoints/tasks.py]
@router.post("/{task_id}/move", response_model=TaskResponse)
async def move_task(
    task_id: int,
    move_data: TaskMove,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
) -> TaskResponse:
    """Mover tarea a otra lista (cambiar estado)"""
    
    # Obtener tarea
    task = await task_crud.get(db, id=task_id)
    if not task:
        raise NotFoundException("Task not found")
    
    # Verificar permisos
    await verify_list_permission(db, task.list_id, current_user.id)
    await verify_list_permission(db, move_data.list_id, current_user.id)
    
    # Mover tarea
    task = await task_crud.move_to_list(
        db, task=task, 
        list_id=move_data.list_id, 
        position=move_data.position
    )
    return task
```

### Validación de Permisos

```python
async def verify_list_permission(
    db: AsyncSession, list_id: int, user_id: int
) -> None:
    """Verificar que el usuario tiene acceso a la lista"""
    list_obj = await list_crud.get(db, id=list_id)
    if not list_obj:
        raise NotFoundException("List not found")
    
    board = await board_crud.get(db, id=list_obj.board_id)
    if board.owner_id != user_id:
        raise ForbiddenException("Not enough permissions")
```

---

## Migraciones con Alembic

### ¿Por qué Migraciones?

::tip
Las migraciones permiten:

-  Versionamiento de la base de datos
-  Cambios controlados en producción
-  Rollback si algo sale mal
-  Colaboración en equipo
::
### Configuración de Alembic

```python [app/api/v1/endpoints/tasks.py]
from app.core.config import settings
from app.db.session import Base
from app.db.models.user import User
from app.db.models.board import Board
from app.db.models.list import List
from app.db.models.task import Task

config.set_main_option('sqlalchemy.url', settings.DATABASE_URL)
target_metadata = Base.metadata
```

### Comandos Principales

```bash
# Crear migración inicial
alembic revision --autogenerate -m "Initial migration"

# Aplicar migraciones
alembic upgrade head

# Revertir migración
alembic downgrade -1

# Ver historial
alembic history

# Ver estado actual
alembic current
```

### Ejemplo de Migración

```python [alembic/versions/xxx_add_avatar_to_users.py]
def upgrade() -> None:
    op.add_column('users', 
        sa.Column('avatar_url', sa.String(), nullable=True)
    )

def downgrade() -> None:
    op.drop_column('users', 'avatar_url')
```

---

## Testing

### Configuración de Tests

```python [tests/conftest.py]
import pytest
from httpx import AsyncClient
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from app.main import app
from app.db.session import get_db, Base

TEST_DATABASE_URL = "sqlite+aiosqlite:///./test.db"

@pytest.fixture
async def client() -> AsyncClient:
    engine = create_async_engine(TEST_DATABASE_URL)
    
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    
    async def override_get_db():
        async with AsyncSession(engine) as session:
            yield session
    
    app.dependency_overrides[get_db] = override_get_db
    
    async with AsyncClient(app=app, base_url="http://test") as ac:
        yield ac
    
    app.dependency_overrides.clear()
```

::tip
Des de que aprendi  a testear todo lo testeo
::

### Test de Autenticación

```python [tests/test_auth.py]
@pytest.mark.asyncio
async def test_register_and_login(client: AsyncClient):
    # Registro
    register_data = {
        "email": "test@example.com",
        "username": "testuser",
        "password": "Test1234"
    }
    response = await client.post("/api/v1/auth/register", json=register_data)
    assert response.status_code == 201
    
    # Login
    login_data = {
        "username": "test@example.com",
        "password": "Test1234"
    }
    response = await client.post("/api/v1/auth/login", data=login_data)
    assert response.status_code == 200
    assert "access_token" in response.json()
```

### Test de Flujo Completo

```python
@pytest.mark.asyncio
async def test_complete_kanban_flow(client: AsyncClient):
    # 1. Registrar y login
    await client.post("/api/v1/auth/register", json=user_data)
    login_response = await client.post("/api/v1/auth/login", data=login_data)
    token = login_response.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}
    
    # 2. Crear tablero
    board_response = await client.post(
        "/api/v1/boards/",
        json={"title": "Mi Tablero"},
        headers=headers
    )
    board_id = board_response.json()["id"]
    
    # 3. Crear listas
    list1 = await client.post(
        "/api/v1/lists/",
        json={"title": "Pendiente", "board_id": board_id, "position": 0},
        headers=headers
    )
    list2 = await client.post(
        "/api/v1/lists/",
        json={"title": "Terminado", "board_id": board_id, "position": 1},
        headers=headers
    )
    
    # 4. Crear tarea
    task_response = await client.post(
        "/api/v1/tasks/",
        json={"title": "Mi Tarea", "list_id": list1.json()["id"]},
        headers=headers
    )
    task_id = task_response.json()["id"]
    
    # 5. Mover tarea
    move_response = await client.post(
        f"/api/v1/tasks/{task_id}/move",
        json={"list_id": list2.json()["id"]},
        headers=headers
    )
    assert move_response.status_code == 200
    assert move_response.json()["list_id"] == list2.json()["id"]
```



### Mejores Prácticas

::note
**Seguridad**

-  Usar HTTPS en producción
-  Limitar rate de requests
-  Validar todos los inputs
-  No exponer SECRET_KEY
-  Implementar CORS correctamente
::
::tip
**Performance**

-  Usar índices en BD
-  Implementar paginación
-  Cache con Redis
-  Connection pooling
-  Async/await correctamente
::

::tip
**Código**

-  Type hints siempre
-  Docstrings en funciones
-  Tests unitarios y de integración
-  Logging apropiado
-  Manejo de errores consistente
::

::tip
**DevOps**

-  CI/CD con GitHub Actions
-  Migraciones automáticas
-  Monitoreo con Sentry
-  Logs centralizados
-  Backups automáticos
::
---

## Conclusiones

### Lo que Construimos

Hemos creado una **API REST profesional** que incluye:

 **Autenticación robusta** con JWT y refresh tokens  
 **Arquitectura escalable** con separación de responsabilidades  
 **Base de datos async** con SQLAlchemy 2.0  
 **Migraciones** versionadas con Alembic  
 **Validaciones** automáticas con Pydantic  
 **Documentación** automática con OpenAPI  
 **Testing** completo con pytest  
 **Seguridad** con permisos por usuario

---
::card
---
title: ApiKanban
icon: i-simple-icons-github
to: https://github.com/raulanto/ApiKamba
target: _blank
---
Encuentra todo el proyecto completo en mi github
::