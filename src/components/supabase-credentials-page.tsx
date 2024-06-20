import {
  parseSupabaseTablesWithAttributes,
  TableAttributes,
} from "@/utils/tableParser/tableParser";
import { InboxOutlined } from "@ant-design/icons";
import { Upload, message, Button, Steps, Checkbox } from "antd";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

const { Dragger } = Upload;

export default function SupabaseCredentialsPage() {
  const [url, setUrl] = useState("");
  const [key, setKey] = useState("");
  const [tables, setTables] = useState<TableAttributes[]>([]);
  const [fileContent, setFileContent] = useState<string>("");
  const router = useRouter();

  const handleFiles = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result;
      const tablesWithAttributes = parseSupabaseTablesWithAttributes(
        text as string
      );
      setTables(tablesWithAttributes);
      setFileContent(text as string);
    };
    reader.readAsText(file);
  };

  const handleSubmit = async () => {
    if (!url || !key || tables.length === 0) {
      message.error("Supabase credentials and a TypeScript file are required.");
      return;
    }

    // Send credentials and parsed data to the API route
    const response = await fetch("/api/store-data", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url, key, tables }),
    });

    if (response.ok) {
      router.push("/tables-overview");
    } else {
      message.error("Error saving data.");
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-lg">
      <h1 className="text-2xl font-semibold text-center mb-8">
        Supabase Configuration
      </h1>

      <div className="mb-6">
        <label className="block text-lg font-medium mb-2">Supabase URL</label>
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          required
          placeholder="Enter Supabase URL"
          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      <div className="mb-6">
        <label className="block text-lg font-medium mb-2">
          Supabase Service Role Key
        </label>
        <input
          type="password"
          value={key}
          onChange={(e) => setKey(e.target.value)}
          required
          placeholder="Supabase Service Role Key"
          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      <div className="mb-6">
        <Dragger
          name="file"
          multiple={false}
          beforeUpload={(file) => {
            handleFiles(file);
            return false;
          }}
        >
          <p className="ant-upload-drag-icon mb-4">
            <InboxOutlined />
          </p>
          <p className="ant-upload-text text-lg mb-2">
            Click or drag a TypeScript file to upload
          </p>
          <p className="ant-upload-hint">Supports a single-file upload only.</p>
        </Dragger>
      </div>

      <Button
        type="primary"
        onClick={handleSubmit}
        size="large"
        className="w-full"
      >
        Continue
      </Button>
    </div>
  );
}
