import { App, Button, Card, Descriptions, Grid, Input, List, Popconfirm, Space, Table } from "antd";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import type { OrderStatus } from "@monceri/shared";
import { AdminPageHeader } from "@/components/admin-page";
import { formatDate, formatMoney } from "@/components/formatters";
import { notifyApiError } from "@/components/notify";
import { OrderStatusTag } from "@/components/order-status-tag";
import { apiRequest } from "@/providers/api-client";
import type { AdminOrder } from "@/types";

const nextActions: { label: string; status: OrderStatus; from: OrderStatus[]; primary?: boolean }[] = [
  { from: ["PENDING"], label: "Confirmar pedido", primary: true, status: "CONFIRMED" },
  { from: ["CONFIRMED"], label: "Marcar en produccion", status: "IN_PRODUCTION" },
  { from: ["IN_PRODUCTION"], label: "Marcar como listo", status: "READY" },
  { from: ["READY"], label: "Marcar como entregado", primary: true, status: "DELIVERED" },
];

export function OrderShow() {
  const params = useParams();
  const [order, setOrder] = useState<AdminOrder | null>(null);
  const [notes, setNotes] = useState("");
  const { notification } = App.useApp();
  const screens = Grid.useBreakpoint();
  const isMobile = screens.xs && !screens.md;

  async function load() {
    if (!params.orderNumber) {
      return;
    }

    try {
      const nextOrder = await apiRequest<AdminOrder>(`/api/admin/orders/${params.orderNumber}`);
      setOrder(nextOrder);
      setNotes(nextOrder.notes ?? "");
    } catch (error) {
      notifyApiError(notification, error);
    }
  }

  async function updateStatus(status: OrderStatus) {
    if (!order) {
      return;
    }

    try {
      await apiRequest<AdminOrder>(`/api/admin/orders/${order.orderNumber}/status`, {
        body: JSON.stringify({ notes, status }),
        method: "PATCH",
      });
      notification.success({
        description:
          status === "CONFIRMED"
            ? "Stock actualizado y cupon consumido una sola vez."
            : "El estado del pedido quedo actualizado.",
        message: status === "CONFIRMED" ? "Pedido confirmado" : "Pedido actualizado",
      });
      await load();
    } catch (error) {
      notifyApiError(notification, error);
    }
  }

  useEffect(() => {
    void load();
  }, [params.orderNumber]);

  if (!order) {
    return <Card loading />;
  }

  return (
    <div>
      <AdminPageHeader actions={<OrderStatusTag status={order.status} />} title={order.orderNumber} />
      <Card style={{ marginBottom: 16 }}>
        <Descriptions bordered column={isMobile ? 1 : { lg: 3, md: 2, xs: 1 }} title="Cliente">
          <Descriptions.Item label="Nombre">{order.customerName}</Descriptions.Item>
          <Descriptions.Item label="Telefono">{order.customerPhone}</Descriptions.Item>
          <Descriptions.Item label="Email">{order.customerEmail || "-"}</Descriptions.Item>
          <Descriptions.Item label="WhatsApp enviado">{order.whatsappSent ? "Si" : "No"}</Descriptions.Item>
          <Descriptions.Item label="Fecha">{formatDate(order.createdAt)}</Descriptions.Item>
        </Descriptions>
      </Card>
      <Card style={{ marginBottom: 16 }} title="Items">
        {isMobile ? (
          <List
            dataSource={order.items}
            renderItem={(item) => (
              <List.Item>
                <List.Item.Meta
                  title={item.productName}
                  description={
                    <Space direction="vertical" size={0}>
                      {Object.entries(item.variantData).map(([label, value]) => (
                        <span key={label}>
                          <strong>{label}:</strong> {value}
                        </span>
                      ))}
                      <span>
                        {item.quantity} x {formatMoney(item.unitPrice)} = {formatMoney(item.subtotal)}
                      </span>
                    </Space>
                  }
                />
              </List.Item>
            )}
          />
        ) : (
          <Table
            columns={[
              { dataIndex: "productName", title: "Producto" },
              {
                dataIndex: "variantData",
                render: (variantData: Record<string, string>) => (
                  <Space direction="vertical" size={0}>
                    {Object.entries(variantData).map(([label, value]) => (
                      <span key={label}>
                        <strong>{label}:</strong> {value}
                      </span>
                    ))}
                  </Space>
                ),
                title: "Detalle",
              },
              { dataIndex: "quantity", title: "Cantidad" },
              { dataIndex: "unitPrice", render: (value: number) => formatMoney(value), title: "Unitario" },
              { dataIndex: "subtotal", render: (value: number) => formatMoney(value), title: "Subtotal" },
            ]}
            dataSource={order.items}
            pagination={false}
            rowKey="id"
            scroll={{ x: "max-content" }}
          />
        )}
      </Card>
      <Card style={{ marginBottom: 16 }} title="Totales">
        <Descriptions bordered column={{ md: 3, xs: 1 }}>
          <Descriptions.Item label="Subtotal">{formatMoney(order.subtotal)}</Descriptions.Item>
          <Descriptions.Item label="Descuento">{formatMoney(order.discount)}</Descriptions.Item>
          <Descriptions.Item label="Total">{formatMoney(order.total)}</Descriptions.Item>
        </Descriptions>
      </Card>
      <Card title="Notas y acciones">
        <Input.TextArea onChange={(event) => setNotes(event.target.value)} rows={4} value={notes} />
        <Space className="admin-mobile-full" direction={isMobile ? "vertical" : "horizontal"} wrap={!isMobile} style={{ marginTop: 16 }}>
          {nextActions
            .filter((action) => action.from.includes(order.status))
            .map((action) => (
              <Button
                key={action.status}
                onClick={() => updateStatus(action.status)}
                type={action.primary ? "primary" : "default"}
              >
                {action.label}
              </Button>
            ))}
          {!["DELIVERED", "CANCELLED"].includes(order.status) ? (
            <Popconfirm
              okText="Cancelar pedido"
              onConfirm={() => updateStatus("CANCELLED")}
              title={`¿Cancelar pedido ${order.orderNumber}? Esto detendra su avance operativo.`}
            >
              <Button danger>Cancelar</Button>
            </Popconfirm>
          ) : null}
        </Space>
      </Card>
    </div>
  );
}
