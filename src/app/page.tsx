"use client";
import React, { useState } from "react";
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
} from "antd";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import Image from "next/image";
import ProjectCard from "@/components/project-card";
import ProjectUploader from "@/components/create-project-form";

const { Header, Content } = Layout;

const App: React.FC = () => {
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  const router = useRouter();
  const [isModalVisible, setIsModalVisible] = useState(false);

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

  const projectCards = [
    {
      title: "Project 1",
      description: "Description for project 1",
      imageUrl: "https://placehold.co/50x50/3F96FE/FFFFFF.png",
      owner: "Owner 1",
    },
    {
      title: "Project 2",
      description: "Description for project 2",
      imageUrl: "https://placehold.co/50x50/3F96FE/FFFFFF.png",
      owner: "Owner 2",
    },
    {
      title: "Project 3",
      description: "Description for project 3",
      imageUrl: "https://placehold.co/50x50/3F96FE/FFFFFF.png",
      owner: "Owner 3",
    },
    {
      title: "Project 4",
      description: "Description for project 4",
      imageUrl: "https://placehold.co/50x50/3F96FE/FFFFFF.png",
      owner: "Owner 4",
    },
    {
      title: "Project 5",
      description: "Description for project 5",
      imageUrl: "https://placehold.co/50x50/3F96FE/FFFFFF.png",
      owner: "Owner 5",
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
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-3 gap-8">
          {projectCards.map((project, index) => (
            <ProjectCard
              key={index}
              title={project.title}
              description={project.description}
              imageUrl={project.imageUrl}
              owner={project.owner}
            />
          ))}
        </div>
        <Modal
          title="Create New Project"
          visible={isModalVisible}
          onCancel={handleCancel}
          footer={null}
        >
          <ProjectUploader onSuccess={handleSuccess} />
        </Modal>
      </Content>
    </Layout>
  );
};

export default App;
