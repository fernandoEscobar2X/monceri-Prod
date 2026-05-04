import { Button, Card, Form, Input, InputNumber, Select, Space, Switch, Tabs, Typography, message } from "antd";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import type { ProductImageInput, ProductVariantInput } from "@monceri/shared";
import { slugify } from "@/components/formatters";
import { apiRequest } from "@/providers/api-client";
import type { AdminCategory, AdminProduct } from "@/types";
import { ImageUploader } from "./image-uploader";

type ProductValues = {
  name: string;
  slug: string;
  description: string;
  basePrice: number;
  comparePrice?: number | null;
  categoryId: string;
  featured: boolean;
  trackStock: boolean;
  stock: number;
  lowStockAlert: number;
  active: boolean;
  metaTitle?: string | null;
  metaDescription?: string | null;
  images: ProductImageInput[];
  variants: ProductVariantInput[];
};

export function ProductForm() {
  const [form] = Form.useForm<ProductValues>();
  const navigate = useNavigate();
  const params = useParams();
  const [categories, setCategories] = useState<AdminCategory[]>([]);
  const [messageApi, contextHolder] = message.useMessage();
  const isEdit = Boolean(params.id);

  useEffect(() => {
    apiRequest<AdminCategory[]>("/api/admin/categories").then(setCategories);

    if (!params.id) {
      form.setFieldsValue({
        active: true,
        basePrice: 0,
        featured: false,
        images: [],
        lowStockAlert: 5,
        stock: 0,
        trackStock: true,
        variants: [],
      });
      return;
    }

    apiRequest<AdminProduct>(`/api/admin/products/${params.id}`).then((product) => {
      form.setFieldsValue({
        ...product,
        images: product.images.map((image) => ({
          alt: image.alt,
          sortOrder: image.sortOrder,
          thumbnailUrl: image.thumbnailUrl,
          url: image.url,
        })),
        variants: product.variants.map((variant) => ({
          active: variant.active,
          name: variant.name,
          priceAdjust: variant.priceAdjust,
          stock: variant.stock,
          value: variant.value,
        })),
      });
    });
  }, [form, params.id]);

  async function submit(values: ProductValues) {
    const payload = {
      ...values,
      comparePrice: values.comparePrice || null,
      metaDescription: values.metaDescription || null,
      metaTitle: values.metaTitle || null,
    };

    await apiRequest<AdminProduct>(isEdit ? `/api/admin/products/${params.id}` : "/api/admin/products", {
      body: JSON.stringify(payload),
      method: isEdit ? "PATCH" : "POST",
    });
    messageApi.success("Producto guardado");
    navigate("/products");
  }

  return (
    <div>
      {contextHolder}
      <Typography.Title level={2}>{isEdit ? "Editar producto" : "Nuevo producto"}</Typography.Title>
      <Card>
        <Form<ProductValues> form={form} layout="vertical" onFinish={submit}>
          <Tabs
            items={[
              {
                key: "general",
                label: "General",
                children: (
                  <>
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
                    <Form.Item label="Descripcion" name="description" rules={[{ required: true }]}>
                      <Input.TextArea rows={5} />
                    </Form.Item>
                    <Form.Item label="Categoria" name="categoryId" rules={[{ required: true }]}>
                      <Select
                        options={categories.map((category) => ({
                          label: category.name,
                          value: category.id,
                        }))}
                      />
                    </Form.Item>
                    <Space wrap>
                      <Form.Item label="Precio base" name="basePrice" rules={[{ required: true }]}>
                        <InputNumber min={0} />
                      </Form.Item>
                      <Form.Item label="Precio tachado" name="comparePrice">
                        <InputNumber min={0} />
                      </Form.Item>
                    </Space>
                    <Space>
                      <Form.Item label="Destacado" name="featured" valuePropName="checked">
                        <Switch />
                      </Form.Item>
                      <Form.Item label="Activo" name="active" valuePropName="checked">
                        <Switch />
                      </Form.Item>
                    </Space>
                  </>
                ),
              },
              {
                key: "images",
                label: "Imagenes",
                children: (
                  <Form.Item name="images">
                    <ImageUploader />
                  </Form.Item>
                ),
              },
              {
                key: "variants",
                label: "Variantes",
                children: (
                  <Form.List name="variants">
                    {(fields, { add, remove }) => (
                      <Space direction="vertical" style={{ width: "100%" }}>
                        {fields.map((field) => (
                          <Space align="baseline" key={field.key} wrap>
                            <Form.Item label="Nombre" name={[field.name, "name"]} rules={[{ required: true }]}>
                              <Input placeholder="Tamano" />
                            </Form.Item>
                            <Form.Item label="Valor" name={[field.name, "value"]} rules={[{ required: true }]}>
                              <Input placeholder="50cm" />
                            </Form.Item>
                            <Form.Item label="Ajuste precio" name={[field.name, "priceAdjust"]}>
                              <InputNumber min={0} />
                            </Form.Item>
                            <Form.Item label="Stock variante" name={[field.name, "stock"]}>
                              <InputNumber />
                            </Form.Item>
                            <Form.Item label="Activa" name={[field.name, "active"]} valuePropName="checked">
                              <Switch defaultChecked />
                            </Form.Item>
                            <Button danger icon={<MinusCircleOutlined />} onClick={() => remove(field.name)} />
                          </Space>
                        ))}
                        <Button icon={<PlusOutlined />} onClick={() => add({ active: true, priceAdjust: 0 })}>
                          Agregar variante
                        </Button>
                      </Space>
                    )}
                  </Form.List>
                ),
              },
              {
                key: "inventory",
                label: "Inventario",
                children: (
                  <Space wrap>
                    <Form.Item label="Controlar stock" name="trackStock" valuePropName="checked">
                      <Switch />
                    </Form.Item>
                    <Form.Item label="Stock" name="stock">
                      <InputNumber min={0} />
                    </Form.Item>
                    <Form.Item label="Alerta stock bajo" name="lowStockAlert">
                      <InputNumber min={0} />
                    </Form.Item>
                  </Space>
                ),
              },
              {
                key: "seo",
                label: "SEO",
                children: (
                  <>
                    <Form.Item label="Meta title" name="metaTitle">
                      <Input />
                    </Form.Item>
                    <Form.Item label="Meta description" name="metaDescription">
                      <Input.TextArea rows={3} />
                    </Form.Item>
                  </>
                ),
              },
            ]}
          />
          <Button htmlType="submit" type="primary">
            Guardar producto
          </Button>
        </Form>
      </Card>
    </div>
  );
}
