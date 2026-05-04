import { Card, Col, Empty, Row, Statistic, Table, Typography } from "antd";
import { useEffect, useState } from "react";
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { OrderStatusTag } from "@/components/order-status-tag";
import { formatDate, formatMoney } from "@/components/formatters";
import { apiRequest } from "@/providers/api-client";
import type { DashboardSummary } from "@/types";

export function DashboardPage() {
  const [summary, setSummary] = useState<DashboardSummary | null>(null);

  useEffect(() => {
    apiRequest<DashboardSummary>("/api/admin/dashboard/summary").then(setSummary);
  }, []);

  if (!summary) {
    return <Card loading />;
  }

  return (
    <div>
      <Typography.Title level={2}>Dashboard</Typography.Title>
      <Row gutter={[16, 16]}>
        <Col lg={6} sm={12} xs={24}>
          <Card>
            <Statistic title="Pedidos del mes" value={summary.ordersThisMonth} />
          </Card>
        </Col>
        <Col lg={6} sm={12} xs={24}>
          <Card>
            <Statistic title="Ingresos del mes" value={formatMoney(summary.revenueThisMonth)} />
          </Card>
        </Col>
        <Col lg={6} sm={12} xs={24}>
          <Card>
            <Statistic title="Pedidos pendientes" value={summary.pendingOrders} />
          </Card>
        </Col>
        <Col lg={6} sm={12} xs={24}>
          <Card>
            <Statistic title="Stock bajo" value={summary.lowStockProducts.length} />
          </Card>
        </Col>
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
                    <XAxis dataKey="week" />
                    <YAxis />
                    <Tooltip formatter={(value) => formatMoney(Number(value))} />
                    <Line dataKey="total" stroke="#E63946" strokeWidth={3} type="monotone" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}
          </Card>
        </Col>
        <Col lg={10} xs={24}>
          <Card title="Ultimos pedidos">
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
          </Card>
        </Col>
      </Row>
    </div>
  );
}
