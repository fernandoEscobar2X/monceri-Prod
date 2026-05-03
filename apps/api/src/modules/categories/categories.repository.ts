import type { CategoryUpsertInput } from "@monceri/shared";
import { prisma } from "../../lib/prisma";

export const categoriesRepository = {
  listPublic() {
    return prisma.category.findMany({
      where: { active: true },
      orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
    });
  },

  listAdmin() {
    return prisma.category.findMany({
      orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
    });
  },

  findById(id: string) {
    return prisma.category.findUnique({ where: { id } });
  },

  create(input: CategoryUpsertInput) {
    return prisma.category.create({ data: input });
  },

  update(id: string, input: Partial<CategoryUpsertInput>) {
    return prisma.category.update({ where: { id }, data: input });
  },

  delete(id: string) {
    return prisma.category.delete({ where: { id } });
  },
};
