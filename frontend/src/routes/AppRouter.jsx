import { BrowserRouter, Route, Routes } from "react-router-dom"
import Home from "../pages/Home"
import Catalog from "../pages/Catalog"
import Category from "../pages/Category"
import ProductDetail from "../pages/ProductDetail"
import Offers from "../pages/Offers"
import BestSellers from "../pages/BestSellers"
import NewArrivals from "../pages/NewArrivals"
import Login from "../pages/Login"
import Register from "../pages/Register"
import Cart from "../pages/Cart"
import Profile from "../pages/Profile"
import Orders from "../pages/Orders"
import OrderDetail from "../pages/OrderDetail"
import Contact from "../pages/Contact"
import FAQ from "../pages/FAQ"
import NotFound from "../pages/NotFound"
import AccessDenied from "../pages/AccessDenied"
import ProtectedRoute from "./ProtectedRoute"
import AdminRoute from "./AdminRoute"
import Checkout from "../pages/Checkout"
import AdminLayout from "../admin/components/AdminLayout"
import AdminDashboard from "../admin/pages/AdminDashboard"
import AdminProducts from "../admin/pages/AdminProducts"
import AdminCategories from "../admin/pages/AdminCategories"
import AdminSubcategories from "../admin/pages/AdminSubcategories"
import AdminInventory from "../admin/pages/AdminInventory"
import AdminOrders from "../admin/pages/AdminOrders"
import StubPage from "../pages/StubPage"

export default function AppRouter() {
  return <BrowserRouter><Routes>
    <Route path="/" element={<Home />} />
    <Route path="/catalogo" element={<Catalog />} />
    <Route path="/categorias/:id" element={<Category />} />
    <Route path="/producto/:id" element={<ProductDetail />} />
    <Route path="/ofertas" element={<Offers />} />
    <Route path="/mas-vendidos" element={<BestSellers />} />
    <Route path="/novedades" element={<NewArrivals />} />
    <Route path="/login" element={<Login />} />
    <Route path="/registro" element={<Register />} />
    <Route path="/contacto" element={<Contact />} />
    <Route path="/preguntas-frecuentes" element={<FAQ />} />
    <Route path="/privacidad" element={<StubPage title="Privacidad" description="Información sobre privacidad disponible próximamente." />} />
    <Route path="/terminos" element={<StubPage title="Términos y condiciones" description="Los términos comerciales se configurarán antes de publicar la tienda." />} />
    <Route path="/acceso-denegado" element={<AccessDenied />} />
    <Route element={<ProtectedRoute />}>
      <Route path="/perfil" element={<Profile />} />
      <Route path="/carrito" element={<Cart />} />
      <Route path="/mis-pedidos" element={<Orders />} />
      <Route path="/mis-pedidos/:id" element={<OrderDetail />} />
      <Route path="/checkout" element={<Checkout />} />
      <Route element={<AdminRoute />}>
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="productos" element={<AdminProducts />} />
          <Route path="categorias" element={<AdminCategories />} />
          <Route path="subcategorias" element={<AdminSubcategories />} />
          <Route path="pedidos" element={<AdminOrders />} />
          <Route path="inventario" element={<AdminInventory />} />
        </Route>
      </Route>
    </Route>
    <Route path="*" element={<NotFound />} />
  </Routes></BrowserRouter>
}
