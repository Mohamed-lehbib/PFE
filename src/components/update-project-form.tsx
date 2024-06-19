import React, { useState, useEffect } from "react";
import { PlusOutlined, DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { message, Spin } from "antd";

const ProjectEditor: React.FC<{
  projectId: string;
  onSuccess: () => void;
  setUploading: React.Dispatch<React.SetStateAction<boolean>>;
}> = ({ projectId, onSuccess, setUploading }) => {
  const [file, setFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchProjectData = async () => {
      try {
        const response = await fetch(`/api/project/get-projects/${projectId}`);
        if (response.ok) {
          const data = await response.json();
          setName(data.project.project_name);
          setDescription(data.project.project_description);
          setFilePreview(data.project.project_logo || null);
        } else {
          throw new Error("Failed to fetch project data");
        }
      } catch (error) {
        console.error("Error fetching project data:", error);
        message.error("Failed to fetch project data");
      } finally {
        setLoading(false);
      }
    };

    fetchProjectData();
  }, [projectId]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile?.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          setFilePreview(e.target.result as string);
        }
      };
      reader.readAsDataURL(selectedFile);
      setFile(selectedFile);
    }
  };

  const handleRemoveImage = () => {
    setFile(null);
    setFilePreview(null);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("description", description);
      if (file) {
        formData.append("project_logo", file);
      }
      formData.append("current_logo_url", filePreview ?? ""); // Ensure current_logo_url is sent even if null

      const response = await fetch(`/api/project/update/${projectId}`, {
        method: "PUT",
        body: formData,
      });

      if (response.ok) {
        onSuccess();
        setFile(null);
        setFilePreview(null);
        setName("");
        setDescription("");
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update project");
      }
    } catch (error: any) {
      console.error("Error updating project:", error);
      message.error(error.message || "Failed to update project");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Spin spinning={loading}>
      <div className="flex flex-col items-center justify-center p-4 rounded-lg">
        <form onSubmit={handleSubmit} className="w-full max-w-md">
          <div className="flex flex-col items-center mb-4">
            {filePreview ? (
              <div className="relative">
                <img
                  src={filePreview}
                  alt="Preview of uploaded file"
                  className="rounded-full object-cover w-24 h-24"
                />
                <button
                  type="button"
                  className="absolute top-0 right-0 text-blue-500"
                  onClick={() => document.getElementById("file-input")?.click()}
                >
                  <EditOutlined />
                </button>
                <button
                  type="button"
                  className="absolute top-0 right-8 text-red-500"
                  onClick={handleRemoveImage}
                >
                  <DeleteOutlined />
                </button>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  id="file-input"
                  onChange={handleFileChange}
                />
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center w-24 h-24 border-2 border-dashed rounded-full cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-all duration-200">
                <PlusOutlined className="text-2xl" />
                <span>Upload</span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileChange}
                  disabled={!!file}
                />
              </label>
            )}
          </div>
          <div className="mb-4">
            <label htmlFor="name" className="block mb-2">
              Name
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter project name"
              className="w-full px-3 py-2 border rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="description" className="block mb-2">
              Description
            </label>
            <input
              type="text"
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter project description"
              className="w-full px-3 py-2 border rounded"
            />
          </div>
          <button
            type="submit"
            className="w-full px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600"
          >
            Update
          </button>
        </form>
      </div>
    </Spin>
  );
};

export default ProjectEditor;
