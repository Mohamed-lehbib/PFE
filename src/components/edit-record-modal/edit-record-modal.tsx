import React, { useEffect, useState } from "react";
import { Modal, Form, Button, Spin, message } from "antd";
import { fetchRecordAttributes } from "@/queries/records/get-record/get-record";
import { uploadFile } from "@/queries/records/upload-record-file/upload-record-file";
import { updateRecord } from "@/queries/records/update-record/update-record";
import FormFieldsRenderer from "../form-fields-renderer/form-fields-renderer";

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
    const fetchData = async () => {
      if (!record) return;

      const { data, error } = await fetchRecordAttributes(
        supabaseUrl,
        supabaseServiceRoleKey,
        table.name,
        record.id
      );

      if (error) {
        message.error(`Error fetching record attributes: ${error.message}`);
        return;
      }

      const initialValues = { ...data };
      attributes.forEach((attr) => {
        if (attr.metaType === "image" && data[attr.name]) {
          initialValues[attr.name] = [
            {
              uid: "-1",
              name: "image.png",
              status: "done",
              url: data[attr.name],
            },
          ];
        }
      });
      form.setFieldsValue(initialValues);
    };

    if (visible && record) {
      fetchData();
    }
  }, [
    visible,
    record,
    form,
    attributes,
    supabaseUrl,
    supabaseServiceRoleKey,
    table.name,
  ]);

  const getValueFromEvent = (e: any) => {
    if (Array.isArray(e)) {
      return e.slice(-1); // Ensure only one file is kept
    }
    return e?.fileList.slice(-1); // Ensure only one file is kept
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);

      const dataToUpdate = { ...values };

      // Handle file uploads
      for (const key in values) {
        if (values[key] && values[key][0]?.originFileObj) {
          const file = values[key][0].originFileObj;
          const attribute = attributes.find((attr) => attr.name === key);
          const bucketName = attribute?.bucketName;

          const { error: uploadError, data } = await uploadFile(
            supabaseUrl,
            supabaseServiceRoleKey,
            bucketName,
            file
          );

          if (uploadError) {
            message.error(`Error uploading file: ${uploadError.message}`);
            setLoading(false);
            return;
          }

          dataToUpdate[key] = data.publicUrl;
        } else if (values[key] && values[key][0]?.url) {
          dataToUpdate[key] = values[key][0].url; // Keep the existing URL if no new file is uploaded
        }
      }

      // Update the record in the table
      const { error } = await updateRecord(
        supabaseUrl,
        supabaseServiceRoleKey,
        table.name,
        record.id,
        dataToUpdate
      );

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
          <FormFieldsRenderer
            attributes={attributes}
            getValueFromEvent={getValueFromEvent}
          />
        </Form>
      </Spin>
    </Modal>
  );
};

export default EditRecordModal;
