import React from "react";
import { Form, Input, Select, Upload, Button } from "antd";
import { UploadOutlined } from "@ant-design/icons";

const { Option } = Select;

interface FormFieldsRendererProps {
  attributes: any[];
  getValueFromEvent: (e: any) => any;
}

const FormFieldsRenderer: React.FC<FormFieldsRendererProps> = ({
  attributes,
  getValueFromEvent,
}) => {
  return (
    <>
      {attributes.map((attr) => {
        if (attr.enumValues) {
          return (
            <Form.Item
              key={attr.name}
              name={attr.name}
              label={attr.name}
              rules={[
                { required: true, message: `Please select ${attr.name}` },
              ]}
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
                rules={[
                  { required: true, message: `Please input ${attr.name}` },
                ]}
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
                rules={[
                  { required: true, message: `Please input ${attr.name}` },
                ]}
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
              rules={[
                { required: true, message: `Please select ${attr.name}` },
              ]}
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
      })}
    </>
  );
};

export default FormFieldsRenderer;
