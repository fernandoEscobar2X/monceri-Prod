import { Button, Card, Form, Input, InputNumber, Modal, Select, Space, Table, Tabs, Tag, Typography, message } from "antd";
import { useEffect, useState } from "react";
import type { StockMovementType } from "@monceri/shared";
import { formatDate } from "@/components/formatters";
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
  const [messageApi, contextHolder] = message.useMessage();

  async function load() {
    setProducts(await apiRequest<InventoryProduct[]>("/api/admin/inventory/stock"));
    setMovements(await apiRequest<StockMovement[]>("/api/admin/inventory/movements"));
  }

  async function submit(values: AdjustmentValues) {
    await apiRequest<StockMovement>("/api/admin/inventory/adjustments", {
      body: JSON.stringify(values),
      method: "POST",
    });
    messageApi.success("Stock ajustado");
    setSelectedProduct(null);
    await load();
  }

  useEffect(() => {
    void load();
  }, []);

  return (
    <div>
      {contextHolder}
      <Typography.Title level={2}>Inventario</Typography.Title>
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
        onCancel={() => setSelectedProduct(null)}
        onOk={() => form.submit()}
        open={Boolean(selectedProduct)}
        title={`Ajustar stock ${selectedProduct?.name ?? ""}`}
      >
        <Form<AdjustmentValues> form={form} layout="vertical" onFinish={submit}>
          <Form.Item hidden name="productId">
            <Input />
          </Form.Item>
          <Form.Item label="Tipo" name="type" rules={[{ required: true }]}>
            <Select
              options={[
                { label: "Compra", value: "PURCHASE" },
                { label: "Ajuste", value: "ADJUSTMENT" },
                { label: "Devolucion", value: "RETURN" },
              ]}
            />
          </Form.Item>
          <Space>
            <Form.Item label="Cantidad" name="quantity" rules={[{ required: true }]}>
              <InputNumber />
            </Form.Item>
          </Space>
          <Form.Item label="Razon" name="reason" rules={[{ required: true }]}>
            <Input.TextArea rows={3} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
