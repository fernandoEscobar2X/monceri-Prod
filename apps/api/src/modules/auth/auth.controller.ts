import type { FastifyReply, FastifyRequest } from "fastify";
import { AdminLoginSchema } from "./auth.schemas";
import { authService } from "./auth.service";

const cookieOptions = {
  httpOnly: true,
  path: "/",
  sameSite: "strict" as const,
  secure: process.env.NODE_ENV === "production",
};

export async function loginAdmin(request: FastifyRequest, reply: FastifyReply) {
  const input = AdminLoginSchema.parse(request.body);
  const admin = await authService.login(input);
  const token = await reply.jwtSign({
    email: admin.email,
    name: admin.name,
    role: admin.role,
    sub: admin.id,
  });

  return reply
    .setCookie("monceri_admin_token", token, cookieOptions)
    .send(admin);
}

export async function logoutAdmin(_request: FastifyRequest, reply: FastifyReply) {
  return reply.clearCookie("monceri_admin_token", { path: "/" }).status(204).send();
}

export async function getCurrentAdmin(request: FastifyRequest, reply: FastifyReply) {
  return reply.send(request.user);
}
