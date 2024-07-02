"use client";
import { useParams } from "next/navigation";
import React from "react";
import { Layout } from "antd";
import Sidebar from "@/components/sidebar/sidebar";

const { Content } = Layout;

export default function ProjectPage() {
  const params = useParams<{ id: string }>();
  const projectId = params?.id;

  return (
    <Layout style={{ minHeight: "100vh" }}>
      {projectId && <Sidebar projectId={projectId} />}
      <Layout>
        <Content style={{ padding: "24px", background: "#fff" }}>
          <div>Page content</div>
        </Content>
      </Layout>
    </Layout>
  );
}
