# ShipNow API

API de ShipNow refactorizada de un modelo monolítico a una **arquitectura por capas**
(Controller → Service → Repository), con configuración de entorno validada al arranque,
constantes centralizadas para roles/estados/prioridades, y un **sistema de mocking**
para generar datos de prueba (usuarios, repartidores, pedidos y entregas) sin cargarlos
a mano.

## Estructura del proyecto

```
src/
  config/         # Validación y exposición de variables de entorno
  constants/      # Diccionarios congelados: ROLES, PRODUCT_STATUS, ORDER_STATUS,
                  # ORDER_PRIORITY, DELIVERY_STATUS
  models/         # Esquemas de Mongoose (sin lógica de negocio): Product, User,
                  # Order (Pedido), Delivery (Entrega)
  repositories/   # Único lugar que conoce Mongoose/MongoDB
  services/       # Lógica de negocio, validaciones, reglas del dominio
  controllers/    # Única puerta de entrada HTTP (req/res)
  routes/         # Conectan cada path con su método del Controller
  mocks/
    generators/   # Funciones puras que arman objetos falsos (no tocan la DB)
  app.js          # Configuración de Express y montaje de rutas
  server.js       # Conexión a MongoDB y arranque del servidor
```

Flujo de dependencias: **Router → Controller → Service → Repository → Model**.
El Controller nunca importa Mongoose directamente, y el Repository nunca contiene
lógica de negocio (esa vive en el Service).

## Instrucciones para correr el proyecto localmente

1. Cloná el repositorio y entrá a la carpeta:
   ```bash
   git clone <URL_DEL_REPO>
   cd shipnow-api
   ```

2. Instalá las dependencias:
   ```bash
   npm install
   ```

3. Creá tu archivo `.env` a partir del ejemplo:
   ```bash
   cp .env.example .env
   ```
   Completá `MONGODB_URI` con tu cadena de conexión (Atlas o local) y ajustá
   `PORT` / `NODE_ENV` si lo necesitás.

4. Levantá el servidor:
   ```bash
   npm run dev    # con nodemon, recarga automática
   # o
   npm start      # sin recarga automática
   ```

5. Probá que esté vivo:
   ```
   GET http://localhost:8080/
   ```

> Si falta alguna variable obligatoria (`PORT`, `MONGODB_URI` o `NODE_ENV`) en el
> `.env`, la aplicación **no arranca** y muestra un error descriptivo indicando
> cuál falta.

## Endpoints disponibles

### Products — `/api/products`
| Método | Ruta          | Descripción              |
|--------|---------------|---------------------------|
| GET    | `/`           | Lista productos (excluye discontinuados) |
| GET    | `/:id`        | Obtiene un producto por id |
| POST   | `/`           | Crea un producto |
| PUT    | `/:id`        | Actualiza un producto |
| DELETE | `/:id`        | Elimina un producto |

### Users — `/api/users`
| Método | Ruta          | Descripción              |
|--------|---------------|---------------------------|
| GET    | `/`           | Lista usuarios (sin password) |
| GET    | `/:id`        | Obtiene un usuario por id |
| POST   | `/`           | Crea un usuario (hashea password) |
| PUT    | `/:id`        | Actualiza un usuario |
| DELETE | `/:id`        | Elimina un usuario |

### Mocks — `/api/mocks`
| Método | Ruta                | Descripción |
|--------|---------------------|-------------|
| GET    | `/users?qty=N`        | Genera `N` usuarios falsos **sin guardarlos** |
| GET    | `/repartidores?qty=N` | Genera `N` repartidores falsos (rol `REPARTIDOR`) **sin guardarlos** |
| GET    | `/orders?qty=N`       | Genera `N` pedidos falsos, con su usuario y productos embebidos, **sin guardarlos** |
| GET    | `/deliveries?qty=N`   | Genera `N` entregas falsas, con su pedido y repartidor embebidos, **sin guardarlos** |
| POST   | `/seed?qty=N&entity=X`| Genera **e inserta** `N` registros de la entidad `X` en MongoDB |

Ver la sección **"Sistema de mocking"** más abajo para el detalle completo de
cómo probar cada uno y qué datos genera.

## ¿Por qué separar la lógica entre Service y Repository?

El **Repository** es la única capa que sabe que la persistencia se hace con
Mongoose/MongoDB. Su responsabilidad es exclusivamente traducir "necesito estos
datos" o "guardá esto" en queries concretas, incluyendo detalles de acceso como
proyecciones por defecto (por ejemplo, nunca devolver el `password` de un
usuario) o filtros base. Si mañana migramos a otra base de datos, sólo se toca
esta capa.

El **Service**, en cambio, no sabe nada de Mongoose: solo conoce al Repository
a través de sus métodos (`getAll`, `create`, etc.) y ahí es donde vive el
"negocio" de ShipNow. Por ejemplo:

- Calcular el `status` de un producto (`AVAILABLE` / `OUT_OF_STOCK`) según su stock.
- Impedir que un producto `DISCONTINUED` aparezca en el listado público.
- Hashear el password antes de guardar un usuario, o evitar que alguien se
  autoasigne el rol `ADMIN` al registrarse.

Mezclar estas dos responsabilidades en un solo archivo (como pasaba en el
modelo monolítico original) hace que testear las reglas de negocio dependa de
tener una base de datos levantada, y que cualquier cambio de infraestructura
(cambiar de ODM, agregar caché, etc.) obligue a tocar también la lógica de
negocio. Separarlas permite testear el Service con un Repository mockeado, y
cambiar la capa de datos sin romper reglas de negocio.

## Constantes y roles

Los valores inmutables del dominio están en `src/constants/index.js`, usando
`Object.freeze` para evitar mutaciones accidentales:

```js
const { ROLES, PRODUCT_STATUS, ORDER_STATUS, ORDER_PRIORITY, DELIVERY_STATUS } = require('./constants');
// ROLES.ADMIN, ROLES.USER, ROLES.REPARTIDOR
// PRODUCT_STATUS.AVAILABLE, PRODUCT_STATUS.OUT_OF_STOCK, PRODUCT_STATUS.DISCONTINUED
// ORDER_STATUS.PENDING, .CONFIRMED, .IN_TRANSIT, .DELIVERED, .CANCELLED
// ORDER_PRIORITY.LOW, .MEDIUM, .HIGH
// DELIVERY_STATUS.ASSIGNED, .IN_PROGRESS, .COMPLETED, .FAILED
```

Ningún archivo del proyecto usa strings sueltos como `'admin'` o `'available'`.

## Sistema de mocking

El objetivo de este módulo es poder generar datos de prueba realistas
(usuarios, repartidores, pedidos y entregas) sin cargarlos a mano, para poder
probar la API con datos de volumen desde el día uno.

Se usa la librería [`@faker-js/faker`](https://fakerjs.dev/) para generar los
valores falsos, pero **la librería nunca se usa desde las rutas ni desde los
controllers**: vive encapsulada en `src/mocks/generators/`, y solo el
`mock.service.js` la orquesta, respetando el mismo flujo de capas que el resto
del proyecto:

```
Router (mock.routes.js) → Controller (mock.controller.js) → Service (mock.service.js) → Repository (user/product/order/delivery) → Model
                                                                    ↑
                                                    usa los generadores de src/mocks/generators/
```

### Dos modos de uso

**1. Generar sin guardar (`GET`)**

Sirve para ver rápido cómo luce un dato simulado, o para usarlo en el frontend
sin tocar la base. Las relaciones se muestran **embebidas** (como si vinieran
"populadas"), ya que no hay un `_id` real todavía:

```bash
GET http://localhost:8080/api/mocks/users?qty=2
GET http://localhost:8080/api/mocks/repartidores?qty=2
GET http://localhost:8080/api/mocks/orders?qty=2      # cada pedido trae su usuario y productos embebidos
GET http://localhost:8080/api/mocks/deliveries?qty=2  # cada entrega trae su pedido y repartidor embebidos
```

Ejemplo de respuesta de `GET /api/mocks/users?qty=2`:
```json
[
  {
    "firstName": "Ana",
    "lastName": "Pérez",
    "email": "ana.perez.48213@shipnow-mock.test",
    "password": "a8f3kd92sl",
    "role": "USER"
  },
  {
    "firstName": "Luis",
    "lastName": "Gómez",
    "email": "luis.gomez.91820@shipnow-mock.test",
    "password": "q0pz71xmwa",
    "role": "REPARTIDOR"
  }
]
```

**2. Generar y guardar en MongoDB (`POST /api/mocks/seed`)**

Inserta los registros generados directamente en la colección correspondiente,
usando el Repository real de cada entidad (o sea, pasa por las mismas
validaciones de esquema que un alta normal). Parámetros de query:

- `qty`: cantidad a insertar (default `10`, tope `200`).
- `entity`: `users` | `repartidores` | `orders` | `deliveries` (default `users`).

```bash
POST http://localhost:8080/api/mocks/seed?qty=10
POST http://localhost:8080/api/mocks/seed?qty=10&entity=users
POST http://localhost:8080/api/mocks/seed?qty=5&entity=repartidores
POST http://localhost:8080/api/mocks/seed?qty=8&entity=orders
POST http://localhost:8080/api/mocks/seed?qty=8&entity=deliveries
```

Ejemplo de respuesta:
```json
{ "insertados": 10, "coleccion": "usuarios" }
```

**Relaciones garantizadas al persistir:** si pedís `entity=orders` y todavía
no hay usuarios o productos cargados en la base, el Service los genera y
guarda automáticamente primero (mínimo 3 de cada uno) para poder asociar cada
pedido a un `user` y a `products` reales. Lo mismo pasa con `entity=deliveries`:
si faltan pedidos o repartidores, se generan antes de crear las entregas, así
cada `Delivery.order` y `Delivery.repartidor` siempre apunta a un documento
que realmente existe en la base.

### Orden recomendado para poblar la base de cero

Aunque no es obligatorio (el sistema resuelve las dependencias solo), para
tener control total del volumen de cada colección conviene seedear en este
orden:

```bash
POST /api/mocks/seed?qty=15&entity=users
POST /api/mocks/seed?qty=5&entity=repartidores
POST /api/mocks/seed?qty=20&entity=orders
POST /api/mocks/seed?qty=20&entity=deliveries
```

### Por qué el mocking respeta la arquitectura por capas

- **Generators** (`src/mocks/generators/`): funciones puras, sin `req`/`res`
  ni Mongoose. Solo saben construir un objeto con la forma de un modelo real,
  usando las constantes de `ROLES`, `ORDER_STATUS`, `ORDER_PRIORITY` y
  `DELIVERY_STATUS` — nunca strings sueltos.
- **`mock.service.js`**: la única pieza que decide *qué* generar y *cómo*
  garantizar relaciones válidas. Para persistir, llama a los Repositories
  existentes (`userRepository`, `productRepository`, `orderRepository`,
  `deliveryRepository`) — nunca importa Mongoose directamente.
- **`mock.controller.js`**: valida el query param `qty` y delega todo al
  Service. No arma datos falsos ni sabe nada de la base.
- **`mock.routes.js`**: solo conecta cada path con su método del controller.
