// "use client";
// import React, { useState } from "react";
// import { InboxOutlined } from "@ant-design/icons";
// import { Upload, message } from "antd";
// import {
//   parseSupabaseTablesWithAttributes,
//   TableAttributes,
// } from "@/utils/tableParser/tableParser";

// const { Dragger } = Upload;

// const TsFileUploader = () => {
//   const [tables, setTables] = useState<TableAttributes[]>([]);
//   const [fileContent, setFileContent] = useState<string>("");

//   const handleFiles = (file: File) => {
//     const reader = new FileReader();
//     reader.onload = (e) => {
//       const text = e.target?.result;
//       const tablesWithAttributes = parseSupabaseTablesWithAttributes(
//         text as string
//       );
//       setTables(tablesWithAttributes);
//       setFileContent(text as string);
//     };
//     reader.readAsText(file);
//     return false; // Prevents automatic upload
//   };

//   return (
//     <div className="container mx-auto px-4 py-8 max-w-lg">
//       <h1 className="text-2xl font-semibold text-center mb-8">
//         Upload TypeScript File
//       </h1>

//       <div className="mb-6">
//         <Dragger name="file" multiple={false} beforeUpload={handleFiles}>
//           <p className="ant-upload-drag-icon mb-4">
//             <InboxOutlined />
//           </p>
//           <p className="ant-upload-text text-lg mb-2">
//             Click or drag a TypeScript file to upload
//           </p>
//           <p className="ant-upload-hint">Supports a single-file upload only.</p>
//         </Dragger>
//       </div>
//     </div>
//   );
// };

// export default TsFileUploader;

"use client";
import React, { useState } from "react";
import { InboxOutlined } from "@ant-design/icons";
import { Button, Upload, message } from "antd";
import {
  parseSupabaseTablesWithAttributes,
  TableAttributes,
} from "@/utils/tableParser/tableParser";

const { Dragger } = Upload;

interface Props {
  onNext: () => void;
  onPrevious: () => void;
}

const TsFileUploader = ({ onNext, onPrevious }: Props) => {
  const [tables, setTables] = useState<TableAttributes[]>([]);
  const [fileContent, setFileContent] = useState<string>("");

  const handleFiles = (file: File) => {
    if (file.type !== "application/typescript") {
      message.error("Please upload a valid TypeScript file.");
      return false;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result;
      const tablesWithAttributes = parseSupabaseTablesWithAttributes(
        text as string
      );
      setTables(tablesWithAttributes);
      setFileContent(text as string);
    };
    reader.readAsText(file);
    return false; // Prevents automatic upload
  };

  const handleSubmit = () => {
    if (!fileContent) {
      message.error("Please upload a TypeScript file before proceeding.");
      return;
    }
    onNext();
  };

  return (
    <div className="flex flex-col w-screen">
      <div className="container mx-auto px-4 py-8 max-w-lg">
        <h1 className="text-2xl font-semibold text-center mb-8">
          Upload TypeScript File
        </h1>

        <div className="mb-6">
          <Dragger name="file" multiple={false} beforeUpload={handleFiles}>
            <p className="ant-upload-drag-icon mb-4">
              <InboxOutlined />
            </p>
            <p className="ant-upload-text text-lg mb-2">
              Click or drag a TypeScript file to upload
            </p>
            <p className="ant-upload-hint">
              Supports a single-file upload only.
            </p>
          </Dragger>
        </div>
      </div>
      <div className="flex justify-end mb-4">
        <Button onClick={onPrevious} className="mr-2">
          Previous
        </Button>
        <Button type="primary" onClick={handleSubmit}>
          Next
        </Button>
      </div>
    </div>
  );
};

export default TsFileUploader;
