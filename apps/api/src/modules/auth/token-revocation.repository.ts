import { prisma } from "../../lib/prisma";

export const tokenRevocationRepository = {
  cleanupExpired(now = new Date()) {
    return prisma.revokedToken.deleteMany({
      where: {
        expiresAt: {
          lt: now,
        },
      },
    });
  },

  async isRevoked(jti: string) {
    const token = await prisma.revokedToken.findUnique({
      select: { jti: true },
      where: { jti },
    });

    return Boolean(token);
  },

  revoke(jti: string, expiresAt: Date) {
    return prisma.revokedToken.upsert({
      create: {
        expiresAt,
        jti,
      },
      update: {
        expiresAt,
      },
      where: { jti },
    });
  },
};
