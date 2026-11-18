import { useEffect, useMemo, useState } from "react"
import { Search, SlidersHorizontal } from "lucide-react"
import ProductCard from "./ProductCard"
import { getCategories } from "../../services/category.service"
import { getProducts } from "../../services/product.service"
import { getErrorMessage, normalizeProduct } from "../../utils/catalog"
import { ErrorState, LoadingState, EmptyState } from "../common/AsyncState"

export default function ProductListing({ initialProducts = null, initialSearch = "", title = "Catálogo", categoryId = "", subCategories = [] }) {
  const [search, setSearch] = useState(initialSearch)
  const [category, setCategory] = useState(categoryId)
  const [subCategory, setSubCategory] = useState("")
  const [sort, setSort] = useState("name")
  const [productsSource, setProductsSource] = useState(initialProducts)
  const [categories, setCategories] = useState([])
  const [loadingCategories, setLoadingCategories] = useState(!initialProducts)
  const [error, setError] = useState("")

  useEffect(() => {
    if (initialProducts) {
      setProductsSource(initialProducts)
      setLoadingCategories(false)
      return
    }
    let active = true
    getProducts({ limit: 100 })
      .then((productResponse) => {
        if (active) setProductsSource(productResponse.products.map(normalizeProduct))
      })
      .catch((requestError) => {
        if (active) setError(getErrorMessage(requestError))
      })
      .finally(() => {
        if (active) setLoadingCategories(false)
      })

    getCategories()
      .then((categoryResponse) => {
        if (active) setCategories(categoryResponse)
      })
      .catch(() => {
        if (active) setCategories([])
      })
    return () => { active = false }
  }, [initialProducts])

  useEffect(() => { setSearch(initialSearch) }, [initialSearch])

  const products = useMemo(() => {
    const filtered = (productsSource || []).filter((product) => {
      const matchesSearch = `${product.name} ${product.category} ${product.subCategoryName}`.toLowerCase().includes(search.toLowerCase())
      return matchesSearch && (!category || product.categoryId === category) && (!subCategory || product.subCategoryId === subCategory)
    })
    return [...filtered].sort((a, b) => {
      if (sort === "price-asc") return a.price - b.price
      if (sort === "price-desc") return b.price - a.price
      return a.name.localeCompare(b.name)
    })
  }, [category, productsSource, search, sort, subCategory])

  return (
    <section className="section listing-section">
      <div className="container">
        <div className="section-heading"><div><span className="eyebrow">Catálogo</span><h2>{title}</h2><p>{loadingCategories ? "Consultando productos..." : `${products.length} productos encontrados`}</p></div>{!error && <span className="demo-note">Información actual</span>}</div>
        <div className="catalog-toolbar">
          <label className="catalog-search"><Search size={17} /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Buscar por nombre o categoría" /></label>
          {!initialProducts && <label className="catalog-select"><SlidersHorizontal size={17} /><select value={category} onChange={(event) => setCategory(event.target.value)}><option value="">Todas las categorías</option>{categories.map((item) => <option value={item._id} key={item._id}>{item.name}</option>)}</select></label>}
          {subCategories.length > 0 && <label className="catalog-select"><SlidersHorizontal size={17} /><select value={subCategory} onChange={(event) => setSubCategory(event.target.value)}><option value="">Todas las subcategorías</option>{subCategories.map((item) => <option value={item._id} key={item._id}>{item.name}</option>)}</select></label>}
          <select className="catalog-select sort-select" value={sort} onChange={(event) => setSort(event.target.value)}><option value="name">Ordenar por nombre</option><option value="price-asc">Precio menor a mayor</option><option value="price-desc">Precio mayor a menor</option></select>
        </div>
        {loadingCategories ? <LoadingState label="Cargando productos y categorías..." /> : error ? <ErrorState message={error} /> : products.length ? <div className="products-grid">{products.map((product) => <ProductCard key={product.id} product={product} />)}</div> : <EmptyState message="No hay productos que coincidan con la búsqueda." />}
      </div>
    </section>
  )
}
