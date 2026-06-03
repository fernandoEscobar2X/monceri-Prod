import "@fastify/jwt";

declare module "@fastify/jwt" {
  interface FastifyJWT {
    payload: {
      email: string;
      jti: string;
      name: string;
      role: "ADMIN" | "SUPERADMIN";
      sub: string;
    };
    user: {
      email: string;
      exp?: number;
      jti?: string;
      name: string;
      role: "ADMIN" | "SUPERADMIN";
      sub: string;
    };
  }
}
