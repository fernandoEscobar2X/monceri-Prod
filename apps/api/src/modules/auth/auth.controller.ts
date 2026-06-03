import { randomUUID } from "node:crypto";
import type { FastifyReply, FastifyRequest } from "fastify";
import { env } from "../../config/env";
import { UnauthorizedError } from "../../lib/errors";
import { AdminLoginSchema, ChangePasswordSchema } from "./auth.schemas";
import { authService } from "./auth.service";
import { tokenRevocationService } from "./token-revocation.service";

const cookieOptions = {
  httpOnly: true,
  path: "/",
  sameSite: "strict" as const,
  secure: env.NODE_ENV === "production",
  signed: true,
};

export async function loginAdmin(request: FastifyRequest, reply: FastifyReply) {
  const input = AdminLoginSchema.parse(request.body);
  const admin = await authService.login(input);
  const token = await reply.jwtSign({
    email: admin.email,
    jti: randomUUID(),
    name: admin.name,
    role: admin.role,
    sub: admin.id,
  });

  return reply
    .setCookie("monceri_admin_token", token, cookieOptions)
    .send(admin);
}

export async function logoutAdmin(request: FastifyRequest, reply: FastifyReply) {
  const payload = request.user as { exp?: number; jti?: string } | undefined;

  if (payload?.jti && payload.exp) {
    await tokenRevocationService.revoke(payload.jti, new Date(payload.exp * 1000));
  }

  return reply.clearCookie("monceri_admin_token", { path: "/" }).status(204).send();
}

export async function getCurrentAdmin(request: FastifyRequest, reply: FastifyReply) {
  return reply.send(request.user);
}

export async function changeAdminPassword(request: FastifyRequest, reply: FastifyReply) {
  const input = ChangePasswordSchema.parse(request.body);
  const adminId = (request.user as { sub?: string } | undefined)?.sub;

  if (!adminId) {
    throw new UnauthorizedError();
  }

  await authService.changePassword(adminId, input.currentPassword, input.newPassword);
  return reply.status(204).send();
}
