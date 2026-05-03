import "@refinedev/antd/dist/reset.css";
import {
  Refine,
  type BaseRecord,
  type CreateParams,
  type DataProvider,
  type DeleteOneParams,
  type GetListParams,
  type GetOneParams,
  type UpdateParams,
} from "@refinedev/core";
import { useNotificationProvider } from "@refinedev/antd";
import { App as AntdApp, ConfigProvider, Typography } from "antd";
import esES from "antd/locale/es_ES";
import { createRoot } from "react-dom/client";

const API_URL = import.meta.env.VITE_API_URL ?? "http://127.0.0.1:4000";

async function readJson<T>(response: Response) {
  return (await response.json()) as T;
}

const dataProvider: DataProvider = {
  create: async <TData extends BaseRecord = BaseRecord, TVariables = Record<string, unknown>>({
    resource,
    variables,
  }: CreateParams<TVariables>) => {
    const response = await fetch(`${API_URL}/api/admin/${resource}`, {
      body: JSON.stringify(variables),
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      method: "POST",
    });
    return { data: await readJson<TData>(response) };
  },
  deleteOne: async <TData extends BaseRecord = BaseRecord, TVariables = Record<string, unknown>>({
    id,
    resource,
  }: DeleteOneParams<TVariables>) => {
    await fetch(`${API_URL}/api/admin/${resource}/${id}`, {
      credentials: "include",
      method: "DELETE",
    });
    return { data: { id } as TData };
  },
  getApiUrl: () => API_URL,
  getList: async <TData extends BaseRecord = BaseRecord>({ resource }: GetListParams) => {
    const response = await fetch(`${API_URL}/api/admin/${resource}`, { credentials: "include" });
    const data = await readJson<TData[]>(response);
    return { data, total: data.length };
  },
  getOne: async <TData extends BaseRecord = BaseRecord>({ id, resource }: GetOneParams) => {
    const response = await fetch(`${API_URL}/api/admin/${resource}/${id}`, { credentials: "include" });
    return { data: await readJson<TData>(response) };
  },
  update: async <TData extends BaseRecord = BaseRecord, TVariables = Record<string, unknown>>({
    id,
    resource,
    variables,
  }: UpdateParams<TVariables>) => {
    const response = await fetch(`${API_URL}/api/admin/${resource}/${id}`, {
      body: JSON.stringify(variables),
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      method: "PATCH",
    });
    return { data: await readJson<TData>(response) };
  },
};

function Dashboard() {
  return (
    <main style={{ minHeight: "100vh", padding: 24 }}>
      <Typography.Title level={2}>Panel Monceri</Typography.Title>
      <Typography.Paragraph>
        Base admin Refine lista para conectar recursos de productos, pedidos, inventario y cupones.
      </Typography.Paragraph>
    </main>
  );
}

createRoot(document.getElementById("root")!).render(
  <ConfigProvider locale={esES}>
    <AntdApp>
      <Refine
        dataProvider={dataProvider}
        notificationProvider={useNotificationProvider}
        resources={[
          { name: "products", list: "/" },
          { name: "categories", list: "/" },
          { name: "orders", list: "/" },
          { name: "inventory", list: "/" },
          { name: "coupons", list: "/" },
        ]}
      >
        <Dashboard />
      </Refine>
    </AntdApp>
  </ConfigProvider>,
);
