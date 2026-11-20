# Frontend de la cacharrería

Aplicación React/Vite que consume la API Express para mostrar el catálogo, manejar usuarios y proporcionar el panel administrativo.

## Tecnologías

- React 19.
- Vite.
- React Router.
- Axios.
- React Hook Form.
- Zod.
- Lucide React.
- React Hot Toast.

## Requisitos

- Node.js 18 o superior.
- Backend ejecutándose.

## Instalación

```bash
cd frontend
npm install
npm run dev
```

Aplicación: `http://localhost:5173`.

## Configuración

Ejemplo de `.env`:

```env
VITE_API_URL=http://localhost:4000/api
```

Para el backend de pruebas:

```env
VITE_API_URL=http://localhost:4001/api
```

Axios conserva `withCredentials: true` para la autenticación por cookie HTTP-only.

## Estructura

```text
src/components/
src/pages/
src/admin/
src/context/
src/hooks/
src/routes/
src/services/
src/styles/
src/data/
src/utils/
```

## Funcionalidades

- Inicio, catálogo, categorías, ofertas, más vendidos y novedades.
- Búsqueda, filtros, ordenamiento y paginación de 9 productos.
- Vista rápida y detalle de producto.
- Registro, login, perfil y rutas protegidas.
- Carrito sincronizado, checkout e historial de pedidos.
- Panel administrativo protegido por rol.
- Gestión de productos, categorías, subcategorías, inventario y pedidos.

## Rutas públicas

```text
/ 
/catalogo
/categorias/:id
/producto/:id
/ofertas
/mas-vendidos
/novedades
/login
/registro
/carrito
/contacto
/preguntas-frecuentes
/privacidad
/terminos
```

## Rutas privadas

```text
/perfil
/checkout
/mis-pedidos
/mis-pedidos/:id
/admin
/admin/productos
/admin/categorias
/admin/subcategorias
/admin/pedidos
/admin/inventario
```

## Usuarios de prueba

Usuario normal:

```text
test-user@local.invalid
TestOnlyUser!2026
```

Administrador:

```text
test-admin@local.invalid
TestOnlyAdmin!2026
```

Estas cuentas son únicamente de desarrollo/prueba y requieren que el backend de pruebas esté iniciado contra `proyecto_cacharreria_test`.

## Compilación

```bash
npm run build
npm run preview
```
