import { Modal, Spin } from "antd";
import React from "react";
import ProjectUploader from "../create-project-form/create-project-form";

interface CreateProjectModalProps {
  isModalVisible: boolean;
  handleCancel: () => void;
  uploading: boolean;
  handleSuccess: () => void;
  setUploading: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function CreateProjectModal({
  isModalVisible,
  handleCancel,
  uploading,
  handleSuccess,
  setUploading,
}: Readonly<CreateProjectModalProps>) {
  return (
    <Modal
      title="Create New Project"
      open={isModalVisible}
      onCancel={handleCancel}
      footer={null}
    >
      <Spin spinning={uploading}>
        <ProjectUploader
          onSuccess={handleSuccess}
          setUploading={setUploading}
        />
      </Spin>
    </Modal>
  );
}
