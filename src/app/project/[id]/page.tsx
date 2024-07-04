"use client";
import { useParams } from "next/navigation";
import React, { useState, useEffect, useCallback } from "react";
import { Layout, Skeleton, Button, message } from "antd";
import Sidebar from "@/components/sidebar/sidebar";
import ProjectHeader from "@/components/header/header";
import ProjectTable from "@/components/project-table/project-table";
import CreateRecordModal from "@/components/create-record-modal/create-record-modal";
import { getTablesByProjectId } from "@/queries/tables/get-tables-by-project-id/get-tables-by-project-id";
import { uploadFile } from "@/queries/records/upload-record-file/upload-record-file";
import { createRecord } from "@/queries/records/create-record/create-record";
import { fetchProjectCredentials } from "@/queries/project/get-project-credentials/get-project-credentials";

const { Content } = Layout;

export default function ProjectPage() {
  const params = useParams<{ id: string }>();
  const projectId = params?.id;
  const [selectedTable, setSelectedTable] = useState<{
    id: number;
    name: string;
    actions: string[];
  } | null>(null);
  const [fields, setFields] = useState<string[]>([]);
  const [attributes, setAttributes] = useState<any[]>([]);
  const [createAttributes, setCreateAttributes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [supabaseUrl, setSupabaseUrl] = useState<string>("");
  const [supabaseServiceRoleKey, setSupabaseServiceRoleKey] =
    useState<string>("");
  const [searchField, setSearchField] = useState<string>("");
  const [searchValue, setSearchValue] = useState<string>("");
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [refreshTable, setRefreshTable] = useState<number>(0);

  useEffect(() => {
    const fetchTableDetails = async () => {
      if (!selectedTable) return;

      const { tables, error } = await getTablesByProjectId(projectId);

      if (error) {
        console.error("Error fetching table details:", error);
        message.error(`Error fetching table details: ${error}`);
      } else if (tables) {
        const table = tables.find(
          (table: any) => table.id === selectedTable.id
        );
        const filteredAttributes = table.attributes.filter(
          (attr: any) =>
            attr.read &&
            (!attr.meta_type ||
              (attr.meta_type !== "file" && attr.meta_type !== "image"))
        );
        setAttributes(filteredAttributes);
        setFields(filteredAttributes.map((attr: any) => attr.name));
      }

      setLoading(false);
    };

    if (selectedTable) {
      fetchTableDetails();
    }
  }, [selectedTable, projectId]);

  useEffect(() => {
    const fetchProjectDetails = async () => {
      const { data, error } = await fetchProjectCredentials(projectId);

      if (error) {
        console.error("Error fetching project details:", error);
        message.error(`Error fetching project details: ${error}`);
      } else if (data) {
        setSupabaseUrl(data.supabase_url);
        setSupabaseServiceRoleKey(data.supabase_service_role_key);
      }
    };

    if (projectId) {
      fetchProjectDetails();
    }
  }, [projectId]);

  const handleSelectTable = (table: {
    id: number;
    name: string;
    actions: string[];
  }) => {
    setSelectedTable(table);
    setLoading(true); // Set loading true when a new table is selected
  };

  const handleSearch = useCallback((field: string, value: string) => {
    setSearchField(field);
    setSearchValue(value);
  }, []);

  const handleCreateButtonClick = async () => {
    if (!selectedTable) return;

    const { tables, error } = await getTablesByProjectId(projectId);

    if (error) {
      console.error("Error fetching table details:", error);
      message.error(`Error fetching table details: ${error}`);
    } else if (tables) {
      const table = tables.find((table: any) => table.id === selectedTable.id);
      const createAttributes = table.attributes.filter(
        (attr: any) => attr.create
      );
      setCreateAttributes(createAttributes);
      setIsModalVisible(true);
    }
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
  };

  const handleModalCreate = async (values: any, resetForm: () => void) => {
    if (!selectedTable) return;
    setIsSubmitting(true);

    const dataToInsert = { ...values };

    // Handle file uploads
    for (const key in values) {
      if (values[key][0]?.originFileObj) {
        const file = values[key][0].originFileObj;
        const attribute = attributes.find((attr) => attr.name === key);

        const { error, data } = await uploadFile(
          supabaseUrl,
          supabaseServiceRoleKey,
          attribute?.bucketName,
          file
        );

        if (error) {
          console.error("Error uploading file:", error);
          message.error(`Error uploading file: ${error}`);
          setIsSubmitting(false);
          return;
        }

        // Only set the public URL as the value for the key
        dataToInsert[key] = data.publicUrl;
      }
    }

    // Insert the data into the table
    const { error } = await createRecord(
      supabaseUrl,
      supabaseServiceRoleKey,
      selectedTable.name,
      dataToInsert
    );

    if (error) {
      console.error("Error creating record:", error);
      message.error(`Error creating record: ${error}`);
    } else {
      resetForm();
      setIsModalVisible(false);
      setRefreshTable((prev) => prev + 1); // Increment refreshTable state to refresh the table data
      message.success("Record created successfully");
    }

    setIsSubmitting(false);
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      {projectId && (
        <Sidebar projectId={projectId} onSelectTable={handleSelectTable} />
      )}
      <Layout style={{ marginLeft: 200 }}>
        <ProjectHeader
          selectedTable={selectedTable ? selectedTable.name : ""}
          fields={fields}
          loading={loading}
          onSearch={handleSearch}
        />
        <Content style={{ padding: "24px", background: "#fff" }}>
          <div className="mb-[24px] flex justify-end">
            {selectedTable && (
              <Button
                type="primary"
                onClick={handleCreateButtonClick}
                style={{ paddingLeft: "20px", paddingRight: "20px" }}
              >
                Create {selectedTable.name}
              </Button>
            )}
          </div>
          <div>
            {loading ? (
              <Skeleton active />
            ) : (
              selectedTable && (
                <ProjectTable
                  key={refreshTable} // Ensure the table refreshes when this key changes
                  table={selectedTable}
                  attributes={attributes}
                  supabaseUrl={supabaseUrl}
                  supabaseServiceRoleKey={supabaseServiceRoleKey}
                  searchField={searchField}
                  searchValue={searchValue}
                  onTableChange={() => setRefreshTable((prev) => prev + 1)}
                />
              )
            )}
          </div>
        </Content>
        <CreateRecordModal
          visible={isModalVisible}
          onCancel={handleModalCancel}
          onCreate={handleModalCreate}
          attributes={createAttributes.filter((attr) => attr.create)}
          isSubmitting={isSubmitting}
        />
      </Layout>
    </Layout>
  );
}
