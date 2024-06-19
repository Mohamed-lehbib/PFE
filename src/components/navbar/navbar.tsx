import { createClient } from "@/utils/supabase/client";
import { Button, Menu, message as messageApi } from "antd";
import {
  LogoutOutlined,
  ProjectOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React from "react";

export default function Navbar() {
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
    <>
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
        style={{ marginRight: "40px" }}
      >
        Logout
      </Button>
    </>
  );
}
