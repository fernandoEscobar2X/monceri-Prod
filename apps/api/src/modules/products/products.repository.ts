import type { ProductListQuery, ProductUpsertInput } from "@monceri/shared";
import type { Prisma } from "@prisma/client";
import { prisma } from "../../lib/prisma";

const includeProductRelations = {
  category: true,
  images: { orderBy: { sortOrder: "asc" } },
  variants: { orderBy: { name: "asc" } },
} satisfies Prisma.ProductInclude;

export const productsRepository = {
  listPublic(query: ProductListQuery) {
    return prisma.product.findMany({
      include: includeProductRelations,
      orderBy: [{ featured: "desc" }, { createdAt: "desc" }],
      where: {
        active: true,
        featured: query.featured,
        category: query.category ? { slug: query.category } : undefined,
        OR: query.search
          ? [
              { name: { contains: query.search, mode: "insensitive" } },
              { description: { contains: query.search, mode: "insensitive" } },
            ]
          : undefined,
      },
    });
  },

  listAdmin(query: ProductListQuery) {
    return prisma.product.findMany({
      include: includeProductRelations,
      orderBy: [{ createdAt: "desc" }],
      where: {
        active: query.active,
        featured: query.featured,
        category: query.category ? { slug: query.category } : undefined,
        OR: query.search
          ? [
              { name: { contains: query.search, mode: "insensitive" } },
              { description: { contains: query.search, mode: "insensitive" } },
            ]
          : undefined,
      },
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
      data: input,
      include: includeProductRelations,
    });
  },

  update(id: string, input: Partial<ProductUpsertInput>) {
    return prisma.product.update({
      data: input,
      include: includeProductRelations,
      where: { id },
    });
  },

  delete(id: string) {
    return prisma.product.delete({ where: { id } });
  },
};
