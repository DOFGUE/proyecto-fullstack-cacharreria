import { useEffect, useState } from "react"
import { Sparkles } from "lucide-react"
import PageLayout from "../components/layout/PageLayout"
import PageHeader from "../components/common/PageHeader"
import ProductCard from "../components/products/ProductCard"
import { getProducts } from "../services/product.service"
import { getErrorMessage, normalizeProduct } from "../utils/catalog"
import { ErrorState, LoadingState } from "../components/common/AsyncState"
export default function Offers() {
  const [state, setState] = useState({ loading: true, error: "", products: [] })
  useEffect(() => {
    let active = true
    getProducts({ limit: 100 }).then(({ products }) => {
      if (active) setState({ loading: false, error: "", products: products.map(normalizeProduct).filter((product) => Object.hasOwn(product, "oldPrice")) })
    }).catch((error) => { if (active) setState({ loading: false, error: getErrorMessage(error), products: [] }) })
    return () => { active = false }
  }, [])
  return <PageLayout><PageHeader title="Ofertas especiales" description="Solo se muestran productos con descuentos registrados." />{state.loading ? <section className="section"><div className="container"><LoadingState label="Comprobando ofertas..." /></div></section> : state.error ? <section className="section"><div className="container"><ErrorState message={state.error} /></div></section> : <section className="section"><div className="container">{state.products.length ? <div className="products-grid">{state.products.map((product) => <ProductCard key={product.id} product={product} />)}</div> : <div className="placeholder"><Sparkles /><strong>No hay ofertas disponibles.</strong><p>Las promociones aparecerán cuando existan descuentos registrados.</p></div>}</div></section>}</PageLayout>
}
