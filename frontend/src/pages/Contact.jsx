import { Mail, MapPin, Phone } from "lucide-react"
import PageLayout from "../components/layout/PageLayout"
import PageHeader from "../components/common/PageHeader"
import "./AuthForm.css"

export default function Contact() {
  return (
    <PageLayout>
      <PageHeader eyebrow="Estamos cerca" title="Contacto" description="Información básica y formulario demostrativo de atención." />
      <section className="section auth-section">
        <div className="container contact-layout">
          <div className="contact-details">
            <span className="eyebrow">Información demostrativa</span>
            <h2>Conversemos</h2>
            <p>Estos datos son una referencia visual mientras se configura la información comercial real.</p>
            <div className="contact-detail-row"><MapPin size={19} /><div><strong>Ubicación</strong><span>Por confirmar</span></div></div>
            <div className="contact-detail-row"><Phone size={19} /><div><strong>Teléfono</strong><span>+57 000 000 0000</span></div></div>
            <div className="contact-detail-row"><Mail size={19} /><div><strong>Correo</strong><span>contacto@ejemplo.com</span></div></div>
          </div>
          <form className="auth-card contact-form" onSubmit={(event) => event.preventDefault()}>
            <span className="eyebrow">Formulario demostrativo</span>
            <h2>Escríbenos</h2>
            <div className="form-grid">
              <div className="form-field"><label htmlFor="contact-name">Nombre</label><input id="contact-name" type="text" placeholder="Tu nombre" /></div>
              <div className="form-field"><label htmlFor="contact-email">Correo</label><input id="contact-email" type="email" placeholder="correo@ejemplo.com" /></div>
            </div>
            <div className="form-field"><label htmlFor="contact-message">Mensaje</label><textarea id="contact-message" rows="5" placeholder="¿En qué podemos ayudarte?" /></div>
            <button className="button button-primary" type="submit" disabled>Envío no disponible</button>
          </form>
        </div>
      </section>
    </PageLayout>
  )
}
