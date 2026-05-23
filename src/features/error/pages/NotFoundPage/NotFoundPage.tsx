import React from "react";
import { useNavigate } from "react-router-dom";
import { SearchOffIcon as SearchOff } from "../../../../shared/icons";
import { ErrorContent } from "../../components";

const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <ErrorContent
      icon={<SearchOff />}
      title="404 Page Not Found"
      message="Oops! The page you are looking for does not exist or has been moved. Please check the URL or return to the dashboard."
      onButtonClick={() => navigate("/dashboard")}
      colorType="error"
    />
  );
};

export default NotFoundPage;
