import { Table, Card, Typography, Tag, Spin, Flex } from "antd";
import { useGetReportsQuery } from "../features/api/reportsApi";
import type { Report } from "../features/api/reportsApi";
import type { ColumnsType } from "antd/es/table";

const { Title } = Typography;

const statusColors: Record<string, string> = {
  ready: "green",
  processing: "orange",
};

const statusLabels: Record<string, string> = {
  ready: "Tayyor",
  processing: "Jarayonda",
};

const typeLabels: Record<string, string> = {
  sales: "Sotuvlar",
  users: "Foydalanuvchilar",
  revenue: "Daromad",
  payments: "To'lovlar",
  finance: "Moliya",
};

const columns: ColumnsType<Report> = [
  {
    title: "Hisobot nomi",
    dataIndex: "title",
    key: "title",
    ellipsis: true,
  },
  {
    title: "Turi",
    dataIndex: "type",
    key: "type",
    render: (type: string) => (
      <Tag color="blue">{typeLabels[type] ?? type}</Tag>
    ),
  },
  {
    title: "Davr",
    dataIndex: "period",
    key: "period",
    responsive: ["md"],
  },
  {
    title: "Summa",
    dataIndex: "total_amount",
    key: "total_amount",
    render: (amount: number | null) =>
      amount ? `${amount.toLocaleString()} UZS` : "—",
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

export default function Reports() {
  const { data: reports, isLoading } = useGetReportsQuery();

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
        Hisobotlar
      </Title>
      <Table
        columns={columns}
        dataSource={reports}
        rowKey="id"
        pagination={{ pageSize: 10 }}
        scroll={{ x: 600 }}
      />
    </Card>
  );
}
