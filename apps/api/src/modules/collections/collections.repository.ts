import type { CollectionPatchInput, CollectionCreateInput, CollectionListQuery } from "./collections.types";
import type { Prisma } from "@prisma/client";
import { prisma } from "../../lib/prisma";

const includeProductRelations = {
  category: true,
  images: { orderBy: { sortOrder: "asc" } },
  variants: { orderBy: [{ name: "asc" }, { value: "asc" }] },
} satisfies Prisma.ProductInclude;

const includeCollectionRelations = {
  _count: { select: { products: true } },
  products: {
    include: {
      product: {
        include: includeProductRelations,
      },
    },
    orderBy: { sortOrder: "asc" },
  },
} satisfies Prisma.CollectionInclude;

function activeAndCurrentWhere(now = new Date()): Prisma.CollectionWhereInput {
  return {
    active: true,
    AND: [
      { OR: [{ startsAt: null }, { startsAt: { lte: now } }] },
      { OR: [{ endsAt: null }, { endsAt: { gte: now } }] },
    ],
  };
}

function collectionOrderBy(): Prisma.CollectionOrderByWithRelationInput[] {
  return [{ sortOrder: "asc" }, { startsAt: "desc" }, { createdAt: "desc" }];
}

function toNullableDate(value: null | string | undefined) {
  if (value === undefined) {
    return undefined;
  }

  return value ? new Date(value) : null;
}

function collectionData(input: CollectionCreateInput | CollectionPatchInput): Prisma.CollectionUpdateInput {
  return {
    active: input.active,
    bannerImageThumbnailUrl: input.bannerImageThumbnailUrl,
    bannerImageUrl: input.bannerImageUrl,
    ctaLabel: input.ctaLabel,
    description: input.description,
    endsAt: toNullableDate(input.endsAt),
    name: input.name,
    popupImageThumbnailUrl: input.popupImageThumbnailUrl,
    popupImageUrl: input.popupImageUrl,
    showInPopup: input.showInPopup,
    slug: input.slug,
    sortOrder: input.sortOrder,
    startsAt: toNullableDate(input.startsAt),
    tagline: input.tagline,
  };
}

function adminWhere(query: CollectionListQuery): Prisma.CollectionWhereInput {
  return {
    active: query.active,
    OR: query.search
      ? [
          { name: { contains: query.search, mode: "insensitive" } },
          { slug: { contains: query.search, mode: "insensitive" } },
          { tagline: { contains: query.search, mode: "insensitive" } },
        ]
      : undefined,
  };
}

export const collectionsRepository = {
  async listPublic() {
    return prisma.collection.findMany({
      include: includeCollectionRelations,
      orderBy: collectionOrderBy(),
      where: activeAndCurrentWhere(),
    });
  },

  async listAdmin(query: CollectionListQuery) {
    const where = adminWhere(query);
    const [items, total] = await prisma.$transaction([
      prisma.collection.findMany({
        include: includeCollectionRelations,
        orderBy: collectionOrderBy(),
        skip: (query.page - 1) * query.pageSize,
        take: query.pageSize,
        where,
      }),
      prisma.collection.count({ where }),
    ]);

    return {
      items,
      page: query.page,
      pageSize: query.pageSize,
      total,
      totalPages: Math.ceil(total / query.pageSize),
    };
  },

  findAdminById(id: string) {
    return prisma.collection.findUnique({
      include: includeCollectionRelations,
      where: { id },
    });
  },

  findPublicBySlug(slug: string) {
    return prisma.collection.findFirst({
      include: includeCollectionRelations,
      where: {
        ...activeAndCurrentWhere(),
        slug,
      },
    });
  },

  findPopupActive() {
    return prisma.collection.findFirst({
      include: includeCollectionRelations,
      orderBy: collectionOrderBy(),
      where: {
        ...activeAndCurrentWhere(),
        showInPopup: true,
      },
    });
  },

  findHomeBanner() {
    return prisma.collection.findFirst({
      include: includeCollectionRelations,
      orderBy: collectionOrderBy(),
      where: activeAndCurrentWhere(),
    });
  },

  create(input: CollectionCreateInput) {
    return prisma.$transaction(async (tx) => {
      if (input.showInPopup) {
        await tx.collection.updateMany({
          data: { showInPopup: false },
          where: { showInPopup: true },
        });
      }

      return tx.collection.create({
        data: collectionData(input) as Prisma.CollectionCreateInput,
        include: includeCollectionRelations,
      });
    });
  },

  update(id: string, input: CollectionPatchInput) {
    return prisma.$transaction(async (tx) => {
      if (input.showInPopup) {
        await tx.collection.updateMany({
          data: { showInPopup: false },
          where: {
            id: { not: id },
            showInPopup: true,
          },
        });
      }

      return tx.collection.update({
        data: collectionData(input),
        include: includeCollectionRelations,
        where: { id },
      });
    });
  },

  delete(id: string) {
    return prisma.collection.update({
      data: { active: false },
      where: { id },
    });
  },

  async replaceProducts(collectionId: string, productIds: string[]) {
    return prisma.$transaction(async (tx) => {
      await tx.productCollection.deleteMany({ where: { collectionId } });

      if (productIds.length > 0) {
        await tx.productCollection.createMany({
          data: productIds.map((productId, sortOrder) => ({
            collectionId,
            productId,
            sortOrder,
          })),
        });
      }

      return tx.collection.findUnique({
        include: includeCollectionRelations,
        where: { id: collectionId },
      });
    });
  },

  async removeProduct(collectionId: string, productId: string) {
    await prisma.productCollection.deleteMany({
      where: {
        collectionId,
        productId,
      },
    });

    return prisma.collection.findUnique({
      include: includeCollectionRelations,
      where: { id: collectionId },
    });
  },
};
