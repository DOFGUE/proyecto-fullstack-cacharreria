import { useEffect, useMemo, useState } from "react"
import { Search, SlidersHorizontal } from "lucide-react"
import ProductCard from "./ProductCard"
import { getCategories } from "../../services/category.service"
import { getProducts } from "../../services/product.service"
import { getErrorMessage, normalizeProduct } from "../../utils/catalog"
import { ErrorState, LoadingState, EmptyState } from "../common/AsyncState"
import Pagination from "../common/Pagination"
import CustomSelect from "../common/CustomSelect"

export default function ProductListing({ initialProducts = null, initialSearch = "", title = "Catálogo", categoryId = "", subCategories = [] }) {
  const [search, setSearch] = useState(initialSearch)
  const [category, setCategory] = useState(categoryId)
  const [subCategory, setSubCategory] = useState("")
  const [sort, setSort] = useState("name")
  const [productsSource, setProductsSource] = useState(initialProducts)
  const [categories, setCategories] = useState([])
  const [loadingCategories, setLoadingCategories] = useState(!initialProducts)
  const [error, setError] = useState("")
  const [page, setPage] = useState(1)
  const pageSize = 9

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
  useEffect(() => { setCategory(categoryId) }, [categoryId])
  useEffect(() => { setSubCategory("") }, [initialProducts])
  useEffect(() => { setPage(1) }, [search, category, subCategory, sort])

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

  const totalPages = Math.ceil(products.length / pageSize)
  const safePage = totalPages > 0 ? Math.min(page, totalPages) : 1
  const pageStart = products.length ? (safePage - 1) * pageSize : 0
  const visibleProducts = products.slice(pageStart, pageStart + pageSize)

  useEffect(() => {
    if (page !== safePage) setPage(safePage)
  }, [page, safePage])

  return (
    <section className="section listing-section">
      <div className="container">
        <div className="section-heading"><div><span className="eyebrow">Catálogo</span><h2>{title}</h2><p>{loadingCategories ? "Consultando productos..." : `${products.length} productos encontrados`}</p></div>{!error && <span className="demo-note">Información actual</span>}</div>
        <div className="catalog-toolbar">
          <label className="catalog-search"><Search size={17} /><span>Buscar</span><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Nombre o categoría" /></label>
          {!initialProducts && (
            <CustomSelect
              label="Categoría"
              icon={SlidersHorizontal}
              className="catalog-select"
              value={category}
              onChange={setCategory}
              options={[{ value: "", label: "Todas las categorías" }, ...categories.map((item) => ({ value: item._id, label: item.name }))]}
            />
          )}
          {subCategories.length > 0 && (
            <CustomSelect
              label="Subcategoría"
              icon={SlidersHorizontal}
              className="catalog-select"
              value={subCategory}
              onChange={setSubCategory}
              options={[{ value: "", label: "Todas las subcategorías" }, ...subCategories.map((item) => ({ value: item._id, label: item.name }))]}
            />
          )}
          <CustomSelect
            label="Ordenar por"
            className="catalog-select sort-select"
            value={sort}
            onChange={setSort}
            options={[
              { value: "name", label: "Nombre" },
              { value: "price-asc", label: "Precio menor a mayor" },
              { value: "price-desc", label: "Precio mayor a menor" }
            ]}
          />
        </div>
        {loadingCategories ? <LoadingState label="Cargando productos y categorías..." /> : error ? <ErrorState message={error} /> : products.length ? (
          <>
            <p className="catalog-results-count">Mostrando {pageStart + 1}-{Math.min(pageStart + pageSize, products.length)} de {products.length} productos</p>
            <div className="products-grid catalog-products-grid">{visibleProducts.map((product) => <ProductCard key={product.id} product={product} />)}</div>
            <Pagination page={safePage} totalPages={totalPages} onPageChange={(nextPage) => setPage(Math.min(Math.max(1, nextPage), totalPages))} />
          </>
        ) : <EmptyState message="No hay productos que coincidan con la búsqueda." />}
      </div>
    </section>
  )
}
