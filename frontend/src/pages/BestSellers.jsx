import { useEffect, useState } from "react"
import PageLayout from "../components/layout/PageLayout"
import PageHeader from "../components/common/PageHeader"
import ProductCard from "../components/products/ProductCard"
import { getBestSellers } from "../services/product.service"
import { ErrorState, LoadingState } from "../components/common/AsyncState"
import { getErrorMessage, normalizeProduct } from "../utils/catalog"

export default function BestSellers() {
  const [state, setState] = useState({ loading: true, error: "", products: [] })

  useEffect(() => {
    let active = true
    getBestSellers()
      .then((products) => {
        if (active) setState({ loading: false, error: "", products: products.map(normalizeProduct) })
      })
      .catch((error) => {
        if (active) setState({ loading: false, error: getErrorMessage(error), products: [] })
      })
    return () => { active = false }
  }, [])

  return (
    <PageLayout>
      <PageHeader title="Más vendidos" description="Productos ordenados por unidades vendidas en pedidos entregados." />
      {state.loading ? (
        <section className="section"><div className="container"><LoadingState label="Calculando productos más vendidos..." /></div></section>
      ) : state.error ? (
        <section className="section"><div className="container"><ErrorState message={state.error} /></div></section>
      ) : (
        <section className="section"><div className="container">
          {state.products.length ? (
            <div className="products-grid">{state.products.map((product) => <ProductCard key={product.id} product={product} />)}</div>
          ) : (
            <div className="placeholder"><strong>Aún no hay ventas entregadas.</strong><p>Esta sección aparecerá cuando existan pedidos completados.</p></div>
          )}
        </div></section>
      )}
    </PageLayout>
  )
}
