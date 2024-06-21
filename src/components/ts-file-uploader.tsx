import React, { useState } from "react";
import { InboxOutlined } from "@ant-design/icons";
import { Button, Upload, message, Spin } from "antd";
import { parseSupabaseTablesWithAttributes } from "@/utils/tableParser/tableParser"; // Adjust import
import { useParams } from "next/navigation";
import { insertTables } from "@/queries/tables/create-table/create-table";
const { Dragger } = Upload;

interface Props {
  onNext: () => void;
  onPrevious: () => void;
}

const TsFileUploader = ({ onNext, onPrevious }: Props) => {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const params = useParams<{ id: string }>();

  const handleFiles = async (file: File) => {
    if (!file.name.endsWith(".ts")) {
      message.error("Please upload a valid TypeScript file.");
      return false;
    }
    setFile(file);
    return true; // Proceed with upload
  };

  const handleSubmit = async () => {
    if (!file) {
      message.error("Please upload a TypeScript file before proceeding.");
      return;
    }
    setLoading(true);
    const reader = new FileReader();
    reader.onload = async (e) => {
      const text = e.target?.result;
      try {
        const tablesWithAttributes = parseSupabaseTablesWithAttributes(
          text as string
        );
        console.log("Parsed tables with attributes:", tablesWithAttributes);
        const response = await insertTables(
          tablesWithAttributes.map(({ tableName, attributes }) => ({
            name: tableName,
            project_id: params.id,
            attributes,
            status: "SHOWN",
          }))
        );
        console.log("Insert response:", response);
        if (response.status === 201) {
          message.success("File uploaded successfully!");
          onNext(); // Move onNext inside onload to ensure parsing is complete before proceeding
        } else {
          if (
            typeof response.error === "object" &&
            response.error !== null &&
            "message" in response.error
          ) {
            message.error(`Failed to upload file: ${response.error.message}`);
          } else {
            message.error("Failed to upload file. Please try again.");
          }
        }
      } catch (error) {
        console.error("Error in handleSubmit:", error);
        message.error("Failed to upload file. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    reader.readAsText(file);
  };

  return (
    <Spin spinning={loading}>
      <div className="flex flex-col w-screen">
        <div className="container mx-auto px-4 py-8 max-w-lg">
          <h1 className="text-2xl font-semibold text-center mb-8">
            Upload TypeScript File
          </h1>

          <div className="mb-6">
            <Dragger name="file" multiple={false} beforeUpload={handleFiles}>
              <p className="ant-upload-drag-icon mb-4">
                <InboxOutlined />
              </p>
              <p className="ant-upload-text text-lg mb-2">
                Click or drag a TypeScript file to upload
              </p>
              <p className="ant-upload-hint">
                Supports a single-file upload only.
              </p>
            </Dragger>
          </div>
        </div>
        <div className="flex justify-end mb-4 px-4">
          <Button onClick={onPrevious} className="mr-2">
            Previous
          </Button>
          <Button type="primary" onClick={handleSubmit} disabled={loading}>
            Next
          </Button>
        </div>
      </div>
    </Spin>
  );
};

export default TsFileUploader;
