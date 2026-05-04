import { App, Button, Card, DatePicker, Form, Input, InputNumber, Select, Skeleton, Switch, Typography } from "antd";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import type { CouponType } from "@monceri/shared";
import { AdminPageHeader } from "@/components/admin-page";
import { couponRules } from "@/components/form-rules";
import { notifyApiError } from "@/components/notify";
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
  const { notification } = App.useApp();
  const [loading, setLoading] = useState(Boolean(params.id));
  const [submitting, setSubmitting] = useState(false);
  const isEdit = Boolean(params.id);
  const type = Form.useWatch("type", form);
  const value = Form.useWatch("value", form);

  useEffect(() => {
    if (!params.id) {
      form.setFieldsValue({ active: true, type: "PERCENTAGE", value: 10 });
      return;
    }

    apiRequest<AdminCoupon>(`/api/admin/coupons/${params.id}`)
      .then((coupon) => {
        form.setFieldsValue({
          ...coupon,
          expiresAt: coupon.expiresAt ? dayjs(coupon.expiresAt) : null,
        });
      })
      .catch((error: unknown) => notifyApiError(notification, error))
      .finally(() => setLoading(false));
  }, [form, notification, params.id]);

  async function submit(values: CouponValues) {
    try {
      setSubmitting(true);
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
      notification.success({
        description: "El cupon quedo listo para validarse al crear pedidos.",
        message: isEdit ? "Cupon actualizado" : "Cupon creado",
      });
      navigate("/coupons");
    } catch (error) {
      notifyApiError(notification, error);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div>
      <AdminPageHeader title={isEdit ? "Editar cupon" : "Nuevo cupon"} />
      <Card>
        {loading ? (
          <Skeleton active paragraph={{ rows: 8 }} />
        ) : (
          <Form<CouponValues>
            form={form}
            layout="vertical"
            onFinish={submit}
            validateTrigger={["onBlur", "onChange"]}
          >
          <Form.Item label="Codigo" name="code" rules={couponRules.code}>
            <Input onBlur={() => form.setFieldValue("code", form.getFieldValue("code")?.trim().toUpperCase())} />
          </Form.Item>
          <Form.Item label="Tipo" name="type" rules={couponRules.type}>
            <Select
              options={[
                { label: "Porcentaje", value: "PERCENTAGE" },
                { label: "Monto fijo", value: "FIXED_AMOUNT" },
              ]}
            />
          </Form.Item>
          <Form.Item
            label="Valor"
            name="value"
            rules={[
              ...couponRules.value,
              {
                validator: async () => {
                  if (type === "PERCENTAGE" && Number(value) > 100) {
                    throw new Error("El porcentaje no puede ser mayor a 100.");
                  }
                },
              },
            ]}
          >
            <InputNumber min={0} />
          </Form.Item>
          {value ? (
            <Typography.Text type="secondary">
              Aplicado a $1,000 = ahorras {type === "PERCENTAGE" ? `$${Math.round((1000 * value) / 100)}` : `$${value}`}
            </Typography.Text>
          ) : null}
          <Form.Item label="Compra minima" name="minPurchase">
            <InputNumber min={0} />
          </Form.Item>
          <Form.Item label="Usos maximos" name="maxUses" rules={couponRules.maxUses}>
            <InputNumber min={1} />
          </Form.Item>
          <Form.Item
            label="Expira"
            name="expiresAt"
            rules={[
              {
                validator: async (_rule, nextValue?: dayjs.Dayjs | null) => {
                  if (nextValue && nextValue.isBefore(dayjs(), "day")) {
                    throw new Error("La fecha de expiracion debe ser futura.");
                  }
                },
              },
            ]}
          >
            <DatePicker />
          </Form.Item>
          <Form.Item label="Activo" name="active" valuePropName="checked">
            <Switch />
          </Form.Item>
          <Button htmlType="submit" loading={submitting} type="primary">
            Guardar cupon
          </Button>
          </Form>
        )}
      </Card>
    </div>
  );
}
