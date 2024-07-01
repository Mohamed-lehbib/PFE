import React, { useEffect } from "react";
import { notification } from "antd";
import { CloseCircleOutlined } from "@ant-design/icons";

const ErrorNotification = ({
  title,
  message,
}: {
  title: string;
  message: string;
}) => {
  const [api, contextHolder] = notification.useNotification();

  useEffect(() => {
    api.error({
      message: title,
      description: message,
      placement: "topRight",
      icon: <CloseCircleOutlined style={{ color: "#f5222d" }} />,
    });
  }, [api, title, message]);

  return <>{contextHolder}</>;
};

export default ErrorNotification;
