"use client";
import React, { useState, useEffect, useCallback } from "react";
import {
  LogoutOutlined,
  ProjectOutlined,
  TeamOutlined,
  PlusOutlined,
  MoreOutlined,
} from "@ant-design/icons";
import {
  Button,
  Layout,
  Menu,
  Modal,
  message as messageApi,
  Spin,
  theme,
  Dropdown,
} from "antd";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import Image from "next/image";
import ProjectCard from "@/components/project-card";
import ProjectUploader from "@/components/create-project-form";

interface Project {
  user_email: string;
  project_logo: string;
  project_name: string;
  project_description: string;
  project_id: string;
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
  const [uploading, setUploading] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<string | null>(null);

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
    setLoading(true);
    fetchProjects();
  };

  const handleDelete = async () => {
    if (!projectToDelete) return;
    setLoading(true);
    try {
      const response = await fetch(`/api/project/delete/${projectToDelete}`, {
        method: "DELETE",
      });
      const result = await response.json();
      if (response.status === 200) {
        messageApi.success({
          content: "Project deleted successfully",
          duration: 2,
          className: "custom-class",
        });
        fetchProjects();
      } else {
        messageApi.error({
          content: `Failed to delete project: ${result.error}`,
          duration: 10,
          className: "custom-class",
        });
      }
    } catch (error) {
      console.error("Error deleting project:", error);
      messageApi.error({
        content: `Failed to delete project: ${error}`,
        duration: 10,
        className: "custom-class",
      });
    } finally {
      setLoading(false);
      setDeleteModalVisible(false);
      setProjectToDelete(null);
    }
  };

  const showDeleteModal = (projectId: string) => {
    setProjectToDelete(projectId);
    setDeleteModalVisible(true);
  };

  const handleDeleteCancel = () => {
    setDeleteModalVisible(false);
    setProjectToDelete(null);
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
            {projects.map((project) => (
              <ProjectCard
                key={project.project_id}
                title={project.project_name}
                description={project.project_description}
                imageUrl={project.project_logo}
                owner={project.user_email}
                onDelete={() => showDeleteModal(project.project_id)}
              />
            ))}
          </div>
        </Spin>
        <Modal
          title="Create New Project"
          open={isModalVisible}
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
        <Modal
          title="Confirm Deletion"
          visible={deleteModalVisible}
          onOk={handleDelete}
          onCancel={handleDeleteCancel}
          okText="Yes, delete it"
          cancelText="Cancel"
        >
          <p>Are you sure you want to delete this project?</p>
        </Modal>
      </Content>
    </Layout>
  );
};

export default App;
