import { Card, Typography, Tag, Flex } from "antd";
import { useGetProfileQuery } from "../features/api/authApi";

const { Title, Text } = Typography;

export default function Dashboard() {
  const { data: profile } = useGetProfileQuery();

  return (
    <Card>
      <Title level={3}>Xush kelibsiz, {profile?.user.name}!</Title>
      <Text type="secondary">Sizning rollaringiz:</Text>
      <Flex gap={8} style={{ marginTop: 8 }}>
        {profile?.roles.map((role) => (
          <Tag color="blue" key={role}>
            {role}
          </Tag>
        ))}
      </Flex>
    </Card>
  );
}
