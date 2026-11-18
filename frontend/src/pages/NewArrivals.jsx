import { useEffect, useState } from "react"
import PageLayout from "../components/layout/PageLayout"
import PageHeader from "../components/common/PageHeader"
import ProductListing from "../components/products/ProductListing"
import { getProducts } from "../services/product.service"
import { getErrorMessage, normalizeProduct } from "../utils/catalog"
import { ErrorState, LoadingState } from "../components/common/AsyncState"
export default function NewArrivals() {
  const [state, setState] = useState({ loading: true, error: "", products: [] })
  useEffect(() => {
    let active = true
    getProducts({ limit: 100 }).then(({ products }) => {
      if (active) setState({ loading: false, error: "", products: products.map(normalizeProduct).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) })
    }).catch((error) => { if (active) setState({ loading: false, error: getErrorMessage(error), products: [] }) })
    return () => { active = false }
  }, [])
  return <PageLayout><PageHeader title="Novedades" description="Productos ordenados por su fecha real de creación." />{state.loading ? <section className="section"><div className="container"><LoadingState label="Cargando novedades..." /></div></section> : state.error ? <section className="section"><div className="container"><ErrorState message={state.error} /></div></section> : <ProductListing initialProducts={state.products} title="Recién llegados" />}</PageLayout>
}
