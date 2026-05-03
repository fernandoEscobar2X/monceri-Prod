import "@fastify/jwt";

declare module "@fastify/jwt" {
  interface FastifyJWT {
    payload: {
      sub: string;
      email: string;
      role: "ADMIN" | "SUPERADMIN";
      name: string;
    };
    user: {
      sub: string;
      email: string;
      role: "ADMIN" | "SUPERADMIN";
      name: string;
    };
  }
}
