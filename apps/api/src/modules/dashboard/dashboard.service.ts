import { dashboardRepository } from "./dashboard.repository";

function weekKey(date: Date) {
  const firstDay = new Date(date);
  const day = firstDay.getDay();
  const diff = firstDay.getDate() - day + (day === 0 ? -6 : 1);
  firstDay.setDate(diff);
  firstDay.setHours(0, 0, 0, 0);
  return firstDay.toISOString().slice(0, 10);
}

function weeklyRevenue(
  orders: { createdAt: Date; total: unknown }[],
  now = new Date(),
) {
  const weeks = new Map<string, number>();

  for (let index = 7; index >= 0; index -= 1) {
    const week = new Date(now);
    week.setDate(week.getDate() - index * 7);
    weeks.set(weekKey(week), 0);
  }

  for (const order of orders) {
    const key = weekKey(order.createdAt);
    weeks.set(key, (weeks.get(key) ?? 0) + Number(order.total));
  }

  return Array.from(weeks, ([week, total]) => ({ total, week }));
}

export const dashboardService = {
  async summary() {
    const summary = await dashboardRepository.summary();

    return {
      lowStockProducts: summary.lowStockProducts,
      ordersThisMonth: summary.ordersThisMonth,
      pendingOrders: summary.pendingOrders,
      recentOrders: summary.recentOrders,
      revenueThisMonth: summary.revenueThisMonth,
      weeklyRevenue: weeklyRevenue(summary.revenueOrders),
    };
  },
};
