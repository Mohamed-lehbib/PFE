import React from "react";
import { Button, Space } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";

const fallbackImage = "/assets/images/fallback-image.jpeg";

export const generateColumns = (
  attributes: any[],
  tableActions: string[],
  handleEditClick: (record: any) => void,
  showDeleteModal: (record: any) => void
) => {
  const columns: any[] = attributes
    .filter((attr) => attr.read)
    .map((attr) => ({
      title: attr.name,
      dataIndex: attr.name,
      key: attr.name,
      render: (text: any) =>
        attr.metaType === "image" ? (
          <img
            src={text || fallbackImage}
            alt={attr.name}
            style={{ width: "100px" }}
            onError={(e: any) => {
              e.target.src = fallbackImage;
            }}
          />
        ) : (
          text
        ),
    }));

  if (tableActions.includes("delete") || tableActions.includes("update")) {
    columns.push({
      title: "Action",
      key: "action",
      render: (_: any, record: any) => (
        <Space size="middle">
          {tableActions.includes("update") && (
            <Button
              type="link"
              icon={<EditOutlined />}
              onClick={() => handleEditClick(record)}
            />
          )}
          {tableActions.includes("delete") && (
            <Button
              type="link"
              icon={<DeleteOutlined style={{ color: "red" }} />}
              onClick={() => showDeleteModal(record)}
            />
          )}
        </Space>
      ),
    });
  }

  return columns;
};
