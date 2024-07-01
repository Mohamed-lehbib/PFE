import { getTablesByProjectId } from "@/queries/tables/get-tables-by-project-id/get-tables-by-project-id";
import { updateTableStatusActions } from "@/queries/tables/update-table-status-actions/update-table-status-actions";
import { AttributeWithEnum } from "@/utils/tableParser/tableParser";
import { Button, Checkbox, Spin, Table, message } from "antd";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";

interface TableData {
  id: string;
  name: string;
  project_id: string;
  status: string;
  attributes: AttributeWithEnum[];
  actions: string[];
  all: boolean;
  create: boolean;
  read: boolean;
  update: boolean;
  delete: boolean;
}

export default function SelectTables({
  onNext,
  onPrevious,
}: Readonly<{
  onNext: () => void;
  onPrevious: () => void;
}>) {
  const [tables, setTables] = useState<TableData[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const params = useParams<{ id: string }>();

  useEffect(() => {
    const fetchTables = async () => {
      setLoading(true);
      try {
        const response = await getTablesByProjectId(params.id);
        if (response.status === 200 && response.tables) {
          const tableData = response.tables.map((table: any) => ({
            ...table,
            all: false,
            create: false,
            read: false,
            update: false,
            delete: false,
            actions: [],
          }));
          setTables(tableData);
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

  const handleCheckboxChange = (
    id: string,
    field: keyof TableData,
    value: boolean
  ) => {
    const updatedTables = tables.map((table) => {
      if (table.id === id) {
        if (field === "all") {
          return {
            ...table,
            all: value,
            create: value,
            read: value,
            update: value,
            delete: value,
          };
        }
        const allChecked = ["create", "read", "update", "delete"].every(
          (key) => key === field || table[key as keyof TableData]
        );
        return { ...table, [field]: value, all: allChecked };
      }
      return table;
    });

    setTables(updatedTables);
  };

  const handleSubmit = async () => {
    setLoading(true);

    const updatedTables = tables.map((table) => {
      const actions = [];
      if (table.create) actions.push("create");
      if (table.read) actions.push("read");
      if (table.update) actions.push("update");
      if (table.delete) actions.push("delete");

      return {
        id: table.id,
        status: table.read ? "SHOWN" : "HIDDEN",
        actions,
      };
    });
    console.log("updateTable", updatedTables);
    const response = await updateTableStatusActions(updatedTables);

    if (response.status === 200) {
      message.success("Tables updated successfully");
      setLoading(false);
    } else {
      message.error("Failed to update tables");
      console.error("Failed to update tables:", response.error);
      setLoading(false);
      // Handle error case, maybe show a message to the user
    }
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "All",
      dataIndex: "all",
      key: "all",
      render: (_: any, record: TableData) => (
        <Checkbox
          checked={record.all}
          onChange={(e) =>
            handleCheckboxChange(record.id, "all", e.target.checked)
          }
        />
      ),
    },
    {
      title: "Create",
      dataIndex: "create",
      key: "create",
      render: (_: any, record: TableData) => (
        <Checkbox
          checked={record.create}
          onChange={(e) =>
            handleCheckboxChange(record.id, "create", e.target.checked)
          }
        />
      ),
    },
    {
      title: "Read",
      dataIndex: "read",
      key: "read",
      render: (_: any, record: TableData) => (
        <Checkbox
          checked={record.read}
          onChange={(e) =>
            handleCheckboxChange(record.id, "read", e.target.checked)
          }
        />
      ),
    },
    {
      title: "Update",
      dataIndex: "update",
      key: "update",
      render: (_: any, record: TableData) => (
        <Checkbox
          checked={record.update}
          onChange={(e) =>
            handleCheckboxChange(record.id, "update", e.target.checked)
          }
        />
      ),
    },
    {
      title: "Delete",
      dataIndex: "delete",
      key: "delete",
      render: (_: any, record: TableData) => (
        <Checkbox
          checked={record.delete}
          onChange={(e) =>
            handleCheckboxChange(record.id, "delete", e.target.checked)
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
            Table Selection
          </h1>
          <Table
            columns={columns}
            dataSource={tables}
            rowKey="id"
            pagination={false}
          />
        </div>
        <div className="flex justify-end mb-4 px-4">
          <Button onClick={onPrevious} className="mr-2">
            Previous
          </Button>
          <Button type="primary" onClick={handleSubmit}>
            Next
          </Button>
        </div>
      </div>
    </Spin>
  );
}
