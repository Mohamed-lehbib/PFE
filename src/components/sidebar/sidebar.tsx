import React, { useState, useEffect } from "react";
import { Layout, Menu, Skeleton } from "antd";
import { createClient } from "@/utils/supabase/client";
import Image from "next/image";

const { Sider } = Layout;

interface TableIdName {
  id: number;
  name: string;
}

interface Project {
  name: string;
  project_logo: string;
}

interface SidebarProps {
  projectId: string;
  onSelectTable: (table: { id: number; name: string }) => void;
}

export default function Sidebar({
  projectId,
  onSelectTable,
}: Readonly<SidebarProps>) {
  const [tables, setTables] = useState<TableIdName[]>([]);
  const [project, setProject] = useState<Project | undefined>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTablesAndProject = async () => {
      const supabase = createClient();
      const { data: tableData, error: tableError } = await supabase
        .from("tables")
        .select("id, name")
        .eq("project_id", projectId)
        .order("name", { ascending: true });

      if (tableError) {
        console.error("Error fetching tables:", tableError);
      } else {
        setTables(tableData);
        if (tableData.length > 0) {
          onSelectTable({ id: tableData[0].id, name: tableData[0].name });
        }
      }

      const { data: projectData, error: projectError } = await supabase
        .from("project")
        .select("project_logo, name")
        .eq("id", projectId)
        .single();

      if (projectError) {
        console.error("Error fetching project:", projectError);
      } else {
        setProject(projectData);
      }

      setLoading(false);
    };
    fetchTablesAndProject();
  }, [projectId]);

  const handleMenuClick = (e: any) => {
    const selectedTable = tables.find((table) => table.id === parseInt(e.key));
    if (selectedTable) {
      onSelectTable({ id: selectedTable.id, name: selectedTable.name });
    }
  };

  const menuItems = tables.map((table) => ({
    key: String(table.id),
    label: table.name,
  }));

  return (
    <Sider
      trigger={null}
      style={{
        height: "100vh",
        background: "#ffffff",
        borderRight: "1px solid #f0f0f0", // Light border right
        display: "flex",
        flexDirection: "column",
        position: "fixed", // Fix the sidebar position
        top: 0,
        left: 0,
        bottom: 0,
        overflowY: "auto", // Allow scrolling within the sidebar
      }}
      className="sidebar"
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          padding: "16px",
          background: "#ffffff",
        }}
      >
        {project ? (
          <Image
            src={project.project_logo}
            alt="App Icon"
            width={64}
            height={64}
          />
        ) : (
          <Skeleton.Avatar active size={64} shape="circle" />
        )}
        {loading ? (
          <Skeleton.Input
            active
            style={{ width: 120, marginTop: 16, marginBottom: 16 }}
          />
        ) : (
          <div style={{ marginTop: 16, marginBottom: 16 }}>{project?.name}</div>
        )}
      </div>
      {loading ? (
        <div
          style={{
            padding: "16px",
            background: "#ffffff",
            width: "100%",
          }}
        >
          <Skeleton active paragraph={{ rows: 8 }} />
        </div>
      ) : (
        <Menu
          theme="light"
          mode="inline"
          defaultSelectedKeys={
            tables.length > 0 ? [String(tables[0].id)] : undefined
          }
          items={menuItems}
          onClick={handleMenuClick}
          style={{
            height: "calc(100% - 64px)",
            borderRight: 0,
            background: "#ffffff",
            width: "100%",
          }}
        />
      )}
    </Sider>
  );
}
