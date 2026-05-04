import { ArrowDownOutlined, ArrowUpOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Space, Tooltip, Upload, message } from "antd";
import type { UploadFile, UploadProps } from "antd";
import type { ProductImageInput, UploadImageResponse } from "@monceri/shared";
import { API_URL } from "@/providers/api-client";

type ImageUploaderProps = {
  value?: ProductImageInput[];
  onChange?: (value: ProductImageInput[]) => void;
};

function toUploadFile(image: ProductImageInput, index: number): UploadFile {
  return {
    name: image.alt || `Imagen ${index + 1}`,
    status: "done",
    thumbUrl: image.thumbnailUrl ?? image.url,
    uid: `${image.url}-${index}`,
    url: image.url,
  };
}

function swapImages(images: ProductImageInput[], from: number, to: number) {
  const next = [...images];
  const current = next[from];
  next[from] = next[to];
  next[to] = current;
  return next;
}

export function ImageUploader({ onChange, value = [] }: ImageUploaderProps) {
  const [messageApi, contextHolder] = message.useMessage();

  function update(next: ProductImageInput[]) {
    onChange?.(next.map((image, index) => ({ ...image, sortOrder: index })));
  }

  const uploadProps: UploadProps = {
    customRequest: async ({ file, onError, onSuccess }) => {
      const formData = new FormData();
      formData.append("file", file);

      try {
        const response = await fetch(`${API_URL}/api/admin/uploads`, {
          body: formData,
          credentials: "include",
          method: "POST",
        });

        if (!response.ok) {
          throw new Error("No se pudo subir la imagen");
        }

        const result = (await response.json()) as UploadImageResponse;
        update([
          ...value,
          {
            alt: "",
            sortOrder: value.length,
            thumbnailUrl: result.thumbnailUrl,
            url: result.url,
          },
        ]);
        onSuccess?.(result);
      } catch (error) {
        messageApi.error(error instanceof Error ? error.message : "No se pudo subir la imagen");
        onError?.(error instanceof Error ? error : new Error("No se pudo subir la imagen"));
      }
    },
    fileList: value.map(toUploadFile),
    listType: "picture-card",
    multiple: true,
    onRemove: (file) => {
      update(value.filter((image) => image.url !== file.url));
    },
    beforeUpload: (file) => {
      if (!file.type.startsWith("image/")) {
        messageApi.error("Solo imagenes");
        return Upload.LIST_IGNORE;
      }

      if (file.size > 5 * 1024 * 1024) {
        messageApi.error("Maximo 5 MB por imagen");
        return Upload.LIST_IGNORE;
      }

      return true;
    },
  };

  return (
    <>
      {contextHolder}
      <Upload {...uploadProps}>
        <button style={{ border: 0, background: "none" }} type="button">
          <PlusOutlined />
          <div style={{ marginTop: 8 }}>Subir</div>
        </button>
      </Upload>
      <Space wrap>
        {value.map((image, index) => (
          <Space key={image.url}>
            <Tooltip title="Mover arriba">
              <Button
                aria-label="Mover arriba"
                disabled={index === 0}
                icon={<ArrowUpOutlined />}
                onClick={() => update(swapImages(value, index, index - 1))}
              />
            </Tooltip>
            <Tooltip title="Mover abajo">
              <Button
                aria-label="Mover abajo"
                disabled={index === value.length - 1}
                icon={<ArrowDownOutlined />}
                onClick={() => update(swapImages(value, index, index + 1))}
              />
            </Tooltip>
          </Space>
        ))}
      </Space>
    </>
  );
}
