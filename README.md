# ShipNow API

API de ShipNow refactorizada de un modelo monolítico a una **arquitectura por capas**
(Controller → Service → Repository), con configuración de entorno validada al arranque
y constantes centralizadas para roles y estados.

## Estructura del proyecto

```
src/
  config/         # Validación y exposición de variables de entorno
  constants/      # Diccionarios congelados: ROLES, PRODUCT_STATUS
  models/         # Esquemas de Mongoose (sin lógica de negocio)
  repositories/   # Único lugar que conoce Mongoose/MongoDB
  services/       # Lógica de negocio, validaciones, reglas del dominio
  controllers/    # Única puerta de entrada HTTP (req/res)
  routes/         # Conectan cada path con su método del Controller
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
const { ROLES, PRODUCT_STATUS } = require('./constants');
// ROLES.ADMIN, ROLES.USER
// PRODUCT_STATUS.AVAILABLE, PRODUCT_STATUS.OUT_OF_STOCK, PRODUCT_STATUS.DISCONTINUED
```

Ningún archivo del proyecto usa strings sueltos como `'admin'` o `'available'`.
