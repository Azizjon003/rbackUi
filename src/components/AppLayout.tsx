import { useState } from "react";
import { Layout, Menu, Button, Typography, Flex, Grid, Drawer, theme, Spin } from "antd";
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
const { useBreakpoint } = Grid;

export default function AppLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const screens = useBreakpoint();
  const isMobile = !screens.md;

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

  const handleMenuClick = ({ key }: { key: string }) => {
    navigate(key);
    if (isMobile) setDrawerOpen(false);
  };

  const siderMenu = (
    <>
      <Flex
        justify="center"
        align="center"
        style={{ height: 64, borderBottom: "1px solid #f0f0f0" }}
      >
        <Text strong style={{ fontSize: 20 }}>
          RBackUI
        </Text>
      </Flex>
      <Menu
        mode="inline"
        selectedKeys={[location.pathname]}
        items={menuItems}
        onClick={handleMenuClick}
        style={{ border: "none" }}
      />
    </>
  );

  return (
    <Layout style={{ minHeight: "100vh" }}>
      {isMobile ? (
        <Drawer
          placement="left"
          onClose={() => setDrawerOpen(false)}
          open={drawerOpen}
          width={240}
          styles={{ body: { padding: 0 } }}
        >
          {siderMenu}
        </Drawer>
      ) : (
        <Sider
          trigger={null}
          collapsible
          collapsed={collapsed}
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
            onClick={handleMenuClick}
            style={{ border: "none" }}
          />
        </Sider>
      )}

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
            icon={isMobile ? <MenuUnfoldOutlined /> : (collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />)}
            onClick={() => isMobile ? setDrawerOpen(true) : setCollapsed(!collapsed)}
          />
          <Flex align="center" gap={isMobile ? 8 : 16}>
            {!isMobile && (
              <Text>
                {user?.name} {user?.surname}
              </Text>
            )}
            <Button
              type="text"
              danger
              icon={<LogoutOutlined />}
              onClick={handleLogout}
            >
              {isMobile ? "" : "Chiqish"}
            </Button>
          </Flex>
        </Header>
        <Content style={{ margin: isMobile ? 12 : 24 }}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
}
