import { prisma } from "../../lib/prisma";

export const authRepository = {
  findByEmail(email: string) {
    return prisma.adminUser.findUnique({
      where: { email: email.toLowerCase() },
    });
  },

  findById(id: string) {
    return prisma.adminUser.findUnique({
      where: { id },
    });
  },

  updateLoginFailure(id: string, failedLoginCount: number, lockedUntil: Date | null) {
    return prisma.adminUser.update({
      data: {
        failedLoginCount,
        lockedUntil,
      },
      where: { id },
    });
  },

  updateLoginSuccess(id: string) {
    return prisma.adminUser.update({
      data: {
        failedLoginCount: 0,
        lastLogin: new Date(),
        lockedUntil: null,
      },
      where: { id },
    });
  },

  updatePassword(id: string, password: string) {
    return prisma.adminUser.update({
      data: { password },
      where: { id },
    });
  },
};
