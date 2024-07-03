import React from "react";
import { Modal, Form, Input, Select, Button, Spin, Upload } from "antd";
import { UploadOutlined } from "@ant-design/icons";

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

  const getValueFromEvent = (e: any) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e && e.fileList;
  };

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

  const handleSubmit = () => {
    form
      .validateFields()
      .then((values) => {
        onCreate(values); // Send values directly
        form.resetFields();
      })
      .catch((info) => {
        console.log("Validate Failed:", info);
      });
  };

  return (
    <Modal
      open={visible}
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
