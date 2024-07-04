import React from "react";
import { Modal, Form, Button, Spin } from "antd";
import FormFieldsRenderer from "../form-fields-renderer/form-fields-renderer";

interface CreateRecordModalProps {
  visible: boolean;
  onCancel: () => void;
  onCreate: (values: any, resetForm: () => void) => void;
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
      return e.slice(-1); // Ensure only one file is kept
    }
    return e?.fileList.slice(-1); // Ensure only one file is kept
  };

  const handleSubmit = () => {
    form
      .validateFields()
      .then((values) => {
        onCreate(values, form.resetFields);
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
          <FormFieldsRenderer
            attributes={attributes}
            getValueFromEvent={getValueFromEvent}
          />
        </Form>
      </Spin>
    </Modal>
  );
};

export default CreateRecordModal;
