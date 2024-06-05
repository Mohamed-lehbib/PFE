"use client";
import React from "react";
import {
  LogoutOutlined,
  ProjectOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import { Button, Layout, Menu, theme, message as messageApi } from "antd";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import Image from "next/image";

const { Header, Content } = Layout;

const App: React.FC = () => {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const router = useRouter();

  const handleLogout = async () => {
    console.log("Logout function called");
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.log("Supabase update password error:", error);
        messageApi.error({
          content: `Failed to logout: ${error.message}`,
          duration: 10,
          className: "custom-class",
        });
      } else {
        messageApi.success({
          content: `Logout successfully`,
          duration: 2,
          className: "custom-class",
        });
        router.push("/signin");
      }
    } catch (error) {
      console.error(`Error logout : ${error}`);
      messageApi.error({
        content: `Failed to logout: ${error}`,
        duration: 10,
        className: "custom-class",
      });
    }
  };

  const menuItems = [
    {
      key: "1",
      icon: <ProjectOutlined />,
      label: "Projects",
    },
    {
      key: "2",
      icon: <TeamOutlined />,
      label: "Team",
    },
  ];

  return (
    <Layout>
      <Header
        style={{
          position: "sticky",
          top: 0,
          zIndex: 1,
          width: "100%",
          display: "flex",
          alignItems: "center",
          background: colorBgContainer,
          boxShadow: "0 2px 8px #f0f1f2",
          padding: "0 16px",
        }}
      >
        <div
          style={{ marginRight: "auto", display: "flex", alignItems: "center" }}
        >
          <Image
            src="/assets/images/icon.svg"
            alt="App Icon"
            width={32}
            height={32}
            style={{ marginLeft: "40px" }}
          />
        </div>
        <Menu
          theme="light"
          mode="horizontal"
          defaultSelectedKeys={["1"]}
          items={menuItems}
          style={{ flex: 1, justifyContent: "center", minWidth: 0 }}
        />
        <Button
          type="primary"
          icon={<LogoutOutlined />}
          onClick={handleLogout}
          style={{
            marginRight: "40px",
          }}
        >
          Logout
        </Button>
      </Header>
      <Content style={{ padding: "16px 48px" }}>
        <div
          style={{
            padding: 24,
            minHeight: "100vh",
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
          }}
        >
          Content
        </div>
      </Content>
    </Layout>
  );
};

export default App;
