import mongoose from "mongoose"
import fs from "node:fs/promises"
import path from "node:path"
import { fileURLToPath } from "node:url"
import Category from "../src/models/category.model.js"
import SubCategory from "../src/models/subCategory.model.js"
import Item from "../src/models/item.model.js"
import { MONGO_URI } from "../src/config.js"

// Precios de referencia en pesos colombianos (COP), editables para ajustarlos al inventario real.
const catalog = [
  {
    name: "Cocina y mesa",
    description: "Utensilios y artículos para preparar y servir alimentos.",
    subcategories: [
      {
        name: "Utensilios de cocina",
        description: "Herramientas manuales para cocinar y preparar alimentos.",
        products: [
          ["Espátula de silicona", "Espátula flexible resistente al calor para mezclar y servir preparaciones.", 8500, 24],
          ["Cucharón de acero inoxidable", "Cucharón metálico para servir sopas, caldos y salsas.", 12000, 18],
          ["Tabla para picar plástica", "Tabla lavable para cortar y preparar alimentos en la cocina.", 14000, 20]
        ]
      },
      {
        name: "Recipientes de cocina",
        description: "Recipientes y elementos para guardar o transportar alimentos.",
        products: [
          ["Juego de recipientes herméticos x3", "Tres recipientes plásticos con tapa para conservar alimentos.", 22000, 15],
          ["Frasco de vidrio con tapa", "Frasco reutilizable para almacenar granos, especias o conservas.", 16000, 12],
          ["Botella plástica reutilizable 1 L", "Botella liviana con tapa para transportar bebidas.", 11000, 25]
        ]
      },
      {
        name: "Vajilla y mesa",
        description: "Artículos básicos para servir y consumir alimentos.",
        products: [
          ["Plato tendido plástico", "Plato reutilizable para servir comidas.", 6500, 30],
          ["Vaso plástico reutilizable x6", "Paquete de seis vasos para bebidas frías o calientes.", 12000, 20],
          ["Jarra plástica con tapa 2 L", "Jarra con tapa y asa para servir bebidas.", 15000, 14]
        ]
      }
    ]
  },
  {
    name: "Aseo y limpieza",
    description: "Productos e implementos para la limpieza del hogar.",
    subcategories: [
      {
        name: "Escobas y cepillos",
        description: "Elementos manuales para barrer y cepillar superficies.",
        products: [
          ["Escoba de cerdas suaves", "Escoba para barrer pisos interiores y superficies lisas.", 18000, 16],
          ["Escoba de cerdas duras", "Escoba resistente para patios y pisos de exterior.", 20000, 13],
          ["Cepillo de mano para lavar", "Cepillo compacto para limpiar ropa, pisos y superficies.", 7500, 22]
        ]
      },
      {
        name: "Traperos y limpieza de pisos",
        description: "Accesorios para lavar, secar y mantener los pisos.",
        products: [
          ["Trapero de microfibra", "Cabezal absorbente para limpiar diferentes tipos de piso.", 14000, 18],
          ["Mango para trapero", "Mango liviano de repuesto para cabezales de trapero compatibles.", 10000, 15],
          ["Balde plástico 12 L", "Balde multiuso con asa para labores de limpieza del hogar.", 17000, 12]
        ]
      },
      {
        name: "Esponjas y paños",
        description: "Paños y esponjas para lavar y limpiar superficies.",
        products: [
          ["Esponja lavaplatos x3", "Paquete de tres esponjas para lavar utensilios de cocina.", 5000, 35],
          ["Paño de microfibra", "Paño reutilizable para limpiar superficies y retirar polvo.", 7000, 28],
          ["Guantes de aseo", "Guantes reutilizables para proteger las manos durante la limpieza.", 9000, 20]
        ]
      }
    ]
  },
  {
    name: "Plásticos y organización",
    description: "Artículos plásticos para almacenar, organizar y mantener el hogar.",
    subcategories: [
      {
        name: "Canecas y papeleras",
        description: "Recipientes para recolección de residuos y organización doméstica.",
        products: [
          ["Papelera plástica 10 L", "Papelera liviana para baño, oficina o habitación.", 14000, 12],
          ["Caneca plástica con tapa 20 L", "Caneca doméstica con tapa para almacenar residuos.", 32000, 8],
          ["Caneca plástica 35 L", "Recipiente de mayor capacidad para uso doméstico o comercial.", 48000, 6]
        ]
      },
      {
        name: "Cajas y organizadores",
        description: "Soluciones de almacenamiento para diferentes espacios del hogar.",
        products: [
          ["Caja organizadora 5 L", "Caja plástica compacta para guardar accesorios y objetos pequeños.", 12000, 14],
          ["Caja organizadora 15 L", "Caja plástica con tapa para organizar objetos del hogar.", 24000, 10],
          ["Canasta plástica multiuso", "Canasta ventilada para organizar ropa, juguetes u otros objetos.", 18000, 16]
        ]
      },
      {
        name: "Ganchos y lavandería",
        description: "Accesorios para colgar, secar y organizar prendas.",
        products: [
          ["Ganchos plásticos para ropa x6", "Paquete de seis ganchos para organizar prendas en el clóset.", 9000, 25],
          ["Pinzas para ropa x24", "Paquete de pinzas reutilizables para tendederos.", 7000, 30],
          ["Canasto para ropa", "Canasto liviano para recolectar y transportar prendas.", 26000, 9]
        ]
      }
    ]
  },
  {
    name: "Ferretería y herramientas",
    description: "Herramientas y suministros básicos para reparaciones domésticas.",
    subcategories: [
      {
        name: "Herramientas manuales",
        description: "Herramientas de uso manual para mantenimiento y reparación.",
        products: [
          ["Martillo de uña 16 oz", "Martillo de uso general para clavar y retirar puntillas.", 28000, 8],
          ["Destornillador plano mediano", "Destornillador manual para tornillos de cabeza plana.", 10000, 14],
          ["Destornillador de estrella mediano", "Destornillador manual para tornillos de cabeza Phillips.", 10000, 14]
        ]
      },
      {
        name: "Tornillos y fijaciones",
        description: "Elementos de fijación para reparaciones y proyectos domésticos.",
        products: [
          ["Caja de puntillas surtidas", "Surtido de puntillas para trabajos generales de carpintería.", 12000, 12],
          ["Tornillos para madera surtidos", "Paquete de tornillos de varios tamaños para madera.", 14000, 10],
          ["Cinta aislante eléctrica", "Cinta para aislamiento y protección de empalmes eléctricos.", 6500, 24]
        ]
      },
      {
        name: "Plomería básica",
        description: "Repuestos y accesorios comunes para instalaciones de agua domésticas.",
        products: [
          ["Cinta de teflón", "Cinta selladora para roscas en conexiones de plomería.", 3500, 30],
          ["Manguera flexible para lavaplatos", "Manguera flexible de conexión para instalaciones domésticas compatibles.", 18000, 8],
          ["Sifón flexible para lavamanos", "Sifón flexible para desagüe de lavamanos, verificar medidas antes de instalar.", 22000, 7]
        ]
      }
    ]
  },
  {
    name: "Eléctricos e iluminación",
    description: "Accesorios eléctricos e iluminación para el hogar.",
    subcategories: [
      {
        name: "Bombillos y lámparas",
        description: "Fuentes de iluminación para espacios domésticos.",
        products: [
          ["Bombillo LED 9 W luz blanca", "Bombillo LED de bajo consumo con luz blanca para portalámparas compatible.", 9000, 20],
          ["Bombillo LED 12 W luz cálida", "Bombillo LED de luz cálida para iluminación interior.", 12000, 16],
          ["Linterna LED recargable", "Linterna portátil recargable para iluminación de emergencia.", 28000, 8]
        ]
      },
      {
        name: "Extensiones y adaptadores",
        description: "Accesorios para conectar aparatos eléctricos de uso doméstico.",
        products: [
          ["Extensión eléctrica 3 m", "Extensión para uso doméstico; verificar capacidad eléctrica del equipo conectado.", 26000, 10],
          ["Multitoma de 3 puestos", "Multitoma doméstica para conectar varios aparatos compatibles.", 18000, 12],
          ["Adaptador de enchufe sencillo", "Adaptador para conexiones domésticas compatibles.", 7000, 18]
        ]
      },
      {
        name: "Pilas y baterías",
        description: "Pilas para controles, juguetes y dispositivos de uso cotidiano.",
        products: [
          ["Pilas alcalinas AA x2", "Paquete de dos pilas alcalinas tamaño AA.", 9000, 25],
          ["Pilas alcalinas AAA x2", "Paquete de dos pilas alcalinas tamaño AAA.", 9000, 25],
          ["Pila botón CR2032", "Pila tipo botón para dispositivos compatibles; revisar referencia del equipo.", 6000, 15]
        ]
      }
    ]
  },
  {
    name: "Baño y hogar",
    description: "Accesorios funcionales para el baño y otras áreas de la vivienda.",
    subcategories: [
      {
        name: "Accesorios para baño",
        description: "Artículos básicos para organización y uso del baño.",
        products: [
          ["Cortina para baño", "Cortina impermeable para ducha, compatible con barras estándar.", 24000, 8],
          ["Portacepillos plástico", "Organizador plástico para cepillos dentales.", 8000, 16],
          ["Dispensador de jabón", "Dispensador recargable para jabón líquido.", 12000, 12]
        ]
      },
      {
        name: "Tendidos y secado",
        description: "Artículos para tender y secar ropa en casa.",
        products: [
          ["Tendedero plegable pequeño", "Tendedero doméstico plegable para secar prendas.", 58000, 5],
          ["Cuerda para tendedero 10 m", "Cuerda multiuso de diez metros para tendido de ropa.", 10000, 14],
          ["Perchero plástico para puerta", "Perchero liviano para colgar prendas y accesorios.", 15000, 10]
        ]
      },
      {
        name: "Textiles para el hogar",
        description: "Textiles de uso cotidiano para diferentes espacios de la vivienda.",
        products: [
          ["Toalla de manos", "Toalla absorbente de tamaño práctico para uso diario.", 18000, 10],
          ["Tapete antideslizante para baño", "Tapete para baño con base antideslizante; mantener seco el piso.", 22000, 8],
          ["Paño de cocina", "Paño reutilizable para secar utensilios y limpiar superficies de cocina.", 8000, 20]
        ]
      }
    ]
  },
  {
    name: "Papelería y miscelánea",
    description: "Útiles escolares, de oficina y artículos pequeños de uso cotidiano.",
    subcategories: [
      {
        name: "Útiles escolares y oficina",
        description: "Elementos básicos para escritura, estudio y oficina.",
        products: [
          ["Cuaderno cuadriculado 100 hojas", "Cuaderno de cien hojas cuadriculadas para estudio o trabajo.", 9000, 20],
          ["Esfero de tinta negra", "Esfero de tinta negra para escritura cotidiana.", 2500, 40],
          ["Tijeras escolares", "Tijeras para manualidades y cortes de papel de uso escolar.", 7000, 15]
        ]
      },
      {
        name: "Adhesivos y cintas",
        description: "Adhesivos y cintas para trabajos manuales y reparaciones sencillas.",
        products: [
          ["Pegante en barra", "Adhesivo en barra para papel y cartulina.", 5000, 18],
          ["Cinta transparente 18 mm", "Cinta adhesiva transparente para envolver y fijar papel.", 4000, 22],
          ["Silicona líquida 100 ml", "Adhesivo líquido para manualidades y materiales compatibles.", 8500, 12]
        ]
      },
      {
        name: "Costura y manualidades",
        description: "Suministros sencillos para costura y proyectos manuales.",
        products: [
          ["Kit de agujas para coser", "Juego de agujas manuales surtidas para costura doméstica.", 5000, 15],
          ["Hilo de coser surtido x6", "Paquete de seis carretes de hilo en colores variados.", 12000, 10],
          ["Cinta métrica flexible 150 cm", "Cinta métrica flexible para costura y mediciones domésticas.", 6500, 14]
        ]
      }
    ]
  }
]

const imageDirectory = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../imagenes de proyecto 2")
const imageAliases = {
  "Espátula de silicona": "Espátula miserable de plástico blanco 25 y 40 cm - Espatula Miserable 16 41 cm.jpg",
  "Cucharón de acero inoxidable": "Cucharon Acero Inoxidable 15ml - LDI-0 - Winco (Caja 6 piezas).jpg",
  "Tabla para picar plástica": "Tabla para picar ideal para pescados y mariscos uso reversible.jpg",
  "Juego de recipientes herméticos x3": "GENERICO Set 3 Tupper HermÃ©tico Vidrio 640ml Transparente _ Falabella Chile.jpg",
  "Frasco de vidrio con tapa": "(2) Mayorista 40 Frascos Amanecer 360 Cc Con Tapa Oferta - $ 1_200,00 en Mercado Libre.jpg",
  "Botella plástica reutilizable 1 L": "Botella de Plástico 1L - Rojo.jpg",
  "Plato tendido plástico": "LEOBOX Plastic Plates Mineral Filled PP 9 Inch - 150 Pack Shrink Wrap BPA Free Dinner Trays _ Dishwasher Freezer & Microwave Safe _ Reusable &.jpg",
  "Vaso plástico reutilizable x6": "plastic cup.jpg",
  "Jarra plástica con tapa 2 L": "Jarra Plástica 2 Litros Tampa Água Suco Chá Geladeira Mesa Cozinha Jarra Grande.jpg",
  "Escoba de cerdas suaves": "descarga.jpg",
  "Escoba de cerdas duras": "Escoba de cerdas duras.jpg",
  "Caja organizadora 15 L": "Caja organizadora 15 litros.jpg",
  "Canasta plástica multiuso": "Cesta multiusos mediana.jpg",
  "Martillo de uña 16 oz": "Martillo de uña curva 16oz.jpg"
}

const normalizeImageName = (value) => value
  .replace(/\.[^.]+$/, "")
  .normalize("NFD")
  .replace(/[\u0300-\u036f]/g, "")
  .toLowerCase()
  .replace(/[^a-z0-9]+/g, " ")
  .trim()

const loadCatalogImages = async () => {
  const files = await fs.readdir(imageDirectory)
  const imageFiles = new Map(files.map((file) => [
    normalizeImageName(path.parse(file).name),
    file
  ]))
  const images = new Map()
  const missing = []

  for (const category of catalog) {
    for (const subcategory of category.subcategories) {
      for (const [name] of subcategory.products) {
        const imageName = imageAliases[name] ?? name
        const file = imageFiles.get(normalizeImageName(imageName))
        if (!file) {
          missing.push(name)
          continue
        }

        const imageBuffer = await fs.readFile(path.join(imageDirectory, file))
        const image = `data:image/jpeg;base64,${imageBuffer.toString("base64")}`
        if (image.length > 2_000_000) {
          throw new Error(`La imagen de ${name} supera el límite de 2 MB aceptado por la API.`)
        }
        images.set(name, image)
      }
    }
  }

  return { images, missing }
}

const seedCatalog = async () => {
  const { images, missing } = await loadCatalogImages()
  await mongoose.connect(MONGO_URI)

  let categoryCount = 0
  let subCategoryCount = 0
  let productCount = 0

  for (const categoryData of catalog) {
    const category = await Category.findOneAndUpdate(
      { name: categoryData.name },
      { $set: { description: categoryData.description } },
      { returnDocument: "after", upsert: true, setDefaultsOnInsert: true }
    )
    categoryCount += 1

    for (const subCategoryData of categoryData.subcategories) {
      const subCategory = await SubCategory.findOneAndUpdate(
        { category: category._id, name: subCategoryData.name },
        { $set: { description: subCategoryData.description } },
        { returnDocument: "after", upsert: true, setDefaultsOnInsert: true }
      )
      subCategoryCount += 1

      for (const [name, description, price, stock] of subCategoryData.products) {
        await Item.findOneAndUpdate(
          { subCategory: subCategory._id, name },
          {
            $set: {
              description,
              price,
              stock,
              ...(images.has(name) ? { image: images.get(name) } : {})
            }
          },
          { returnDocument: "after", upsert: true, setDefaultsOnInsert: true, runValidators: true }
        )
        productCount += 1
      }
    }
  }

  console.log(`Catálogo cargado: ${categoryCount} categorías, ${subCategoryCount} subcategorías y ${productCount} productos.`)
  console.log(`Imágenes vinculadas: ${images.size}/${productCount}.`)
  if (missing.length) {
    console.warn(`Productos sin imagen encontrada (${missing.length}): ${missing.join(", ")}`)
  }

  const storedCounts = {
    categories: await Category.countDocuments(),
    subcategories: await SubCategory.countDocuments(),
    products: await Item.countDocuments(),
    productsMissingRequiredData: await Item.countDocuments({
      $or: [
        { description: { $exists: false } },
        { price: { $exists: false } },
        { stock: { $exists: false } },
        { subCategory: { $exists: false } }
      ]
    }),
    productsWithImage: await Item.countDocuments({ image: { $nin: ["", null] } })
  }
  console.log("Verificación de la base:", JSON.stringify(storedCounts))
}

try {
  await seedCatalog()
} catch (error) {
  console.error("No se pudo cargar el catálogo:", error.message)
  process.exitCode = 1
} finally {
  await mongoose.disconnect()
}
