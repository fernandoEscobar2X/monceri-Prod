import {
  AppstoreOutlined,
  BarChartOutlined,
  CalendarOutlined,
  KeyOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  MoonOutlined,
  PercentageOutlined,
  ProductOutlined,
  ShoppingOutlined,
  SunOutlined,
  TagsOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Breadcrumb, Button, Dropdown, Grid, Layout, Menu, Space, Tooltip, Typography, theme } from "antd";
import type { ItemType } from "antd/es/menu/interface";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { authProvider } from "@/providers/auth-provider";
import { useThemeStore } from "@/stores/theme";

const menuItems: ItemType[] = [
  { icon: <BarChartOutlined />, key: "/dashboard", label: "Dashboard" },
  { icon: <ProductOutlined />, key: "/products", label: "Productos" },
  { icon: <CalendarOutlined />, key: "/collections", label: "Temporadas" },
  { icon: <TagsOutlined />, key: "/categories", label: "Categorias" },
  { icon: <ShoppingOutlined />, key: "/orders", label: "Pedidos" },
  { icon: <AppstoreOutlined />, key: "/inventory", label: "Inventario" },
  { icon: <PercentageOutlined />, key: "/coupons", label: "Cupones" },
];

export function AdminLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const screens = Grid.useBreakpoint();
  const [collapsed, setCollapsed] = useState(false);
  const mode = useThemeStore((state) => state.mode);
  const toggleMode = useThemeStore((state) => state.toggleMode);
  const { token } = theme.useToken();
  const isMobile = screens.xs && !screens.md;

  useEffect(() => {
    setCollapsed(Boolean(isMobile));
  }, [isMobile]);

  async function logout() {
    await authProvider.logout({});
    navigate("/login");
  }

  const breadcrumbItems = useMemo(() => {
    const [section, actionOrId] = location.pathname.split("/").filter(Boolean);
    const rootBySection: Record<string, { label: string; to: string }> = {
      account: { label: "Cuenta", to: "/account/password" },
      categories: { label: "Categorias", to: "/categories" },
      collections: { label: "Temporadas", to: "/collections" },
      coupons: { label: "Cupones", to: "/coupons" },
      dashboard: { label: "Dashboard", to: "/dashboard" },
      inventory: { label: "Inventario", to: "/inventory" },
      orders: { label: "Pedidos", to: "/orders" },
      products: { label: "Productos", to: "/products" },
    };
    const root = rootBySection[section ?? "dashboard"] ?? rootBySection.dashboard;
    const items = [{ title: <Link to={root.to}>{root.label}</Link> }];

    if (actionOrId === "create") {
      items.push({ title: <span>Nuevo</span> });
    } else if (actionOrId === "edit") {
      items.push({ title: <span>Editar</span> });
    } else if (section === "orders" && actionOrId) {
      items.push({ title: <span>{actionOrId}</span> });
    } else if (section === "account" && actionOrId === "password") {
      items.push({ title: <span>Contrasena</span> });
    }

    return items;
  }, [location.pathname]);

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Layout.Sider
        breakpoint="lg"
        collapsed={collapsed}
        collapsedWidth={isMobile ? 0 : 80}
        onCollapse={setCollapsed}
        style={{
          boxShadow: collapsed ? undefined : token.boxShadowSecondary,
        }}
        width={248}
      >
        <div style={{ minHeight: 88, padding: collapsed ? "20px 16px" : 20 }}>
          <Typography.Title
            className="font-display"
            level={3}
            style={{ color: "white", margin: 0, textAlign: collapsed ? "center" : "left" }}
          >
            {collapsed ? "M" : "Monceri"}
          </Typography.Title>
          {!collapsed ? (
            <Typography.Text style={{ color: "rgba(255,255,255,0.65)" }}>Panel admin</Typography.Text>
          ) : null}
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
            background: token.colorBgContainer,
            borderBottom: `1px solid ${token.colorBorderSecondary}`,
            display: "flex",
            justifyContent: "space-between",
            paddingInline: isMobile ? 12 : 24,
          }}
        >
          <Space>
            <Button
              aria-label={collapsed ? "Abrir menu" : "Cerrar menu"}
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed((current) => !current)}
              type="text"
            />
            <Typography.Text strong>{isMobile ? "Monceri" : "Operacion Monceri"}</Typography.Text>
          </Space>
          <Space>
            <Tooltip title="Cambiar tema">
              <Button
                aria-label="Cambiar tema"
                icon={mode === "dark" ? <SunOutlined /> : <MoonOutlined />}
                onClick={toggleMode}
                type="text"
              />
            </Tooltip>
            <Dropdown
              menu={{
                items: [
                  {
                    icon: <KeyOutlined />,
                    key: "password",
                    label: "Cambiar contrasena",
                    onClick: () => navigate("/account/password"),
                  },
                  {
                    danger: true,
                    icon: <LogoutOutlined />,
                    key: "logout",
                    label: "Salir",
                    onClick: logout,
                  },
                ],
              }}
              placement="bottomRight"
              trigger={["click"]}
            >
              <Button icon={<UserOutlined />}>{isMobile ? "" : "Cuenta"}</Button>
            </Dropdown>
          </Space>
        </Layout.Header>
        <Layout.Content style={{ padding: isMobile ? 16 : 24 }}>
          <Breadcrumb items={breadcrumbItems} style={{ marginBottom: 16 }} />
          <Outlet />
        </Layout.Content>
        <Layout.Footer style={{ color: token.colorTextTertiary, textAlign: "center" }}>
          © 2026 Monceri. Panel administrativo por VisibleMX.
        </Layout.Footer>
      </Layout>
    </Layout>
  );
}
