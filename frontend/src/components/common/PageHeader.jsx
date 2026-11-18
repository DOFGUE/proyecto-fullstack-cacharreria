export default function PageHeader({ eyebrow = "Casa Bonita", title, description, children }) {
  return (
    <div className="page-header">
      <div className="container">
        <span className="eyebrow">{eyebrow}</span>
        <h1>{title}</h1>
        {description && <p>{description}</p>}
        {children}
      </div>
    </div>
  )
}
