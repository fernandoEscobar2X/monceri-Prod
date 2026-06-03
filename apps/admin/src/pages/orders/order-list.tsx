import { Button, Card, DatePicker, Grid, Input, List, Select, Space, Table } from "antd";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import type { OrderStatus } from "@monceri/shared";
import { AdminEmptyState, AdminPageHeader } from "@/components/admin-page";
import { formatMoney } from "@/components/formatters";
import { OrderStatusTag } from "@/components/order-status-tag";
import { apiRequest } from "@/providers/api-client";
import type { AdminOrder } from "@/types";

dayjs.extend(relativeTime);

export function OrderList() {
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const screens = Grid.useBreakpoint();
  const isMobile = screens.xs && !screens.md;

  async function load() {
    setLoading(true);
    setOrders(await apiRequest<AdminOrder[]>("/api/admin/orders"));
    setLoading(false);
  }

  useEffect(() => {
    void load();
  }, []);

  return (
    <div>
      <AdminPageHeader subtitle="Da seguimiento al cierre por WhatsApp y produccion." title="Pedidos" />
      <Card>
        <Space wrap style={{ marginBottom: 16 }}>
          <Input.Search placeholder="Buscar folio o telefono" style={{ width: 260 }} />
          <Select
            mode="multiple"
            options={["PENDING", "CONFIRMED", "IN_PRODUCTION", "READY", "DELIVERED", "CANCELLED"].map((value) => ({
              label: value,
              value,
            }))}
            placeholder="Status"
            style={{ minWidth: 260 }}
          />
          <DatePicker.RangePicker />
        </Space>
        {isMobile ? (
          <List
            dataSource={orders}
            loading={loading}
            locale={{
              emptyText: <AdminEmptyState description="Aun no hay pedidos." />,
            }}
            renderItem={(order) => (
              <List.Item
                actions={[
                  <Button key="wa" href={`https://wa.me/${order.customerPhone.replace(/\D/g, "")}`} target="_blank">
                    WhatsApp
                  </Button>,
                ]}
              >
                <List.Item.Meta
                  title={<Link to={`/orders/${order.orderNumber}`}>{order.orderNumber}</Link>}
                  description={`${order.customerName} · ${formatMoney(order.total)} · ${dayjs(order.createdAt).fromNow()}`}
                />
                <OrderStatusTag status={order.status} />
              </List.Item>
            )}
          />
        ) : (
          <Table
            columns={[
              {
                dataIndex: "orderNumber",
                render: (value: string) => <Link to={`/orders/${value}`}>{value}</Link>,
                title: "Folio",
              },
              { dataIndex: "customerName", title: "Cliente" },
              {
                dataIndex: "customerPhone",
                render: (phone: string) => (
                  <Button href={`https://wa.me/${phone.replace(/\D/g, "")}`} target="_blank">
                    WhatsApp
                  </Button>
                ),
                title: "Telefono",
              },
              {
                dataIndex: "total",
                render: (value: number) => formatMoney(value),
                title: "Total",
              },
              {
                dataIndex: "status",
                render: (status: OrderStatus) => <OrderStatusTag status={status} />,
                title: "Status",
              },
              {
                dataIndex: "createdAt",
                render: (value: string) => dayjs(value).fromNow(),
                title: "Fecha",
              },
            ]}
            dataSource={orders}
            loading={loading}
            locale={{
              emptyText: <AdminEmptyState description="Aun no hay pedidos." />,
            }}
            rowKey="id"
            scroll={{ x: "max-content" }}
          />
        )}
      </Card>
    </div>
  );
}
