import { Steps } from "antd";
import React from "react";

export default function ConfigureProject() {
  return (
    <div>
      <div className="flex">
        <button>{/* <CloseOutlined /> */}</button>
      </div>
      <Steps
        size="small"
        current={1}
        items={[
          {
            title: "Finished",
          },
          {
            title: "In Progress",
          },
          {
            title: "Waiting",
          },
        ]}
      />
    </div>
  );
}
