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
  },
  {
    title: "Summa",
    dataIndex: "totalAmount",
    key: "totalAmount",
    render: (amount?: number) =>
      amount ? `${amount.toLocaleString()} UZS` : "—",
    responsive: ["md"],
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
    dataIndex: "createdAt",
    key: "createdAt",
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
