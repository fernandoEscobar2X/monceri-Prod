import {
  ArrowDownOutlined,
  ArrowUpOutlined,
  DeleteOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import {
  Alert,
  App,
  Avatar,
  Button,
  Card,
  Collapse,
  DatePicker,
  Form,
  Grid,
  Input,
  InputNumber,
  List,
  Modal,
  Popconfirm,
  Select,
  Skeleton,
  Space,
  Switch,
  Tabs,
  Typography,
} from "antd";
import type { FormProps } from "antd";
import dayjs from "dayjs";
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import type { ProductImageInput } from "@monceri/shared";
import { AdminPageHeader } from "@/components/admin-page";
import { collectionRules } from "@/components/form-rules";
import { formatMoney, slugify } from "@/components/formatters";
import { notifyApiError } from "@/components/notify";
import { API_URL, apiRequest } from "@/providers/api-client";
import type { AdminCollection, AdminProduct } from "@/types";
import { ImageUploader } from "@/pages/products/image-uploader";

type ProductListResponse = {
  items: AdminProduct[];
  total: number;
};

type CollectionValues = {
  active: boolean;
  bannerImages: ProductImageInput[];
  ctaLabel?: string | null;
  description?: string | null;
  endsAt?: dayjs.Dayjs | null;
  name: string;
  popupImages: ProductImageInput[];
  productIds: string[];
  showInPopup: boolean;
  slug: string;
  sortOrder: number;
  startsAt?: dayjs.Dayjs | null;
  tagline?: string | null;
};

const defaultValues: Partial<CollectionValues> = {
  active: true,
  bannerImages: [],
  popupImages: [],
  productIds: [],
  showInPopup: false,
  sortOrder: 0,
};

function imageUrl(src?: null | string) {
  if (!src) {
    return undefined;
  }

  return src.startsWith("/uploads") ? `${API_URL}${src}` : src;
}

function imageInput(url?: null | string, thumbnailUrl?: null | string): ProductImageInput[] {
  if (!url) {
    return [];
  }

  return [{ alt: "", sortOrder: 0, thumbnailUrl: thumbnailUrl ?? url, url }];
}

function moveItem(items: string[], from: number, to: number) {
  const next = [...items];
  const current = next[from];
  next[from] = next[to];
  next[to] = current;
  return next;
}

function sectionForField(namePath: (number | string)[]) {
  const root = String(namePath[0] ?? "");

  if (["bannerImages", "popupImages"].includes(root)) {
    return "images";
  }

  if (["startsAt", "endsAt"].includes(root)) {
    return "validity";
  }

  if (root === "productIds") {
    return "products";
  }

  return "general";
}

export function CollectionForm() {
  const [form] = Form.useForm<CollectionValues>();
  const navigate = useNavigate();
  const params = useParams();
  const { notification } = App.useApp();
  const screens = Grid.useBreakpoint();
  const isMobile = screens.xs && !screens.md;
  const [allProducts, setAllProducts] = useState<AdminProduct[]>([]);
  const [loading, setLoading] = useState(Boolean(params.id));
  const [submitting, setSubmitting] = useState(false);
  const [selectorOpen, setSelectorOpen] = useState(false);
  const [selectorValue, setSelectorValue] = useState<string[]>([]);
  const [hasErrors, setHasErrors] = useState(false);
  const [activeSection, setActiveSection] = useState("general");
  const isEdit = Boolean(params.id);
  const productIds = Form.useWatch("productIds", form) ?? [];
  const showInPopup = Form.useWatch("showInPopup", form);
  const startsAt = Form.useWatch("startsAt", form);
  const selectedProducts = useMemo(
    () =>
      productIds
        .map((productId) => allProducts.find((product) => product.id === productId))
        .filter((product): product is AdminProduct => Boolean(product)),
    [allProducts, productIds],
  );

  useEffect(() => {
    async function load() {
      try {
        const productsResponse = await apiRequest<ProductListResponse>("/api/admin/products?pageSize=50");
        setAllProducts(productsResponse.items);

        if (!params.id) {
          form.setFieldsValue(defaultValues);
          return;
        }

        const collection = await apiRequest<AdminCollection>(`/api/admin/collections/${params.id}`);
        form.setFieldsValue({
          active: collection.active,
          bannerImages: imageInput(collection.bannerImageUrl, collection.bannerImageThumbnailUrl),
          ctaLabel: collection.ctaLabel,
          description: collection.description,
          endsAt: collection.endsAt ? dayjs(collection.endsAt) : null,
          name: collection.name,
          popupImages: imageInput(collection.popupImageUrl, collection.popupImageThumbnailUrl),
          productIds: collection.products.map((product) => product.id),
          showInPopup: collection.showInPopup,
          slug: collection.slug,
          sortOrder: collection.sortOrder,
          startsAt: collection.startsAt ? dayjs(collection.startsAt) : null,
          tagline: collection.tagline,
        });
      } catch (error) {
        notifyApiError(notification, error);
      } finally {
        setLoading(false);
      }
    }

    void load();
  }, [form, notification, params.id]);

  async function submit(values: CollectionValues) {
    const banner = values.bannerImages[0];
    const popup = values.popupImages[0];
    const payload = {
      active: values.active,
      bannerImageThumbnailUrl: banner?.thumbnailUrl ?? null,
      bannerImageUrl: banner?.url ?? null,
      ctaLabel: values.ctaLabel || null,
      description: values.description || null,
      endsAt: values.endsAt ? values.endsAt.toISOString() : null,
      name: values.name,
      popupImageThumbnailUrl: popup?.thumbnailUrl ?? null,
      popupImageUrl: popup?.url ?? null,
      showInPopup: values.showInPopup,
      slug: values.slug,
      sortOrder: values.sortOrder,
      startsAt: values.startsAt ? values.startsAt.toISOString() : null,
      tagline: values.tagline || null,
    };

    try {
      setSubmitting(true);
      const collection = await apiRequest<AdminCollection>(
        isEdit ? `/api/admin/collections/${params.id}` : "/api/admin/collections",
        {
          body: JSON.stringify(payload),
          method: isEdit ? "PATCH" : "POST",
        },
      );
      await apiRequest<AdminCollection>(`/api/admin/collections/${collection.id}/products`, {
        body: JSON.stringify({ productIds: values.productIds }),
        method: "POST",
      });
      notification.success({
        description: values.showInPopup
          ? "Si habia otra temporada en popup, se desactivo automaticamente."
          : "La temporada quedo lista para mostrarse cuando este vigente.",
        message: isEdit ? "Temporada actualizada" : "Temporada creada",
      });
      navigate("/collections");
    } catch (error) {
      notifyApiError(notification, error);
    } finally {
      setSubmitting(false);
    }
  }

  const handleFinishFailed: FormProps<CollectionValues>["onFinishFailed"] = ({ errorFields }) => {
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
      <Form.Item label="Nombre" name="name" rules={collectionRules.name}>
        <Input
          onBlur={(event) => {
            if (!form.getFieldValue("slug")) {
              form.setFieldValue("slug", slugify(event.target.value));
            }
          }}
        />
      </Form.Item>
      <Form.Item label="Slug" name="slug" rules={collectionRules.slug}>
        <Input />
      </Form.Item>
      <Form.Item label="Texto corto" name="tagline" rules={collectionRules.tagline}>
        <Input showCount maxLength={120} placeholder="Temporada de verano 2026" />
      </Form.Item>
      <Form.Item label="Descripcion" name="description" rules={collectionRules.description}>
        <Input.TextArea showCount maxLength={1000} rows={5} />
      </Form.Item>
      <Form.Item label="Texto del boton" name="ctaLabel" rules={collectionRules.ctaLabel}>
        <Input showCount maxLength={30} placeholder="Ver coleccion" />
      </Form.Item>
      <Space wrap>
        <Form.Item label="Activa" name="active" valuePropName="checked">
          <Switch />
        </Form.Item>
        <Form.Item label="Mostrar en popup" name="showInPopup" valuePropName="checked">
          <Switch />
        </Form.Item>
        <Form.Item label="Orden" name="sortOrder">
          <InputNumber />
        </Form.Item>
      </Space>
      {showInPopup ? (
        <Alert
          showIcon
          message="Solo una temporada puede aparecer en popup. Al guardar, se desactivara el popup en las demas."
          type="warning"
        />
      ) : null}
    </>
  );

  const imageSection = (
    <Space direction="vertical" size="large" style={{ width: "100%" }}>
      <div>
        <Typography.Text strong>Banner</Typography.Text>
        <Typography.Paragraph type="secondary">
          Imagen principal para el home y la pagina de temporada.
        </Typography.Paragraph>
        <Form.Item name="bannerImages">
          <ImageUploader maxCount={1} uploadLabel="Subir banner" />
        </Form.Item>
      </div>
      <div>
        <Typography.Text strong>Popup</Typography.Text>
        <Typography.Paragraph type="secondary">
          Opcional. Si no subes una imagen especifica, se usa la del banner.
        </Typography.Paragraph>
        <Form.Item name="popupImages">
          <ImageUploader maxCount={1} uploadLabel="Subir popup" />
        </Form.Item>
      </div>
    </Space>
  );

  const validitySection = (
    <Space direction={isMobile ? "vertical" : "horizontal"} size="large" style={{ width: "100%" }}>
      <Form.Item label="Inicio" name="startsAt">
        <DatePicker showTime placeholder="Sin inicio fijo" style={{ width: "100%" }} />
      </Form.Item>
      <Form.Item
        label="Fin"
        name="endsAt"
        rules={[
          {
            validator: async (_rule, value?: dayjs.Dayjs | null) => {
              if (startsAt && value && value.isBefore(startsAt)) {
                throw new Error("La fecha de fin debe ser posterior a la fecha de inicio.");
              }
            },
          },
        ]}
      >
        <DatePicker showTime placeholder="Sin expiracion" style={{ width: "100%" }} />
      </Form.Item>
    </Space>
  );

  const productsSection = (
    <Space direction="vertical" style={{ width: "100%" }}>
      <Button
        icon={<PlusOutlined />}
        onClick={() => {
          setSelectorValue(productIds);
          setSelectorOpen(true);
        }}
        type="primary"
      >
        Agregar productos
      </Button>
      <Form.Item hidden name="productIds">
        <Select mode="multiple" options={[]} />
      </Form.Item>
      <List
        dataSource={selectedProducts}
        locale={{ emptyText: "Aun no hay productos asociados." }}
        renderItem={(product, index) => (
          <List.Item
            actions={[
              <Button
                aria-label="Mover arriba"
                disabled={index === 0}
                icon={<ArrowUpOutlined />}
                key="up"
                onClick={() => form.setFieldValue("productIds", moveItem(productIds, index, index - 1))}
              />,
              <Button
                aria-label="Mover abajo"
                disabled={index === selectedProducts.length - 1}
                icon={<ArrowDownOutlined />}
                key="down"
                onClick={() => form.setFieldValue("productIds", moveItem(productIds, index, index + 1))}
              />,
              <Popconfirm
                key="remove"
                okText="Quitar"
                onConfirm={() =>
                  form.setFieldValue(
                    "productIds",
                    productIds.filter((productId) => productId !== product.id),
                  )
                }
                title={`Quitar "${product.name}" de esta temporada?`}
              >
                <Button danger icon={<DeleteOutlined />} />
              </Popconfirm>,
            ]}
          >
            <List.Item.Meta
              avatar={<Avatar shape="square" size={56} src={imageUrl(product.thumbnail ?? product.images[0]?.url)} />}
              description={formatMoney(product.basePrice)}
              title={product.name}
            />
          </List.Item>
        )}
      />
    </Space>
  );

  const sections = [
    { children: generalSection, key: "general", label: "General" },
    { children: imageSection, key: "images", label: "Imagenes" },
    { children: validitySection, key: "validity", label: "Vigencia" },
    { children: productsSection, key: "products", label: "Productos" },
  ];

  return (
    <div>
      <AdminPageHeader title={isEdit ? "Editar temporada" : "Nueva temporada"} />
      <Card>
        {loading ? (
          <Skeleton active paragraph={{ rows: 14 }} />
        ) : (
          <Form<CollectionValues>
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
              Guardar temporada
            </Button>
          </Form>
        )}
      </Card>
      <Modal
        okText="Agregar seleccion"
        onCancel={() => setSelectorOpen(false)}
        onOk={() => {
          form.setFieldValue("productIds", selectorValue);
          setSelectorOpen(false);
        }}
        open={selectorOpen}
        title="Agregar productos a la temporada"
      >
        <Select
          mode="multiple"
          onChange={setSelectorValue}
          optionFilterProp="label"
          options={allProducts.map((product) => ({
            label: product.name,
            value: product.id,
          }))}
          placeholder="Selecciona productos"
          style={{ width: "100%" }}
          value={selectorValue}
        />
      </Modal>
    </div>
  );
}
