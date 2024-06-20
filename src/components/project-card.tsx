import React from "react";
import { Dropdown, Menu } from "antd";
import { MoreOutlined, DeleteOutlined, EditOutlined } from "@ant-design/icons";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface ProjectCardProps {
  id: string;
  title: string;
  description: string;
  imageUrl: string | null;
  owner: string;
  onDelete: () => void;
  onEdit: () => void;
}

const ProjectCard: React.FC<ProjectCardProps> = ({
  id,
  title,
  description,
  imageUrl,
  owner,
  onDelete,
  onEdit,
}) => {
  const router = useRouter();

  const menu = (
    <Menu>
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
    <div
      className="bg-white px-6 py-6 rounded border h-[12.5rem] flex flex-col justify-between relative"
      onClick={() => router.push(`/configure-project/${id}`)}
    >
      <Dropdown
        overlay={menu}
        trigger={["click"]}
        className="absolute top-4 right-4"
      >
        <MoreOutlined className="text-xl cursor-pointer" />
      </Dropdown>
      <div className="flex items-center mb-2 mt-8">
        <Image
          src={imageUrl || fallbackImage}
          alt={title}
          width={70}
          height={70}
          className="rounded-full mr-4"
        />
        <div className="flex-1">
          <h3 className="text-lg font-semibold">{title}</h3>
          <p className="text-sm text-gray-600 mt-1">{description}</p>
        </div>
      </div>
      <p className="text-sm text-gray-600">Owner: {owner}</p>
    </div>
  );
};

export default ProjectCard;
