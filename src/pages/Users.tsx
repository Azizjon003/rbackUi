import { useState } from "react";
import {
  Table,
  Card,
  Typography,
  Tag,
  Button,
  Space,
  Popconfirm,
  Modal,
  Form,
  Input,
  Select,
  Grid,
  message,
  Spin,
  Flex,
} from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import {
  useGetUsersQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
  useGetRolesQuery,
  useAddUserRolesMutation,
  useDeleteUserRolesMutation,
  useGetPermissionsQuery,
  useAddUserPermissionsMutation,
  useDeleteUserPermissionsMutation,
} from "../features/api/usersApi";
import { getErrorMessage } from "../features/api/baseApi";
import { usePermission } from "../hooks/usePermission";
import type { User, CreateUserRequest, UpdateUserRequest } from "../types";
import type { ColumnsType } from "antd/es/table";

const { Title } = Typography;

function CreateUserModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [form] = Form.useForm<CreateUserRequest>();
  const [createUser, { isLoading }] = useCreateUserMutation();
  const screens = Grid.useBreakpoint();

  const handleSubmit = async (values: CreateUserRequest) => {
    try {
      await createUser(values).unwrap();
      message.success("Foydalanuvchi yaratildi!");
      form.resetFields();
      onClose();
    } catch (err: unknown) {
      const error = err as { data?: unknown };
      message.error(getErrorMessage(error?.data, "Yaratishda xatolik yuz berdi"));
    }
  };

  return (
    <Modal
      title="Yangi foydalanuvchi"
      open={open}
      onCancel={onClose}
      footer={null}
      destroyOnClose
      width={screens.md ? 520 : "95vw"}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        style={{ marginTop: 16 }}
      >
        <Form.Item
          name="name"
          label="Ism"
          rules={[{ required: true, message: "Ism kiriting!" }]}
        >
          <Input placeholder="Ism" />
        </Form.Item>
        <Form.Item
          name="surname"
          label="Familiya"
          rules={[{ required: true, message: "Familiya kiriting!" }]}
        >
          <Input placeholder="Familiya" />
        </Form.Item>
        <Form.Item
          name="email"
          label="Email"
          rules={[
            { required: true, message: "Email kiriting!" },
            { type: "email", message: "Email formati noto'g'ri!" },
          ]}
        >
          <Input placeholder="Email" />
        </Form.Item>
        <Form.Item
          name="password"
          label="Parol"
          rules={[
            { required: true, message: "Parol kiriting!" },
            { min: 6, message: "Parol kamida 6 ta belgidan iborat bo'lsin!" },
          ]}
        >
          <Input.Password placeholder="Parol" />
        </Form.Item>
        <Form.Item style={{ marginBottom: 0, textAlign: "right" }}>
          <Space>
            <Button onClick={onClose}>Bekor qilish</Button>
            <Button type="primary" htmlType="submit" loading={isLoading}>
              Yaratish
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Modal>
  );
}

function EditUserModal({
  user,
  onClose,
}: {
  user: User | null;
  onClose: () => void;
}) {
  const [form] = Form.useForm<Omit<UpdateUserRequest, "id"> & { roleIds: number[]; permissionIds: number[] }>();
  const [updateUser, { isLoading: isUpdating }] = useUpdateUserMutation();
  const [addUserRoles, { isLoading: isAddingRoles }] = useAddUserRolesMutation();
  const [deleteUserRoles, { isLoading: isDeletingRoles }] = useDeleteUserRolesMutation();
  const [addUserPermissions, { isLoading: isAddingPerms }] = useAddUserPermissionsMutation();
  const [deleteUserPermissions, { isLoading: isDeletingPerms }] = useDeleteUserPermissionsMutation();
  const { data: roles } = useGetRolesQuery();
  const { data: permissions } = useGetPermissionsQuery();
  const screens = Grid.useBreakpoint();

  const handleSubmit = async (values: Omit<UpdateUserRequest, "id"> & { roleIds: number[]; permissionIds: number[] }) => {
    if (!user) return;
    const { roleIds, permissionIds, ...userData } = values;

    const userChanged =
      userData.name !== user.name ||
      userData.surname !== user.surname ||
      userData.email !== user.email;

    if (userChanged) {
      try {
        await updateUser({ id: user.id, ...userData }).unwrap();
        message.success("Foydalanuvchi yangilandi!");
      } catch (err: unknown) {
        const error = err as { data?: unknown };
        message.error(getErrorMessage(error?.data, "Foydalanuvchini yangilashda xatolik"));
      }
    }

    const oldRoleIds = roles
      ?.filter((r) => user.roles.includes(r.name))
      .map((r) => r.id) ?? [];
    const rolesToAdd = roleIds.filter((id) => !oldRoleIds.includes(id));
    const rolesToRemove = oldRoleIds.filter((id) => !roleIds.includes(id));

    if (rolesToAdd.length || rolesToRemove.length) {
      try {
        if (rolesToAdd.length) {
          await addUserRoles({ userId: user.id, roleIds: rolesToAdd }).unwrap();
        }
        if (rolesToRemove.length) {
          await deleteUserRoles({ userId: user.id, roleIds: rolesToRemove }).unwrap();
        }
        message.success("Rollar yangilandi!");
      } catch (err: unknown) {
        const error = err as { data?: unknown };
        message.error(getErrorMessage(error?.data, "Rollarni yangilashda xatolik"));
      }
    }

    const oldPermIds = permissions
      ?.filter((p) => user.permissions.includes(`${p.action}:${p.resource}`))
      .map((p) => p.id) ?? [];
    const permsToAdd = permissionIds.filter((id) => !oldPermIds.includes(id));
    const permsToRemove = oldPermIds.filter((id) => !permissionIds.includes(id));

    if (permsToAdd.length || permsToRemove.length) {
      try {
        if (permsToAdd.length) {
          await addUserPermissions({ userId: user.id, permissionIds: permsToAdd }).unwrap();
        }
        if (permsToRemove.length) {
          await deleteUserPermissions({ userId: user.id, permissionIds: permsToRemove }).unwrap();
        }
        message.success("Huquqlar yangilandi!");
      } catch (err: unknown) {
        const error = err as { data?: unknown };
        message.error(getErrorMessage(error?.data, "Huquqlarni yangilashda xatolik"));
      }
    }

    onClose();
  };

  const initialRoleIds = roles
    ?.filter((r) => user?.roles.includes(r.name))
    .map((r) => r.id) ?? [];

  const initialPermIds = permissions
    ?.filter((p) => user?.permissions.includes(`${p.action}:${p.resource}`))
    .map((p) => p.id) ?? [];

  return (
    <Modal
      title="Foydalanuvchini tahrirlash"
      open={!!user}
      onCancel={onClose}
      footer={null}
      destroyOnClose
      width={screens.md ? 520 : "95vw"}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={{
          name: user?.name,
          surname: user?.surname,
          email: user?.email,
          roleIds: initialRoleIds,
          permissionIds: initialPermIds,
        }}
        style={{ marginTop: 16 }}
      >
        <Form.Item
          name="name"
          label="Ism"
          rules={[{ required: true, message: "Ism kiriting!" }]}
        >
          <Input placeholder="Ism" />
        </Form.Item>
        <Form.Item
          name="surname"
          label="Familiya"
          rules={[{ required: true, message: "Familiya kiriting!" }]}
        >
          <Input placeholder="Familiya" />
        </Form.Item>
        <Form.Item
          name="email"
          label="Email"
          rules={[
            { required: true, message: "Email kiriting!" },
            { type: "email", message: "Email formati noto'g'ri!" },
          ]}
        >
          <Input placeholder="Email" />
        </Form.Item>
        <Form.Item
          name="roleIds"
          label="Rollar"
          rules={[{ required: true, message: "Kamida bitta rol tanlang!" }]}
        >
          <Select
            mode="multiple"
            placeholder="Rollarni tanlang"
            options={roles?.map((r) => ({ label: r.name, value: r.id }))}
          />
        </Form.Item>
        <Form.Item
          name="permissionIds"
          label="Huquqlar"
        >
          <Select
            mode="multiple"
            placeholder="Huquqlarni tanlang"
            options={permissions?.map((p) => ({ label: `${p.action}:${p.resource}`, value: p.id }))}
          />
        </Form.Item>
        <Form.Item style={{ marginBottom: 0, textAlign: "right" }}>
          <Space>
            <Button onClick={onClose}>Bekor qilish</Button>
            <Button type="primary" htmlType="submit" loading={isUpdating || isAddingRoles || isDeletingRoles || isAddingPerms || isDeletingPerms}>
              Saqlash
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Modal>
  );
}

function UserActions({ user, onEdit }: { user: User; onEdit: (user: User) => void }) {
  const { hasPermission } = usePermission();
  const [deleteUser] = useDeleteUserMutation();

  const handleDelete = async () => {
    try {
      await deleteUser(user.id).unwrap();
      message.success("Foydalanuvchi o'chirildi");
    } catch (err: unknown) {
      const error = err as { data?: unknown };
      message.error(getErrorMessage(error?.data, "O'chirishda xatolik yuz berdi"));
    }
  };

  return (
    <Space size={0}>
      {hasPermission("WRITE:USERS") && (
        <Button
          type="link"
          icon={<EditOutlined />}
          onClick={() => onEdit(user)}
          size="small"
        />
      )}
      {hasPermission("DELETE:USERS") && (
        <Popconfirm
          title="Rostdan o'chirmoqchimisiz?"
          onConfirm={handleDelete}
          okText="Ha"
          cancelText="Yo'q"
        >
          <Button type="link" danger icon={<DeleteOutlined />} size="small" />
        </Popconfirm>
      )}
    </Space>
  );
}

export default function Users() {
  const [createOpen, setCreateOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
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
      responsive: ["md"],
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      ellipsis: true,
    },
    {
      title: "Rollar",
      dataIndex: "roles",
      key: "roles",
      responsive: ["lg"],
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
            render: (_: unknown, record: User) => <UserActions user={record} onEdit={setEditingUser} />,
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
      <Flex justify="space-between" align="center" wrap gap={8} style={{ marginBottom: 16 }}>
        <Title level={4} style={{ margin: 0 }}>
          Foydalanuvchilar
        </Title>
        {hasPermission("WRITE:USERS") && (
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setCreateOpen(true)}
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
      <CreateUserModal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
      />
      <EditUserModal
        user={editingUser}
        onClose={() => setEditingUser(null)}
      />
    </Card>
  );
}
