import React from "react";
import { Modal, Form, Input, Select, Button, Spin } from "antd";

const { Option } = Select;

interface CreateRecordModalProps {
  visible: boolean;
  onCancel: () => void;
  onCreate: (values: any) => void;
  attributes: any[];
  isSubmitting: boolean;
}

const CreateRecordModal: React.FC<CreateRecordModalProps> = ({
  visible,
  onCancel,
  onCreate,
  attributes,
  isSubmitting,
}) => {
  const [form] = Form.useForm();

  const renderFormFields = () => {
    return attributes.map((attr) => {
      if (attr.type === "enum" || attr.enumValues) {
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

  const handleSubmit = () => {
    form
      .validateFields()
      .then((values) => {
        onCreate(values);
        form.resetFields();
      })
      .catch((info) => {
        console.log("Validate Failed:", info);
      });
  };

  return (
    <Modal
      visible={visible}
      title="Create New Record"
      onCancel={onCancel}
      footer={[
        <Button key="back" onClick={onCancel} disabled={isSubmitting}>
          Cancel
        </Button>,
        <Button
          key="submit"
          type="primary"
          onClick={handleSubmit}
          loading={isSubmitting}
        >
          Create
        </Button>,
      ]}
    >
      <Spin spinning={isSubmitting}>
        <Form form={form} layout="vertical">
          {renderFormFields()}
        </Form>
      </Spin>
    </Modal>
  );
};

export default CreateRecordModal;
