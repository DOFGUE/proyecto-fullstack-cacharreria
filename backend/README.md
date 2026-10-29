# Proyecto Cacharreria

Backend de una API para una cacharreria, construido con Express, MongoDB y Mongoose.

## Requisitos

- Node.js 18 o superior.
- npm.
- MongoDB ejecutandose localmente o una URI de MongoDB accesible.

## Instalacion

Desde la carpeta `backend`:

```bash
npm install
cp .env.example .env
```

Edita `.env` y configura estos valores:

```env
PORT=4000
MONGO_URI=mongodb://127.0.0.1:27017/proyecto_cacharreria?replicaSet=rs0
TOKEN_SECRET=una-clave-larga-y-segura
NODE_ENV=development
FRONTEND_ORIGINS=http://localhost:3000,http://localhost:5173
```

El archivo `.env` no debe subirse a GitHub. Solo se debe compartir `.env.example`.

### MongoDB local como Replica Set

La creación de facturas usa una transacción para descontar inventario, guardar la
factura y renovar el carrito de forma atómica. Por eso MongoDB debe ejecutarse como
Replica Set o mediante MongoDB Atlas.

En Linux, agrega esta sección a `/etc/mongod.conf`:

```yaml
replication:
  replSetName: rs0
```

Reinicia el servicio:

```bash
sudo systemctl restart mongod
```

Inicializa el Replica Set una sola vez:

```bash
mongosh
```

```javascript
rs.initiate({
  _id: "rs0",
  members: [{ _id: 0, host: "127.0.0.1:27017" }]
})
```

Verifica el estado con `rs.status()` y confirma que el nodo aparezca como
`PRIMARY`. La URI debe contener `?replicaSet=rs0`. Esta configuración no elimina
las bases de datos existentes.

## Ejecucion

Modo desarrollo:

```bash
npm run dev
```

Modo normal:

```bash
npm start
```

La API queda disponible en `http://localhost:4000` si se usa el puerto predeterminado.
El estado de la API se puede comprobar en `GET /health`. Si el frontend usa otro origen,
agregalo a `FRONTEND_ORIGINS`, separado por comas.
Al iniciar, se crean automaticamente los estados `en tienda`, `enviado` y `entregado` si no existen.

## Autenticacion

El registro y el login guardan el JWT en una cookie HTTP-only llamada `token`.
Thunder Client debe conservar las cookies entre peticiones.

El registro crea usuarios con rol `user`. Las operaciones administrativas requieren rol `admin`.
Para promover un usuario en MongoDB:

```javascript
const adminRole = db.roles.findOneAndUpdate(
	{ name: "admin" },
	{ $setOnInsert: { name: "admin" } },
	{ upsert: true, returnDocument: "after" }
)
db.users.updateOne(
	{ email: "usuario@example.com" },
	{ $set: { role: adminRole._id } }
)
```

## Endpoints

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
POST   /api/products       (admin)
POST   /api/products/bulk  (admin)
PUT    /api/products/:id  (admin)
DELETE /api/products/:id  (admin)
```

Para cargar varios productos con imagenes, envia un objeto con la propiedad `products`.
Cada imagen debe ser una Data URL JPEG, PNG o WebP, por ejemplo:

```json
{
	"products": [
		{
			"subCategory": "ID_DE_SUBCATEGORIA",
			"name": "Escoba plastica",
			"description": "Escoba para uso domestico",
			"price": 18000,
			"image": "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQ...",
			"stock": 25
		}
	]
}
```

Se permiten hasta 100 productos por peticion y cada imagen puede tener hasta 2 MB en formato Data URL.

### Preparar productos desde una carpeta de imagenes

El script `scripts/encode-products.js` convierte imagenes JPG, PNG o WebP a Data URL y genera el JSON para la carga masiva.
Cuando tengas los datos, crea `data/products.json` con este formato:

```json
[
	{
		"imageFile": "escoba.png",
		"subCategory": "ID_DE_SUBCATEGORIA",
		"name": "Escoba plastica",
		"description": "Escoba para limpieza del hogar",
		"price": 18000,
		"stock": 20
	}
]
```

Guarda las imagenes en `data/images/` y ejecuta desde `backend`:

```bash
node scripts/encode-products.js
```

El resultado se crea en `data/products-payload.json` y queda listo para enviarlo a `POST /api/products/bulk`.
Los archivos de datos e imagenes estan excluidos de Git; el script y esta documentacion si se suben al repositorio.

### Cargar el catalogo de ejemplo con imagenes

El script `scripts/seed-catalog.js` carga las categorias, subcategorias y productos de ejemplo y vincula las imagenes de `../imagenes de proyecto 2/` por nombre de producto. Convierte cada JPG a una Data URL Base64 y la guarda en `Item.image`.
Desde `backend`, ejecuta `npm run seed:catalog`. La carga es repetible y requiere que esa carpeta exista en la raiz del repositorio.

### Categorias y subcategorias

```text
GET    /api/categories
GET    /api/categories/:id
POST   /api/categories       (admin)
PUT    /api/categories/:id  (admin)
DELETE /api/categories/:id  (admin)

GET    /api/subcategories
GET    /api/subcategories/:id
POST   /api/subcategories       (admin)
PUT    /api/subcategories/:id  (admin)
DELETE /api/subcategories/:id  (admin)
```

### Carrito

```text
GET    /api/cart
POST   /api/cart/items
PUT    /api/cart/items/:id
DELETE /api/cart/items/:id
DELETE /api/cart
```

### Facturas y estados

```text
GET    /api/statuses
POST   /api/bills
GET    /api/bills
GET    /api/bills/:id
PATCH  /api/bills/:id/status  (admin)
```

Los estados de una factura solo pueden avanzar en este orden:

```text
en tienda -> enviado -> entregado
```

No se permiten saltos de estado ni regresar a un estado anterior.

La creación de facturas, el descuento de inventario y la renovación del carrito se
ejecutan dentro de una transacción de MongoDB. En producción, MongoDB debe ejecutarse
como replica set o mediante MongoDB Atlas, ya que las transacciones no funcionan en
una instancia standalone.

### Pruebas

Desde `backend`, ejecuta:

```bash
npm test
```

### Seguridad y despliegue

El backend configura CORS con credenciales, cookies HTTP-only, headers de seguridad,
limitación de intentos para registro/login y apagado ordenado. En producción usa
HTTPS, establece `NODE_ENV=production` y define explícitamente `FRONTEND_ORIGINS`.

## Estructura principal

```text
src/
	config.js       Configuracion desde variables de entorno.
	db.js           Conexion a MongoDB y estados iniciales.
	index.js        Configuracion y arranque de Express.
	controllers/    Logica de cada recurso.
	middlewares/    Autenticacion, permisos y validaciones.
	models/         Modelos y relaciones de Mongoose.
	routers/        Rutas HTTP.
	schema/         Validaciones de entrada con Zod.
```