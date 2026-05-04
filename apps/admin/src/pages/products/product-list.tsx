import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Card, Image, Input, Popconfirm, Space, Switch, Table, Tag, Typography, message } from "antd";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import type { ProductListResponse } from "@monceri/shared";
import { formatMoney } from "@/components/formatters";
import { apiRequest } from "@/providers/api-client";
import type { AdminProduct } from "@/types";

export function ProductList() {
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [messageApi, contextHolder] = message.useMessage();

  async function load(nextSearch = search) {
    setLoading(true);
    const params = new URLSearchParams({ page: "1", pageSize: "50" });

    if (nextSearch) {
      params.set("search", nextSearch);
    }

    const response = await apiRequest<ProductListResponse>(`/api/admin/products?${params.toString()}`);
    setProducts(response.items as AdminProduct[]);
    setLoading(false);
  }

  async function remove(id: string) {
    await apiRequest<void>(`/api/admin/products/${id}`, { method: "DELETE" });
    messageApi.success("Producto desactivado");
    await load();
  }

  useEffect(() => {
    void load("");
  }, []);

  return (
    <div>
      {contextHolder}
      <Space align="center" style={{ justifyContent: "space-between", width: "100%" }}>
        <Typography.Title level={2}>Productos</Typography.Title>
        <Link to="/products/create">
          <Button icon={<PlusOutlined />} type="primary">
            Nuevo producto
          </Button>
        </Link>
      </Space>
      <Card>
        <Input.Search
          allowClear
          onSearch={(value) => {
            setSearch(value);
            void load(value);
          }}
          placeholder="Buscar producto"
          style={{ marginBottom: 16, maxWidth: 360 }}
        />
        <Table
          columns={[
            {
              render: (_value: unknown, record: AdminProduct) => (
                <Image
                  height={56}
                  src={record.thumbnail ?? record.images[0]?.url}
                  style={{ objectFit: "cover" }}
                  width={56}
                />
              ),
              title: "Foto",
            },
            { dataIndex: "name", title: "Nombre" },
            { dataIndex: "categoryName", title: "Categoria" },
            {
              dataIndex: "basePrice",
              render: (value: number) => formatMoney(value),
              title: "Precio",
            },
            { dataIndex: "stock", title: "Stock" },
            {
              dataIndex: "featured",
              render: (featured: boolean) => (featured ? <Tag color="gold">Destacado</Tag> : null),
              title: "Featured",
            },
            {
              dataIndex: "active",
              render: (active: boolean) => <Switch checked={active} disabled />,
              title: "Activo",
            },
            {
              render: (_value: unknown, record: AdminProduct) => (
                <Space>
                  <Link to={`/products/edit/${record.id}`}>
                    <Button icon={<EditOutlined />} />
                  </Link>
                  <Popconfirm okText="Desactivar" onConfirm={() => remove(record.id)} title="Desactivar producto">
                    <Button danger icon={<DeleteOutlined />} />
                  </Popconfirm>
                </Space>
              ),
              title: "Acciones",
            },
          ]}
          dataSource={products}
          loading={loading}
          rowKey="id"
          scroll={{ x: "max-content" }}
        />
      </Card>
    </div>
  );
}
