import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Card, Popconfirm, Space, Switch, Table, Tag, Typography, message } from "antd";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { formatDate, formatMoney } from "@/components/formatters";
import { apiRequest } from "@/providers/api-client";
import type { AdminCoupon } from "@/types";

export function CouponList() {
  const [coupons, setCoupons] = useState<AdminCoupon[]>([]);
  const [messageApi, contextHolder] = message.useMessage();

  async function load() {
    setCoupons(await apiRequest<AdminCoupon[]>("/api/admin/coupons"));
  }

  async function remove(id: string) {
    await apiRequest<void>(`/api/admin/coupons/${id}`, { method: "DELETE" });
    messageApi.success("Cupon desactivado");
    await load();
  }

  useEffect(() => {
    void load();
  }, []);

  return (
    <div>
      {contextHolder}
      <Space align="center" style={{ justifyContent: "space-between", width: "100%" }}>
        <Typography.Title level={2}>Cupones</Typography.Title>
        <Link to="/coupons/create">
          <Button icon={<PlusOutlined />} type="primary">
            Nuevo cupon
          </Button>
        </Link>
      </Space>
      <Card>
        <Table
          columns={[
            { dataIndex: "code", title: "Codigo" },
            { dataIndex: "type", render: (type: string) => <Tag>{type}</Tag>, title: "Tipo" },
            {
              render: (_value: unknown, record: AdminCoupon) =>
                record.type === "PERCENTAGE" ? `${record.value}%` : formatMoney(record.value),
              title: "Valor",
            },
            {
              render: (_value: unknown, record: AdminCoupon) => `${record.usedCount}/${record.maxUses ?? "∞"}`,
              title: "Usos",
            },
            { dataIndex: "expiresAt", render: (value: string | null) => formatDate(value), title: "Expira" },
            {
              render: (_value: unknown, record: AdminCoupon) => {
                if (record.maxUses !== null && record.maxUses !== undefined && record.usedCount >= record.maxUses) {
                  return <Tag color="red">Agotado</Tag>;
                }

                if (record.expiresAt && new Date(record.expiresAt) < new Date()) {
                  return <Tag color="red">Expirado</Tag>;
                }

                return <Switch checked={record.active} disabled />;
              },
              title: "Estado",
            },
            {
              render: (_value: unknown, record: AdminCoupon) => (
                <Space>
                  <Link to={`/coupons/edit/${record.id}`}>
                    <Button icon={<EditOutlined />} />
                  </Link>
                  <Popconfirm okText="Desactivar" onConfirm={() => remove(record.id)} title="Desactivar cupon">
                    <Button danger icon={<DeleteOutlined />} />
                  </Popconfirm>
                </Space>
              ),
              title: "Acciones",
            },
          ]}
          dataSource={coupons}
          rowKey="id"
          scroll={{ x: "max-content" }}
        />
      </Card>
    </div>
  );
}
