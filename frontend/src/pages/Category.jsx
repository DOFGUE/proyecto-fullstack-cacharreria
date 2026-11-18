import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import PageLayout from "../components/layout/PageLayout"
import PageHeader from "../components/common/PageHeader"
import ProductListing from "../components/products/ProductListing"
import { getCategories } from "../services/category.service"
import { getSubCategories } from "../services/subCategory.service"
import { getProducts } from "../services/product.service"
import { getErrorMessage, normalizeProduct } from "../utils/catalog"
import { ErrorState, LoadingState } from "../components/common/AsyncState"

export default function Category() {
  const { id } = useParams()
  const [state, setState] = useState({ loading: true, error: "", category: null, products: [], subCategories: [] })

  useEffect(() => {
    let active = true
    Promise.all([getCategories(), getSubCategories(), getProducts({ category: id, limit: 100 })])
      .then(([categories, subCategories, response]) => {
        if (!active) return
        const category = categories.find((item) => item._id === id)
        setState({ loading: false, error: "", category, products: response.products.map(normalizeProduct), subCategories: subCategories.filter((item) => item.category?._id === id) })
      })
      .catch((error) => { if (active) setState((current) => ({ ...current, loading: false, error: getErrorMessage(error) })) })
    return () => { active = false }
  }, [id])

  return <PageLayout><PageHeader title={state.category?.name || "Categoría"} description={state.category?.description || "Explora los productos disponibles en esta categoría."}>{state.subCategories.length > 0 && <div className="subcategory-list">{state.subCategories.map((item) => <span key={item._id}>{item.name}</span>)}</div>}</PageHeader>{state.loading ? <section className="section"><div className="container"><LoadingState label="Cargando categoría y productos..." /></div></section> : state.error ? <section className="section"><div className="container"><ErrorState message={state.error} /></div></section> : <ProductListing initialProducts={state.products} subCategories={state.subCategories} title={state.category?.name || "Categoría"} />}</PageLayout>
}
