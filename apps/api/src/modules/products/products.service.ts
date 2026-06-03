import type { ProductListQuery, ProductUpsertInput } from "@monceri/shared";
import { NotFoundError } from "../../lib/errors";
import { productsRepository } from "./products.repository";

type ProductRecord = Awaited<ReturnType<typeof productsRepository.findById>>;
type ProductListRecord = NonNullable<ProductRecord>;

function mapProduct(product: ProductListRecord) {
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

function mapProductList(result: Awaited<ReturnType<typeof productsRepository.listPublic>>) {
  return {
    ...result,
    items: result.items.map(mapProduct),
  };
}

export const productsService = {
  async listPublic(query: ProductListQuery) {
    return mapProductList(await productsRepository.listPublic(query));
  },

  async listAdmin(query: ProductListQuery) {
    return mapProductList(await productsRepository.listAdmin(query));
  },

  async listFeatured(limit: number) {
    return (await productsRepository.listFeatured(limit)).map(mapProduct);
  },

  async findPublicBySlug(slug: string) {
    const product = await productsRepository.findPublicBySlug(slug);

    if (!product) {
      throw new NotFoundError("Producto");
    }

    return mapProduct(product);
  },

  async findAdminById(id: string) {
    const product = await productsRepository.findAdminById(id);

    if (!product) {
      throw new NotFoundError("Producto");
    }

    return mapProduct(product);
  },

  async findActiveForOrder(id: string) {
    const product = await productsRepository.findById(id);

    if (!product || !product.active) {
      throw new NotFoundError("Producto activo");
    }

    return product;
  },

  async findActiveBySlugForOrder(slug: string) {
    const product = await productsRepository.findBySlug(slug);

    if (!product || !product.active) {
      throw new NotFoundError("Producto activo");
    }

    return product;
  },

  async create(input: ProductUpsertInput) {
    return mapProduct(await productsRepository.create(input));
  },

  async update(id: string, input: Partial<ProductUpsertInput>) {
    const product = await productsRepository.findById(id);

    if (!product) {
      throw new NotFoundError("Producto");
    }

    return mapProduct(await productsRepository.update(id, input));
  },

  async delete(id: string) {
    const product = await productsRepository.findById(id);

    if (!product) {
      throw new NotFoundError("Producto");
    }

    return productsRepository.delete(id);
  },
};
