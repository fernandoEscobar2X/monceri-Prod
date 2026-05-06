import bcrypt from "bcryptjs";
import { prisma } from "../src/lib/prisma";

type DemoProductInput = {
  basePrice: number;
  categoryId: string;
  comparePrice?: number;
  description: string;
  imageUrl: string;
  name: string;
  slug: string;
  stock: number;
  variants: Array<{
    name: string;
    priceAdjust: number;
    stock?: number;
    value: string;
  }>;
};

async function upsertDemoProduct(input: DemoProductInput) {
  return prisma.product.upsert({
    create: {
      active: true,
      basePrice: input.basePrice,
      categoryId: input.categoryId,
      comparePrice: input.comparePrice,
      description: input.description,
      featured: true,
      images: {
        create: [
          {
            alt: input.name,
            sortOrder: 1,
            thumbnailUrl: input.imageUrl,
            url: input.imageUrl,
          },
        ],
      },
      lowStockAlert: 3,
      name: input.name,
      slug: input.slug,
      stock: input.stock,
      trackStock: true,
      variants: {
        create: input.variants.map((variant) => ({
          active: true,
          name: variant.name,
          priceAdjust: variant.priceAdjust,
          stock: variant.stock,
          value: variant.value,
        })),
      },
    },
    update: {
      active: true,
      basePrice: input.basePrice,
      categoryId: input.categoryId,
      comparePrice: input.comparePrice,
      description: input.description,
      featured: true,
      images: {
        deleteMany: {},
        create: [
          {
            alt: input.name,
            sortOrder: 1,
            thumbnailUrl: input.imageUrl,
            url: input.imageUrl,
          },
        ],
      },
      lowStockAlert: 3,
      name: input.name,
      stock: input.stock,
      trackStock: true,
      variants: {
        deleteMany: {},
        create: input.variants.map((variant) => ({
          active: true,
          name: variant.name,
          priceAdjust: variant.priceAdjust,
          stock: variant.stock,
          value: variant.value,
        })),
      },
    },
    where: { slug: input.slug },
  });
}

async function main() {
  const category = await prisma.category.upsert({
    create: {
      description: "Letreros personalizados de neon LED",
      name: "Neon LED",
      slug: "neon-led",
      sortOrder: 1,
    },
    update: {},
    where: { slug: "neon-led" },
  });

  const acrylicCategory = await prisma.category.upsert({
    create: {
      description: "Piezas en acrilico con volumen para marcas, eventos y espacios interiores",
      name: "Acrilico 3D",
      slug: "acrilico-3d",
      sortOrder: 2,
    },
    update: {
      active: true,
      description: "Piezas en acrilico con volumen para marcas, eventos y espacios interiores",
      name: "Acrilico 3D",
      sortOrder: 2,
    },
    where: { slug: "acrilico-3d" },
  });

  const laserCategory = await prisma.category.upsert({
    create: {
      description: "Corte laser en MDF y materiales decorativos para proyectos comerciales",
      name: "Corte Laser",
      slug: "corte-laser",
      sortOrder: 3,
    },
    update: {
      active: true,
      description: "Corte laser en MDF y materiales decorativos para proyectos comerciales",
      name: "Corte Laser",
      sortOrder: 3,
    },
    where: { slug: "corte-laser" },
  });

  await prisma.product.upsert({
    create: {
      active: true,
      basePrice: 1290,
      categoryId: category.id,
      description: "Letrero neon personalizado fabricado bajo pedido.",
      featured: true,
      images: {
        create: [{ alt: "Letrero neon Monceri", sortOrder: 1, url: "/monceri-hero-installation.jpg" }],
      },
      name: "Letrero Neon Personalizado",
      slug: "letrero-neon-personalizado",
      stock: 0,
      trackStock: false,
      variants: {
        create: [
          { name: "Tamano", value: "Mediano", priceAdjust: 0 },
          { name: "Tamano", value: "Grande", priceAdjust: 600 },
          { name: "Color", value: "Rojo", priceAdjust: 0 },
        ],
      },
    },
    update: {},
    where: { slug: "letrero-neon-personalizado" },
  });

  const demoProducts = await Promise.all([
    upsertDemoProduct({
      basePrice: 2100,
      categoryId: category.id,
      comparePrice: 2490,
      description:
        "Letrero neon LED para mostrador, punto fotografiable o muro principal de negocio.",
      imageUrl: "/monceri-hero-installation.jpg",
      name: "Letrero Neon Para Negocio",
      slug: "letrero-neon-para-negocio",
      stock: 8,
      variants: [
        { name: "Color", priceAdjust: 0, stock: 4, value: "Blanco calido" },
        { name: "Color", priceAdjust: 0, stock: 4, value: "Rojo Monceri" },
        { name: "Tamano", priceAdjust: 0, stock: 5, value: "85cm" },
        { name: "Tamano", priceAdjust: 450, stock: 3, value: "105cm" },
      ],
    }),
    upsertDemoProduct({
      basePrice: 1500,
      categoryId: category.id,
      description:
        "Frase LED decorativa lista para cafeterias, estudios creativos y corners comerciales.",
      imageUrl: "/monceri-coffee-installation.png",
      name: "Coffee Corner LED",
      slug: "coffee-corner-led",
      stock: 6,
      variants: [
        { name: "Color", priceAdjust: 0, stock: 3, value: "Blanco frio" },
        { name: "Color", priceAdjust: 120, stock: 3, value: "Rosa neon" },
        { name: "Montaje", priceAdjust: 0, value: "Interior" },
      ],
    }),
    upsertDemoProduct({
      basePrice: 2570,
      categoryId: acrylicCategory.id,
      comparePrice: 2890,
      description:
        "Logo en acrilico con volumen y acabado limpio para recepciones, stands y oficinas.",
      imageUrl: "/monceri-anatomy-detail.jpg",
      name: "Logo Acrilico 3D Premium",
      slug: "logo-acrilico-3d-premium",
      stock: 5,
      variants: [
        { name: "Acabado", priceAdjust: 0, stock: 3, value: "Negro brillante" },
        { name: "Acabado", priceAdjust: 180, stock: 2, value: "Dorado espejo" },
        { name: "Instalacion", priceAdjust: 0, value: "Cinta industrial" },
      ],
    }),
    upsertDemoProduct({
      basePrice: 980,
      categoryId: laserCategory.id,
      description:
        "Pieza decorativa de MDF cortada con laser para senaletica, eventos y displays.",
      imageUrl: "/monceri-hero-installation.jpg",
      name: "Display MDF Corte Laser",
      slug: "display-mdf-corte-laser",
      stock: 12,
      variants: [
        { name: "Material", priceAdjust: 0, stock: 6, value: "MDF natural" },
        { name: "Material", priceAdjust: 220, stock: 6, value: "MDF pintado" },
        { name: "Tamano", priceAdjust: 0, value: "Mediano" },
      ],
    }),
  ]);

  await prisma.collection.updateMany({
    data: { showInPopup: false },
    where: { showInPopup: true },
  });

  const summerCollection = await prisma.collection.upsert({
    create: {
      active: true,
      bannerImageThumbnailUrl: "/monceri-hero-installation.jpg",
      bannerImageUrl: "/monceri-hero-installation.jpg",
      ctaLabel: "Ver temporada",
      description:
        "Ideas luminosas para negocios, terrazas y eventos que necesitan una presencia visual memorable.",
      name: "Temporada Verano Monceri",
      popupImageThumbnailUrl: "/monceri-coffee-installation.png",
      popupImageUrl: "/monceri-coffee-installation.png",
      showInPopup: true,
      slug: "temporada-verano-monceri",
      sortOrder: 0,
      tagline: "Temporada de verano 2026",
    },
    update: {
      active: true,
      bannerImageThumbnailUrl: "/monceri-hero-installation.jpg",
      bannerImageUrl: "/monceri-hero-installation.jpg",
      ctaLabel: "Ver temporada",
      description:
        "Ideas luminosas para negocios, terrazas y eventos que necesitan una presencia visual memorable.",
      name: "Temporada Verano Monceri",
      popupImageThumbnailUrl: "/monceri-coffee-installation.png",
      popupImageUrl: "/monceri-coffee-installation.png",
      showInPopup: true,
      sortOrder: 0,
      tagline: "Temporada de verano 2026",
    },
    where: { slug: "temporada-verano-monceri" },
  });

  await prisma.productCollection.deleteMany({
    where: { collectionId: summerCollection.id },
  });

  await prisma.productCollection.createMany({
    data: demoProducts.map((product, index) => ({
      collectionId: summerCollection.id,
      productId: product.id,
      sortOrder: index,
    })),
    skipDuplicates: true,
  });

  await prisma.coupon.upsert({
    create: {
      active: true,
      code: "BIENVENIDA10",
      type: "PERCENTAGE",
      value: 10,
    },
    update: {},
    where: { code: "BIENVENIDA10" },
  });

  await prisma.adminUser.upsert({
    create: {
      email: "admin@monceri.local",
      name: "Admin Monceri",
      password: await bcrypt.hash("MonceriAdmin123", 12),
      role: "SUPERADMIN",
    },
    update: {},
    where: { email: "admin@monceri.local" },
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
