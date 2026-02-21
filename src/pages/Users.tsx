import {
  Table,
  Card,
  Typography,
  Tag,
  Button,
  Space,
  Popconfirm,
  message,
  Spin,
  Flex,
} from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import {
  useGetUsersQuery,
  useDeleteUserMutation,
} from "../features/api/usersApi";
import { usePermission } from "../hooks/usePermission";
import type { User } from "../types";
import type { ColumnsType } from "antd/es/table";

const { Title } = Typography;
function UserActions({ user }: { user: User }) {
  const { hasPermission } = usePermission();
  const [deleteUser] = useDeleteUserMutation();

  const handleDelete = async () => {
    try {
      await deleteUser(user.id).unwrap();
      message.success("Foydalanuvchi o'chirildi");
    } catch {
      message.error("O'chirishda xatolik yuz berdi");
    }
  };

  return (
    <Space>
      {hasPermission("WRITE:USERS") && (
        <Button
          type="link"
          icon={<EditOutlined />}
          onClick={() => {
            // TODO: tahrirlash modalni ochish
            console.log("Edit", user.id);
          }}
        >
          Tahrirlash
        </Button>
      )}
      {hasPermission("DELETE:USERS") && (
        <Popconfirm
          title="Rostdan o'chirmoqchimisiz?"
          onConfirm={handleDelete}
          okText="Ha"
          cancelText="Yo'q"
        >
          <Button type="link" danger icon={<DeleteOutlined />}>
            O'chirish
          </Button>
        </Popconfirm>
      )}
    </Space>
  );
}
export default function Users() {
  const { data: users, isLoading } = useGetUsersQuery();
  const { hasPermission, hasAnyPermission } = usePermission();

  const columns: ColumnsType<User> = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: 60,
    },
    {
      title: "Ism",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Familiya",
      dataIndex: "surname",
      key: "surname",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Rollar",
      dataIndex: "roles",
      key: "roles",
      render: (roles: string[]) => (
        <Flex gap={4} wrap>
          {roles.map((role) => (
            <Tag color={role === "ADMIN" ? "red" : "blue"} key={role}>
              {role}
            </Tag>
          ))}
        </Flex>
      ),
    },
    {
      title: "Yaratilgan",
      dataIndex: "created_at",
      key: "created_at",
      render: (date: string) => new Date(date).toLocaleDateString("uz-UZ"),
      responsive: ["md"],
    },
    ...(hasAnyPermission(["WRITE:USERS", "DELETE:USERS"])
      ? [
          {
            title: "Amallar",
            key: "actions",
            render: (_: unknown, record: User) => <UserActions user={record} />,
          },
        ]
      : []),
  ];

  if (isLoading) {
    return (
      <Flex justify="center" align="center" style={{ padding: 100 }}>
        <Spin size="large" />
      </Flex>
    );
  }

  return (
    <Card>
      <Flex justify="space-between" align="center" style={{ marginBottom: 16 }}>
        <Title level={4} style={{ margin: 0 }}>
          Foydalanuvchilar
        </Title>
        {hasPermission("WRITE:USERS") && (
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => {
              // TODO: yaratish modalni ochish
              console.log("Create user");
            }}
          >
            Yangi foydalanuvchi
          </Button>
        )}
      </Flex>
      <Table
        columns={columns}
        dataSource={users}
        rowKey="id"
        pagination={{ pageSize: 10 }}
        scroll={{ x: 600 }}
      />
    </Card>
  );
}
