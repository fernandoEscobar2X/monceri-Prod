import { Button, Card, DatePicker, Input, Select, Space, Table, Typography } from "antd";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import type { OrderStatus } from "@monceri/shared";
import { formatMoney } from "@/components/formatters";
import { OrderStatusTag } from "@/components/order-status-tag";
import { apiRequest } from "@/providers/api-client";
import type { AdminOrder } from "@/types";

dayjs.extend(relativeTime);

export function OrderList() {
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [loading, setLoading] = useState(true);

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
      <Typography.Title level={2}>Pedidos</Typography.Title>
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
          rowKey="id"
          scroll={{ x: "max-content" }}
        />
      </Card>
    </div>
  );
}
