import React from "react";
import { useNavigate } from "react-router-dom";
import { LockRounded as Lock } from "@mui/icons-material";
import { ErrorContent } from "../../components";

const ForbiddenPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <ErrorContent
      icon={<Lock />}
      title="403 Access Denied"
      message="Sorry, you do not have the required permissions to access this page or perform this action. Your user role may not grant you access to this resource."
      onButtonClick={() => navigate("/dashboard")}
      colorType="error"
    />
  );
};

export default ForbiddenPage;
