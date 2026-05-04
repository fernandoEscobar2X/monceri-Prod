import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { Button, Card, Form, Input, Typography, message } from "antd";
import { useNavigate } from "react-router-dom";
import { authProvider } from "@/providers/auth-provider";

type LoginValues = {
  email: string;
  password: string;
};

export function LoginPage() {
  const navigate = useNavigate();
  const [messageApi, contextHolder] = message.useMessage();

  async function submit(values: LoginValues) {
    const result = await authProvider.login(values);

    if (!result.success) {
      messageApi.error(result.error?.message ?? "No se pudo iniciar sesion");
      return;
    }

    navigate(result.redirectTo ?? "/dashboard");
  }

  return (
    <main
      style={{
        alignItems: "center",
        background: "#f5f5f5",
        display: "flex",
        minHeight: "100vh",
        padding: 24,
      }}
    >
      {contextHolder}
      <Card style={{ margin: "0 auto", maxWidth: 420, width: "100%" }}>
        <Typography.Title level={2} style={{ marginTop: 0 }}>
          Monceri Admin
        </Typography.Title>
        <Typography.Paragraph type="secondary">
          Entra para gestionar productos, pedidos e inventario.
        </Typography.Paragraph>
        <Form<LoginValues>
          initialValues={{ email: "", password: "" }}
          layout="vertical"
          onFinish={submit}
        >
          <Form.Item label="Email" name="email" rules={[{ required: true, type: "email" }]}>
            <Input autoComplete="email" prefix={<UserOutlined />} />
          </Form.Item>
          <Form.Item label="Password" name="password" rules={[{ required: true }]}>
            <Input.Password autoComplete="current-password" prefix={<LockOutlined />} />
          </Form.Item>
          <Button block htmlType="submit" type="primary">
            Entrar
          </Button>
        </Form>
      </Card>
    </main>
  );
}
