import type { FastifyInstance } from "fastify";
import { authenticate } from "../../plugins/auth";
import { changeAdminPassword, getCurrentAdmin, loginAdmin, logoutAdmin } from "./auth.controller";

export async function registerAuthRoutes(app: FastifyInstance) {
  app.post("/login", {
    config: {
      rateLimit: {
        max: 5,
        timeWindow: "1 minute",
      },
    },
    handler: loginAdmin,
  });
  app.post("/logout", { preHandler: authenticate }, logoutAdmin);
  app.get("/me", { preHandler: authenticate }, getCurrentAdmin);
  app.post("/change-password", { preHandler: authenticate }, changeAdminPassword);
}
