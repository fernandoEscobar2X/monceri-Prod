import { App, Button, Card, Form, Input, InputNumber, Modal, Select, Space, Table, Tabs, Tag } from "antd";
import { useEffect, useState } from "react";
import type { StockMovementType } from "@monceri/shared";
import { AdminEmptyState, AdminPageHeader } from "@/components/admin-page";
import { formatDate } from "@/components/formatters";
import { inventoryRules } from "@/components/form-rules";
import { notifyApiError } from "@/components/notify";
import { apiRequest } from "@/providers/api-client";
import type { InventoryProduct, StockMovement } from "@/types";

type AdjustmentValues = {
  productId: string;
  quantity: number;
  reason: string;
  type: StockMovementType;
};

export function InventoryPage() {
  const [products, setProducts] = useState<InventoryProduct[]>([]);
  const [movements, setMovements] = useState<StockMovement[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<InventoryProduct | null>(null);
  const [form] = Form.useForm<AdjustmentValues>();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const { notification } = App.useApp();

  async function load() {
    try {
      setLoading(true);
      const [nextProducts, nextMovements] = await Promise.all([
        apiRequest<InventoryProduct[]>("/api/admin/inventory/stock"),
        apiRequest<StockMovement[]>("/api/admin/inventory/movements"),
      ]);

      setProducts(nextProducts);
      setMovements(nextMovements);
    } catch (error) {
      notifyApiError(notification, error);
    } finally {
      setLoading(false);
    }
  }

  async function submit(values: AdjustmentValues) {
    try {
      setSubmitting(true);
      await apiRequest<StockMovement>("/api/admin/inventory/adjustments", {
        body: JSON.stringify(values),
        method: "POST",
      });
      notification.success({
        description: "El movimiento quedo registrado en el historial.",
        message: "Stock ajustado",
      });
      setSelectedProduct(null);
      await load();
    } catch (error) {
      notifyApiError(notification, error);
    } finally {
      setSubmitting(false);
    }
  }

  useEffect(() => {
    void load();
  }, []);

  return (
    <div>
      <AdminPageHeader subtitle="Ajustes manuales e historial de movimientos." title="Inventario" />
      <Tabs
        items={[
          {
            key: "stock",
            label: "Stock",
            children: (
              <Card>
                <Table
                  columns={[
                    { dataIndex: "name", title: "Producto" },
                    { dataIndex: "stock", title: "Stock" },
                    { dataIndex: "lowStockAlert", title: "Alerta" },
                    {
                      render: (_value: unknown, record: InventoryProduct) =>
                        record.trackStock && record.stock <= record.lowStockAlert ? (
                          <Tag color="red">Stock bajo</Tag>
                        ) : (
                          <Tag color="green">OK</Tag>
                        ),
                      title: "Estado",
                    },
                    {
                      render: (_value: unknown, record: InventoryProduct) => (
                        <Button
                          onClick={() => {
                            setSelectedProduct(record);
                            form.setFieldsValue({ productId: record.id, type: "ADJUSTMENT" });
                          }}
                        >
                          Ajustar stock
                        </Button>
                      ),
                      title: "Acciones",
                    },
                  ]}
                  dataSource={products}
                  loading={loading}
                  locale={{
                    emptyText: <AdminEmptyState description="Aun no hay productos con inventario." />,
                  }}
                  rowKey="id"
                  scroll={{ x: "max-content" }}
                />
              </Card>
            ),
          },
          {
            key: "movements",
            label: "Historico de movimientos",
            children: (
              <Card>
                <Table
                  columns={[
                    { dataIndex: ["product", "name"], title: "Producto" },
                    { dataIndex: "type", render: (type: StockMovementType) => <Tag>{type}</Tag>, title: "Tipo" },
                    {
                      dataIndex: "quantity",
                      render: (quantity: number) => (
                        <Tag color={quantity >= 0 ? "green" : "red"}>{quantity}</Tag>
                      ),
                      title: "Cantidad",
                    },
                    { dataIndex: "reason", title: "Razon" },
                    { dataIndex: "createdAt", render: (value: string) => formatDate(value), title: "Fecha" },
                  ]}
                  dataSource={movements}
                  loading={loading}
                  locale={{
                    emptyText: <AdminEmptyState description="Aun no hay movimientos de stock." />,
                  }}
                  rowKey="id"
                  scroll={{ x: "max-content" }}
                />
              </Card>
            ),
          },
        ]}
      />
      <Modal
        okText="Guardar ajuste"
        confirmLoading={submitting}
        onCancel={() => setSelectedProduct(null)}
        onOk={() => form.submit()}
        open={Boolean(selectedProduct)}
        title={`Ajustar stock ${selectedProduct?.name ?? ""}`}
      >
        <Form<AdjustmentValues>
          form={form}
          layout="vertical"
          onFinish={submit}
          validateTrigger={["onBlur", "onChange"]}
        >
          <Form.Item hidden name="productId">
            <Input />
          </Form.Item>
          <Form.Item label="Tipo" name="type" rules={[{ required: true, message: "Selecciona el tipo de ajuste." }]}>
            <Select
              options={[
                { label: "Compra", value: "PURCHASE" },
                { label: "Ajuste", value: "ADJUSTMENT" },
                { label: "Devolucion", value: "RETURN" },
              ]}
            />
          </Form.Item>
          <Space>
            <Form.Item label="Cantidad" name="quantity" rules={inventoryRules.quantity}>
              <InputNumber />
            </Form.Item>
          </Space>
          <Form.Item label="Razon" name="reason" rules={inventoryRules.reason}>
            <Input.TextArea rows={3} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
