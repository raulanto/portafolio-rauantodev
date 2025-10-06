---
title: "Fundamentos de Arquitectura Web"
date: "2025-09-29"
description: "Principios, Patrones y Protocolos"
tags: ["Arquitectura", "Web Development"]
name: "arquitec"

author: "raulanto"
author_avatar: 'https://avatars.githubusercontent.com/u/74162376?v=4'
author_description: "Desarrollador Full Stack "
thumbnail: /neat.png
---



# Principios, Patrones y Protocolos

## 1. Principios de Arquitectura de Software

### SOLID Principles

#### **S - Single Responsibility Principle (SRP)**

_Una clase debe tener una sola razón para cambiar_

```javascript
// ❌ Viola SRP - maneja tanto persistencia como lógica de negocio
class User {
  constructor(name, email) {
    this.name = name;
    this.email = email;
  }
  
  save() {
    // Lógica de base de datos
    database.save(this);
  }
  
  sendEmail() {
    // Lógica de email
    emailService.send(this.email);
  }
  
  validateEmail() {
    // Lógica de validación
    return this.email.includes('@');
  }
}

// ✅ Respeta SRP - cada clase tiene una responsabilidad
class User {
  constructor(name, email) {
    this.name = name;
    this.email = email;
  }
}

class UserRepository {
  save(user) {
    database.save(user);
  }
}

class EmailService {
  send(email, message) {
    // Lógica de envío
  }
}

class EmailValidator {
  validate(email) {
    return email.includes('@') && email.includes('.');
  }
}
```

#### **O - Open/Closed Principle (OCP)**

_Las entidades deben estar abiertas para extensión, cerradas para modificación_

```javascript
// ❌ Viola OCP - necesitas modificar la clase para agregar nuevos tipos
class PaymentProcessor {
  process(payment, type) {
    if (type === 'credit_card') {
      return this.processCreditCard(payment);
    } else if (type === 'paypal') {
      return this.processPaypal(payment);
    }
    // Para agregar Bitcoin, necesitas modificar esta clase
  }
}

// ✅ Respeta OCP - puedes agregar nuevos procesadores sin modificar código existente
class PaymentProcessor {
  constructor() {
    this.processors = new Map();
  }
  
  registerProcessor(type, processor) {
    this.processors.set(type, processor);
  }
  
  process(payment, type) {
    const processor = this.processors.get(type);
    return processor.process(payment);
  }
}

class CreditCardProcessor {
  process(payment) {
    // Lógica específica para tarjetas
  }
}

class BitcoinProcessor {
  process(payment) {
    // Nueva funcionalidad sin modificar código existente
  }
}
```

#### **L - Liskov Substitution Principle (LSP)**

_Los objetos derivados deben poder sustituir a sus objetos base_

```javascript
// ❌ Viola LSP - el subtipo no puede sustituir al tipo base
class Bird {
  fly() {
    return "Flying high!";
  }
}

class Penguin extends Bird {
  fly() {
    throw new Error("Penguins can't fly!");
  }
}

// ✅ Respeta LSP - diseño por comportamiento común
class Bird {
  move() {
    return "Moving around";
  }
}

class FlyingBird extends Bird {
  fly() {
    return "Flying high!";
  }
  
  move() {
    return this.fly();
  }
}

class SwimmingBird extends Bird {
  swim() {
    return "Swimming gracefully";
  }
  
  move() {
    return this.swim();
  }
}
```

#### **I - Interface Segregation Principle (ISP)**

_Los clientes no deben depender de interfaces que no usan_

```javascript
// ❌ Viola ISP - interfaz demasiado grande
class MultiFunctionPrinter {
  print(document) {}
  scan(document) {}
  fax(document) {}
  email(document) {}
}

class SimplePrinter extends MultiFunctionPrinter {
  print(document) {
    // Implementación real
  }
  
  scan(document) {
    throw new Error("Not supported");
  }
  
  fax(document) {
    throw new Error("Not supported");
  }
}

// ✅ Respeta ISP - interfaces específicas y pequeñas
class Printer {
  print(document) {}
}

class Scanner {
  scan(document) {}
}

class FaxMachine {
  fax(document) {}
}

class AdvancedPrinter extends Printer {
  print(document) {
    // Solo implementa lo que necesita
  }
}

class AllInOnePrinter {
  constructor(printer, scanner, fax) {
    this.printer = printer;
    this.scanner = scanner;
    this.fax = fax;
  }
}
```

#### **D - Dependency Inversion Principle (DIP)**

_Depende de abstracciones, no de concreciones_

```javascript
// ❌ Viola DIP - depende directamente de implementaciones concretas
class OrderService {
  constructor() {
    this.emailService = new GmailService();
    this.database = new MySQLDatabase();
  }
  
  createOrder(order) {
    this.database.save(order);
    this.emailService.send(order.customerEmail, "Order confirmed");
  }
}

// ✅ Respeta DIP - depende de abstracciones
class OrderService {
  constructor(emailService, database) {
    this.emailService = emailService;
    this.database = database;
  }
  
  createOrder(order) {
    this.database.save(order);
    this.emailService.send(order.customerEmail, "Order confirmed");
  }
}

// Inyección de dependencias
const orderService = new OrderService(
  new GmailService(), // Fácil de cambiar por SendGridService
  new MySQLDatabase() // Fácil de cambiar por PostgreSQLDatabase
);
```

### DRY (Don't Repeat Yourself)

```javascript
// ❌ Viola DRY - código duplicado
class UserController {
  createUser(userData) {
    if (!userData.email || !userData.email.includes('@')) {
      throw new Error('Invalid email');
    }
    if (!userData.password || userData.password.length < 8) {
      throw new Error('Password too short');
    }
    // Crear usuario
  }
  
  updateUser(userData) {
    if (!userData.email || !userData.email.includes('@')) {
      throw new Error('Invalid email');
    }
    if (!userData.password || userData.password.length < 8) {
      throw new Error('Password too short');
    }
    // Actualizar usuario
  }
}

// ✅ Respeta DRY - validación centralizada
class UserValidator {
  static validate(userData) {
    const errors = [];
    
    if (!userData.email || !userData.email.includes('@')) {
      errors.push('Invalid email');
    }
    
    if (!userData.password || userData.password.length < 8) {
      errors.push('Password too short');
    }
    
    if (errors.length > 0) {
      throw new Error(errors.join(', '));
    }
  }
}

class UserController {
  createUser(userData) {
    UserValidator.validate(userData);
    // Crear usuario
  }
  
  updateUser(userData) {
    UserValidator.validate(userData);
    // Actualizar usuario
  }
}
```

## 2. Patrones de Diseño Aplicados a Web

### MVC (Model-View-Controller)

```javascript
// MODEL - Maneja datos y lógica de negocio
class UserModel {
  constructor(database) {
    this.database = database;
  }
  
  async createUser(userData) {
    const user = {
      id: generateId(),
      ...userData,
      createdAt: new Date()
    };
    
    await this.database.users.insert(user);
    return user;
  }
  
  async getUserById(id) {
    return await this.database.users.findById(id);
  }
  
  async validateUser(userData) {
    // Lógica de validación de negocio
    if (!userData.email) throw new Error('Email required');
    return true;
  }
}

// VIEW - Maneja presentación (en el contexto web, a menudo JSON/HTML)
class UserView {
  renderUser(user) {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      // No exponer datos sensibles como passwords
    };
  }
  
  renderError(error) {
    return {
      error: true,
      message: error.message
    };
  }
  
  renderUserList(users) {
    return {
      users: users.map(user => this.renderUser(user)),
      total: users.length
    };
  }
}

// CONTROLLER - Coordina Model y View, maneja requests
class UserController {
  constructor(userModel, userView) {
    this.userModel = userModel;
    this.userView = userView;
  }
  
  async createUser(req, res) {
    try {
      await this.userModel.validateUser(req.body);
      const user = await this.userModel.createUser(req.body);
      const response = this.userView.renderUser(user);
      
      res.status(201).json(response);
    } catch (error) {
      const errorResponse = this.userView.renderError(error);
      res.status(400).json(errorResponse);
    }
  }
  
  async getUser(req, res) {
    try {
      const user = await this.userModel.getUserById(req.params.id);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      
      const response = this.userView.renderUser(user);
      res.json(response);
    } catch (error) {
      const errorResponse = this.userView.renderError(error);
      res.status(500).json(errorResponse);
    }
  }
}
```

### Repository Pattern

```javascript
// Abstracción del repositorio
class UserRepository {
  async save(user) {
    throw new Error('Method not implemented');
  }
  
  async findById(id) {
    throw new Error('Method not implemented');
  }
  
  async findByEmail(email) {
    throw new Error('Method not implemented');
  }
  
  async delete(id) {
    throw new Error('Method not implemented');
  }
}

// Implementación concreta para MongoDB
class MongoUserRepository extends UserRepository {
  constructor(mongoClient) {
    super();
    this.collection = mongoClient.db('myapp').collection('users');
  }
  
  async save(user) {
    if (user.id) {
      await this.collection.updateOne(
        { _id: user.id },
        { $set: user }
      );
    } else {
      const result = await this.collection.insertOne(user);
      user.id = result.insertedId;
    }
    return user;
  }
  
  async findById(id) {
    return await this.collection.findOne({ _id: id });
  }
  
  async findByEmail(email) {
    return await this.collection.findOne({ email });
  }
}

// Implementación para PostgreSQL
class PostgresUserRepository extends UserRepository {
  constructor(pgClient) {
    super();
    this.client = pgClient;
  }
  
  async save(user) {
    if (user.id) {
      const query = 'UPDATE users SET name = $1, email = $2 WHERE id = $3';
      await this.client.query(query, [user.name, user.email, user.id]);
    } else {
      const query = 'INSERT INTO users (name, email) VALUES ($1, $2) RETURNING id';
      const result = await this.client.query(query, [user.name, user.email]);
      user.id = result.rows[0].id;
    }
    return user;
  }
  
  async findById(id) {
    const query = 'SELECT * FROM users WHERE id = $1';
    const result = await this.client.query(query, [id]);
    return result.rows[0];
  }
}

// Uso del patrón - fácil intercambio de implementaciones
class UserService {
  constructor(userRepository) {
    this.userRepository = userRepository; // Puede ser Mongo, Postgres, etc.
  }
  
  async createUser(userData) {
    const existingUser = await this.userRepository.findByEmail(userData.email);
    if (existingUser) {
      throw new Error('User already exists');
    }
    
    return await this.userRepository.save(userData);
  }
}
```

### Factory Pattern

```javascript
// Factory para diferentes tipos de notificaciones
class NotificationFactory {
  static create(type, config) {
    switch (type) {
      case 'email':
        return new EmailNotification(config);
      case 'sms':
        return new SMSNotification(config);
      case 'push':
        return new PushNotification(config);
      case 'webhook':
        return new WebhookNotification(config);
      default:
        throw new Error(`Notification type ${type} not supported`);
    }
  }
}

class EmailNotification {
  constructor(config) {
    this.smtpConfig = config.smtp;
  }
  
  async send(recipient, message) {
    // Lógica de envío por email
    console.log(`Email sent to ${recipient}: ${message}`);
  }
}

class SMSNotification {
  constructor(config) {
    this.apiKey = config.apiKey;
    this.provider = config.provider;
  }
  
  async send(phoneNumber, message) {
    // Lógica de envío por SMS
    console.log(`SMS sent to ${phoneNumber}: ${message}`);
  }
}

// Uso del factory
class NotificationService {
  constructor() {
    this.notifications = [];
  }
  
  addNotificationMethod(type, config) {
    const notification = NotificationFactory.create(type, config);
    this.notifications.push(notification);
  }
  
  async sendToAll(recipient, message) {
    const promises = this.notifications.map(notification => 
      notification.send(recipient, message)
    );
    await Promise.all(promises);
  }
}

// Configuración
const notificationService = new NotificationService();
notificationService.addNotificationMethod('email', { 
  smtp: { host: 'smtp.gmail.com', port: 587 } 
});
notificationService.addNotificationMethod('sms', { 
  apiKey: 'xxx', provider: 'twilio' 
});
```

### Observer Pattern (Pub/Sub)

```javascript
// Sistema de eventos para aplicaciones web
class EventEmitter {
  constructor() {
    this.events = new Map();
  }
  
  subscribe(eventName, callback) {
    if (!this.events.has(eventName)) {
      this.events.set(eventName, []);
    }
    
    this.events.get(eventName).push(callback);
    
    // Retorna función de unsuscribe
    return () => {
      const callbacks = this.events.get(eventName);
      const index = callbacks.indexOf(callback);
      if (index > -1) {
        callbacks.splice(index, 1);
      }
    };
  }
  
  emit(eventName, data) {
    if (this.events.has(eventName)) {
      this.events.get(eventName).forEach(callback => {
        callback(data);
      });
    }
  }
}

// Ejemplo de uso en una aplicación de e-commerce
class OrderService {
  constructor(eventEmitter) {
    this.eventEmitter = eventEmitter;
  }
  
  async createOrder(orderData) {
    // Crear la orden
    const order = await this.saveOrder(orderData);
    
    // Emitir evento para que otros servicios reaccionen
    this.eventEmitter.emit('order.created', {
      orderId: order.id,
      customerId: order.customerId,
      total: order.total,
      items: order.items
    });
    
    return order;
  }
}

// Servicios que escuchan eventos
class EmailService {
  constructor(eventEmitter) {
    eventEmitter.subscribe('order.created', this.sendConfirmationEmail.bind(this));
    eventEmitter.subscribe('order.shipped', this.sendShippingEmail.bind(this));
  }
  
  async sendConfirmationEmail(orderData) {
    console.log(`Sending confirmation email for order ${orderData.orderId}`);
  }
}

class InventoryService {
  constructor(eventEmitter) {
    eventEmitter.subscribe('order.created', this.updateInventory.bind(this));
  }
  
  async updateInventory(orderData) {
    console.log(`Updating inventory for order ${orderData.orderId}`);
    // Reducir stock de los items
  }
}

class AnalyticsService {
  constructor(eventEmitter) {
    eventEmitter.subscribe('order.created', this.trackSale.bind(this));
    eventEmitter.subscribe('user.registered', this.trackNewUser.bind(this));
  }
  
  async trackSale(orderData) {
    console.log(`Tracking sale: $${orderData.total}`);
  }
}
```

## 3. Protocolos y Estándares Web

### HTTP/HTTPS Profundo

#### Headers Importantes y Su Uso

```javascript
// Ejemplo de servidor Express con headers importantes
const express = require('express');
const app = express();

// Middleware para headers de seguridad
app.use((req, res, next) => {
  // Previene ataques XSS
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  
  // Content Security Policy
  res.setHeader('Content-Security-Policy', 
    "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'"
  );
  
  // HSTS para HTTPS
  if (req.secure) {
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  }
  
  next();
});

// Ejemplo de manejo de caché
app.get('/api/users/:id', (req, res) => {
  const userId = req.params.id;
  
  // ETag para validación de caché
  const user = getUserById(userId);
  const etag = generateETag(user);
  
  res.setHeader('ETag', etag);
  res.setHeader('Cache-Control', 'private, max-age=300'); // 5 minutos
  
  // Verificar If-None-Match header del cliente
  if (req.headers['if-none-match'] === etag) {
    return res.status(304).end(); // Not Modified
  }
  
  res.json(user);
});

// Manejo de CORS
app.use((req, res, next) => {
  const origin = req.headers.origin;
  const allowedOrigins = ['https://myapp.com', 'https://admin.myapp.com'];
  
  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Max-Age', '86400'); // 24 horas
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  next();
});
```

#### Códigos de Estado HTTP y Su Uso Correcto

```javascript
class APIController {
  // 200 - Success (GET, PUT)
  async getUser(req, res) {
    const user = await userService.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.status(200).json(user);
  }
  
  // 201 - Created (POST)
  async createUser(req, res) {
    try {
      const user = await userService.create(req.body);
      res.status(201)
         .location(`/api/users/${user.id}`)
         .json(user);
    } catch (error) {
      if (error.name === 'ValidationError') {
        return res.status(400).json({ error: error.message });
      }
      res.status(500).json({ error: 'Internal server error' });
    }
  }
  
  // 204 - No Content (DELETE)
  async deleteUser(req, res) {
    const deleted = await userService.delete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.status(204).end();
  }
  
  // 400 - Bad Request
  async updateUser(req, res) {
    if (!req.body.name && !req.body.email) {
      return res.status(400).json({ 
        error: 'At least one field (name or email) is required' 
      });
    }
    
    // ... resto de la lógica
  }
  
  // 401 - Unauthorized
  async protectedRoute(req, res) {
    if (!req.headers.authorization) {
      return res.status(401).json({ error: 'Authorization header required' });
    }
    // ... verificar token
  }
  
  // 403 - Forbidden
  async adminOnly(req, res) {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }
    // ... lógica de admin
  }
  
  // 409 - Conflict
  async createUniqueResource(req, res) {
    try {
      const resource = await service.create(req.body);
      res.status(201).json(resource);
    } catch (error) {
      if (error.code === 'DUPLICATE_KEY') {
        return res.status(409).json({ 
          error: 'Resource already exists' 
        });
      }
      throw error;
    }
  }
  
  // 422 - Unprocessable Entity
  async validateAndCreate(req, res) {
    const validation = validateInput(req.body);
    if (!validation.valid) {
      return res.status(422).json({
        error: 'Validation failed',
        details: validation.errors
      });
    }
    // ... crear recurso
  }
  
  // 429 - Too Many Requests
  async rateLimitedEndpoint(req, res) {
    const rateLimitInfo = await rateLimiter.check(req.ip);
    
    res.setHeader('X-RateLimit-Limit', rateLimitInfo.limit);
    res.setHeader('X-RateLimit-Remaining', rateLimitInfo.remaining);
    res.setHeader('X-RateLimit-Reset', rateLimitInfo.resetTime);
    
    if (rateLimitInfo.exceeded) {
      return res.status(429).json({ 
        error: 'Rate limit exceeded',
        retryAfter: rateLimitInfo.retryAfter
      });
    }
    
    // ... lógica normal
  }
}
```

### REST vs GraphQL vs gRPC

#### REST API Design

```javascript
// Diseño RESTful correcto
class RESTfulAPI {
  // Recursos como sustantivos, acciones como verbos HTTP
  
  // GET /api/users - Listar usuarios
  async listUsers(req, res) {
    const { page = 1, limit = 10, sort = 'name', filter } = req.query;
    
    const users = await userService.list({
      page: parseInt(page),
      limit: parseInt(limit),
      sort,
      filter
    });
    
    res.json({
      data: users,
      pagination: {
        page,
        limit,
        total: users.total,
        pages: Math.ceil(users.total / limit)
      },
      links: {
        self: `/api/users?page=${page}&limit=${limit}`,
        next: page < users.totalPages ? `/api/users?page=${page + 1}&limit=${limit}` : null,
        prev: page > 1 ? `/api/users?page=${page - 1}&limit=${limit}` : null
      }
    });
  }
  
  // GET /api/users/:id - Obtener usuario específico
  async getUser(req, res) {
    const user = await userService.findById(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    
    res.json({
      data: user,
      links: {
        self: `/api/users/${user.id}`,
        posts: `/api/users/${user.id}/posts`,
        comments: `/api/users/${user.id}/comments`
      }
    });
  }
  
  // POST /api/users - Crear usuario
  async createUser(req, res) {
    const user = await userService.create(req.body);
    
    res.status(201)
       .location(`/api/users/${user.id}`)
       .json({ data: user });
  }
  
  // PUT /api/users/:id - Actualizar usuario completo
  async updateUser(req, res) {
    const user = await userService.update(req.params.id, req.body);
    res.json({ data: user });
  }
  
  // PATCH /api/users/:id - Actualización parcial
  async partialUpdateUser(req, res) {
    const user = await userService.partialUpdate(req.params.id, req.body);
    res.json({ data: user });
  }
  
  // DELETE /api/users/:id - Eliminar usuario
  async deleteUser(req, res) {
    await userService.delete(req.params.id);
    res.status(204).end();
  }
  
  // Recursos anidados
  // GET /api/users/:id/posts - Posts de un usuario
  async getUserPosts(req, res) {
    const posts = await postService.findByUserId(req.params.id);
    res.json({ data: posts });
  }
}
```

#### GraphQL Schema y Resolvers

```javascript
// Definición del schema GraphQL
const typeDefs = `
  type User {
    id: ID!
    name: String!
    email: String!
    posts: [Post!]!
    createdAt: String!
  }
  
  type Post {
    id: ID!
    title: String!
    content: String!
    author: User!
    comments: [Comment!]!
    publishedAt: String
  }
  
  type Comment {
    id: ID!
    content: String!
    author: User!
    post: Post!
    createdAt: String!
  }
  
  type Query {
    user(id: ID!): User
    users(first: Int, after: String): UserConnection!
    post(id: ID!): Post
    posts(authorId: ID, published: Boolean): [Post!]!
  }
  
  type Mutation {
    createUser(input: CreateUserInput!): User!
    updateUser(id: ID!, input: UpdateUserInput!): User!
    deleteUser(id: ID!): Boolean!
    
    createPost(input: CreatePostInput!): Post!
    publishPost(id: ID!): Post!
  }
  
  input CreateUserInput {
    name: String!
    email: String!
  }
  
  input UpdateUserInput {
    name: String
    email: String
  }
  
  input CreatePostInput {
    title: String!
    content: String!
    authorId: ID!
  }
  
  type UserConnection {
    edges: [UserEdge!]!
    pageInfo: PageInfo!
  }
  
  type UserEdge {
    node: User!
    cursor: String!
  }
  
  type PageInfo {
    hasNextPage: Boolean!
    hasPreviousPage: Boolean!
    startCursor: String
    endCursor: String
  }
`;

// Resolvers
const resolvers = {
  Query: {
    user: async (parent, { id }, context) => {
      return await context.dataSources.userService.findById(id);
    },
    
    users: async (parent, { first = 10, after }, context) => {
      const result = await context.dataSources.userService.findMany({
        first,
        after
      });
      
      return {
        edges: result.users.map(user => ({
          node: user,
          cursor: Buffer.from(`user:${user.id}`).toString('base64')
        })),
        pageInfo: {
          hasNextPage: result.hasNextPage,
          hasPreviousPage: result.hasPreviousPage,
          startCursor: result.startCursor,
          endCursor: result.endCursor
        }
      };
    },
    
    posts: async (parent, { authorId, published }, context) => {
      return await context.dataSources.postService.findMany({
        authorId,
        published
      });
    }
  },
  
  Mutation: {
    createUser: async (parent, { input }, context) => {
      // Validación
      if (!input.email.includes('@')) {
        throw new Error('Invalid email format');
      }
      
      return await context.dataSources.userService.create(input);
    },
    
    createPost: async (parent, { input }, context) => {
      // Verificar autorización
      if (!context.user || context.user.id !== input.authorId) {
        throw new Error('Unauthorized');
      }
      
      return await context.dataSources.postService.create(input);
    }
  },
  
  // Resolvers de campo - evitan el problema N+1
  User: {
    posts: async (user, args, context) => {
      return await context.dataSources.postService.findByAuthorId(user.id);
    }
  },
  
  Post: {
    author: async (post, args, context) => {
      // DataLoader para batching automático
      return await context.dataSources.userLoader.load(post.authorId);
    },
    
    comments: async (post, args, context) => {
      return await context.dataSources.commentService.findByPostId(post.id);
    }
  }
};
```