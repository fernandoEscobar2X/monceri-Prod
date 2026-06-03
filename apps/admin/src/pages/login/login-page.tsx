import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { Alert, App, Button, Card, Form, Input, Typography, theme } from "antd";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authProvider } from "@/providers/auth-provider";

type LoginValues = {
  email: string;
  password: string;
};

export function LoginPage() {
  const navigate = useNavigate();
  const { notification } = App.useApp();
  const { token } = theme.useToken();
  const [loginError, setLoginError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function submit(values: LoginValues) {
    setSubmitting(true);
    setLoginError(null);
    const result = await authProvider.login(values);
    setSubmitting(false);

    if (!result.success) {
      const message = result.error?.message ?? "No se pudo iniciar sesion";

      setLoginError(message);
      notification.error({
        description: "Revisa el correo, la contrasena o que la API este encendida.",
        duration: 8,
        message,
      });
      return;
    }

    navigate(result.redirectTo ?? "/dashboard");
  }

  return (
    <main
      style={{
        alignItems: "center",
        background:
          token.colorBgLayout === "#0F172A"
            ? "radial-gradient(circle at top, #1E293B 0, #0F172A 52%)"
            : "linear-gradient(135deg, #FAFAFA 0%, #FFFFFF 100%)",
        display: "flex",
        minHeight: "100vh",
        padding: 24,
      }}
    >
      <Card
        style={{
          borderRadius: 24,
          boxShadow: token.boxShadowSecondary,
          margin: "0 auto",
          maxWidth: 430,
          width: "100%",
        }}
      >
        <Typography.Title className="font-display" level={1} style={{ marginBottom: 0, marginTop: 0 }}>
          Monceri
        </Typography.Title>
        <Typography.Title level={4} style={{ marginTop: 4 }}>
          Panel administrativo
        </Typography.Title>
        <Typography.Paragraph type="secondary">Gestiona productos, pedidos e inventario.</Typography.Paragraph>
        {loginError ? <Alert message={loginError} showIcon style={{ marginBottom: 20 }} type="error" /> : null}
        <Form<LoginValues>
          initialValues={{ email: "", password: "" }}
          layout="vertical"
          onFinish={submit}
          validateTrigger={["onBlur", "onChange"]}
        >
          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: "El email es obligatorio." },
              { type: "email", message: "Escribe un email valido." },
            ]}
          >
            <Input autoComplete="email" prefix={<UserOutlined />} size="large" />
          </Form.Item>
          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: "La contrasena es obligatoria." }]}
          >
            <Input.Password autoComplete="current-password" prefix={<LockOutlined />} size="large" />
          </Form.Item>
          <Button block htmlType="submit" loading={submitting} size="large" type="primary">
            Entrar
          </Button>
        </Form>
      </Card>
    </main>
  );
}
