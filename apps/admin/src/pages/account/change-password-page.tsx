import { App, Alert, Button, Card, Form, Input, Typography } from "antd";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiRequest, ApiClientError } from "@/providers/api-client";

type ChangePasswordValues = {
  confirmNewPassword: string;
  currentPassword: string;
  newPassword: string;
};

export function ChangePasswordPage() {
  const [form] = Form.useForm<ChangePasswordValues>();
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();
  const { notification } = App.useApp();

  async function submit(values: ChangePasswordValues) {
    setError(null);
    setSaving(true);

    try {
      await apiRequest<void>("/api/admin/auth/change-password", {
        body: JSON.stringify({
          currentPassword: values.currentPassword,
          newPassword: values.newPassword,
        }),
        method: "POST",
      });

      notification.success({
        description: "Tu nueva contrasena ya esta activa.",
        message: "Contrasena actualizada",
      });
      navigate("/dashboard");
    } catch (requestError) {
      const message =
        requestError instanceof ApiClientError
          ? requestError.message
          : "No se pudo cambiar la contrasena. Intenta de nuevo.";
      setError(message);
      notification.error({
        description: message,
        duration: 8,
        message: "No se pudo cambiar la contrasena",
      });
    } finally {
      setSaving(false);
    }
  }

  return (
    <Card style={{ maxWidth: 560 }}>
      <Typography.Title className="font-display" level={1}>
        Cambiar contrasena
      </Typography.Title>
      <Typography.Paragraph type="secondary">
        Usa una contrasena de 8 a 72 caracteres. El cambio aplica de inmediato.
      </Typography.Paragraph>

      {error ? <Alert message={error} showIcon style={{ marginBottom: 20 }} type="error" /> : null}

      <Form form={form} layout="vertical" onFinish={submit} validateTrigger={["onBlur", "onChange"]}>
        <Form.Item
          label="Contrasena actual"
          name="currentPassword"
          rules={[{ message: "Escribe tu contrasena actual", required: true }]}
        >
          <Input.Password autoComplete="current-password" />
        </Form.Item>

        <Form.Item
          label="Nueva contrasena"
          name="newPassword"
          rules={[
            { message: "Escribe una nueva contrasena", required: true },
            { max: 72, message: "La contrasena no puede pasar de 72 caracteres" },
            { message: "La contrasena debe tener minimo 8 caracteres", min: 8 },
          ]}
        >
          <Input.Password autoComplete="new-password" />
        </Form.Item>

        <Form.Item
          dependencies={["newPassword"]}
          label="Confirmar nueva contrasena"
          name="confirmNewPassword"
          rules={[
            { message: "Confirma la nueva contrasena", required: true },
            ({ getFieldValue }) => ({
              validator(_, value: string | undefined) {
                if (!value || getFieldValue("newPassword") === value) {
                  return Promise.resolve();
                }

                return Promise.reject(new Error("Las contrasenas no coinciden"));
              },
            }),
          ]}
        >
          <Input.Password autoComplete="new-password" />
        </Form.Item>

        <Button block htmlType="submit" loading={saving} type="primary">
          Guardar contrasena
        </Button>
      </Form>
    </Card>
  );
}
