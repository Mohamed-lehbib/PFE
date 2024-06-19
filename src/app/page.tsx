"use client";
import React, { useState, useEffect, useCallback } from "react";
import { PlusOutlined } from "@ant-design/icons";
import { Button, Layout, message as messageApi, Spin, theme } from "antd";
import { useRouter } from "next/navigation";
import ProjectCard from "@/components/project-card";
import CreateProjectModal from "@/components/modals/create-project-modal";
import DeleteProjectModal from "@/components/modals/delete-project-modal";
import UpdateProjectModal from "@/components/modals/update-project-modal";
import Navbar from "@/components/navbar/navbar";

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
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

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

  // Handle edit button click
  const handleEdit = (project: Project) => {
    setSelectedProject(project);
    setEditModalVisible(true);
  };

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
        <Navbar />
      </Header>
      <Content className="p-4 px-6 md:px-12 bg-white">
        <div className="flex justify-end my-4">
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setIsModalVisible(true)}
          >
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
                onDelete={() => {
                  setProjectToDelete(project.project_id);
                  setDeleteModalVisible(true);
                }}
                onEdit={() => handleEdit(project)}
              />
            ))}
          </div>
        </Spin>
        {/* The create project Modal */}
        <CreateProjectModal
          isModalVisible={isModalVisible}
          handleCancel={() => setIsModalVisible(false)}
          uploading={uploading}
          handleSuccess={handleSuccess}
          setUploading={setUploading}
        />
        {/* The delete project Modal */}
        <DeleteProjectModal
          isVisible={deleteModalVisible}
          onConfirm={handleDelete}
          onCancel={() => {
            setDeleteModalVisible(false);
            setProjectToDelete(null);
          }}
        />
        {/* The Edit project Modal */}
        <UpdateProjectModal
          editModalVisible={editModalVisible}
          selectedProject={selectedProject}
          setEditModalVisible={setEditModalVisible}
          setLoading={setLoading}
          fetchProjects={fetchProjects}
          setUploading={setUploading}
        />
      </Content>
    </Layout>
  );
};

export default App;
