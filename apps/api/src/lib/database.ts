import { prisma } from "./prisma";

export async function closeDatabaseConnection() {
  await prisma.$disconnect();
}
