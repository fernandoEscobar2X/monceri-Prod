import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import { App, Button, Card, Grid, Image, Input, List, Popconfirm, Space, Switch, Table, Tag } from "antd";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import type { ProductListResponse } from "@monceri/shared";
import { AdminEmptyState, AdminPageHeader } from "@/components/admin-page";
import { formatMoney } from "@/components/formatters";
import { notifyApiError } from "@/components/notify";
import { apiRequest } from "@/providers/api-client";
import type { AdminProduct } from "@/types";

export function ProductList() {
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const { notification } = App.useApp();
  const screens = Grid.useBreakpoint();
  const isMobile = screens.xs && !screens.md;

  async function load(nextSearch = search) {
    try {
      setLoading(true);
      const params = new URLSearchParams({ page: "1", pageSize: "50" });

      if (nextSearch) {
        params.set("search", nextSearch);
      }

      const response = await apiRequest<ProductListResponse>(`/api/admin/products?${params.toString()}`);
      setProducts(response.items as AdminProduct[]);
    } catch (error) {
      notifyApiError(notification, error);
    } finally {
      setLoading(false);
    }
  }

  async function remove(id: string) {
    try {
      await apiRequest<void>(`/api/admin/products/${id}`, { method: "DELETE" });
      notification.success({
        description: "El producto se retiro del catalogo publico, pero conserva pedidos historicos.",
        message: "Producto desactivado",
      });
      await load();
    } catch (error) {
      notifyApiError(notification, error);
    }
  }

  useEffect(() => {
    void load("");
  }, []);

  return (
    <div>
      <AdminPageHeader
        actions={
          <Link to="/products/create">
            <Button icon={<PlusOutlined />} type="primary">
              Nuevo producto
            </Button>
          </Link>
        }
        subtitle="Gestiona el catalogo publico, precios e inventario."
        title="Productos"
      />
      <Card>
        <Space style={{ marginBottom: 16, width: "100%" }} wrap>
          <Input.Search
            allowClear
            onSearch={(value) => {
              setSearch(value);
              void load(value);
            }}
            placeholder="Buscar producto"
            style={{ maxWidth: 360, width: "100%" }}
          />
        </Space>
        {isMobile ? (
          <List
            dataSource={products}
            loading={loading}
            locale={{
              emptyText: (
                <AdminEmptyState
                  actionHref="/products/create"
                  actionLabel="Crear primer producto"
                  description="Aun no tienes productos."
                />
              ),
            }}
            renderItem={(record) => (
              <List.Item
                actions={[
                  <Link key="edit" to={`/products/edit/${record.id}`}>
                    <Button icon={<EditOutlined />}>Editar</Button>
                  </Link>,
                  <Popconfirm
                    key="delete"
                    okText="Desactivar"
                    onConfirm={() => remove(record.id)}
                    title={`¿Borrar producto "${record.name}"? Esto lo retirara del catalogo publico pero conservara los pedidos historicos.`}
                  >
                    <Button danger icon={<DeleteOutlined />} />
                  </Popconfirm>,
                ]}
              >
                <List.Item.Meta
                  avatar={
                    <Image
                      height={56}
                      src={record.thumbnail ?? record.images[0]?.url}
                      style={{ borderRadius: 10, objectFit: "cover" }}
                      width={56}
                    />
                  }
                  description={`${record.categoryName} · ${formatMoney(record.basePrice)} · Stock ${record.stock}`}
                  title={record.name}
                />
              </List.Item>
            )}
          />
        ) : (
          <Table
            columns={[
              {
                render: (_value: unknown, record: AdminProduct) => (
                  <Image
                    height={56}
                    src={record.thumbnail ?? record.images[0]?.url}
                    style={{ borderRadius: 10, objectFit: "cover" }}
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
                      <Button aria-label={`Editar ${record.name}`} icon={<EditOutlined />} />
                    </Link>
                    <Popconfirm
                      okText="Desactivar"
                      onConfirm={() => remove(record.id)}
                      title={`¿Borrar producto "${record.name}"? Esto lo retirara del catalogo publico pero conservara los pedidos historicos.`}
                    >
                      <Button aria-label={`Desactivar ${record.name}`} danger icon={<DeleteOutlined />} />
                    </Popconfirm>
                  </Space>
                ),
                title: "Acciones",
              },
            ]}
            dataSource={products}
            loading={loading}
            locale={{
              emptyText: (
                <AdminEmptyState
                  actionHref="/products/create"
                  actionLabel="Crear primer producto"
                  description="Aun no tienes productos."
                />
              ),
            }}
            rowKey="id"
            scroll={{ x: "max-content" }}
          />
        )}
      </Card>
    </div>
  );
}
