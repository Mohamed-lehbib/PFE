import { Button, Form, Input, message, Spin } from "antd";
import { useForm } from "antd/es/form/Form";
import { useParams } from "next/navigation";
import React, { useState } from "react";

interface Props {
  onNext: () => void;
}

export default function SupabaseCredentialsPage({ onNext }: Readonly<Props>) {
  const [form] = useForm();
  const [url, setUrl] = useState("");
  const [key, setKey] = useState("");
  const [loading, setLoading] = useState(false);
  const params = useParams<{ id: string }>();

  const handleSubmit = () => {
    form.submit();
  };

  const onFinish = async (values: { [key: string]: any }) => {
    console.log("Received values from form: ", values);
    setLoading(true); // Start loading

    try {
      const response = await fetch(
        `/api/project/update-credentials/${params.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            supabase_url: values.url,
            supabase_service_role_key: values.key,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error updating project:", errorData);
        message.error(
          `Error updating project: ${errorData.error || "Unknown error"}`
        );
        return;
      }

      const responseData = await response.json();
      console.log("Project updated successfully:", responseData);
      message.success("Project updated successfully");
      onNext(); // Call the parent component's onNext function
    } catch (error: any) {
      console.error("Failed to update project:", error);
      message.error(
        `Failed to update project: ${error.message || "Unknown error"}`
      );
    } finally {
      setLoading(false); // Stop loading
    }
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log("Failed:", errorInfo);
    message.error("Please fill in all required fields.");
  };

  return (
    <div className="flex flex-col w-screen">
      <Spin spinning={loading}>
        <div className="container mx-auto px-4 py-8 max-w-lg">
          <h1 className="text-2xl font-semibold text-center mb-8">
            Supabase Configuration
          </h1>
          <Form
            form={form}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
            layout="vertical"
          >
            <Form.Item
              label="Supabase URL"
              name="url"
              rules={[{ required: true, message: "Please enter Supabase URL" }]}
            >
              <Input
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="Enter Supabase URL"
              />
            </Form.Item>

            <Form.Item
              label="Supabase Service Role Key"
              name="key"
              rules={[
                {
                  required: true,
                  message: "Please enter Supabase Service Role Key",
                },
              ]}
            >
              <Input
                type="password"
                value={key}
                onChange={(e) => setKey(e.target.value)}
                placeholder="Supabase Service Role Key"
              />
            </Form.Item>
          </Form>
        </div>
        <div className="flex justify-end mb-4">
          <Button type="primary" onClick={handleSubmit} disabled={loading}>
            Next
          </Button>
        </div>
      </Spin>
    </div>
  );
}
