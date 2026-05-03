import { prisma } from "../../lib/prisma";

export const authRepository = {
  findByEmail(email: string) {
    return prisma.adminUser.findUnique({
      where: { email: email.toLowerCase() },
    });
  },

  touchLastLogin(id: string) {
    return prisma.adminUser.update({
      data: { lastLogin: new Date() },
      where: { id },
    });
  },
};
