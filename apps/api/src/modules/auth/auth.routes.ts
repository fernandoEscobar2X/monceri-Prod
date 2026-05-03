import type { FastifyInstance } from "fastify";
import { authenticate } from "../../plugins/auth";
import { getCurrentAdmin, loginAdmin, logoutAdmin } from "./auth.controller";

export async function registerAuthRoutes(app: FastifyInstance) {
  app.post("/login", {
    config: {
      rateLimit: {
        max: 10,
        timeWindow: "1 minute",
      },
    },
    handler: loginAdmin,
  });
  app.post("/logout", { preHandler: authenticate }, logoutAdmin);
  app.get("/me", { preHandler: authenticate }, getCurrentAdmin);
}
