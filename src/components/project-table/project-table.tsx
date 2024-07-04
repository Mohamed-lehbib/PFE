import React, { useEffect, useState } from "react";
import { Table, Skeleton, Modal, message } from "antd";
import EditRecordModal from "@/components/edit-record-modal/edit-record-modal";
import { fetchTableData } from "@/queries/records/list-records/list-records";
import { deleteRecord } from "@/queries/records/delete-record/delete-record";
import { fetchRecordDetails } from "@/queries/records/get-record/get-record";
import { generateColumns } from "@/utils/generate-columns/generate-columns";

interface ProjectTableProps {
  table: { id: number; name: string; actions: string[] };
  attributes: any[];
  supabaseUrl: string;
  supabaseServiceRoleKey: string;
  searchField: string;
  searchValue: string;
  onTableChange: () => void;
}

const ProjectTable: React.FC<ProjectTableProps> = ({
  table,
  attributes,
  supabaseUrl,
  supabaseServiceRoleKey,
  searchField,
  searchValue,
  onTableChange,
}) => {
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
        message.error(`Error fetching table data: ${error.message}`);
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

  const columns = generateColumns(
    attributes,
    table.actions,
    handleEditClick,
    showDeleteModal
  );

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
      {recordToEdit && (
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
      )}
    </>
  );
};

export default ProjectTable;
