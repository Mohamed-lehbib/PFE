import { useEffect, useState } from "react";
import { Table, Skeleton, Button, Space, Modal } from "antd";
import { createClient } from "@supabase/supabase-js";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import EditRecordModal from "@/components/edit-record-modal/edit-record-modal";

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
      const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);
      let query = supabase
        .from(table.name)
        .select(
          attributes
            .filter((attr) => attr.read)
            .map((attr) => attr.name)
            .join(", ")
        )
        .order("id", { ascending: false });

      if (searchField && searchValue) {
        const attribute = attributes.find((attr) => attr.name === searchField);

        if (attribute) {
          if (attribute.type === "string") {
            query = query.ilike(searchField, `%${searchValue}%`);
          } else {
            query = query.eq(searchField, searchValue);
          }
        }
      }

      const { data: tableData, error } = await query;

      if (error) {
        console.error("Error fetching table data:", error);
      } else {
        setData(tableData);
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
    // Fetch record details directly from the table
    const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);
    const { data: recordData, error } = await supabase
      .from(table.name)
      .select("*")
      .eq("id", record.id)
      .single();

    if (error) {
      console.error("Error fetching record details:", error);
      return;
    }

    const updateAttributes = attributes.filter((attr) => attr.update);

    setRecordToEdit(recordData);
    setEditableAttributes(updateAttributes);
    setIsEditModalVisible(true);
  };

  const handleDelete = async () => {
    const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);
    const { error } = await supabase
      .from(table.name)
      .delete()
      .eq("id", recordToDelete.id);

    if (error) {
      console.error("Error deleting record:", error);
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
