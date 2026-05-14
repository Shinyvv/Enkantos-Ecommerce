import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

const categories = [
  { nombre: "Vestidos", slug: "vestidos" },
  { nombre: "Conjuntos", slug: "conjuntos" },
  { nombre: "Jeans", slug: "jeans" },
  { nombre: "Tops", slug: "tops" },
  { nombre: "Blazers", slug: "blazers" }
]

const products = [
  {
    nombre: "Vestido Noche Rebel",
    slug: "vestido-noche-rebel",
    descripcion:
      "Vestido negro ajustado con brillo sutil para una salida impactante.",
    precio: 32990,
    categoria: "Vestidos",
    imagenes: [
      "https://images.unsplash.com/photo-1483985988355-763728e1935b",
      "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f",
      "https://images.unsplash.com/photo-1464863979621-258859e62245"
    ],
    tallas: ["S", "M", "L"],
    disponible: true,
    visible: true,
    destacado: true
  },
  {
    nombre: "Set Urbano Goldline",
    slug: "set-urbano-goldline",
    descripcion: "Set de dos piezas con fit comodo y look viral de feed.",
    precio: 38990,
    categoria: "Conjuntos",
    imagenes: [
      "https://images.unsplash.com/photo-1529139574466-a303027c1d8b",
      "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f",
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f"
    ],
    tallas: ["M", "L", "XL"],
    disponible: true,
    visible: true,
    destacado: true
  },
  {
    nombre: "Jean Push-Up Skyline",
    slug: "jean-push-up-skyline",
    descripcion: "Jean high waist con stretch premium y silueta marcada.",
    precio: 27990,
    categoria: "Jeans",
    imagenes: [
      "https://images.unsplash.com/photo-1541099649105-f69ad21f3246",
      "https://images.unsplash.com/photo-1445205170230-053b83016050",
      "https://images.unsplash.com/photo-1434389677669-e08b4cac3105"
    ],
    tallas: ["36", "38", "40", "42"],
    disponible: true,
    visible: true,
    destacado: false
  },
  {
    nombre: "Top Satin Lux",
    slug: "top-satin-lux",
    descripcion: "Top satinado con caida ligera y detalle dorado minimal.",
    precio: 19990,
    categoria: "Tops",
    imagenes: [
      "https://images.unsplash.com/photo-1503342394128-c104d54dba01",
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab",
      "https://images.unsplash.com/photo-1485230895905-ec40ba36b9bc"
    ],
    tallas: ["S", "M", "L"],
    disponible: true,
    visible: true,
    destacado: false
  },
  {
    nombre: "Blazer Midnight City",
    slug: "blazer-midnight-city",
    descripcion: "Blazer estructurado para elevar outfits casuales y de noche.",
    precio: 42990,
    categoria: "Blazers",
    imagenes: [
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1",
      "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446",
      "https://images.unsplash.com/photo-1504593811423-6dd665756598"
    ],
    tallas: ["M", "L", "XL"],
    disponible: true,
    visible: true,
    destacado: true
  },
  {
    nombre: "Vestido Street Spark",
    slug: "vestido-street-spark",
    descripcion: "Vestido corto con actitud urbana y ajuste comodo.",
    precio: 30990,
    categoria: "Vestidos",
    imagenes: [
      "https://images.unsplash.com/photo-1502716119720-b23a93e5fe1b",
      "https://images.unsplash.com/photo-1485968579580-b6d095142e6e",
      "https://images.unsplash.com/photo-1492707892479-7bc8d5a4ee93"
    ],
    tallas: ["S", "M"],
    disponible: false,
    visible: true,
    destacado: false
  }
]

async function main() {
  const categoryMap = new Map()

  for (const category of categories) {
    const result = await prisma.category.upsert({
      where: { slug: category.slug },
      update: { nombre: category.nombre },
      create: category
    })

    categoryMap.set(category.nombre, result.id)
  }

  await prisma.product.deleteMany()

  await prisma.product.createMany({
    data: products.map((product) => ({
      ...product,
      categoryId: categoryMap.get(product.categoria) ?? null
    }))
  })
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (error) => {
    console.error(error)
    await prisma.$disconnect()
    process.exit(1)
  })
