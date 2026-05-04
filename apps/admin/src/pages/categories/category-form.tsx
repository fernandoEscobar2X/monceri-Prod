import { App, Button, Card, Form, Input, InputNumber, Skeleton, Switch } from "antd";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AdminPageHeader } from "@/components/admin-page";
import { categoryRules } from "@/components/form-rules";
import { slugify } from "@/components/formatters";
import { notifyApiError } from "@/components/notify";
import { apiRequest } from "@/providers/api-client";
import type { AdminCategory } from "@/types";

type CategoryValues = {
  name: string;
  slug: string;
  description?: string | null;
  image?: string | null;
  sortOrder: number;
  active: boolean;
};

export function CategoryForm() {
  const [form] = Form.useForm<CategoryValues>();
  const navigate = useNavigate();
  const params = useParams();
  const { notification } = App.useApp();
  const [loading, setLoading] = useState(Boolean(params.id));
  const [submitting, setSubmitting] = useState(false);
  const isEdit = Boolean(params.id);

  useEffect(() => {
    if (!params.id) {
      form.setFieldsValue({ active: true, sortOrder: 0 });
      return;
    }

    apiRequest<AdminCategory>(`/api/admin/categories/${params.id}`)
      .then((category) => {
        form.setFieldsValue(category);
      })
      .catch((error: unknown) => notifyApiError(notification, error))
      .finally(() => setLoading(false));
  }, [form, notification, params.id]);

  async function submit(values: CategoryValues) {
    try {
      setSubmitting(true);
      await apiRequest<AdminCategory>(isEdit ? `/api/admin/categories/${params.id}` : "/api/admin/categories", {
        body: JSON.stringify(values),
        method: isEdit ? "PATCH" : "POST",
      });
      notification.success({
        description: "La categoria ya puede organizar productos del catalogo.",
        message: isEdit ? "Categoria actualizada" : "Categoria creada",
      });
      navigate("/categories");
    } catch (error) {
      notifyApiError(notification, error);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div>
      <AdminPageHeader title={isEdit ? "Editar categoria" : "Nueva categoria"} />
      <Card>
        {loading ? (
          <Skeleton active paragraph={{ rows: 8 }} />
        ) : (
          <Form<CategoryValues>
            form={form}
            layout="vertical"
            onFinish={submit}
            validateTrigger={["onBlur", "onChange"]}
          >
          <Form.Item label="Nombre" name="name" rules={categoryRules.name}>
            <Input
              onBlur={(event) => {
                if (!form.getFieldValue("slug")) {
                  form.setFieldValue("slug", slugify(event.target.value));
                }
              }}
            />
          </Form.Item>
          <Form.Item label="Slug" name="slug" rules={categoryRules.slug}>
            <Input />
          </Form.Item>
          <Form.Item label="Descripcion" name="description">
            <Input.TextArea rows={3} />
          </Form.Item>
          <Form.Item label="Imagen" name="image">
            <Input />
          </Form.Item>
          <Form.Item label="Orden" name="sortOrder" rules={categoryRules.sortOrder}>
            <InputNumber min={0} />
          </Form.Item>
          <Form.Item label="Activa" name="active" valuePropName="checked">
            <Switch />
          </Form.Item>
          <Button htmlType="submit" loading={submitting} type="primary">
            Guardar
          </Button>
          </Form>
        )}
      </Card>
    </div>
  );
}
