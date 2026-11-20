export default function Pagination({ page, totalPages, onPageChange }) {
  if (totalPages <= 1) return null

  const pages = Array.from({ length: totalPages }, (_, index) => index + 1)

  return (
    <nav className="catalog-pagination" aria-label="Paginación del catálogo">
      <button type="button" onClick={() => onPageChange(page - 1)} disabled={page <= 1}>
        Anterior
      </button>
      {pages.map((pageNumber) => (
        <button
          type="button"
          key={pageNumber}
          className={pageNumber === page ? "active" : ""}
          aria-current={pageNumber === page ? "page" : undefined}
          onClick={() => onPageChange(pageNumber)}
        >
          {pageNumber}
        </button>
      ))}
      <button type="button" onClick={() => onPageChange(page + 1)} disabled={page >= totalPages}>
        Siguiente
      </button>
    </nav>
  )
}
