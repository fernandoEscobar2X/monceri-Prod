import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import { App, Button, Card, Popconfirm, Space, Switch, Table } from "antd";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AdminEmptyState, AdminPageHeader } from "@/components/admin-page";
import { notifyApiError } from "@/components/notify";
import { apiRequest } from "@/providers/api-client";
import type { AdminCategory } from "@/types";

export function CategoryList() {
  const [categories, setCategories] = useState<AdminCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const { notification } = App.useApp();

  async function load() {
    try {
      setLoading(true);
      setCategories(await apiRequest<AdminCategory[]>("/api/admin/categories"));
    } catch (error) {
      notifyApiError(notification, error);
    } finally {
      setLoading(false);
    }
  }

  async function remove(id: string) {
    try {
      await apiRequest<void>(`/api/admin/categories/${id}`, { method: "DELETE" });
      notification.success({
        description: "La categoria se oculto sin borrar los productos asociados.",
        message: "Categoria desactivada",
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
          <Link to="/categories/create">
            <Button icon={<PlusOutlined />} type="primary">
              Nueva categoria
            </Button>
          </Link>
        }
        title="Categorias"
      />
      <Card>
        <Table
          columns={[
            { dataIndex: "name", title: "Nombre" },
            { dataIndex: "slug", title: "Slug" },
            { dataIndex: "sortOrder", title: "Orden" },
            {
              dataIndex: "active",
              render: (active: boolean) => <Switch checked={active} disabled />,
              title: "Activa",
            },
            {
              render: (_value: unknown, record: AdminCategory) => (
                <Space>
                  <Link to={`/categories/edit/${record.id}`}>
                    <Button aria-label={`Editar ${record.name}`} icon={<EditOutlined />} />
                  </Link>
                  <Popconfirm
                    okText="Desactivar"
                    onConfirm={() => remove(record.id)}
                    title={`¿Borrar categoria "${record.name}"? Esto la ocultara del catalogo sin eliminar productos.`}
                  >
                    <Button aria-label={`Desactivar ${record.name}`} danger icon={<DeleteOutlined />} />
                  </Popconfirm>
                </Space>
              ),
              title: "Acciones",
            },
          ]}
          dataSource={categories}
          loading={loading}
          locale={{
            emptyText: (
              <AdminEmptyState
                actionHref="/categories/create"
                actionLabel="Crear primera categoria"
                description="Aun no tienes categorias."
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
