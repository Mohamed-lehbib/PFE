import React from "react";
import { Dropdown, Menu, Card, Avatar, Skeleton } from "antd";
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
  onDelete: () => void;
  onEdit: () => void;
  loading: boolean; // Add a loading prop to handle the loading state
}

const ProjectCard: React.FC<ProjectCardProps> = ({
  id,
  title,
  description,
  imageUrl,
  owner,
  onDelete,
  onEdit,
  loading, // Use the loading prop
}) => {
  const router = useRouter();

  const handleCardClick = () => {
    router.push(`/configure-project/${id}`);
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

  return (
    <Card style={{ width: "100%", marginTop: 16 }} onClick={handleCardClick}>
      <Skeleton loading={loading} avatar active>
        <Meta
          avatar={<Avatar src={imageUrl || fallbackImage} />}
          title={title}
          description={
            <>
              <p>{description}</p>
              <p>Owner: {owner}</p>
            </>
          }
        />
      </Skeleton>
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
