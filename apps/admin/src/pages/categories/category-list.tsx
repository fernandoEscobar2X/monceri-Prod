import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Card, Popconfirm, Space, Switch, Table, Typography, message } from "antd";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { apiRequest } from "@/providers/api-client";
import type { AdminCategory } from "@/types";

export function CategoryList() {
  const [categories, setCategories] = useState<AdminCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [messageApi, contextHolder] = message.useMessage();

  async function load() {
    setLoading(true);
    setCategories(await apiRequest<AdminCategory[]>("/api/admin/categories"));
    setLoading(false);
  }

  async function remove(id: string) {
    await apiRequest<void>(`/api/admin/categories/${id}`, { method: "DELETE" });
    messageApi.success("Categoria desactivada");
    await load();
  }

  useEffect(() => {
    void load();
  }, []);

  return (
    <div>
      {contextHolder}
      <Space align="center" style={{ justifyContent: "space-between", width: "100%" }}>
        <Typography.Title level={2}>Categorias</Typography.Title>
        <Link to="/categories/create">
          <Button icon={<PlusOutlined />} type="primary">
            Nueva categoria
          </Button>
        </Link>
      </Space>
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
                    <Button icon={<EditOutlined />} />
                  </Link>
                  <Popconfirm
                    okText="Desactivar"
                    onConfirm={() => remove(record.id)}
                    title="Desactivar categoria"
                  >
                    <Button danger icon={<DeleteOutlined />} />
                  </Popconfirm>
                </Space>
              ),
              title: "Acciones",
            },
          ]}
          dataSource={categories}
          loading={loading}
          rowKey="id"
          scroll={{ x: "max-content" }}
        />
      </Card>
    </div>
  );
}
