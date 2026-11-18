import { useEffect, useState } from "react"
import { AlertTriangle, Boxes, Shapes, Tags, PackageSearch } from "lucide-react"
import { Link } from "react-router-dom"
import toast from "react-hot-toast"
import * as productService from "../../services/product.service"
import * as categoryService from "../../services/category.service"
import * as subCategoryService from "../../services/subCategory.service"
import { formatPrice, getErrorMessage } from "../../utils/catalog"

export default function AdminDashboard() {
  const [data, setData] = useState({ products: [], productTotal: 0, categories: [], subCategories: [] })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const load = async () => {
    setLoading(true)
    setError("")
    try {
      const [productResult, categories, subCategories] = await Promise.all([
        productService.getProducts({ limit: 100 }),
        categoryService.getCategories(),
        subCategoryService.getSubCategories()
      ])
      setData({ products: productResult.products, productTotal: productResult.pagination.total, categories, subCategories })
    } catch (requestError) {
      const message = getErrorMessage(requestError)
      setError(message)
      toast.error(message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const lowStock = data.products.filter((product) => Number(product.stock) > 0 && Number(product.stock) <= 5)
  const outOfStock = data.products.filter((product) => Number(product.stock) === 0)

  return (
    <>
      <div className="admin-page-heading"><div><span className="admin-eyebrow">Resumen general</span><h1>Dashboard</h1><p>Información real obtenida del catálogo.</p></div><button className="admin-button admin-button-secondary" type="button" onClick={load} disabled={loading}>Actualizar</button></div>
      {error && <div className="admin-alert admin-alert-error">{error}</div>}
      {loading ? <div className="admin-loading">Cargando información administrativa...</div> : (
        <>
          <div className="admin-stats">
            <div className="admin-stat"><span className="admin-stat-icon orange"><Boxes /></span><div><small>Productos</small><strong>{data.productTotal}</strong></div></div>
            <div className="admin-stat"><span className="admin-stat-icon green"><Tags /></span><div><small>Categorías</small><strong>{data.categories.length}</strong></div></div>
            <div className="admin-stat"><span className="admin-stat-icon coral"><Shapes /></span><div><small>Subcategorías</small><strong>{data.subCategories.length}</strong></div></div>
            <div className="admin-stat"><span className="admin-stat-icon dark"><PackageSearch /></span><div><small>Agotados</small><strong>{outOfStock.length}</strong></div></div>
          </div>
          <div className="admin-dashboard-grid">
            <section className="admin-panel">
              <div className="admin-panel-heading"><div><span className="admin-eyebrow">Inventario visual</span><h2>Existencias bajas</h2></div><Link to="/admin/inventario" className="admin-text-link">Ver inventario</Link></div>
              {lowStock.length === 0 ? <div className="admin-empty-small">No hay productos con existencias entre 1 y 5 unidades.</div> : (
                <div className="admin-low-list">
                  {lowStock.slice(0, 8).map((product) => <div className="admin-low-row" key={product._id}><span className="admin-low-icon"><AlertTriangle size={17} /></span><div><strong>{product.name}</strong><small>{formatPrice(product.price)}</small></div><span className="admin-stock-badge low">{product.stock} unidades</span></div>)}
                </div>
              )}
              <p className="admin-data-note">La clasificación visual usa un umbral de 5 unidades y no modifica las existencias reales.</p>
            </section>
            <section className="admin-panel">
              <div className="admin-panel-heading"><div><span className="admin-eyebrow">Accesos rápidos</span><h2>Administrar</h2></div></div>
              <div className="admin-shortcuts">
                <Link to="/admin/productos"><Boxes /><span><strong>Productos</strong><small>Crear, editar y eliminar</small></span></Link>
                <Link to="/admin/categorias"><Tags /><span><strong>Categorías</strong><small>Organizar el catálogo</small></span></Link>
                <Link to="/admin/subcategorias"><Shapes /><span><strong>Subcategorías</strong><small>Relacionarlas con categorías</small></span></Link>
              </div>
            </section>
          </div>
        </>
      )}
    </>
  )
}
