import React from "react";
import { Modal } from "antd";

interface DeleteProjectModalProps {
  isVisible: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function DeleteProjectModal({
  isVisible,
  onConfirm,
  onCancel,
}: Readonly<DeleteProjectModalProps>) {
  return (
    <Modal
      title="Confirm Deletion"
      visible={isVisible}
      onOk={onConfirm}
      onCancel={onCancel}
      okText="Yes, delete it"
      cancelText="Cancel"
    >
      <p>Are you sure you want to delete this project?</p>
    </Modal>
  );
}
