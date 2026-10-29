# Proyecto Cacharrería

API de comercio para productos, categorías, usuarios, carrito y facturas, construida con Express y MongoDB. El frontend se agregará en la carpeta `frontend/`.

## Requisitos

- Node.js 18 o superior y npm.
- Una instancia accesible de MongoDB.

## Preparar y ejecutar

1. Instala Node.js 18 o superior, npm y MongoDB Community Server, o configura una URI de MongoDB Atlas.
2. Desde `backend`, ejecuta `npm install`.
3. Copia `backend/.env.example` como `backend/.env` y configura un `TOKEN_SECRET` aleatorio de al menos 32 caracteres. El archivo `.env` es local y no debe subirse a GitHub.
4. Desde `backend`, ejecuta `npm run dev`.
5. Cuando aparezca `DB is connected` y el servidor indique el puerto, la API estará en `http://localhost:4000`.

Consulta [backend/README.md](backend/README.md) para los endpoints, autenticación, Replica Set y carga de productos.

## Estructura del proyecto

```text
backend/   API Express, MongoDB, autenticación y lógica de negocio.
frontend/  Aplicación cliente que consumirá la API.
```

El frontend debe ejecutarse como una aplicación independiente y usar
`http://localhost:4000` como URL base de la API. Como la autenticación usa cookies,
las peticiones autenticadas deben enviar credenciales (`credentials: "include"` en
Fetch o la opción equivalente en Axios). El origen del frontend debe estar incluido
en `backend/.env` dentro de `FRONTEND_ORIGINS`.

## MongoDB local como Replica Set

El backend usa transacciones al crear facturas para descontar inventario, guardar la
factura y renovar el carrito de forma atómica. Por eso la instancia local debe usar
un Replica Set, incluso si tiene un solo nodo.

En Linux, edita `/etc/mongod.conf` y agrega:

```yaml
replication:
  replSetName: rs0
```

Reinicia MongoDB:

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

Comprueba que el nodo sea `PRIMARY`:

```javascript
rs.status()
```

La URI debe incluir el nombre del Replica Set:

```env
MONGO_URI=mongodb://127.0.0.1:27017/proyecto_cacharreria?replicaSet=rs0
```

Si MongoDB muestra `ECONNREFUSED`, revisa `sudo systemctl status mongod`.
Si aparece un error de transacciones indicando que no se permiten en un servidor
standalone, comprueba que `rs.status()` muestre un nodo `PRIMARY` y que la URI tenga
`?replicaSet=rs0`. MongoDB Atlas ya incluye Replica Set y no requiere estos pasos.

## Contribuir

La rama de trabajo es `main`. Antes de enviar cambios, revisa `git status`, crea una rama y no incluyas credenciales, archivos `.env`, dependencias ni datos privados.