"use client";
import React, { useState } from "react";
import { Steps } from "antd";
import SupabaseCredentialsPage from "@/components/supabase-credentials/supabase-credentials-page";
import TsFileUploader from "@/components/ts-file-uploader/ts-file-uploader";
import SelectTables from "@/components/select-tables/select-tables";
import { useRouter, useSearchParams } from "next/navigation";
import SelectAttributes from "@/components/select-attributes/select-attributes";

const ConfigureProject = () => {
  const router = useRouter();
  const [current, setCurrent] = useState(0);

  // Parse the current step from the query parameters
  const params = useSearchParams();
  const currentStep = parseInt(params.get("step") ?? "0", 10);

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
      title: "Configure tables",
      content: <SelectTables onNext={() => next()} onPrevious={() => prev()} />,
    },
    {
      title: "configure attributes",
      content: <SelectAttributes />,
    },
  ];

  const next = () => {
    router.push(`?step=${current + 1}`);
  };

  const prev = () => {
    // Update the query parameter to the previous step
    router.push(`?step=${current - 1}`);
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
    </div>
  );
};

export default ConfigureProject;
