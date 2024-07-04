import React, { useEffect, useState } from "react";
import {
  Modal,
  Form,
  Input,
  Select,
  Button,
  Spin,
  Upload,
  message,
} from "antd";
import { createClient } from "@supabase/supabase-js";
import { UploadOutlined } from "@ant-design/icons";
import { v4 as uuidv4 } from "uuid";

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
      const initialValues = { ...record };
      attributes.forEach((attr) => {
        if (attr.metaType === "image" && record[attr.name]) {
          initialValues[attr.name] = [
            {
              uid: "-1",
              name: "image.png",
              status: "done",
              url: record[attr.name],
            },
          ];
        }
      });
      form.setFieldsValue(initialValues);
    }
  }, [record, form, attributes]);

  const getValueFromEvent = (e: any) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e?.fileList;
  };

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
        if (attr.metaType === "textarea") {
          return (
            <Form.Item
              key={attr.name}
              name={attr.name}
              label={attr.name}
              rules={[{ required: true, message: `Please input ${attr.name}` }]}
            >
              <Input.TextArea />
            </Form.Item>
          );
        } else if (attr.metaType === "image" || attr.metaType === "file") {
          return (
            <Form.Item
              key={attr.name}
              name={attr.name}
              label={attr.name}
              valuePropName="fileList"
              getValueFromEvent={getValueFromEvent}
              rules={[
                { required: true, message: `Please upload ${attr.name}` },
              ]}
            >
              <Upload listType="picture" beforeUpload={() => false}>
                <Button icon={<UploadOutlined />}>Click to upload</Button>
              </Upload>
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
              <Input type="text" />
            </Form.Item>
          );
        }
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
      const dataToUpdate = { ...values };

      // Handle file uploads
      for (const key in values) {
        if (values[key] && values[key][0]?.originFileObj) {
          const file = values[key][0].originFileObj;
          const attribute = attributes.find((attr) => attr.name === key);
          const bucketName = attribute?.bucketName;
          const validFileName = file.name.replace(
            /[^a-zA-Z0-9-._*'()&$@=;:+,?/ ]/g,
            ""
          );
          const filePath = `public/${uuidv4()}/${validFileName}`;

          const { error: uploadError } = await supabase.storage
            .from(bucketName)
            .upload(filePath, file);

          if (uploadError) {
            message.error(`Error uploading file: ${uploadError.message}`);
            setLoading(false);
            return;
          }

          // Get public URL for the uploaded file
          const { data } = supabase.storage
            .from(bucketName)
            .getPublicUrl(filePath);

          dataToUpdate[key] = data.publicUrl;
        }
      }

      // Update the record in the table
      const { error } = await supabase
        .from(table.name)
        .update(dataToUpdate)
        .eq("id", record.id);

      if (error) {
        message.error(`Error updating record: ${error.message}`);
      } else {
        onEditSuccess();
        onCancel();
        message.success("Record updated successfully");
      }
    } catch (error: any) {
      console.log("Validate Failed:", error);
      message.error(`Validation Failed: ${error.message}`);
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
