# Proyecto Cacharrería

Aplicación fullstack para gestionar el catálogo, usuarios, carrito, checkout y pedidos de una cacharrería. Incluye una tienda pública construida con React y un panel administrativo protegido por rol.

## Tecnologías

- Frontend: React 19, Vite, React Router, Axios, React Hook Form, Zod, Lucide React y React Hot Toast.
- Backend: Node.js, Express, MongoDB, Mongoose, JWT y Zod.
- Base de datos: MongoDB local con Replica Set o MongoDB Atlas.

## Estructura

```text
backend/
  src/controllers/
  src/models/
  src/routers/
  src/schema/
  src/middlewares/
  scripts/
  test/
frontend/
  src/components/
  src/pages/
  src/admin/
  src/context/
  src/services/
  src/routes/
  src/styles/
  src/utils/
```

## Requisitos

- Node.js 18 o superior.
- npm.
- MongoDB Community Server o MongoDB Atlas.
- MongoDB configurado como Replica Set para crear pedidos con transacciones.

## Instalación

```bash
cd backend
npm install
npm run dev
```

En otra terminal:

```bash
cd frontend
npm install
npm run dev
```

El frontend utiliza `http://localhost:4000/api` en desarrollo normal. El backend escucha en `http://localhost:4000`.

## MongoDB local

Ejemplo de URI:

```text
MONGO_URI=mongodb://127.0.0.1:27017/proyecto_cacharreria?replicaSet=rs0
```

MongoDB debe iniciar con:

```yaml
replication:
  replSetName: rs0
```

Después, si el Replica Set no ha sido iniciado:

```javascript
rs.initiate({
  _id: "rs0",
  members: [{ _id: 0, host: "127.0.0.1:27017" }]
})
```

## Configuración

Copia los archivos de ejemplo sin publicar secretos reales:

```text
backend/.env.example
backend/.env.test.example
frontend/.env.example
```

No subas `.env`, tokens, contraseñas ni cadenas de conexión reales.

## Funcionalidades

- Catálogo, búsqueda, filtros, ordenamiento y paginación.
- Categorías, subcategorías, ofertas y más vendidos.
- Vista rápida y detalle de producto.
- Registro, login, perfil y logout con cookies HTTP-only.
- Carrito sincronizado con el backend.
- Checkout y pedidos transaccionales.
- Historial y detalle de pedidos.
- Administración de productos, categorías, subcategorías, inventario y pedidos.

## Usuarios de prueba

El proyecto contiene fixtures aislados documentados en `backend/scripts/setup-test-db.js`.

Cuentas disponibles en el entorno de pruebas:

```text
Administrador
Correo: test-admin@local.invalid
Contraseña: TestOnlyAdmin!2026

Usuario normal
Correo: test-user@local.invalid
Contraseña: TestOnlyUser!2026
```

Estas credenciales son exclusivamente para desarrollo y pruebas en `proyecto_cacharreria_test`.

## Compilación y pruebas

```bash
cd frontend
npm run build
```

```bash
cd backend
npm test
```

Para preparar el entorno aislado:

```bash
cd backend
npm run setup:test
npm run dev:test
```

No ejecutes los scripts de fixtures contra la base de producción.
