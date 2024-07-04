import React, { useEffect, useState } from "react";
import { Table, Skeleton, Button, Space, Modal, message } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import EditRecordModal from "@/components/edit-record-modal/edit-record-modal";
import { fetchTableData } from "@/queries/records/list-records/list-records";
import { deleteRecord } from "@/queries/records/delete-record/delete-record";
import { fetchRecordDetails } from "@/queries/records/get-record/get-record";

interface ProjectTableProps {
  table: { id: number; name: string; actions: string[] };
  attributes: any[];
  supabaseUrl: string;
  supabaseServiceRoleKey: string;
  searchField: string;
  searchValue: string;
  onTableChange: () => void;
}

const fallbackImage = "/assets/images/fallback-image.jpeg";

export default function ProjectTable({
  table,
  attributes,
  supabaseUrl,
  supabaseServiceRoleKey,
  searchField,
  searchValue,
  onTableChange,
}: Readonly<ProjectTableProps>) {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [recordToDelete, setRecordToDelete] = useState<any>(null);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [recordToEdit, setRecordToEdit] = useState<any>(null);
  const [editableAttributes, setEditableAttributes] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const { data, error } = await fetchTableData(
        supabaseUrl,
        supabaseServiceRoleKey,
        table.name,
        attributes,
        searchField,
        searchValue
      );

      if (error) {
        console.error("Error fetching table data:", error);
      } else {
        setData(data);
      }

      setLoading(false);
    };

    fetchData();
  }, [
    table,
    attributes,
    supabaseUrl,
    supabaseServiceRoleKey,
    searchField,
    searchValue,
    onTableChange,
  ]);

  const handleEditClick = async (record: any) => {
    const { data: recordData, error } = await fetchRecordDetails(
      supabaseUrl,
      supabaseServiceRoleKey,
      table.name,
      record.id
    );

    if (error) {
      message.error(`Error fetching record details: ${error.message}`);
      return;
    }

    const updateAttributes = attributes.filter((attr) => attr.update);

    setRecordToEdit(recordData);
    setEditableAttributes(updateAttributes);
    setIsEditModalVisible(true);
  };

  const handleDelete = async () => {
    const { error } = await deleteRecord(
      supabaseUrl,
      supabaseServiceRoleKey,
      table.name,
      recordToDelete.id
    );

    if (error) {
      message.error(`Error deleting record: ${error.message}`);
    } else {
      setData(data.filter((item) => item.id !== recordToDelete.id));
      setIsDeleteModalVisible(false);
      onTableChange(); // Refresh the table after deleting
    }
  };

  const showDeleteModal = (record: any) => {
    setRecordToDelete(record);
    setIsDeleteModalVisible(true);
  };

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

  if (table.actions.includes("delete") || table.actions.includes("update")) {
    columns.push({
      title: "Action",
      key: "action",
      render: (_: any, record: any) => (
        <Space size="middle">
          {table.actions.includes("update") && (
            <Button
              type="link"
              icon={<EditOutlined />}
              onClick={() => handleEditClick(record)}
            />
          )}
          {table.actions.includes("delete") && (
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

  return (
    <>
      {loading ? (
        <Skeleton active />
      ) : (
        <Table dataSource={data} columns={columns} rowKey="id" />
      )}
      <Modal
        title="Confirm Deletion"
        open={isDeleteModalVisible}
        onOk={handleDelete}
        onCancel={() => setIsDeleteModalVisible(false)}
        okText="Yes"
        cancelText="No"
      >
        <p>Are you sure you want to delete the record?</p>
      </Modal>
      <EditRecordModal
        visible={isEditModalVisible}
        onCancel={() => setIsEditModalVisible(false)}
        record={recordToEdit}
        table={table}
        supabaseUrl={supabaseUrl}
        supabaseServiceRoleKey={supabaseServiceRoleKey}
        attributes={editableAttributes}
        onEditSuccess={onTableChange}
      />
    </>
  );
}
