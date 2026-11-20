import { useEffect, useState } from "react"
import { ArrowRight, BadgeCheck, Clock3, PackageCheck, Sparkles } from "lucide-react"
import { Link } from "react-router-dom"
import Footer from "../components/layout/Footer"
import Header from "../components/layout/Header"
import ProductCard from "../components/products/ProductCard"
import { getCategories } from "../services/category.service"
import { getBestSellers, getOffers, getProducts } from "../services/product.service"
import { ErrorState, LoadingState } from "../components/common/AsyncState"
import { FALLBACK_IMAGE, getErrorMessage, normalizeProduct } from "../utils/catalog"

const benefits = [
  { icon: PackageCheck, title: "Compra con confianza", text: "Un catálogo organizado para encontrar lo que necesitas." },
  { icon: BadgeCheck, title: "Productos seleccionados", text: "Variedades útiles y bonitas para tu día a día." },
  { icon: Clock3, title: "Atención cercana", text: "Estamos preparando una experiencia simple y amable." },
  { icon: Sparkles, title: "Nuevos hallazgos", text: "Siempre hay algo especial por descubrir." }
]

export default function Home() {
  const [catalog, setCatalog] = useState({ loading: true, error: "", categories: [], products: [], offers: [], bestSellers: [] })

  useEffect(() => {
    let active = true
    setCatalog((current) => ({ ...current, loading: true, error: "", categories: [], products: [], offers: [], bestSellers: [] }))

    getCategories()
      .then((categories) => {
        if (active) setCatalog((current) => ({ ...current, loading: current.loading, categories }))
      })
      .catch((error) => {
        if (active) setCatalog((current) => ({ ...current, error: getErrorMessage(error), categories: [] }))
      })

    getProducts({ limit: 100 })
      .then((productResponse) => {
        if (active) setCatalog((current) => ({
          ...current,
          loading: false,
          products: productResponse.products.map(normalizeProduct)
        }))
      })
      .catch((error) => {
        if (active) setCatalog((current) => ({
          ...current,
          loading: false,
          error: current.error || getErrorMessage(error),
          products: []
        }))
      })

    getOffers()
      .then((products) => {
        if (active) setCatalog((current) => ({ ...current, offers: products.map(normalizeProduct) }))
      })
      .catch(() => {})

    getBestSellers()
      .then((products) => {
        if (active) setCatalog((current) => ({ ...current, bestSellers: products.map(normalizeProduct) }))
      })
      .catch(() => {})
    return () => { active = false }
  }, [])

  return (
    <>
      <Header />
      <main id="inicio">
        <section className="hero">
          <div className="container hero-inner">
            <div className="hero-copy">
              <span className="eyebrow">Una tienda para todos los días</span>
              <h1>Encuentra eso que le faltaba a <em>tu hogar.</em></h1>
              <p>Artículos prácticos, detalles bonitos y pequeños tesoros para hacer tu espacio más tuyo.</p>
              <Link className="button button-primary" to="/catalogo">Explorar novedades <ArrowRight size={17} /></Link>
            </div>
            <div className="hero-image-wrap">
              <img className="hero-image" src="https://images.unsplash.com/photo-1556911220-bff31c812dba?auto=format&fit=crop&w=1000&q=85" alt="Utensilios y productos para el hogar" />
            </div>
          </div>
        </section>

        <section className="section" id="categorias">
          <div className="container">
            <div className="section-heading"><div><span className="eyebrow">Para cada espacio</span><h2>Explora por categoría</h2><p>Categorías disponibles en el catálogo.</p></div><span className="demo-note">Información actual</span></div>
            {catalog.loading ? (
              <LoadingState label="Cargando categorías..." />
            ) : catalog.error ? (
              <ErrorState message={catalog.error} />
            ) : (
              <div className="category-grid">
                {catalog.categories.map((category) => {
                  return (
                    <Link className="category-card" to={`/categorias/${category._id}`} key={category._id}>
                      <img
                        src={category.image || FALLBACK_IMAGE}
                        alt={category.name}
                        loading="lazy"
                        onError={(event) => { event.currentTarget.src = FALLBACK_IMAGE }}
                      />
                      <div className="category-info">
                        <strong>{category.name}</strong>
                        <ArrowRight size={15} />
                      </div>
                    </Link>
                  )
                })}
              </div>
            )}
          </div>
        </section>

        <section className="section soft-section" id="catalogo">
          <div className="container">
            <div className="section-heading"><div><span className="eyebrow">Selección de la casa</span><h2>Productos disponibles</h2><p>Productos cargados desde la base de datos.</p></div><Link className="text-link" to="/catalogo">Ver catálogo <ArrowRight size={15} /></Link></div>
            {catalog.loading ? <LoadingState label="Cargando productos..." /> : catalog.error ? <ErrorState message={catalog.error} /> : catalog.products.length ? <div className="products-grid">{catalog.products.slice(0, 4).map((product) => <ProductCard key={product.id} product={product} />)}</div> : <div className="placeholder"><strong>No hay productos disponibles.</strong></div>}
          </div>
        </section>

        <section className="section" id="ofertas">
          <div className="container">
            <div className="section-heading"><div><span className="eyebrow">Precios que alegran</span><h2>Ofertas especiales</h2><p>Descuentos configurados desde el panel administrativo.</p></div><Link className="text-link" to="/ofertas">Ver ofertas <ArrowRight size={15} /></Link></div>
            {catalog.loading ? <LoadingState label="Cargando ofertas..." /> : catalog.offers.length ? <div className="products-grid">{catalog.offers.slice(0, 4).map((product) => <ProductCard key={product.id} product={product} />)}</div> : <div className="placeholder"><Sparkles /><strong>No hay ofertas disponibles.</strong><p>Configura un porcentaje de descuento en un producto activo.</p></div>}
          </div>
        </section>

        <section className="section soft-section">
          <div className="container">
            <div className="section-heading"><div><span className="eyebrow">Favoritos de nuestros clientes</span><h2>Los más vendidos</h2><p>Basado en unidades incluidas en pedidos entregados.</p></div><Link className="text-link" to="/mas-vendidos">Ver más vendidos <ArrowRight size={15} /></Link></div>
            {catalog.loading ? <LoadingState label="Calculando más vendidos..." /> : catalog.bestSellers.length ? <div className="products-grid">{catalog.bestSellers.slice(0, 4).map((product) => <ProductCard key={product.id} product={product} />)}</div> : <div className="placeholder"><Sparkles /><strong>Aún no hay ventas entregadas.</strong><p>Los rankings aparecerán cuando existan pedidos completados.</p></div>}
          </div>
        </section>

        <section className="section" id="novedades">
          <div className="container">
            <div className="section-heading"><div><span className="eyebrow">Recién llegados</span><h2>Novedades</h2><p>Una vista previa de productos incorporados recientemente.</p></div></div>
            {catalog.loading ? <LoadingState label="Cargando novedades..." /> : catalog.error ? <ErrorState message={catalog.error} /> : <div className="products-grid">{[...catalog.products].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 4).map((product) => <ProductCard key={product.id} product={product} />)}</div>}
          </div>
        </section>

        <section className="section soft-section">
          <div className="container"><div className="section-heading"><div><span className="eyebrow">Nuestra promesa</span><h2>Comprar se siente bonito</h2></div></div><div className="benefits">{benefits.map(({ icon: Icon, title, text }) => <div className="benefit" key={title}><span className="benefit-icon"><Icon size={20} /></span><div><h3>{title}</h3><p>{text}</p></div></div>)}</div></div>
        </section>
      </main>
      <Footer />
    </>
  )
}
