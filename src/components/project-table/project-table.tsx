import React, { useEffect, useState } from "react";
import { Table, Skeleton } from "antd";
import { createClient } from "@supabase/supabase-js";


interface ProjectTableProps {
  table: { id: number; name: string };
  attributes: any[];
  supabaseUrl: string;
  supabaseServiceRoleKey: string;
}

export default function ProjectTable({
  table,
  attributes,
  supabaseUrl,
  supabaseServiceRoleKey,
}: ProjectTableProps) {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);
      const { data: tableData, error } = await supabase.from(table.name).select(
        attributes
          .filter((attr) => attr.read)
          .map((attr) => attr.name)
          .join(", ")
      );

      if (error) {
        console.error("Error fetching table data:", error);
      } else {
        setData(tableData);
      }

      setLoading(false);
    };

    fetchData();
  }, [table, attributes, supabaseUrl, supabaseServiceRoleKey]);

  const columns = attributes
    .filter((attr) => attr.read)
    .map((attr) => ({
      title: attr.name,
      dataIndex: attr.name,
      key: attr.name,
    }));

  return loading ? (
    <Skeleton active />
  ) : (
    <Table dataSource={data} columns={columns} rowKey="id" />
  );
}
