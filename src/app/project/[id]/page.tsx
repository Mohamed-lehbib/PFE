"use client";
import { useParams } from "next/navigation";
import React, { useState, useEffect, useCallback } from "react";
import { Layout, Skeleton, Button } from "antd";
import Sidebar from "@/components/sidebar/sidebar";
import { createClient as createSupabaseClient } from "@/utils/supabase/client";
import ProjectHeader from "@/components/header/header";
import ProjectTable from "@/components/project-table/project-table";
import CreateRecordModal from "@/components/create-record-modal/create-record-modal";
import { createClient } from "@supabase/supabase-js";
import { v4 as uuidv4 } from "uuid";

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

      const supabase = createSupabaseClient();
      const { data: tableData, error: tableError } = await supabase
        .from("tables")
        .select("*")
        .eq("id", selectedTable.id)
        .single();

      if (tableError) {
        console.error("Error fetching table details:", tableError);
      } else {
        const filteredAttributes = tableData.attributes.filter(
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
  }, [selectedTable]);

  useEffect(() => {
    const fetchProjectDetails = async () => {
      const supabase = createSupabaseClient();
      const { data: projectData, error: projectError } = await supabase
        .from("project")
        .select("supabase_url, supabase_service_role_key")
        .eq("id", projectId)
        .single();

      if (projectError) {
        console.error("Error fetching project details:", projectError);
      } else {
        setSupabaseUrl(projectData.supabase_url);
        setSupabaseServiceRoleKey(projectData.supabase_service_role_key);
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

  const handleCreateButtonClick = () => {
    setIsModalVisible(true);
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
  };

  const handleModalCreate = async (values: any) => {
    if (!selectedTable) return;
    setIsSubmitting(true);

    const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);
    const dataToInsert = { ...values };

    // Handle file uploads
    for (const key in values) {
      if (values[key][0]?.originFileObj) {
        const file = values[key][0].originFileObj;
        const attribute = attributes.find((attr) => attr.name === key);
        const bucketName = attribute?.bucketName;
        const validFileName = file.name.replace(
          /[^a-zA-Z0-9-._*'()&$@=;:+,?/ ]/g,
          ""
        );
        const filePath = `public/${uuidv4()}/${validFileName}`;

        const { error } = await supabase.storage
          .from(bucketName)
          .upload(filePath, file);

        if (error) {
          console.error("Error uploading file:", error);
          setIsSubmitting(false);
          return;
        }

        // Get public URL for the uploaded file
        const publicUrl = supabase.storage
          .from(bucketName)
          .getPublicUrl(filePath).data.publicUrl;

        dataToInsert[key] = publicUrl;
      }
    }

    // Insert the data into the table
    const { error } = await supabase
      .from(selectedTable.name)
      .insert(dataToInsert);

    if (error) {
      console.error("Error creating record:", error);
    } else {
      setIsModalVisible(false);
      setRefreshTable((prev) => prev + 1); // Increment refreshTable state to refresh the table data
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
          attributes={attributes.filter((attr) => attr.create)}
          isSubmitting={isSubmitting}
        />
      </Layout>
    </Layout>
  );
}
