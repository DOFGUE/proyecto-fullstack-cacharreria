# Backend de la cacharrería

API REST desarrollada con Node.js, Express, MongoDB y Mongoose para gestionar usuarios, catálogo, carrito, facturas y estados de pedidos.

## Requisitos

- Node.js 18 o superior.
- MongoDB local o Atlas.
- Replica Set o MongoDB Atlas para transacciones.

## Instalación

```bash
cd backend
npm install
npm run dev
```

Puerto normal: `4000`.

La aplicación utiliza `/health` para comprobar el estado:

```text
GET /health
```

## Variables de entorno

Usar `.env.example` como referencia:

```env
PORT=4000
MONGO_URI=mongodb://127.0.0.1:27017/proyecto_cacharreria?replicaSet=rs0
TOKEN_SECRET=replace-with-a-long-random-secret
NODE_ENV=development
FRONTEND_ORIGINS=http://localhost:3000,http://localhost:5173
```

Para pruebas, usar `.env.test.example` y una base que termine exactamente en `_test`.

## MongoDB y transacciones

La creación de pedidos ejecuta una transacción que:

1. Valida el carrito y el stock.
2. Descuenta el inventario.
3. Crea la factura.
4. Elimina el carrito anterior.
5. Crea un carrito nuevo vacío.

La configuración local necesita:

```yaml
replication:
  replSetName: rs0
```

No se requieren cambios en los controladores para habilitar el Replica Set.

## Autenticación

- JWT almacenado en una cookie HTTP-only llamada `token`.
- Contraseñas cifradas con BCrypt.
- Validación de esquemas con Zod.
- Middleware `authRequired` para rutas privadas.
- Middleware `adminRequired` para operaciones administrativas.
- El frontend reconoce al administrador mediante `role.name === "admin"`.

## Endpoints principales

### Usuarios

```text
POST   /api/register
POST   /api/login
POST   /api/logout
GET    /api/profile
PATCH  /api/profile
DELETE /api/profile
```

### Productos

```text
GET    /api/products
GET    /api/products/:id
GET    /api/products/offers
GET    /api/products/best-sellers
POST   /api/products
POST   /api/products/bulk
PUT    /api/products/:id
DELETE /api/products/:id
```

### Categorías y subcategorías

```text
GET    /api/categories
POST   /api/categories
PUT    /api/categories/:id
DELETE /api/categories/:id

GET    /api/subcategories
POST   /api/subcategories
PUT    /api/subcategories/:id
DELETE /api/subcategories/:id
```

Las operaciones de escritura requieren autenticación y rol administrador.

### Carrito

```text
GET    /api/cart
POST   /api/cart/items
PUT    /api/cart/items/:id
DELETE /api/cart/items/:id
DELETE /api/cart
```

### Pedidos

```text
GET    /api/statuses
POST   /api/bills
GET    /api/bills
GET    /api/bills/:id
GET    /api/bills/admin
PATCH  /api/bills/:id/status
```

Estados reales:

```text
en tienda -> enviado -> entregado
```

Solo se permite avanzar estados en ese orden.

## Estructura

```text
src/app.js
src/index.js
src/config.js
src/db.js
src/controllers/
src/models/
src/routers/
src/schema/
src/middlewares/
scripts/
test/
```

## Entorno de pruebas

El entorno seguro utiliza `proyecto_cacharreria_test` y `NODE_ENV=test`.

Scripts disponibles:

```bash
npm run dev:test
npm run setup:test
npm run cleanup:test
npm test
npm run test:integration
```

Los scripts de fixtures están protegidos por `assertTestDatabase`, que rechaza bases que no terminen exactamente en `_test`.

## Usuarios de prueba

Creados por `scripts/setup-test-db.js`:

```text
Administrador:
test-admin@local.invalid
Contraseña: TestOnlyAdmin!2026

Usuario normal:
test-user@local.invalid
Contraseña: TestOnlyUser!2026
```

Son únicamente cuentas de desarrollo/prueba. No utilizar credenciales reales ni de producción.
