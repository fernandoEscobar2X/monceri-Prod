import type { FastifyInstance } from "fastify";
import { authenticate } from "../../plugins/auth";
import {
  createProduct,
  deleteProduct,
  getAdminProduct,
  getProduct,
  listAdminProducts,
  listProducts,
  updateProduct,
} from "./products.controller";

export async function registerProductRoutes(app: FastifyInstance) {
  app.get("/products", listProducts);
  app.get("/products/:slug", getProduct);
  app.get("/admin/products", { preHandler: authenticate }, listAdminProducts);
  app.get("/admin/products/:id", { preHandler: authenticate }, getAdminProduct);
  app.post("/admin/products", { preHandler: authenticate }, createProduct);
  app.patch("/admin/products/:id", { preHandler: authenticate }, updateProduct);
  app.delete("/admin/products/:id", { preHandler: authenticate }, deleteProduct);
}
