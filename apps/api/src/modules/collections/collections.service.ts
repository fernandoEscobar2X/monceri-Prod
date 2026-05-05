import type {
  CollectionPatchInput,
  CollectionCreateInput,
  CollectionListQuery,
  CollectionProductsInput,
} from "./collections.types";
import { collectionsRepository } from "./collections.repository";
import { CollectionNotFoundError } from "./collections.errors";
import { productsService } from "../products/products.service";

type CollectionRecord = NonNullable<Awaited<ReturnType<typeof collectionsRepository.findAdminById>>>;
type ProductRecord = CollectionRecord["products"][number]["product"];

function toIsoString(value?: Date | null) {
  return value ? value.toISOString() : null;
}

function mapProduct(product: ProductRecord) {
  const images = product.images.map((image) => ({
    alt: image.alt,
    id: image.id,
    productId: image.productId,
    sortOrder: image.sortOrder,
    thumbnailUrl: image.thumbnailUrl,
    url: image.url,
  }));

  return {
    active: product.active,
    basePrice: Number(product.basePrice),
    category: {
      id: product.category.id,
      name: product.category.name,
      slug: product.category.slug,
    },
    categoryId: product.categoryId,
    categoryName: product.category.name,
    comparePrice: product.comparePrice ? Number(product.comparePrice) : null,
    description: product.description,
    featured: product.featured,
    id: product.id,
    images,
    lowStockAlert: product.lowStockAlert,
    metaDescription: product.metaDescription,
    metaTitle: product.metaTitle,
    name: product.name,
    slug: product.slug,
    stock: product.stock,
    thumbnail: images[0]?.thumbnailUrl ?? images[0]?.url ?? null,
    trackStock: product.trackStock,
    variants: product.variants.map((variant) => ({
      active: variant.active,
      id: variant.id,
      name: variant.name,
      priceAdjust: Number(variant.priceAdjust),
      productId: variant.productId,
      stock: variant.stock,
      value: variant.value,
    })),
  };
}

function mapCollection(collection: CollectionRecord, publicOnly = false) {
  const products = collection.products
    .filter((link) => (publicOnly ? link.product.active : true))
    .map((link) => mapProduct(link.product));

  return {
    active: collection.active,
    bannerImageThumbnailUrl: collection.bannerImageThumbnailUrl,
    bannerImageUrl: collection.bannerImageUrl,
    createdAt: collection.createdAt.toISOString(),
    ctaLabel: collection.ctaLabel,
    description: collection.description,
    endsAt: toIsoString(collection.endsAt),
    id: collection.id,
    name: collection.name,
    popupImageThumbnailUrl: collection.popupImageThumbnailUrl,
    popupImageUrl: collection.popupImageUrl,
    products,
    productsCount: publicOnly ? products.length : collection._count.products,
    showInPopup: collection.showInPopup,
    slug: collection.slug,
    sortOrder: collection.sortOrder,
    startsAt: toIsoString(collection.startsAt),
    tagline: collection.tagline,
    updatedAt: collection.updatedAt.toISOString(),
  };
}

function mapCollectionSummary(collection: CollectionRecord, publicOnly = false) {
  const mapped = mapCollection(collection, publicOnly);

  return {
    active: mapped.active,
    bannerImageThumbnailUrl: mapped.bannerImageThumbnailUrl,
    bannerImageUrl: mapped.bannerImageUrl,
    createdAt: mapped.createdAt,
    ctaLabel: mapped.ctaLabel,
    description: mapped.description,
    endsAt: mapped.endsAt,
    id: mapped.id,
    name: mapped.name,
    popupImageThumbnailUrl: mapped.popupImageThumbnailUrl,
    popupImageUrl: mapped.popupImageUrl,
    productsCount: mapped.productsCount,
    showInPopup: mapped.showInPopup,
    slug: mapped.slug,
    sortOrder: mapped.sortOrder,
    startsAt: mapped.startsAt,
    tagline: mapped.tagline,
    updatedAt: mapped.updatedAt,
  };
}

async function ensureCollection(id: string) {
  const collection = await collectionsRepository.findAdminById(id);

  if (!collection) {
    throw new CollectionNotFoundError();
  }

  return collection;
}

export const collectionsService = {
  async listPublic() {
    return (await collectionsRepository.listPublic()).map((collection) =>
      mapCollectionSummary(collection, true),
    );
  },

  async listAdmin(query: CollectionListQuery) {
    const result = await collectionsRepository.listAdmin(query);

    return {
      ...result,
      items: result.items.map((collection) => mapCollectionSummary(collection)),
    };
  },

  async findAdminById(id: string) {
    return mapCollection(await ensureCollection(id));
  },

  async findPublicBySlug(slug: string) {
    const collection = await collectionsRepository.findPublicBySlug(slug);

    if (!collection) {
      throw new CollectionNotFoundError();
    }

    return mapCollection(collection, true);
  },

  async findPopupActive() {
    const collection = await collectionsRepository.findPopupActive();

    return collection ? mapCollection(collection, true) : null;
  },

  async findHomeBanner() {
    const collection = await collectionsRepository.findHomeBanner();

    return collection ? mapCollection(collection, true) : null;
  },

  async create(input: CollectionCreateInput) {
    return mapCollection(await collectionsRepository.create(input));
  },

  async update(id: string, input: CollectionPatchInput) {
    await ensureCollection(id);
    return mapCollection(await collectionsRepository.update(id, input));
  },

  async delete(id: string) {
    await ensureCollection(id);
    return collectionsRepository.delete(id);
  },

  async replaceProducts(id: string, input: CollectionProductsInput) {
    await ensureCollection(id);
    const productIds = Array.from(new Set(input.productIds));
    await Promise.all(productIds.map((productId) => productsService.findAdminById(productId)));
    const collection = await collectionsRepository.replaceProducts(id, productIds);

    if (!collection) {
      throw new CollectionNotFoundError();
    }

    return mapCollection(collection);
  },

  async removeProduct(id: string, productId: string) {
    await ensureCollection(id);
    const collection = await collectionsRepository.removeProduct(id, productId);

    if (!collection) {
      throw new CollectionNotFoundError();
    }

    return mapCollection(collection);
  },
};
