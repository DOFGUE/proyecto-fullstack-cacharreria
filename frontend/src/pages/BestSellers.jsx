import { Sparkles } from "lucide-react"
import PageLayout from "../components/layout/PageLayout"
import PageHeader from "../components/common/PageHeader"
export default function BestSellers() { return <PageLayout><PageHeader title="Más vendidos" description="Los productos más solicitados aparecerán aquí cuando haya datos de ventas disponibles." /><section className="section"><div className="container"><div className="placeholder"><Sparkles /><strong>Próximamente</strong><p>Aún no hay información real de ventas. Mostraremos esta sección únicamente cuando existan datos verificables.</p></div></div></section></PageLayout> }
