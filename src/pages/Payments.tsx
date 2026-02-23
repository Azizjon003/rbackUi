import { Table, Card, Typography, Tag, Spin, Flex } from "antd";
import { useGetPaymentsQuery } from "../features/api/paymentsApi";
import type { Payment } from "../features/api/paymentsApi";
import type { ColumnsType } from "antd/es/table";

const { Title } = Typography;

const statusColors: Record<string, string> = {
  completed: "green",
  pending: "orange",
  failed: "red",
};

const statusLabels: Record<string, string> = {
  completed: "Bajarildi",
  pending: "Kutilmoqda",
  failed: "Rad etildi",
};

const methodLabels: Record<string, string> = {
  card: "Karta",
  cash: "Naqd",
  transfer: "O'tkazma",
};

const columns: ColumnsType<Payment> = [
  {
    title: "Buyurtma",
    dataIndex: "order_id",
    key: "order_id",
    responsive: ["md"],
  },
  {
    title: "Mijoz",
    dataIndex: "customer_name",
    key: "customer_name",
    ellipsis: true,
  },
  {
    title: "Summa",
    dataIndex: "amount",
    key: "amount",
    render: (amount: number, record) =>
      `${amount.toLocaleString()} ${record.currency}`,
  },
  {
    title: "Usul",
    dataIndex: "method",
    key: "method",
    render: (method: string) => methodLabels[method] ?? method,
    responsive: ["lg"],
  },
  {
    title: "Holat",
    dataIndex: "status",
    key: "status",
    render: (status: string) => (
      <Tag color={statusColors[status] ?? "default"}>
        {statusLabels[status] ?? status}
      </Tag>
    ),
  },
  {
    title: "Sana",
    dataIndex: "created_at",
    key: "created_at",
    render: (date: string) => new Date(date).toLocaleDateString("uz-UZ"),
    responsive: ["md"],
  },
];

export default function Payments() {
  const { data: payments, isLoading } = useGetPaymentsQuery();

  if (isLoading) {
    return (
      <Flex justify="center" align="center" style={{ padding: 100 }}>
        <Spin size="large" />
      </Flex>
    );
  }

  return (
    <Card>
      <Title level={4} style={{ marginBottom: 16 }}>
        To'lovlar
      </Title>
      <Table
        columns={columns}
        dataSource={payments}
        rowKey="id"
        pagination={{ pageSize: 10 }}
        scroll={{ x: 600 }}
      />
    </Card>
  );
}
