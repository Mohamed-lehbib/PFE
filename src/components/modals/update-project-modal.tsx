import React, { Dispatch, SetStateAction } from "react";
import { Modal } from "antd";
import ProjectEditor from "../update-project-form/update-project-form";

interface UpdateProjectModalProps {
  editModalVisible: boolean;
  selectedProject: { project_id: string } | null;
  setEditModalVisible: Dispatch<SetStateAction<boolean>>;
  setLoading: Dispatch<SetStateAction<boolean>>;
  fetchProjects: () => void;
  setUploading: Dispatch<SetStateAction<boolean>>;
}

const UpdateProjectModal: React.FC<UpdateProjectModalProps> = ({
  editModalVisible,
  selectedProject,
  setEditModalVisible,
  setLoading,
  fetchProjects,
  setUploading,
}) => {
  return (
    <Modal
      title="Edit Project"
      open={editModalVisible}
      onCancel={() => setEditModalVisible(false)}
      footer={null}
    >
      {selectedProject && (
        <ProjectEditor
          projectId={selectedProject.project_id}
          onSuccess={() => {
            setEditModalVisible(false);
            setLoading(true);
            fetchProjects();
          }}
          setUploading={setUploading}
        />
      )}
    </Modal>
  );
};

export default UpdateProjectModal;
