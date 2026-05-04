import {
  AppstoreOutlined,
  BarChartOutlined,
  LogoutOutlined,
  PercentageOutlined,
  ProductOutlined,
  ShoppingOutlined,
  TagsOutlined,
} from "@ant-design/icons";
import { Button, Layout, Menu, Typography } from "antd";
import type { ItemType } from "antd/es/menu/interface";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { authProvider } from "@/providers/auth-provider";

const menuItems: ItemType[] = [
  { icon: <BarChartOutlined />, key: "/dashboard", label: "Dashboard" },
  { icon: <ProductOutlined />, key: "/products", label: "Productos" },
  { icon: <TagsOutlined />, key: "/categories", label: "Categorias" },
  { icon: <ShoppingOutlined />, key: "/orders", label: "Pedidos" },
  { icon: <AppstoreOutlined />, key: "/inventory", label: "Inventario" },
  { icon: <PercentageOutlined />, key: "/coupons", label: "Cupones" },
];

export function AdminLayout() {
  const location = useLocation();
  const navigate = useNavigate();

  async function logout() {
    await authProvider.logout({});
    navigate("/login");
  }

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Layout.Sider breakpoint="lg" collapsedWidth={0} width={248}>
        <div style={{ padding: 20 }}>
          <Typography.Title level={3} style={{ color: "white", margin: 0 }}>
            Monceri
          </Typography.Title>
          <Typography.Text style={{ color: "rgba(255,255,255,0.65)" }}>Panel admin</Typography.Text>
        </div>
        <Menu
          items={menuItems}
          mode="inline"
          onClick={({ key }) => navigate(key)}
          selectedKeys={[`/${location.pathname.split("/")[1] || "dashboard"}`]}
          theme="dark"
        />
      </Layout.Sider>
      <Layout>
        <Layout.Header
          style={{
            alignItems: "center",
            background: "white",
            display: "flex",
            justifyContent: "space-between",
            paddingInline: 24,
          }}
        >
          <Typography.Text strong>Operacion Monceri</Typography.Text>
          <Button icon={<LogoutOutlined />} onClick={logout}>
            Salir
          </Button>
        </Layout.Header>
        <Layout.Content style={{ padding: 24 }}>
          <Outlet />
        </Layout.Content>
      </Layout>
    </Layout>
  );
}
