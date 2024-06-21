"use client";
import React, { useState } from "react";
import { Steps } from "antd";
import SupabaseCredentialsPage from "@/components/supabase-credentials-page";
import TsFileUploader from "@/components/ts-file-uploader";
import SelectTables from "@/components/select-tables";
import { useRouter, useSearchParams } from "next/navigation";

const ConfigureProject = () => {
  const router = useRouter();
  const [current, setCurrent] = useState(0);

  // Parse the current step from the query parameters
  const params = useSearchParams();
  const currentStep = parseInt(params.get("step") || "0", 10);

  // Set the current step based on the query parameters
  if (!isNaN(currentStep) && currentStep !== current) {
    setCurrent(currentStep);
  }

  const steps = [
    {
      title: "Supabase Configuration",
      content: <SupabaseCredentialsPage onNext={() => next()} />,
    },
    {
      title: "Upload TypeScript File",
      content: (
        <TsFileUploader onNext={() => next()} onPrevious={() => prev()} />
      ),
    },
    {
      title: "Additional Configuration",
      content: <SelectTables onNext={() => next()} onPrevious={() => prev()} />,
    },
  ];

  const next = () => {
    router.push(`?step=${current + 1}`);
  };

  const prev = () => {
    // Update the query parameter to the previous step
    router.push(`?step=${current - 1}`);
  };

  const handleSubmit = () => {
    // Handle form submission for the last step
    // For example, you can submit the entire form here
    console.log("Form submitted");
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Steps size="small" current={current}>
        {steps.map((item) => (
          <Steps.Step key={item.title} title={item.title} />
        ))}
      </Steps>
      <div className="flex justify-center items-center">
        {steps[current].content}
      </div>
      {/* <div className="flex justify-end mb-4">
        {current > 0 && (
          <Button onClick={prev} className="mr-2">
            Previous
          </Button>
        )}
        {current < steps.length - 1 ? (
          current !== 0 && (
            <Button type="primary" onClick={next}>
              Next
            </Button>
          )
        ) : (
          <Button type="primary" onClick={handleSubmit}>
            Finish
          </Button>
        )}
      </div> */}
    </div>
  );
};

export default ConfigureProject;
