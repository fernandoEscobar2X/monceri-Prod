import { Button, Card, DatePicker, Form, Input, InputNumber, Select, Switch, Typography, message } from "antd";
import dayjs from "dayjs";
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import type { CouponType } from "@monceri/shared";
import { apiRequest } from "@/providers/api-client";
import type { AdminCoupon } from "@/types";

type CouponValues = {
  code: string;
  type: CouponType;
  value: number;
  minPurchase?: number | null;
  maxUses?: number | null;
  expiresAt?: dayjs.Dayjs | null;
  active: boolean;
};

export function CouponForm() {
  const [form] = Form.useForm<CouponValues>();
  const navigate = useNavigate();
  const params = useParams();
  const [messageApi, contextHolder] = message.useMessage();
  const isEdit = Boolean(params.id);

  useEffect(() => {
    if (!params.id) {
      form.setFieldsValue({ active: true, type: "PERCENTAGE", value: 10 });
      return;
    }

    apiRequest<AdminCoupon>(`/api/admin/coupons/${params.id}`).then((coupon) => {
      form.setFieldsValue({
        ...coupon,
        expiresAt: coupon.expiresAt ? dayjs(coupon.expiresAt) : null,
      });
    });
  }, [form, params.id]);

  async function submit(values: CouponValues) {
    await apiRequest<AdminCoupon>(isEdit ? `/api/admin/coupons/${params.id}` : "/api/admin/coupons", {
      body: JSON.stringify({
        ...values,
        code: values.code.trim().toUpperCase(),
        expiresAt: values.expiresAt ? values.expiresAt.toISOString() : null,
        maxUses: values.maxUses ?? null,
        minPurchase: values.minPurchase ?? null,
      }),
      method: isEdit ? "PATCH" : "POST",
    });
    messageApi.success("Cupon guardado");
    navigate("/coupons");
  }

  return (
    <div>
      {contextHolder}
      <Typography.Title level={2}>{isEdit ? "Editar cupon" : "Nuevo cupon"}</Typography.Title>
      <Card>
        <Form<CouponValues> form={form} layout="vertical" onFinish={submit}>
          <Form.Item label="Codigo" name="code" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Tipo" name="type" rules={[{ required: true }]}>
            <Select
              options={[
                { label: "Porcentaje", value: "PERCENTAGE" },
                { label: "Monto fijo", value: "FIXED_AMOUNT" },
              ]}
            />
          </Form.Item>
          <Form.Item label="Valor" name="value" rules={[{ required: true }]}>
            <InputNumber min={0} />
          </Form.Item>
          <Form.Item label="Compra minima" name="minPurchase">
            <InputNumber min={0} />
          </Form.Item>
          <Form.Item label="Usos maximos" name="maxUses">
            <InputNumber min={1} />
          </Form.Item>
          <Form.Item label="Expira" name="expiresAt">
            <DatePicker />
          </Form.Item>
          <Form.Item label="Activo" name="active" valuePropName="checked">
            <Switch />
          </Form.Item>
          <Button htmlType="submit" type="primary">
            Guardar cupon
          </Button>
        </Form>
      </Card>
    </div>
  );
}
