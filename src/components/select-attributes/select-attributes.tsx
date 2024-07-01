import { getTablesByProjectId } from "@/queries/tables/get-tables-by-project-id/get-tables-by-project-id";
import { updateTableAttributes } from "@/queries/tables/update-table-attributes/update-table-attributes";
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
  read: boolean;
  create: boolean;
  update: boolean;
  enumValues?: string[];
}

export default function SelectAttributes() {
  const [tables, setTables] = useState<TableData[]>([]);
  const [currentTableIndex, setCurrentTableIndex] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const fetchTables = async () => {
      setLoading(true);
      try {
        const response = await getTablesByProjectId(params.id);
        if (response.status === 200 && response.tables) {
          const filteredTables = response.tables
            .filter((table: TableData) => table.status === "SHOWN")
            .map((table: TableData) => ({
              ...table,
              attributes: table.attributes.map((attr) => ({
                ...attr,
                read: false,
                create: false,
                update: false,
                type: attr.type || "string",
              })),
            }));
          setTables(filteredTables);
        } else {
          console.error("Failed to fetch tables:", response.error);
        }
      } catch (error) {
        console.error("Error fetching tables:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTables();
  }, [params.id]);

  useEffect(() => {
    if (tables.length > 0 && currentTableIndex < tables.length) {
      const tableId = tables[currentTableIndex].id;
      const updatedSearchParams = new URLSearchParams(searchParams);
      updatedSearchParams.set("table_id", tableId);
      router.replace(`?${updatedSearchParams.toString()}`);
    }
  }, [tables, currentTableIndex, searchParams, router]);

  const handleSaveAndNext = async () => {
    setLoading(true);

    const currentTable = tables[currentTableIndex];

    const result = await updateTableAttributes(params.id, {
      id: currentTable.id,
      attributes: currentTable.attributes,
    });

    setLoading(false);

    if (result.status === 200) {
      if (currentTableIndex < tables.length - 1) {
        setCurrentTableIndex(currentTableIndex + 1);
      } else {
        message.success("All tables configured successfully");
        // Add your logic here to handle the completion of all tables configuration
        const supabase = createClient();
        await supabase
          .from("project")
          .update({ progress: 10 })
          .eq("id", params.id);
        router.push(`/project/${params.id}`);
      }
    } else {
      message.error("Failed to save table configuration");
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

  const handleTypeChange = (attributeName: string, value: string) => {
    const updatedAttributes = currentTable.attributes.map((attr) =>
      attr.name === attributeName ? { ...attr, type: value } : attr
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
      render: (type: string, record: AttributeData) => (
        <Select
          value={type}
          onChange={(value) => handleTypeChange(record.name, value)}
        >
          <Select.Option value="string">String</Select.Option>
          <Select.Option value="number">Number</Select.Option>
          <Select.Option value="image">Image</Select.Option>
          <Select.Option value="file">File</Select.Option>
          <Select.Option value="dropdown">Dropdown</Select.Option>
        </Select>
      ),
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
        <div className="container mx-auto px-4 py-8 max-w-lg">
          <h1 className="text-2xl font-semibold text-center mb-8">
            Attribute Selection for Table: {currentTable?.name}
          </h1>
          {currentTable && (
            <Table
              columns={columns}
              dataSource={currentTable.attributes}
              rowKey="name"
              pagination={false}
            />
          )}
          <div className="flex justify-end mt-4">
            <Button type="primary" onClick={handleSaveAndNext}>
              {currentTableIndex < tables.length - 1 ? "Next" : "Finish"}
            </Button>
          </div>
          <div className="mt-4">
            <Progress
              percent={Number(
                (((currentTableIndex + 1) / tables.length) * 100).toFixed(2)
              )}
              status="active"
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
