import {
  AlertOutlined,
  ClockCircleOutlined,
  RiseOutlined,
  ShoppingCartOutlined,
} from "@ant-design/icons";
import { Card, Col, Empty, Grid, List, Row, Skeleton, Statistic, Table, Typography, theme } from "antd";
import { useEffect, useState } from "react";
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { OrderStatusTag } from "@/components/order-status-tag";
import { formatDate, formatMoney } from "@/components/formatters";
import { apiRequest } from "@/providers/api-client";
import { authProvider, type AdminIdentity } from "@/providers/auth-provider";
import { AdminPageHeader } from "@/components/admin-page";
import type { AdminOrder, DashboardSummary } from "@/types";

const metricIcons = [
  <ShoppingCartOutlined key="orders" />,
  <RiseOutlined key="revenue" />,
  <ClockCircleOutlined key="pending" />,
  <AlertOutlined key="stock" />,
];

export function DashboardPage() {
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [identity, setIdentity] = useState<AdminIdentity | null>(null);
  const screens = Grid.useBreakpoint();
  const { token } = theme.useToken();
  const isMobile = screens.xs && !screens.md;

  useEffect(() => {
    apiRequest<DashboardSummary>("/api/admin/dashboard/summary").then(setSummary);
    authProvider.getIdentity?.({}).then((value) => setIdentity(value as AdminIdentity));
  }, []);

  if (!summary) {
    return (
      <div>
        <Skeleton active paragraph={{ rows: 2 }} title />
        <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
          {[0, 1, 2, 3].map((item) => (
            <Col key={item} lg={6} sm={12} xs={24}>
              <Card>
                <Skeleton active paragraph={{ rows: 1 }} title={false} />
              </Card>
            </Col>
          ))}
        </Row>
      </div>
    );
  }

  const metrics = [
    { title: "Pedidos del mes", value: summary.ordersThisMonth },
    { title: "Ingresos del mes", value: formatMoney(summary.revenueThisMonth) },
    { title: "Pedidos pendientes", value: summary.pendingOrders },
    { title: "Stock bajo", value: summary.lowStockProducts.length },
  ];
  const today = new Intl.DateTimeFormat("es-MX", {
    dateStyle: "full",
  }).format(new Date());

  function renderRecentOrder(order: AdminOrder) {
    return (
      <List.Item>
        <List.Item.Meta
          title={order.orderNumber}
          description={`${order.customerName} · ${formatDate(order.createdAt)}`}
        />
        <OrderStatusTag status={order.status} />
      </List.Item>
    );
  }

  return (
    <div>
      <AdminPageHeader
        subtitle={`${today.charAt(0).toUpperCase()}${today.slice(1)}`}
        title={`Hola, ${identity?.name ?? "Monceri"}`}
      />
      <Row gutter={[16, 16]}>
        {metrics.map((metric, index) => (
          <Col key={metric.title} lg={6} sm={12} xs={24}>
            <Card className="monceri-card-lift">
              <Statistic
                prefix={<span style={{ color: token.colorPrimary }}>{metricIcons[index]}</span>}
                title={metric.title}
                value={metric.value}
              />
              <Typography.Text type="secondary">Seguimiento operativo actual</Typography.Text>
            </Card>
          </Col>
        ))}
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        <Col lg={14} xs={24}>
          <Card title="Ingresos por semana">
            {summary.weeklyRevenue.length === 0 ? (
              <Empty description="Aun no hay pedidos" />
            ) : (
              <div style={{ height: 280 }}>
                <ResponsiveContainer height="100%" width="100%">
                  <LineChart data={summary.weeklyRevenue}>
                    <CartesianGrid stroke={token.colorBorderSecondary} strokeDasharray="4 4" />
                    <XAxis dataKey="week" stroke={token.colorTextTertiary} />
                    <YAxis stroke={token.colorTextTertiary} />
                    <Tooltip formatter={(value) => formatMoney(Number(value))} />
                    <Line dataKey="total" name="Ingresos" stroke={token.colorPrimary} strokeWidth={3} type="monotone" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}
          </Card>
        </Col>
        <Col lg={10} xs={24}>
          <Card title="Ultimos pedidos">
            {isMobile ? (
              <List dataSource={summary.recentOrders} renderItem={renderRecentOrder} />
            ) : (
              <Table
                columns={[
                  { dataIndex: "orderNumber", title: "Folio" },
                  { dataIndex: "customerName", title: "Cliente" },
                  {
                    dataIndex: "status",
                    render: (status) => <OrderStatusTag status={status} />,
                    title: "Status",
                  },
                  {
                    dataIndex: "createdAt",
                    render: (value) => formatDate(value),
                    title: "Fecha",
                  },
                ]}
                dataSource={summary.recentOrders}
                pagination={false}
                rowKey="id"
                size="small"
              />
            )}
          </Card>
        </Col>
      </Row>
    </div>
  );
}
