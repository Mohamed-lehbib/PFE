import { Avatar, Card, Skeleton } from "antd";
import Meta from "antd/es/card/Meta";
import React from "react";

export default function ProjectCardSkeleton() {
  return (
    <Card style={{ width: "100%", marginTop: 16 }}>
      <Skeleton loading={true} avatar active>
        <Meta
          avatar={<Avatar src="/assets/images/fallback-image.jpeg" />}
          title="Loading..."
          description="Please wait..."
        />
      </Skeleton>
    </Card>
  );
}
