import { Card, Typography, Tag, Flex } from "antd";
import { useGetProfileQuery } from "../features/api/authApi";

const { Title, Text } = Typography;

export default function Dashboard() {
  const { data: profile } = useGetProfileQuery();

  return (
    <Flex vertical gap={16}>
      <Card>
        <Title level={4} style={{ margin: 0, marginBottom: 8 }}>
          Xush kelibsiz, {profile?.user.name}!
        </Title>
        <Text type="secondary">Sizning rollaringiz:</Text>
        <Flex gap={8} wrap style={{ marginTop: 8 }}>
          {profile?.roles.map((role) => (
            <Tag color="blue" key={role}>
              {role}
            </Tag>
          ))}
        </Flex>
      </Card>
      <Card>
        <Text type="secondary">Sizning huquqlaringiz:</Text>
        <Flex gap={4} wrap style={{ marginTop: 8 }}>
          {profile?.permissions.map((perm) => (
            <Tag key={perm}>{perm}</Tag>
          ))}
        </Flex>
      </Card>
    </Flex>
  );
}
