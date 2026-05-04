import type { ProductListQuery, ProductUpsertInput } from "@monceri/shared";
import { NotFoundError } from "../../lib/errors";
import { productsRepository } from "./products.repository";

export const productsService = {
  listPublic(query: ProductListQuery) {
    return productsRepository.listPublic(query);
  },

  listAdmin(query: ProductListQuery) {
    return productsRepository.listAdmin(query);
  },

  async findPublicBySlug(slug: string) {
    const product = await productsRepository.findPublicBySlug(slug);

    if (!product) {
      throw new NotFoundError("Producto");
    }

    return product;
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

  create(input: ProductUpsertInput) {
    return productsRepository.create(input);
  },

  async update(id: string, input: Partial<ProductUpsertInput>) {
    const product = await productsRepository.findById(id);

    if (!product) {
      throw new NotFoundError("Producto");
    }

    return productsRepository.update(id, input);
  },

  async delete(id: string) {
    const product = await productsRepository.findById(id);

    if (!product) {
      throw new NotFoundError("Producto");
    }

    return productsRepository.delete(id);
  },
};
