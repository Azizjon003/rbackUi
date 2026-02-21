import { Button, Card, Form, Input, Typography, message, Flex } from "antd";
import { LockOutlined, MailOutlined } from "@ant-design/icons";
import { useLoginMutation } from "../features/api/authApi";
import { useDispatch } from "react-redux";
import { setToken } from "../features/authSlice";
import { useNavigate } from "react-router-dom";
import type { LoginRequest } from "../types";

const { Title, Text } = Typography;

export default function Login() {
  const [login, { isLoading }] = useLoginMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onFinish = async (values: LoginRequest) => {
    try {
      const result = await login(values).unwrap();
      dispatch(setToken(result.token));

      message.success("Tizimga muvaffaqiyatli kirdingiz!");

      navigate("/dashboard");
    } catch {
      message.error("Email yoki parol noto'g'ri!");
    }
  };

  return (
    <Flex
      justify="center"
      align="center"
      style={{ minHeight: "100vh", background: "#f0f2f5", padding: 16 }}
    >
      <Card style={{ width: "100%", maxWidth: 400 }}>
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <Title level={3} style={{ margin: 0 }}>
            Tizimga kirish
          </Title>
          <Text type="secondary">Email va parolingizni kiriting</Text>
        </div>
        <Form layout="vertical" onFinish={onFinish} autoComplete="off">
          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: "Email kiriting!" },
              { type: "email", message: "Email formati noto'g'ri!" },
            ]}
          >
            <Input
              prefix={<MailOutlined />}
              placeholder="admin@example.com"
              size="large"
            />
          </Form.Item>
          <Form.Item
            name="password"
            label="Parol"
            rules={[{ required: true, message: "Parol kiriting!" }]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Parolingiz"
              size="large"
            />
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={isLoading}
              block
              size="large"
            >
              Kirish
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </Flex>
  );
}
