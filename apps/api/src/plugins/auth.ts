import type { FastifyReply, FastifyRequest } from "fastify";
import { UnauthorizedError } from "../lib/errors";

export async function authenticate(request: FastifyRequest, _reply: FastifyReply) {
  try {
    await request.jwtVerify();
  } catch {
    throw new UnauthorizedError();
  }
}

export function currentAdminId(request: FastifyRequest) {
  const user = request.user as { sub?: string } | undefined;
  return user?.sub ?? "system";
}
