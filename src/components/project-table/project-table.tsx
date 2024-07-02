import React, { useEffect, useState } from "react";
import { Table, Skeleton } from "antd";
import { createClient } from "@supabase/supabase-js";

interface ProjectTableProps {
  table: { id: number; name: string };
  attributes: any[];
  supabaseUrl: string;
  supabaseServiceRoleKey: string;
  searchField: string;
  searchValue: string;
}

export default function ProjectTable({
  table,
  attributes,
  supabaseUrl,
  supabaseServiceRoleKey,
  searchField,
  searchValue,
}: ProjectTableProps) {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

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
  ]);

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
