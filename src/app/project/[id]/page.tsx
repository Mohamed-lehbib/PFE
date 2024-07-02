"use client";
import { useParams } from "next/navigation";
import React, { useState, useEffect } from "react";
import { Layout, Select, Skeleton } from "antd";
import Sidebar from "@/components/sidebar/sidebar";
import { createClient } from "@/utils/supabase/client";
import ProjectHeader from "@/components/header/header";

const { Content } = Layout;
const { Option } = Select;

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
      console.log("attributes", attributes);
      setLoading(false);
    };

    if (selectedTable) {
      fetchTableDetails();
    }
  }, [selectedTable]);

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
          <div>{loading ? <Skeleton active /> : <>content</>}</div>
        </Content>
      </Layout>
    </Layout>
  );
}
