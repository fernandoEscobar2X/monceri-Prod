import type { FastifyRequest } from "fastify";
import { UnauthorizedError } from "../lib/errors";
import { tokenRevocationService } from "../modules/auth/token-revocation.service";

export async function authenticate(request: FastifyRequest) {
  try {
    await request.jwtVerify();
  } catch {
    throw new UnauthorizedError();
  }

  const { jti } = request.user as { jti?: string };

  if (jti && (await tokenRevocationService.isRevoked(jti))) {
    throw new UnauthorizedError();
  }
}

export function currentAdminId(request: FastifyRequest) {
  const user = request.user as { sub?: string } | undefined;
  return user?.sub ?? "system";
}
