import { ArrowDownOutlined, ArrowUpOutlined, PlusOutlined } from "@ant-design/icons";
import { App, Button, Space, Tooltip, Upload } from "antd";
import type { UploadFile, UploadProps } from "antd";
import type { ProductImageInput, UploadImageResponse } from "@monceri/shared";
import { API_URL } from "@/providers/api-client";

type ImageUploaderProps = {
  maxCount?: number;
  value?: ProductImageInput[];
  onChange?: (value: ProductImageInput[]) => void;
  uploadLabel?: string;
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

export function ImageUploader({
  maxCount,
  onChange,
  uploadLabel = "Subir",
  value = [],
}: ImageUploaderProps) {
  const { notification } = App.useApp();

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
        const nextImage = {
          alt: "",
          sortOrder: maxCount === 1 ? 0 : value.length,
          thumbnailUrl: result.thumbnailUrl,
          url: result.url,
        };

        update(maxCount === 1 ? [nextImage] : [...value, nextImage]);
        onSuccess?.(result);
      } catch (error) {
        notification.error({
          description: error instanceof Error ? error.message : "Verifica la imagen e intenta de nuevo.",
          duration: 8,
          message: "No se pudo subir la imagen",
        });
        onError?.(error instanceof Error ? error : new Error("No se pudo subir la imagen"));
      }
    },
    fileList: value.map(toUploadFile),
    listType: "picture-card",
    maxCount,
    multiple: maxCount !== 1,
    onRemove: (file) => {
      update(value.filter((image) => image.url !== file.url));
    },
    beforeUpload: (file) => {
      if (!file.type.startsWith("image/")) {
        notification.error({
          description: "Sube un archivo JPG, PNG o WebP.",
          duration: 8,
          message: "Solo imagenes",
        });
        return Upload.LIST_IGNORE;
      }

      if (file.size > 5 * 1024 * 1024) {
        notification.error({
          description: "Reduce el peso de la imagen antes de subirla.",
          duration: 8,
          message: "Maximo 5 MB por imagen",
        });
        return Upload.LIST_IGNORE;
      }

      return true;
    },
  };

  return (
    <>
      {maxCount && value.length >= maxCount ? null : (
        <Upload {...uploadProps}>
          <button style={{ border: 0, background: "none" }} type="button">
            <PlusOutlined />
            <div style={{ marginTop: 8 }}>{uploadLabel}</div>
          </button>
        </Upload>
      )}
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
