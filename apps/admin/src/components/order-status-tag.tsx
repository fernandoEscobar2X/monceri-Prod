import { Tag } from "antd";
import type { OrderStatus } from "@monceri/shared";

const statusLabels: Record<OrderStatus, string> = {
  CANCELLED: "Cancelado",
  CONFIRMED: "Confirmado",
  DELIVERED: "Entregado",
  IN_PRODUCTION: "En produccion",
  PENDING: "Pendiente",
  READY: "Listo",
};

const statusColors: Record<OrderStatus, string> = {
  CANCELLED: "red",
  CONFIRMED: "blue",
  DELIVERED: "default",
  IN_PRODUCTION: "purple",
  PENDING: "gold",
  READY: "green",
};

export function OrderStatusTag({ status }: { status: OrderStatus }) {
  return <Tag color={statusColors[status]}>{statusLabels[status]}</Tag>;
}
