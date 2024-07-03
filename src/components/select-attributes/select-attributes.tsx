import { getTablesByProjectId } from "@/queries/tables/get-tables-by-project-id/get-tables-by-project-id";
import { createClient } from "@/utils/supabase/client";
import { Button, Spin, Table, message, Progress, Checkbox, Select } from "antd";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

interface TableData {
  id: string;
  name: string;
  project_id: string;
  status: string;
  attributes: AttributeData[];
}

interface AttributeData {
  name: string;
  type: string;
  metaType?: string;
  read: boolean;
  create: boolean;
  update: boolean;
  enumValues?: string[];
}

function mapAttributes(attributes: any[]): AttributeData[] {
  return attributes.map((attr) => ({
    ...attr,
    read: false,
    create: false,
    update: false,
    type: attr.type || "string",
  }));
}

function filterAndMapTables(tables: TableData[]): TableData[] {
  return tables
    .filter((table) => table.status === "SHOWN")
    .map((table) => ({
      ...table,
      attributes: mapAttributes(table.attributes),
    }));
}

async function fetchTables(
  id: string,
  setLoading: (loading: boolean) => void,
  setTables: (tables: TableData[]) => void
) {
  setLoading(true);
  try {
    const response = await getTablesByProjectId(id);
    if (response.status === 200 && response.tables) {
      const filteredTables = filterAndMapTables(response.tables);
      setTables(filteredTables);
    } else {
      console.error("Failed to fetch tables:", response.error);
    }
  } catch (error) {
    console.error("Error fetching tables:", error);
  } finally {
    setLoading(false);
  }
}

export default function SelectAttributes() {
  const [tables, setTables] = useState<TableData[]>([]);
  const [currentTableIndex, setCurrentTableIndex] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    fetchTables(params.id, setLoading, setTables);
  }, [params.id]);

  useEffect(() => {
    if (tables.length > 0 && currentTableIndex < tables.length) {
      const tableId = tables[currentTableIndex].id;
      const updatedSearchParams = new URLSearchParams(searchParams);
      updatedSearchParams.set("table_id", tableId);
      router.replace(`?${updatedSearchParams.toString()}`);
      setProgress(
        parseFloat(((currentTableIndex / tables.length) * 100).toFixed(2))
      );
    }
  }, [tables, currentTableIndex, searchParams, router]);

  const handleSaveAndNext = async () => {
    setLoading(true);
    const currentTable = tables[currentTableIndex];
    const response = await fetch(
      `/api/tables/update-table-attributes/${params.id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          tableId: currentTable.id,
          attributes: currentTable.attributes,
        }),
      }
    );

    const result = await response.json();
    setLoading(false);

    if (response.ok) {
      if (currentTableIndex < tables.length - 1) {
        setCurrentTableIndex(currentTableIndex + 1);
      } else {
        message.success("All tables configured successfully");
        const supabase = createClient();
        await supabase
          .from("project")
          .update({ progress: 10 })
          .eq("id", params.id);
        setProgress(100);
        router.push(`/project/${params.id}`);
      }
    } else {
      message.error("Failed to save table configuration");
      console.error("Failed to save table configuration:", result.error);
    }
  };

  const handleCheckboxChange = (
    attributeName: string,
    field: "read" | "create" | "update",
    checked: boolean
  ) => {
    const updatedAttributes = currentTable.attributes.map((attr) =>
      attr.name === attributeName ? { ...attr, [field]: checked } : attr
    );
    setTables((prevTables) => {
      const newTables = [...prevTables];
      newTables[currentTableIndex].attributes = updatedAttributes;
      return newTables;
    });
  };

  const handleMetaTypeChange = (attributeName: string, value: string) => {
    const updatedAttributes = currentTable.attributes.map((attr) =>
      attr.name === attributeName ? { ...attr, metaType: value } : attr
    );
    setTables((prevTables) => {
      const newTables = [...prevTables];
      newTables[currentTableIndex].attributes = updatedAttributes;
      return newTables;
    });
  };

  const currentTable = tables[currentTableIndex];
  const columns = [
    {
      title: "Attribute Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
    },
    {
      title: "Meta Type",
      dataIndex: "metaType",
      key: "metaType",
      render: (metaType: string, record: AttributeData) =>
        record.type === "text" || record.type === "string" ? (
          <Select
            value={metaType}
            onChange={(value) => handleMetaTypeChange(record.name, value)}
            style={{ minWidth: "100px" }}
          >
            <Select.Option value="text">Text</Select.Option>
            <Select.Option value="textarea">Text Area</Select.Option>
            <Select.Option value="file">File</Select.Option>
            <Select.Option value="image">Image</Select.Option>
          </Select>
        ) : null,
    },
    {
      title: "Read",
      dataIndex: "read",
      key: "read",
      render: (read: boolean, record: AttributeData) => (
        <Checkbox
          checked={read}
          onChange={(e) =>
            handleCheckboxChange(record.name, "read", e.target.checked)
          }
        />
      ),
    },
    {
      title: "Create",
      dataIndex: "create",
      key: "create",
      render: (create: boolean, record: AttributeData) => (
        <Checkbox
          checked={create}
          onChange={(e) =>
            handleCheckboxChange(record.name, "create", e.target.checked)
          }
        />
      ),
    },
    {
      title: "Update",
      dataIndex: "update",
      key: "update",
      render: (update: boolean, record: AttributeData) => (
        <Checkbox
          checked={update}
          onChange={(e) =>
            handleCheckboxChange(record.name, "update", e.target.checked)
          }
        />
      ),
    },
  ];

  return (
    <Spin spinning={loading}>
      <div className="flex flex-col w-screen">
        <div className="container mx-auto px-4 py-8 max-w-2xl">
          <h1 className="text-2xl font-semibold text-center mb-8">
            Attribute Selection for Table: {currentTable?.name}
          </h1>
          {currentTable && (
            <Table
              columns={columns}
              dataSource={currentTable.attributes}
              rowKey="name"
              pagination={false}
              scroll={{ x: "max-content" }}
            />
          )}
          <div className="flex justify-end mt-4">
            <Button type="primary" onClick={handleSaveAndNext}>
              {currentTableIndex < tables.length - 1 ? "Next" : "Finish"}
            </Button>
          </div>
          <div className="mt-4">
            <Progress
              percent={progress}
              status={progress === 100 ? "success" : "active"}
            />
            <p>
              Configured {currentTableIndex + 1} of {tables.length} tables
            </p>
          </div>
        </div>
      </div>
    </Spin>
  );
}
