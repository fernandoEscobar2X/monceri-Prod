import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import { App, Button, Card, Popconfirm, Space, Switch, Table, Tag } from "antd";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AdminEmptyState, AdminPageHeader } from "@/components/admin-page";
import { formatDate, formatMoney } from "@/components/formatters";
import { notifyApiError } from "@/components/notify";
import { apiRequest } from "@/providers/api-client";
import type { AdminCoupon } from "@/types";

export function CouponList() {
  const [coupons, setCoupons] = useState<AdminCoupon[]>([]);
  const [loading, setLoading] = useState(true);
  const { notification } = App.useApp();

  async function load() {
    try {
      setLoading(true);
      setCoupons(await apiRequest<AdminCoupon[]>("/api/admin/coupons"));
    } catch (error) {
      notifyApiError(notification, error);
    } finally {
      setLoading(false);
    }
  }

  async function remove(id: string) {
    try {
      await apiRequest<void>(`/api/admin/coupons/${id}`, { method: "DELETE" });
      notification.success({
        description: "El cupon dejo de aplicarse en nuevos pedidos.",
        message: "Cupon desactivado",
      });
      await load();
    } catch (error) {
      notifyApiError(notification, error);
    }
  }

  useEffect(() => {
    void load();
  }, []);

  return (
    <div>
      <AdminPageHeader
        actions={
          <Link to="/coupons/create">
            <Button icon={<PlusOutlined />} type="primary">
              Nuevo cupon
            </Button>
          </Link>
        }
        title="Cupones"
      />
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
                    <Button aria-label={`Editar cupon ${record.code}`} icon={<EditOutlined />} />
                  </Link>
                  <Popconfirm
                    okText="Desactivar"
                    onConfirm={() => remove(record.id)}
                    title={`¿Borrar cupon "${record.code}"? Dejaria de aplicarse en nuevos pedidos.`}
                  >
                    <Button aria-label={`Desactivar cupon ${record.code}`} danger icon={<DeleteOutlined />} />
                  </Popconfirm>
                </Space>
              ),
              title: "Acciones",
            },
          ]}
          dataSource={coupons}
          loading={loading}
          locale={{
            emptyText: (
              <AdminEmptyState
                actionHref="/coupons/create"
                actionLabel="Crear primer cupon"
                description="Aun no tienes cupones."
              />
            ),
          }}
          rowKey="id"
          scroll={{ x: "max-content" }}
        />
      </Card>
    </div>
  );
}
