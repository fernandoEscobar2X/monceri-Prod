import "@refinedev/antd/dist/reset.css";
import "@/styles/globals.css";
import "dayjs/locale/es";
import { Refine } from "@refinedev/core";
import { useNotificationProvider } from "@refinedev/antd";
import routerProvider from "@refinedev/react-router";
import { App as AntdApp, ConfigProvider, theme as antdTheme } from "antd";
import esES from "antd/locale/es_ES";
import dayjs from "dayjs";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { AdminLayout } from "@/components/admin-layout";
import { RequireAuth } from "@/components/require-auth";
import { authProvider } from "@/providers/auth-provider";
import { dataProvider } from "@/providers/data-provider";
import { CategoryForm } from "@/pages/categories/category-form";
import { CategoryList } from "@/pages/categories/category-list";
import { CollectionForm } from "@/pages/collections/collection-form";
import { CollectionList } from "@/pages/collections/collection-list";
import { CouponForm } from "@/pages/coupons/coupon-form";
import { CouponList } from "@/pages/coupons/coupon-list";
import { DashboardPage } from "@/pages/dashboard/dashboard-page";
import { InventoryPage } from "@/pages/inventory/inventory-page";
import { LoginPage } from "@/pages/login/login-page";
import { OrderList } from "@/pages/orders/order-list";
import { OrderShow } from "@/pages/orders/order-show";
import { ProductForm } from "@/pages/products/product-form";
import { ProductList } from "@/pages/products/product-list";
import { useThemeStore } from "@/stores/theme";
import { monceriDarkTheme, monceriLightTheme } from "@/theme/monceri-theme";

dayjs.locale("es");

function ThemedApp() {
  const mode = useThemeStore((state) => state.mode);
  const themeConfig =
    mode === "dark"
      ? { ...monceriDarkTheme, algorithm: antdTheme.darkAlgorithm }
      : { ...monceriLightTheme, algorithm: antdTheme.defaultAlgorithm };

  return (
    <ConfigProvider locale={esES} theme={themeConfig}>
      <AntdApp notification={{ duration: 4.5, placement: "topRight" }}>
        <BrowserRouter>
          <Refine
            authProvider={authProvider}
            dataProvider={dataProvider}
            notificationProvider={useNotificationProvider}
            resources={[
              { name: "dashboard", list: "/dashboard" },
              { create: "/products/create", edit: "/products/edit/:id", list: "/products", name: "products" },
              { create: "/collections/create", edit: "/collections/edit/:id", list: "/collections", name: "collections" },
              { create: "/categories/create", edit: "/categories/edit/:id", list: "/categories", name: "categories" },
              { list: "/orders", show: "/orders/:orderNumber", name: "orders" },
              { list: "/inventory", name: "inventory" },
              { create: "/coupons/create", edit: "/coupons/edit/:id", list: "/coupons", name: "coupons" },
            ]}
            routerProvider={routerProvider}
          >
            <Routes>
              <Route element={<LoginPage />} path="/login" />
              <Route element={<RequireAuth />}>
                <Route element={<AdminLayout />}>
                  <Route element={<Navigate replace to="/dashboard" />} index />
                  <Route element={<DashboardPage />} path="/dashboard" />
                  <Route element={<ProductList />} path="/products" />
                  <Route element={<ProductForm />} path="/products/create" />
                  <Route element={<ProductForm />} path="/products/edit/:id" />
                  <Route element={<CollectionList />} path="/collections" />
                  <Route element={<CollectionForm />} path="/collections/create" />
                  <Route element={<CollectionForm />} path="/collections/edit/:id" />
                  <Route element={<CategoryList />} path="/categories" />
                  <Route element={<CategoryForm />} path="/categories/create" />
                  <Route element={<CategoryForm />} path="/categories/edit/:id" />
                  <Route element={<OrderList />} path="/orders" />
                  <Route element={<OrderShow />} path="/orders/:orderNumber" />
                  <Route element={<InventoryPage />} path="/inventory" />
                  <Route element={<CouponList />} path="/coupons" />
                  <Route element={<CouponForm />} path="/coupons/create" />
                  <Route element={<CouponForm />} path="/coupons/edit/:id" />
                </Route>
              </Route>
              <Route element={<Navigate replace to="/dashboard" />} path="*" />
            </Routes>
          </Refine>
        </BrowserRouter>
      </AntdApp>
    </ConfigProvider>
  );
}

createRoot(document.getElementById("root")!).render(<ThemedApp />);
