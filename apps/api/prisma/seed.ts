import bcrypt from "bcryptjs";
import { prisma } from "../src/lib/prisma";

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
