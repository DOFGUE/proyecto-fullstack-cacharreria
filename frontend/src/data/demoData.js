export const demoCategories = [
  { id: "cocina", name: "Cocina y mesa", image: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=700&q=80" },
  { id: "aseo", name: "Aseo y limpieza", image: "https://images.unsplash.com/photo-1583947215259-38e31be8751f?auto=format&fit=crop&w=700&q=80" },
  { id: "organizacion", name: "Organización", image: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=700&q=80" },
  { id: "papeleria", name: "Papelería", image: "https://images.unsplash.com/photo-1456735190827-d1262f71b8a3?auto=format&fit=crop&w=700&q=80" }
]

export const demoProducts = [
  { id: "recipientes", name: "Set de recipientes herméticos", category: "Cocina y mesa", categoryId: "cocina", price: 22000, oldPrice: 28000, tag: "Oferta", description: "Tres recipientes prácticos para conservar y organizar tus alimentos.", stock: 15, image: "https://images.unsplash.com/photo-1589365278144-c9e705f843ba?auto=format&fit=crop&w=700&q=80" },
  { id: "canasto", name: "Canasto multiusos tejido", category: "Organización", categoryId: "organizacion", price: 18000, tag: "Favorito", description: "Una solución liviana y bonita para organizar diferentes espacios.", stock: 8, image: "https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&w=700&q=80" },
  { id: "panos", name: "Kit de paños de microfibra", category: "Aseo y limpieza", categoryId: "aseo", price: 9000, oldPrice: 12000, tag: "Oferta", description: "Paños reutilizables para limpiar superficies del hogar.", stock: 22, image: "https://images.unsplash.com/photo-1583947581924-a6d7f0f3f5b5?auto=format&fit=crop&w=700&q=80" },
  { id: "cuaderno", name: "Cuaderno creativo", category: "Papelería", categoryId: "papeleria", price: 14000, tag: "Nuevo", description: "Cuaderno versátil para notas, ideas y proyectos personales.", stock: 12, image: "https://images.unsplash.com/photo-1531346878377-a5be20888e57?auto=format&fit=crop&w=700&q=80" }
]

export const formatPrice = (value) => new Intl.NumberFormat("es-CO", {
  style: "currency",
  currency: "COP",
  maximumFractionDigits: 0
}).format(value)
