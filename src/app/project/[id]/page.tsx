"use client";
import { useParams } from "next/navigation";
import React, { useState, useEffect } from "react";
import { Layout, Skeleton } from "antd";
import Sidebar from "@/components/sidebar/sidebar";
import { createClient } from "@/utils/supabase/client";
import ProjectHeader from "@/components/header/header";
import ProjectTable from "@/components/project-table/project-table";

const { Content } = Layout;

export default function ProjectPage() {
  const params = useParams<{ id: string }>();
  const projectId = params?.id;
  const [selectedTable, setSelectedTable] = useState<{
    id: number;
    name: string;
  } | null>(null);
  const [fields, setFields] = useState<string[]>([]);
  const [attributes, setAttributes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [supabaseUrl, setSupabaseUrl] = useState<string>("");
  const [supabaseServiceRoleKey, setSupabaseServiceRoleKey] =
    useState<string>("");

  useEffect(() => {
    const fetchTableDetails = async () => {
      if (!selectedTable) return;

      const supabase = createClient();
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
      const supabase = createClient();
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

  const handleSelectTable = (table: { id: number; name: string }) => {
    setSelectedTable(table);
    setLoading(true); // Set loading true when a new table is selected
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
        />
        <Content style={{ padding: "24px", background: "#fff" }}>
          <div>
            {loading ? (
              <Skeleton active />
            ) : (
              selectedTable && (
                <ProjectTable
                  table={selectedTable}
                  attributes={attributes}
                  supabaseUrl={supabaseUrl}
                  supabaseServiceRoleKey={supabaseServiceRoleKey}
                />
              )
            )}
          </div>
        </Content>
      </Layout>
    </Layout>
  );
}
