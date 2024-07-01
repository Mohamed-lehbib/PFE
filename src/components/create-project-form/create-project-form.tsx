import React, { useState } from "react";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import { message } from "antd";

const ProjectUploader: React.FC<{
  onSuccess: () => void;
  setUploading: React.Dispatch<React.SetStateAction<boolean>>;
}> = ({ onSuccess, setUploading }) => {
  const [file, setFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");

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
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("description", description);
      if (file) {
        formData.append("project_logo", file);
      }
      const response = await fetch("/api/project/create", {
        method: "POST",
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
        throw new Error(errorData.message || "Failed to create project");
      }
    } catch (error: any) {
      console.error("Error creating project:", error);
      message.error(error.message || "Failed to create project");
    } finally {
      setUploading(false);
    }
  };

  return (
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
                className="absolute top-0 right-0 text-red-500"
                onClick={handleRemoveImage}
              >
                <DeleteOutlined />
              </button>
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
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter project description"
            className="w-full px-3 py-2 border rounded h-24"
          />
        </div>
        <button
          type="submit"
          className="w-full px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default ProjectUploader;
