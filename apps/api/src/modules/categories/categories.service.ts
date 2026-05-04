import type { CategoryUpsertInput } from "@monceri/shared";
import { NotFoundError } from "../../lib/errors";
import { categoriesRepository } from "./categories.repository";

export const categoriesService = {
  listPublic() {
    return categoriesRepository.listPublic();
  },

  listAdmin() {
    return categoriesRepository.listAdmin();
  },

  async findById(id: string) {
    const category = await categoriesRepository.findById(id);

    if (!category) {
      throw new NotFoundError("Categoria");
    }

    return category;
  },

  async create(input: CategoryUpsertInput) {
    return categoriesRepository.create(input);
  },

  async update(id: string, input: Partial<CategoryUpsertInput>) {
    const category = await categoriesRepository.findById(id);

    if (!category) {
      throw new NotFoundError("Categoria");
    }

    return categoriesRepository.update(id, input);
  },

  async delete(id: string) {
    const category = await categoriesRepository.findById(id);

    if (!category) {
      throw new NotFoundError("Categoria");
    }

    return categoriesRepository.delete(id);
  },
};
