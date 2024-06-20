"use client";
import React, { useState } from "react";
import { Upload, message, Button, Steps, Checkbox } from "antd";
import { useRouter } from "next/navigation";
import { TableAttributes } from "@/utils/tableParser/tableParser";
import SupabaseCredentialsPage from "@/components/supabase-credentials-page";

const ConfigureProject = () => {
  const router = useRouter();
  const [current, setCurrent] = useState(0);
  const [url, setUrl] = useState("");
  const [key, setKey] = useState("");
  const [tables, setTables] = useState<TableAttributes[]>([]);

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

  const steps = [
    {
      title: "Supabase Configuration",
      content: <SupabaseCredentialsPage />,
    },
    {
      title: "Additional Configuration",
      content: (
        <div className="container mx-auto px-4 py-8 max-w-lg">
          <h1 className="text-2xl font-semibold text-center mb-8">
            Additional Configuration
          </h1>
          <Checkbox.Group style={{ width: "100%" }}>
            <div className="mb-4">
              <Checkbox value="option1">Option 1</Checkbox>
            </div>
            <div className="mb-4">
              <Checkbox value="option2">Option 2</Checkbox>
            </div>
            <div className="mb-4">
              <Checkbox value="option3">Option 3</Checkbox>
            </div>
          </Checkbox.Group>
          <Button
            type="primary"
            onClick={handleSubmit}
            size="large"
            className="w-full mt-6"
          >
            Submit
          </Button>
        </div>
      ),
    },
  ];

  const next = () => {
    setCurrent(current + 1);
  };

  const prev = () => {
    setCurrent(current - 1);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Steps size="small" current={current} className="mb-8">
        {steps.map((item) => (
          <Steps.Step key={item.title} title={item.title} />
        ))}
      </Steps>
      <div>{steps[current].content}</div>
      <div className="flex justify-end mb-4">
        <Button onClick={prev} disabled={current === 0}>
          Previous
        </Button>
        <Button
          type="primary"
          onClick={next}
          disabled={current === steps.length - 1}
          className="ml-2"
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export default ConfigureProject;
