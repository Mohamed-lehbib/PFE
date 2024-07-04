import React, { useState, useEffect, useCallback } from "react";
import { Layout, Typography, Select, Input, Skeleton, Button } from "antd";

const { Header } = Layout;
const { Title } = Typography;
const { Option } = Select;

interface HeaderProps {
  selectedTable: string;
  fields: string[];
  loading: boolean;
  onSearch: (field: string, value: string) => void;
}

const ProjectHeader: React.FC<HeaderProps> = ({
  selectedTable,
  fields,
  loading,
  onSearch,
}) => {
  const [selectedField, setSelectedField] = useState<string | undefined>(
    undefined
  );
  const [searchValue, setSearchValue] = useState<string>("");

  useEffect(() => {
    if (selectedField && searchValue) {
      onSearch(selectedField, searchValue);
    }
  }, [selectedField, searchValue, onSearch]);

  const handleFieldChange = useCallback((value: string) => {
    setSelectedField(value);
  }, []);

  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchValue(e.target.value);
    },
    []
  );

  const handleClearFilter = useCallback(() => {
    setSelectedField(undefined);
    setSearchValue("");
    onSearch("", "");
  }, [onSearch]);

  const renderSkeleton = () => (
    <>
      <Skeleton.Input
        active
        style={{ width: 150, marginRight: 16, padding: "8px" }}
      />
      <Skeleton.Input
        active
        style={{ width: 200, marginRight: 16, padding: "8px" }}
      />
      <Skeleton.Button active style={{ padding: "8px" }} />
    </>
  );

  const renderSearchControls = () => (
    <>
      <Select
        placeholder="Select field for search"
        style={{ width: 200, marginRight: 16 }}
        onChange={handleFieldChange}
        value={selectedField}
      >
        {fields.map((field) => (
          <Option key={field} value={field}>
            {field}
          </Option>
        ))}
      </Select>
      <Input
        placeholder="Enter search value"
        style={{ width: 200, marginRight: 16 }}
        onChange={handleSearchChange}
        value={searchValue}
      />
      <Button type="primary" onClick={handleClearFilter}>
        Clear Filter
      </Button>
    </>
  );

  return (
    <Header
      style={{
        background: "#fff",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "16px 50px",
      }}
    >
      {loading ? (
        <Skeleton.Input active style={{ width: 200, padding: "8px" }} />
      ) : (
        <Title level={4}>{selectedTable}</Title>
      )}
      <div style={{ display: "flex", alignItems: "center" }}>
        {loading ? renderSkeleton() : renderSearchControls()}
      </div>
    </Header>
  );
};

export default ProjectHeader;
