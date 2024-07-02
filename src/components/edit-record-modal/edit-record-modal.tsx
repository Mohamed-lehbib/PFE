import React, { useEffect, useState } from "react";
import { Modal, Form, Input, Select, Button, Spin } from "antd";
import { createClient } from "@supabase/supabase-js";

const { Option } = Select;

interface EditRecordModalProps {
  visible: boolean;
  onCancel: () => void;
  record: any;
  table: { id: number; name: string; actions: string[] };
  supabaseUrl: string;
  supabaseServiceRoleKey: string;
  attributes: any[];
  onEditSuccess: () => void;
}

const EditRecordModal: React.FC<EditRecordModalProps> = ({
  visible,
  onCancel,
  record,
  table,
  supabaseUrl,
  supabaseServiceRoleKey,
  attributes,
  onEditSuccess,
}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (record) {
      form.setFieldsValue(record);
    }
  }, [record, form]);

  const renderFormFields = () => {
    return attributes.map((attr) => {
      if (attr.enumValues) {
        return (
          <Form.Item
            key={attr.name}
            name={attr.name}
            label={attr.name}
            rules={[{ required: true, message: `Please select ${attr.name}` }]}
          >
            <Select>
              {attr.enumValues.map((option: string) => (
                <Option key={option} value={option}>
                  {option}
                </Option>
              ))}
            </Select>
          </Form.Item>
        );
      } else if (attr.type === "number") {
        return (
          <Form.Item
            key={attr.name}
            name={attr.name}
            label={attr.name}
            rules={[{ required: true, message: `Please input ${attr.name}` }]}
          >
            <Input type="number" />
          </Form.Item>
        );
      } else if (attr.type === "string") {
        return (
          <Form.Item
            key={attr.name}
            name={attr.name}
            label={attr.name}
            rules={[{ required: true, message: `Please input ${attr.name}` }]}
          >
            <Input type="text" />
          </Form.Item>
        );
      } else if (attr.type === "boolean") {
        return (
          <Form.Item
            key={attr.name}
            name={attr.name}
            label={attr.name}
            valuePropName="checked"
            rules={[{ required: true, message: `Please select ${attr.name}` }]}
          >
            <Select>
              <Option value={true}>True</Option>
              <Option value={false}>False</Option>
            </Select>
          </Form.Item>
        );
      } else {
        return (
          <Form.Item
            key={attr.name}
            name={attr.name}
            label={attr.name}
            rules={[{ required: true, message: `Please input ${attr.name}` }]}
          >
            <Input type={attr.type} />
          </Form.Item>
        );
      }
    });
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);

      const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);
      const { error } = await supabase
        .from(table.name)
        .update(values)
        .eq("id", record.id);

      if (error) {
        console.error("Error updating record:", error);
      } else {
        onEditSuccess();
        onCancel();
      }
    } catch (error) {
      console.log("Validate Failed:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      open={visible}
      title="Edit Record"
      onCancel={onCancel}
      footer={[
        <Button key="back" onClick={onCancel} disabled={loading}>
          Cancel
        </Button>,
        <Button
          key="submit"
          type="primary"
          onClick={handleSubmit}
          loading={loading}
        >
          Update
        </Button>,
      ]}
    >
      <Spin spinning={loading}>
        <Form form={form} layout="vertical">
          {renderFormFields()}
        </Form>
      </Spin>
    </Modal>
  );
};

export default EditRecordModal;
