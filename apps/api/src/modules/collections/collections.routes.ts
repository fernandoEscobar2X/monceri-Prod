import type { FastifyInstance } from "fastify";
import { authenticate } from "../../plugins/auth";
import {
  createCollection,
  deleteCollection,
  getAdminCollection,
  getCollection,
  getHomeBannerCollection,
  getPopupCollection,
  listAdminCollections,
  listCollections,
  removeCollectionProduct,
  replaceCollectionProducts,
  updateCollection,
} from "./collections.controller";

export async function registerCollectionRoutes(app: FastifyInstance) {
  app.get("/collections", listCollections);
  app.get("/collections/popup-active", getPopupCollection);
  app.get("/collections/:slug", getCollection);
  app.get("/home/banner-collection", getHomeBannerCollection);

  app.get("/admin/collections", { preHandler: authenticate }, listAdminCollections);
  app.get("/admin/collections/:id", { preHandler: authenticate }, getAdminCollection);
  app.post("/admin/collections", { preHandler: authenticate }, createCollection);
  app.patch("/admin/collections/:id", { preHandler: authenticate }, updateCollection);
  app.delete("/admin/collections/:id", { preHandler: authenticate }, deleteCollection);
  app.post("/admin/collections/:id/products", { preHandler: authenticate }, replaceCollectionProducts);
  app.delete(
    "/admin/collections/:id/products/:productId",
    { preHandler: authenticate },
    removeCollectionProduct,
  );
}
