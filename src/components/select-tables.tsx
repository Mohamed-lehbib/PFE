import { Button, Checkbox } from "antd";
import React from "react";

export default function SelectTables() {
  const handleSubmit = () => {
    console.log("clicked submit");
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-lg">
      <h1 className="text-2xl font-semibold text-center mb-8">
        Additional Configuration
      </h1>
      <Checkbox.Group style={{ width: "100%" }}>
        <div className="mb-4">
          <Checkbox value="option1">Option 1</Checkbox>
        </div>
        <div className="mb-4">
          <Checkbox value="option2">Option 2</Checkbox>
        </div>
        <div className="mb-4">
          <Checkbox value="option3">Option 3</Checkbox>
        </div>
      </Checkbox.Group>
      <Button
        type="primary"
        onClick={handleSubmit}
        size="large"
        className="w-full mt-6"
      >
        Submit
      </Button>
    </div>
  );
}
