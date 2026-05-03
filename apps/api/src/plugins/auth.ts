import type { FastifyRequest } from "fastify";
import { UnauthorizedError } from "../lib/errors";

export async function authenticate(request: FastifyRequest) {
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
