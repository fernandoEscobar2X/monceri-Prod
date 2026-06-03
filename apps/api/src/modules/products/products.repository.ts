import type { ProductListQuery, ProductUpsertInput } from "@monceri/shared";
import { CONFIGURATOR_PRODUCT_SLUG } from "@monceri/shared";
import type { Prisma } from "@prisma/client";
import { prisma } from "../../lib/prisma";

const includeProductRelations = {
  category: true,
  images: { orderBy: { sortOrder: "asc" } },
  variants: { orderBy: { name: "asc" } },
} satisfies Prisma.ProductInclude;

function productOrderBy(sort: ProductListQuery["sort"]): Prisma.ProductOrderByWithRelationInput[] {
  if (sort === "price_asc") {
    return [{ basePrice: "asc" }, { createdAt: "desc" }];
  }

  if (sort === "price_desc") {
    return [{ basePrice: "desc" }, { createdAt: "desc" }];
  }

  if (sort === "newest") {
    return [{ createdAt: "desc" }];
  }

  return [{ featured: "desc" }, { createdAt: "desc" }];
}

function productWhere(query: ProductListQuery, publicOnly: boolean): Prisma.ProductWhereInput {
  return {
    active: publicOnly ? true : query.active,
    featured: query.featured,
    slug: publicOnly ? { not: CONFIGURATOR_PRODUCT_SLUG } : undefined,
    category: query.category ? { slug: query.category } : undefined,
    basePrice: {
      gte: query.minPrice,
      lte: query.maxPrice,
    },
    OR: query.search
      ? [
          { name: { contains: query.search, mode: "insensitive" } },
          { description: { contains: query.search, mode: "insensitive" } },
        ]
      : undefined,
  };
}

function productData(input: ProductUpsertInput) {
  const { images, variants, ...product } = input;

  return {
    ...product,
    images: {
      create: images.map((image) => ({
        alt: image.alt,
        sortOrder: image.sortOrder,
        thumbnailUrl: image.thumbnailUrl,
        url: image.url,
      })),
    },
    variants: {
      create: variants.map((variant) => ({
        active: variant.active,
        name: variant.name,
        priceAdjust: variant.priceAdjust,
        stock: variant.stock,
        value: variant.value,
      })),
    },
  };
}

export const productsRepository = {
  async listPublic(query: ProductListQuery) {
    const where = productWhere(query, true);
    const [items, total] = await prisma.$transaction([
      prisma.product.findMany({
        include: includeProductRelations,
        orderBy: productOrderBy(query.sort),
        skip: (query.page - 1) * query.pageSize,
        take: query.pageSize,
        where,
      }),
      prisma.product.count({ where }),
    ]);

    return {
      items,
      page: query.page,
      pageSize: query.pageSize,
      total,
      totalPages: Math.ceil(total / query.pageSize),
    };
  },

  async listAdmin(query: ProductListQuery) {
    const where = productWhere(query, false);
    const [items, total] = await prisma.$transaction([
      prisma.product.findMany({
        include: includeProductRelations,
        orderBy: productOrderBy(query.sort),
        skip: (query.page - 1) * query.pageSize,
        take: query.pageSize,
        where,
      }),
      prisma.product.count({ where }),
    ]);

    return {
      items,
      page: query.page,
      pageSize: query.pageSize,
      total,
      totalPages: Math.ceil(total / query.pageSize),
    };
  },

  listFeatured(limit: number) {
    return prisma.product.findMany({
      include: includeProductRelations,
      orderBy: [{ createdAt: "desc" }],
      take: limit,
      where: {
        active: true,
        featured: true,
        slug: { not: CONFIGURATOR_PRODUCT_SLUG },
      },
    });
  },

  findAdminById(id: string) {
    return prisma.product.findUnique({
      include: includeProductRelations,
      where: { id },
    });
  },

  findPublicBySlug(slug: string) {
    return prisma.product.findFirst({
      include: includeProductRelations,
      where: { slug, active: true },
    });
  },

  findBySlug(slug: string) {
    return prisma.product.findUnique({
      include: includeProductRelations,
      where: { slug },
    });
  },

  findById(id: string) {
    return prisma.product.findUnique({
      include: includeProductRelations,
      where: { id },
    });
  },

  create(input: ProductUpsertInput) {
    return prisma.product.create({
      data: productData(input),
      include: includeProductRelations,
    });
  },

  update(id: string, input: Partial<ProductUpsertInput>) {
    const { images, variants, ...product } = input;

    return prisma.product.update({
      data: {
        ...product,
        images: images
          ? {
              deleteMany: {},
              create: images.map((image) => ({
                alt: image.alt,
                sortOrder: image.sortOrder,
                thumbnailUrl: image.thumbnailUrl,
                url: image.url,
              })),
            }
          : undefined,
        variants: variants
          ? {
              deleteMany: {},
              create: variants.map((variant) => ({
                active: variant.active,
                name: variant.name,
                priceAdjust: variant.priceAdjust,
                stock: variant.stock,
                value: variant.value,
              })),
            }
          : undefined,
      },
      include: includeProductRelations,
      where: { id },
    });
  },

  delete(id: string) {
    return prisma.product.update({
      data: { active: false },
      where: { id },
    });
  },
};
