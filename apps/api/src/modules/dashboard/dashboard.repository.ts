import { prisma } from "../../lib/prisma";

function startOfMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function addWeeks(date: Date, weeks: number) {
  const next = new Date(date);
  next.setDate(next.getDate() + weeks * 7);
  return next;
}

export const dashboardRepository = {
  async summary(now = new Date()) {
    const monthStart = startOfMonth(now);
    const revenueStart = addWeeks(now, -8);
    const [ordersThisMonth, revenueAggregate, pendingOrders, lowStockProducts, recentOrders, revenueOrders] =
      await prisma.$transaction([
        prisma.order.count({
          where: {
            createdAt: { gte: monthStart },
          },
        }),
        prisma.order.aggregate({
          _sum: { total: true },
          where: {
            createdAt: { gte: monthStart },
            status: { not: "CANCELLED" },
          },
        }),
        prisma.order.count({ where: { status: "PENDING" } }),
        prisma.product.findMany({
          orderBy: { stock: "asc" },
          select: {
            id: true,
            lowStockAlert: true,
            name: true,
            stock: true,
          },
          take: 10,
          where: {
            active: true,
            trackStock: true,
          },
        }),
        prisma.order.findMany({
          include: { items: true },
          orderBy: { createdAt: "desc" },
          take: 10,
        }),
        prisma.order.findMany({
          orderBy: { createdAt: "asc" },
          select: {
            createdAt: true,
            total: true,
          },
          where: {
            createdAt: { gte: revenueStart },
            status: { not: "CANCELLED" },
          },
        }),
      ]);

    return {
      lowStockProducts: lowStockProducts.filter((product) => product.stock <= product.lowStockAlert),
      ordersThisMonth,
      pendingOrders,
      recentOrders,
      revenueOrders,
      revenueThisMonth: Number(revenueAggregate._sum.total ?? 0),
    };
  },
};
