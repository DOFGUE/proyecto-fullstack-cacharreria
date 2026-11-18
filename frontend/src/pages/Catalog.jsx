import { useSearchParams } from "react-router-dom"
import PageLayout from "../components/layout/PageLayout"
import PageHeader from "../components/common/PageHeader"
import ProductListing from "../components/products/ProductListing"

export default function Catalog() {
  const [params] = useSearchParams()
  return <PageLayout><PageHeader title="Catálogo" description="Encuentra productos prácticos para todos los espacios de tu hogar." /><ProductListing initialSearch={params.get("search") || ""} /></PageLayout>
}
