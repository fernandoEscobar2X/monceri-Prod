import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import {
  App,
  Button,
  Card,
  Collapse,
  Form,
  Grid,
  Input,
  InputNumber,
  Select,
  Skeleton,
  Space,
  Switch,
  Tabs,
  Tooltip,
  Typography,
} from "antd";
import type { FormProps } from "antd";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import type { ProductImageInput, ProductVariantInput } from "@monceri/shared";
import { AdminPageHeader } from "@/components/admin-page";
import { productRules } from "@/components/form-rules";
import { slugify } from "@/components/formatters";
import { notifyApiError } from "@/components/notify";
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

const defaultProductValues: Partial<ProductValues> = {
  active: true,
  basePrice: 0,
  featured: false,
  images: [],
  lowStockAlert: 5,
  stock: 0,
  trackStock: true,
  variants: [],
};

function sectionForField(namePath: (number | string)[]) {
  const root = String(namePath[0] ?? "");

  if (root === "images") {
    return "images";
  }

  if (root === "variants") {
    return "variants";
  }

  if (["trackStock", "stock", "lowStockAlert"].includes(root)) {
    return "inventory";
  }

  if (["metaTitle", "metaDescription"].includes(root)) {
    return "seo";
  }

  return "general";
}

export function ProductForm() {
  const [form] = Form.useForm<ProductValues>();
  const navigate = useNavigate();
  const params = useParams();
  const { notification } = App.useApp();
  const screens = Grid.useBreakpoint();
  const isMobile = screens.xs && !screens.md;
  const [categories, setCategories] = useState<AdminCategory[]>([]);
  const [loading, setLoading] = useState(Boolean(params.id));
  const [submitting, setSubmitting] = useState(false);
  const [hasErrors, setHasErrors] = useState(false);
  const [activeSection, setActiveSection] = useState("general");
  const isEdit = Boolean(params.id);
  const basePrice = Form.useWatch("basePrice", form) ?? 0;
  const trackStock = Form.useWatch("trackStock", form);
  const variants = Form.useWatch("variants", form) ?? [];
  const variantStockTotal = variants.reduce((total, variant) => total + Number(variant.stock ?? 0), 0);

  useEffect(() => {
    apiRequest<AdminCategory[]>("/api/admin/categories")
      .then(setCategories)
      .catch((error: unknown) => notifyApiError(notification, error));

    if (!params.id) {
      form.setFieldsValue(defaultProductValues);
      setLoading(false);
      return;
    }

    apiRequest<AdminProduct>(`/api/admin/products/${params.id}`)
      .then((product) => {
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
      })
      .catch((error: unknown) => notifyApiError(notification, error))
      .finally(() => setLoading(false));
  }, [form, notification, params.id]);

  async function submit(values: ProductValues) {
    const payload = {
      ...values,
      comparePrice: values.comparePrice || null,
      metaDescription: values.metaDescription || null,
      metaTitle: values.metaTitle || null,
    };

    try {
      setSubmitting(true);
      await apiRequest<AdminProduct>(isEdit ? `/api/admin/products/${params.id}` : "/api/admin/products", {
        body: JSON.stringify(payload),
        method: isEdit ? "PATCH" : "POST",
      });
      notification.success({
        description: "El producto ya esta disponible en el catalogo publico.",
        message: isEdit ? "Producto actualizado" : "Producto creado",
      });
      navigate("/products");
    } catch (error) {
      notifyApiError(notification, error);
    } finally {
      setSubmitting(false);
    }
  }

  const handleFinishFailed: FormProps<ProductValues>["onFinishFailed"] = ({ errorFields }) => {
    const firstField = errorFields[0]?.name ?? ["general"];
    setActiveSection(sectionForField(firstField));
    notification.error({
      description: "Revisa los campos marcados en rojo antes de guardar.",
      duration: 8,
      message: "Hay datos por corregir",
    });
  };

  const generalSection = (
    <>
      <Form.Item label="Nombre" name="name" rules={productRules.name}>
        <Input
          onBlur={(event) => {
            if (!form.getFieldValue("slug")) {
              form.setFieldValue("slug", slugify(event.target.value));
            }
          }}
        />
      </Form.Item>
      <Form.Item label="Slug" name="slug" rules={productRules.slug}>
        <Input />
      </Form.Item>
      <Form.Item label="Descripcion" name="description" rules={productRules.description}>
        <Input.TextArea rows={5} />
      </Form.Item>
      <Form.Item label="Categoria" name="categoryId" rules={productRules.categoryId}>
        <Select
          options={categories.map((category) => ({
            label: category.name,
            value: category.id,
          }))}
        />
      </Form.Item>
      <Space wrap>
        <Form.Item label="Precio base" name="basePrice" rules={productRules.basePrice}>
          <InputNumber min={0} style={{ width: isMobile ? "100%" : 180 }} />
        </Form.Item>
        <Form.Item
          label="Precio tachado"
          name="comparePrice"
          rules={[
            {
              validator: async (_rule, value?: number | null) => {
                if (value && value <= basePrice) {
                  throw new Error("El precio tachado debe ser mayor al precio base.");
                }
              },
            },
          ]}
        >
          <InputNumber min={0} style={{ width: isMobile ? "100%" : 180 }} />
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
  );

  const imageSection = (
    <Form.Item
      name="images"
      rules={[
        {
          validator: async (_rule, value?: ProductImageInput[]) => {
            if (!value || value.length === 0) {
              throw new Error("Sube al menos una imagen del producto.");
            }
          },
        },
      ]}
    >
      <ImageUploader />
    </Form.Item>
  );

  const variantsSection = (
    <Form.List name="variants">
      {(fields, { add, remove }) => (
        <Space direction="vertical" style={{ width: "100%" }}>
          {variantStockTotal > 0 ? (
            <Tooltip title="Se calcula con las variantes que tienen stock definido.">
              <Typography.Text type="secondary">Stock total con variantes: {variantStockTotal}</Typography.Text>
            </Tooltip>
          ) : null}
          {fields.map((field) => (
            <Space align="baseline" key={field.key} wrap>
              <Form.Item label="Nombre" name={[field.name, "name"]} rules={productRules.variantName}>
                <Input placeholder="Tamano" />
              </Form.Item>
              <Form.Item label="Valor" name={[field.name, "value"]} rules={productRules.variantValue}>
                <Input placeholder="45cm" />
              </Form.Item>
              <Form.Item
                label="Ajuste precio"
                name={[field.name, "priceAdjust"]}
                rules={[
                  {
                    validator: async (_rule, value?: number) => {
                      if (Number(value ?? 0) < -basePrice) {
                        throw new Error("El ajuste no puede dejar el precio debajo de $0.");
                      }
                    },
                  },
                ]}
              >
                <InputNumber />
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
  );

  const inventorySection = (
    <Space wrap>
      <Form.Item label="Controlar stock" name="trackStock" valuePropName="checked">
        <Switch />
      </Form.Item>
      <Form.Item label="Stock" name="stock">
        <InputNumber disabled={trackStock === false} min={0} />
      </Form.Item>
      <Form.Item label="Alerta stock bajo" name="lowStockAlert">
        <InputNumber disabled={trackStock === false} min={0} />
      </Form.Item>
    </Space>
  );

  const seoSection = (
    <>
      <Form.Item label="Meta title" name="metaTitle" rules={productRules.metaTitle}>
        <Input showCount maxLength={70} />
      </Form.Item>
      <Form.Item label="Meta description" name="metaDescription" rules={productRules.metaDescription}>
        <Input.TextArea showCount maxLength={160} rows={3} />
      </Form.Item>
    </>
  );

  const sections = [
    { children: generalSection, key: "general", label: "General" },
    { children: imageSection, key: "images", label: "Imagenes" },
    { children: variantsSection, key: "variants", label: "Variantes" },
    { children: inventorySection, key: "inventory", label: "Inventario" },
    { children: seoSection, key: "seo", label: "SEO" },
  ];

  return (
    <div>
      <AdminPageHeader title={isEdit ? "Editar producto" : "Nuevo producto"} />
      <Card>
        {loading ? (
          <Skeleton active paragraph={{ rows: 14 }} />
        ) : (
          <Form<ProductValues>
            form={form}
            layout="vertical"
            onFieldsChange={() => {
              setHasErrors(form.getFieldsError().some((field) => field.errors.length > 0));
            }}
            onFinish={submit}
            onFinishFailed={handleFinishFailed}
            validateTrigger={["onBlur", "onChange"]}
          >
            {isMobile ? (
              <Collapse
                activeKey={[activeSection]}
                items={sections}
                onChange={(keys) => setActiveSection(String(Array.isArray(keys) ? keys[0] : keys))}
              />
            ) : (
              <Tabs activeKey={activeSection} items={sections} onChange={setActiveSection} />
            )}
            <Button disabled={hasErrors} htmlType="submit" loading={submitting} type="primary">
              Guardar producto
            </Button>
          </Form>
        )}
      </Card>
    </div>
  );
}
