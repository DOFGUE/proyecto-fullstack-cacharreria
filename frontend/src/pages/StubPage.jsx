import { Link } from "react-router-dom"
import PageLayout from "../components/layout/PageLayout"
import PageHeader from "../components/common/PageHeader"
export default function StubPage({ title, description, action = "Volver al inicio", to = "/" }) { return <PageLayout><PageHeader title={title} description={description} /><section className="section"><div className="container"><div className="placeholder"><strong>{title}</strong><p>{description}</p><Link className="button button-primary" to={to}>{action}</Link></div></div></section></PageLayout> }
