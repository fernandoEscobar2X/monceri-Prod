import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import { App, Button, Card, Grid, List, Popconfirm, Space, Table, Tag, Typography } from "antd";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AdminEmptyState, AdminPageHeader } from "@/components/admin-page";
import { formatDate } from "@/components/formatters";
import { notifyApiError } from "@/components/notify";
import { apiRequest } from "@/providers/api-client";
import type { AdminCollection } from "@/types";

type CollectionListResponse = {
  items: AdminCollection[];
  total: number;
};

function collectionStatus(collection: AdminCollection) {
  const now = Date.now();
  const startsAt = collection.startsAt ? new Date(collection.startsAt).getTime() : null;
  const endsAt = collection.endsAt ? new Date(collection.endsAt).getTime() : null;

  if (!collection.active) {
    return { color: "default", label: "Pausada" };
  }

  if (startsAt && startsAt > now) {
    return { color: "blue", label: "Programada" };
  }

  if (endsAt && endsAt < now) {
    return { color: "default", label: "Expirada" };
  }

  return { color: "green", label: "Activa" };
}

function formatValidity(collection: AdminCollection) {
  if (!collection.startsAt && !collection.endsAt) {
    return "Permanente";
  }

  return `${formatDate(collection.startsAt)} - ${formatDate(collection.endsAt)}`;
}

export function CollectionList() {
  const [collections, setCollections] = useState<AdminCollection[]>([]);
  const [loading, setLoading] = useState(true);
  const { notification } = App.useApp();
  const screens = Grid.useBreakpoint();
  const isMobile = screens.xs && !screens.md;

  async function load() {
    try {
      setLoading(true);
      const response = await apiRequest<CollectionListResponse>("/api/admin/collections?pageSize=50");
      setCollections(response.items);
    } catch (error) {
      notifyApiError(notification, error);
    } finally {
      setLoading(false);
    }
  }

  async function remove(collection: AdminCollection) {
    try {
      await apiRequest<void>(`/api/admin/collections/${collection.id}`, { method: "DELETE" });
      notification.success({
        description: "La temporada se oculto del sitio sin perder sus productos asociados.",
        message: "Temporada desactivada",
      });
      await load();
    } catch (error) {
      notifyApiError(notification, error);
    }
  }

  useEffect(() => {
    void load();
  }, []);

  const actions = (collection: AdminCollection) => (
    <Space>
      <Link to={`/collections/edit/${collection.id}`}>
        <Button aria-label={`Editar ${collection.name}`} icon={<EditOutlined />} />
      </Link>
      <Popconfirm
        okText="Desactivar"
        onConfirm={() => remove(collection)}
        title={`Desactivar temporada "${collection.name}"? Desaparecera del sitio sin perder datos.`}
      >
        <Button aria-label={`Desactivar ${collection.name}`} danger icon={<DeleteOutlined />} />
      </Popconfirm>
    </Space>
  );

  return (
    <div>
      <AdminPageHeader
        actions={
          <Link to="/collections/create">
            <Button icon={<PlusOutlined />} type="primary">
              Nueva temporada
            </Button>
          </Link>
        }
        title="Temporadas"
      />
      <Card>
        {isMobile ? (
          <List
            dataSource={collections}
            loading={loading}
            locale={{
              emptyText: (
                <AdminEmptyState
                  actionHref="/collections/create"
                  actionLabel="Crear primera temporada"
                  description="Aun no tienes temporadas."
                />
              ),
            }}
            renderItem={(collection) => {
              const status = collectionStatus(collection);

              return (
                <List.Item actions={[actions(collection)]}>
                  <List.Item.Meta
                    description={
                      <Space direction="vertical" size={4}>
                        <Typography.Text type="secondary">{collection.slug}</Typography.Text>
                        <Typography.Text>{formatValidity(collection)}</Typography.Text>
                        <Typography.Text>{collection.productsCount} productos</Typography.Text>
                      </Space>
                    }
                    title={
                      <Space wrap>
                        <span>{collection.name}</span>
                        <Tag color={status.color}>{status.label}</Tag>
                        {collection.showInPopup ? <Tag color="red">Popup</Tag> : null}
                      </Space>
                    }
                  />
                </List.Item>
              );
            }}
          />
        ) : (
          <Table
            columns={[
              { dataIndex: "name", title: "Nombre" },
              { dataIndex: "slug", title: "Slug" },
              {
                render: (_value: unknown, record: AdminCollection) => {
                  const status = collectionStatus(record);
                  return <Tag color={status.color}>{status.label}</Tag>;
                },
                title: "Estado",
              },
              {
                render: (_value: unknown, record: AdminCollection) =>
                  record.showInPopup ? <Tag color="red">Popup</Tag> : "-",
                title: "En popup",
              },
              { dataIndex: "productsCount", title: "Productos" },
              {
                render: (_value: unknown, record: AdminCollection) => formatValidity(record),
                title: "Vigencia",
              },
              {
                render: (_value: unknown, record: AdminCollection) => actions(record),
                title: "Acciones",
              },
            ]}
            dataSource={collections}
            loading={loading}
            locale={{
              emptyText: (
                <AdminEmptyState
                  actionHref="/collections/create"
                  actionLabel="Crear primera temporada"
                  description="Aun no tienes temporadas."
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
