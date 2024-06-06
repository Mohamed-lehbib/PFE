"use client";
import React, { useState, useEffect, useCallback } from "react";
import {
  LogoutOutlined,
  ProjectOutlined,
  TeamOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import {
  Button,
  Layout,
  Menu,
  theme,
  Modal,
  message as messageApi,
  Spin,
} from "antd";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import Image from "next/image";
import ProjectCard from "@/components/project-card";
import ProjectUploader from "@/components/create-project-form";

interface Project {
  email: string;
  project_logo: string;
  name: string;
  description: string;
}

const { Header, Content } = Layout;

const App: React.FC = () => {
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  const router = useRouter();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false); // Add state for uploading

  const fetchProjects = useCallback(async () => {
    try {
      const response = await fetch("/api/project/get-projects");
      const result = await response.json();

      if (response.status === 200) {
        setProjects(result.projects);
      } else {
        messageApi.error({
          content: `Failed to fetch projects: ${result.error}`,
          duration: 10,
          className: "custom-class",
        });
      }
    } catch (error) {
      console.error("Error fetching projects:", error);
      messageApi.error({
        content: `Failed to fetch projects: ${error}`,
        duration: 10,
        className: "custom-class",
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

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

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleSuccess = () => {
    messageApi.success("Project created successfully!");
    setIsModalVisible(false);
    // Refresh the projects list after successful upload
    setLoading(true);
    fetchProjects();
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
          borderBottom: "1px solid #e0e0e0",
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
          style={{ marginRight: "40px" }}
        >
          Logout
        </Button>
      </Header>
      <Content className="p-4 px-6 md:px-12 bg-white">
        <div className="flex justify-end my-4">
          <Button type="primary" icon={<PlusOutlined />} onClick={showModal}>
            Create new project
          </Button>
        </div>
        <Spin spinning={loading}>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-3 gap-8">
            {projects.map((project, index) => (
              <ProjectCard
                key={index}
                title={project.name}
                description={project.description}
                imageUrl={project.project_logo}
                owner={project.email}
              />
            ))}
          </div>
        </Spin>
        <Modal
          title="Create New Project"
          visible={isModalVisible}
          onCancel={handleCancel}
          footer={null}
        >
          <Spin spinning={uploading}>
            <ProjectUploader
              onSuccess={handleSuccess}
              setUploading={setUploading}
            />
          </Spin>
        </Modal>
      </Content>
    </Layout>
  );
};

export default App;
