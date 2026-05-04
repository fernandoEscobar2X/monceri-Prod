import { Button, Card, Form, Input, InputNumber, Switch, Typography, message } from "antd";
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { slugify } from "@/components/formatters";
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
  const [messageApi, contextHolder] = message.useMessage();
  const isEdit = Boolean(params.id);

  useEffect(() => {
    if (!params.id) {
      form.setFieldsValue({ active: true, sortOrder: 0 });
      return;
    }

    apiRequest<AdminCategory>(`/api/admin/categories/${params.id}`).then((category) => {
      form.setFieldsValue(category);
    });
  }, [form, params.id]);

  async function submit(values: CategoryValues) {
    await apiRequest<AdminCategory>(isEdit ? `/api/admin/categories/${params.id}` : "/api/admin/categories", {
      body: JSON.stringify(values),
      method: isEdit ? "PATCH" : "POST",
    });
    messageApi.success("Categoria guardada");
    navigate("/categories");
  }

  return (
    <div>
      {contextHolder}
      <Typography.Title level={2}>{isEdit ? "Editar categoria" : "Nueva categoria"}</Typography.Title>
      <Card>
        <Form<CategoryValues> form={form} layout="vertical" onFinish={submit}>
          <Form.Item label="Nombre" name="name" rules={[{ required: true }]}>
            <Input
              onBlur={(event) => {
                if (!form.getFieldValue("slug")) {
                  form.setFieldValue("slug", slugify(event.target.value));
                }
              }}
            />
          </Form.Item>
          <Form.Item label="Slug" name="slug" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Descripcion" name="description">
            <Input.TextArea rows={3} />
          </Form.Item>
          <Form.Item label="Imagen" name="image">
            <Input />
          </Form.Item>
          <Form.Item label="Orden" name="sortOrder">
            <InputNumber min={0} />
          </Form.Item>
          <Form.Item label="Activa" name="active" valuePropName="checked">
            <Switch />
          </Form.Item>
          <Button htmlType="submit" type="primary">
            Guardar
          </Button>
        </Form>
      </Card>
    </div>
  );
}
