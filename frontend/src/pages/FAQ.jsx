import { Link } from "react-router-dom"
import PageLayout from "../components/layout/PageLayout"
import PageHeader from "../components/common/PageHeader"

const faqItems = [
  { question: "¿Cómo agrego productos al carrito?", answer: "Abre la vista rápida o el detalle del producto, selecciona la cantidad disponible y pulsa Agregar al carrito." },
  { question: "¿Cómo hago seguimiento de mi pedido?", answer: "Desde tu perfil puedes consultar Mis pedidos y abrir cada factura para ver su estado." },
  { question: "¿Cómo reconocen los estados de una compra?", answer: "Los estados disponibles son: en tienda, enviado y entregado." },
  { question: "¿Dónde configuro mis datos?", answer: "Puedes consultar y editar la información disponible desde Mi perfil." }
]

export default function FAQ() {
  return (
    <PageLayout>
      <PageHeader eyebrow="Ayuda" title="Preguntas frecuentes" description="Respuestas rápidas sobre la compra y navegación de la tienda." />
      <section className="section"><div className="container faq-list">
        {faqItems.map((item) => (
          <article className="faq-item" key={item.question}>
            <h2>{item.question}</h2>
            <p>{item.answer}</p>
          </article>
        ))}
        <div className="faq-actions"><Link className="button button-primary" to="/catalogo">Ir al catálogo</Link><Link className="button button-outline" to="/contacto">Ir a contacto</Link></div>
      </div></section>
    </PageLayout>
  )
}
