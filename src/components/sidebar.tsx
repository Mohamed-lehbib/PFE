import React, { useState, useEffect } from "react";
import { Layout, Menu } from "antd";
import { createClient } from "@/utils/supabase/client";
import Image from "next/image";

const { Sider } = Layout;

interface SidebarProps {
  collapsed: boolean;
  onCollapse: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ collapsed, onCollapse }) => {
  const [tables, setTables] = useState<string[]>([]);

  useEffect(() => {
    const fetchTables = async () => {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("information_schema.tables")
        .select("table_name");
      if (error) {
        console.error("Error fetching tables:", error);
      } else {
        setTables(data.map((table: any) => table.table_name));
      }
    };
    fetchTables();
  }, []);

  const menuItems = tables.map((table, index) => ({
    key: String(index + 1),
    label: table,
  }));

  return (
    <Sider
      trigger={null}
      collapsible
      collapsed={collapsed}
      breakpoint="lg"
      collapsedWidth="0"
      style={{
        height: "100vh",
        background: "#ffffff", // Set the background color to white or light color
        paddingTop: "50px", // Add margin-top of 50 pixels
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: "16px",
          background: "#ffffff", // Set the background color to white or light color
        }}
      >
        <Image
          src="/assets/images/icon.svg"
          alt="App Icon"
          width={64} // Increase the width to make the icon bigger
          height={64} // Increase the height to make the icon bigger
        />
      </div>
      <Menu
        theme="light"
        mode="inline"
        defaultSelectedKeys={["1"]}
        items={menuItems}
        style={{
          height: "calc(100% - 64px)",
          borderRight: 0,
          background: "#ffffff", // Set the background color to white or light color
        }}
      />
    </Sider>
  );
};

export default Sidebar;
