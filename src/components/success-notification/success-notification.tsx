import React, { useEffect } from "react";
import { notification } from "antd";
import { CheckCircleOutlined } from "@ant-design/icons";

const SuccessNotification = ({
  title,
  message,
}: {
  title: string;
  message: string;
}) => {
  const [api, contextHolder] = notification.useNotification();

  useEffect(() => {
    api.success({
      message: title,
      description: message,
      placement: "topRight",
      icon: <CheckCircleOutlined style={{ color: "#52c41a" }} />,
    });
  }, [api, title, message]);

  return <>{contextHolder}</>;
};

export default SuccessNotification;
