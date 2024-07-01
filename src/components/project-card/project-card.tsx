import React from "react";
import { Dropdown, Menu, Card, Avatar, Progress } from "antd";
import { MoreOutlined, DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";
import type { MenuProps } from "antd";

const { Meta } = Card;

interface ProjectCardProps {
  id: string;
  title: string;
  description: string;
  imageUrl: string | null;
  owner: string;
  progress: string;
  onDelete: () => void;
  onEdit: () => void;
}

const ProjectCard: React.FC<ProjectCardProps> = ({
  id,
  title,
  description,
  progress,
  imageUrl,
  owner,
  onDelete,
  onEdit,
}) => {
  const router = useRouter();

  const handleCardClick = () => {
    if (!parseInt(progress)) {
      router.push(`/configure-project/${id}`);
    } else if (parseInt(progress) === 10) {
      router.push(`/project/${id}`);
    } else {
      router.push(`/configure-project/${id}?step=${progress}`);
    }
  };

  const handleMenuClick: MenuProps["onClick"] = (e) => {
    e.domEvent.stopPropagation();
  };

  const handleMoreClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  const menu = (
    <Menu onClick={handleMenuClick}>
      <Menu.Item key="1" icon={<EditOutlined />} onClick={onEdit}>
        Edit
      </Menu.Item>
      <Menu.Item key="2" icon={<DeleteOutlined />} onClick={onDelete}>
        Delete
      </Menu.Item>
    </Menu>
  );

  const fallbackImage = "/assets/images/fallback-image.jpeg"; // Path to your fallback image

  // Calculate progress percentage based on the given progress value
  const calculateProgressPercentage = (progress: number) => {
    switch (progress) {
      case 1:
        return 25;
      case 2:
        return 50;
      case 3:
        return 75;
      case 10:
        return 100;
      default:
        return 0;
    }
  };

  return (
    <Card
      className="project-card"
      style={{
        width: "100%",
        marginTop: 16,
        height: 175, // Adjust height as needed
        transition: "transform 0.3s, background-color 0.3s", // Transition for hover effects
      }}
      onClick={handleCardClick}
    >
      <Meta
        avatar={<Avatar src={imageUrl || fallbackImage} size={64} />}
        title={title}
        description={
          <>
            <p className="line-clamp-2">{description}</p>
            <p>Owner: {owner}</p>
            <Progress
              percent={calculateProgressPercentage(parseInt(progress))}
            />
          </>
        }
      />
      <Dropdown
        overlay={menu}
        trigger={["click"]}
        className="absolute top-4 right-4"
      >
        <MoreOutlined
          className="text-xl cursor-pointer"
          onClick={handleMoreClick}
        />
      </Dropdown>
    </Card>
  );
};

export default ProjectCard;
