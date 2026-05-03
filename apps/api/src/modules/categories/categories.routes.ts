import type { FastifyInstance } from "fastify";
import { authenticate } from "../../plugins/auth";
import {
  createCategory,
  deleteCategory,
  listAdminCategories,
  listCategories,
  updateCategory,
} from "./categories.controller";

export async function registerCategoryRoutes(app: FastifyInstance) {
  app.get("/categories", listCategories);
  app.get("/admin/categories", { preHandler: authenticate }, listAdminCategories);
  app.post("/admin/categories", { preHandler: authenticate }, createCategory);
  app.patch("/admin/categories/:id", { preHandler: authenticate }, updateCategory);
  app.delete("/admin/categories/:id", { preHandler: authenticate }, deleteCategory);
}
