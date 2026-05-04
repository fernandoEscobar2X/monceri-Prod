import type {
  Category,
  Coupon,
  Order,
  ProductSummary,
  StockMovementType,
} from "@monceri/shared";

export type AdminCategory = Category & {
  createdAt?: string;
  updatedAt?: string;
};

export type AdminProduct = ProductSummary & {
  active: boolean;
  categoryId: string;
  createdAt?: string;
  updatedAt?: string;
};

export type AdminCoupon = Coupon & {
  createdAt?: string;
};

export type AdminOrder = Order & {
  createdAt?: string;
  updatedAt?: string;
};

export type InventoryProduct = {
  id: string;
  name: string;
  stock: number;
  lowStockAlert: number;
  trackStock: boolean;
  variants: {
    id: string;
    name: string;
    value: string;
    stock: number | null;
    active: boolean;
  }[];
};

export type StockMovement = {
  id: string;
  productId: string;
  variantId?: string | null;
  type: StockMovementType;
  quantity: number;
  reason: string;
  adminId: string;
  createdAt: string;
  product?: { id: string; name: string };
  variant?: { id: string; name: string; value: string } | null;
};

export type DashboardSummary = {
  ordersThisMonth: number;
  revenueThisMonth: number;
  pendingOrders: number;
  lowStockProducts: { id: string; name: string; stock: number; lowStockAlert: number }[];
  recentOrders: AdminOrder[];
  weeklyRevenue: { week: string; total: number }[];
};
