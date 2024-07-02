import React, { useState } from "react";
import { Layout, Typography, Select, Input, Skeleton, Button } from "antd";

const { Header } = Layout;
const { Title } = Typography;
const { Option } = Select;

interface HeaderProps {
  selectedTable: string;
  fields: string[];
  loading: boolean;
}

const ProjectHeader: React.FC<HeaderProps> = ({
  selectedTable,
  fields,
  loading,
}) => {
  const [selectedField, setSelectedField] = useState<string | undefined>(
    undefined
  );
  const [searchValue, setSearchValue] = useState<string>("");

  const handleFieldChange = (value: string) => {
    setSelectedField(value);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
  };

  const handleSearch = () => {
    // Implement the search functionality
    console.log(`Searching ${selectedField} for ${searchValue}`);
  };

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
        {loading ? (
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
        ) : (
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
            <Button type="primary" onClick={handleSearch}>
              Search
            </Button>
          </>
        )}
      </div>
    </Header>
  );
};

export default ProjectHeader;
