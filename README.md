# Proyecto Cacharrería

API de comercio para productos, categorías, usuarios, carrito y facturas, construida con Express y MongoDB. El repositorio contiene actualmente el backend; no incluye una aplicación frontend.

## Requisitos

- Node.js 18 o superior y npm.
- Una instancia accesible de MongoDB.

## Preparar y ejecutar en Windows

1. Abre esta carpeta en Visual Studio Code.
2. Instala MongoDB Community Server e inicia el servicio de MongoDB, o configura una URI de MongoDB Atlas.
3. Abre una terminal en `backend` y ejecuta `npm install`.
4. Copia `backend/.env.example` como `backend/.env` y configura `MONGO_URI` y un `TOKEN_SECRET` aleatorio de al menos 32 caracteres. El archivo `.env` es local y no debe subirse a GitHub.
5. Desde `backend`, ejecuta `npm run dev`.
6. Cuando aparezca `DB is connected` y el servidor indique el puerto, la API estará en `http://localhost:4000`.

Si usas una base local, el ejemplo es `mongodb://localhost:27017/proyecto_cacharreria`. Consulta [backend/README.md](backend/README.md) para los endpoints, autenticación y carga de productos.

## Contribuir

La rama de trabajo es `main`. Antes de enviar cambios, revisa `git status`, crea una rama y no incluyas credenciales, archivos `.env`, dependencias ni datos privados.