import { useState } from "react";
import { Layout, Menu, Button, Typography, Flex, theme, Spin } from "antd";
import {
  DashboardOutlined,
  TeamOutlined,
  DollarOutlined,
  BarChartOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from "@ant-design/icons";
import { Outlet, useNavigate, useLocation, Navigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from "../features/authSlice";
import { useGetProfileQuery } from "../features/api/authApi";

const { Header, Sider, Content } = Layout;
const { Text } = Typography;

export default function AppLayout() {
  const [collapsed, setCollapsed] = useState(false);

  const { data: profile, isLoading, error } = useGetProfileQuery();

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  if (isLoading) {
    return (
      <Flex justify="center" align="center" style={{ minHeight: "100vh" }}>
        <Spin size="large" />
      </Flex>
    );
  }
  if (error) {
    dispatch(logout());
    return <Navigate to="/login" replace />;
  }

  const user = profile?.user;
  const permissions = profile?.permissions ?? [];

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  const allMenuItems = [
    {
      key: "/dashboard",
      icon: <DashboardOutlined />,
      label: "Dashboard",
      permissions: ["*"],
    },
    {
      key: "/users",
      icon: <TeamOutlined />,
      label: "Foydalanuvchilar",
      permissions: ["READ:USERS"],
    },
    {
      key: "/payments",
      icon: <DollarOutlined />,
      label: "To'lovlar",
      permissions: ["READ:PAYMENTS", "WRITE:PAYMENTS"],
    },
    {
      key: "/reports",
      icon: <BarChartOutlined />,
      label: "Hisobotlar",
      permissions: ["READ:REPORTS", "WRITE:REPORTS"],
    },
  ];

  const menuItems = allMenuItems.filter((item) =>
    item.permissions.some((p) => p === "*" || permissions.includes(p)),
  );

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        breakpoint="lg"
        onBreakpoint={(broken) => setCollapsed(broken)}
        style={{ background: colorBgContainer }}
      >
        <Flex
          justify="center"
          align="center"
          style={{ height: 64, borderBottom: "1px solid #f0f0f0" }}
        >
          <Text strong style={{ fontSize: collapsed ? 16 : 20 }}>
            {collapsed ? "R" : "RBackUI"}
          </Text>
        </Flex>
        <Menu
          mode="inline"
          selectedKeys={[location.pathname]}
          items={menuItems}
          onClick={({ key }) => navigate(key)}
          style={{ border: "none" }}
        />
      </Sider>

      <Layout>
        <Header
          style={{
            padding: "0 16px",
            background: colorBgContainer,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderBottom: "1px solid #f0f0f0",
          }}
        >
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
          />
          <Flex align="center" gap={16}>
            <Text>
              {user?.name} {user?.surname}
            </Text>
            <Button
              type="text"
              danger
              icon={<LogoutOutlined />}
              onClick={handleLogout}
            >
              Chiqish
            </Button>
          </Flex>
        </Header>
        <Content style={{ margin: 24 }}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
}
