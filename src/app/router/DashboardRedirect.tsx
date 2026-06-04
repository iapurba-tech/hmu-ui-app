import React from "react";
import { Navigate } from "react-router-dom";
import { useAuthStore } from "../../shared/store/useAuthStore";
import { WorkspaceType } from "../../features/auth/constants/workspace";
import { SystemDashboard } from "../../features/dashboard";

const DashboardRedirect: React.FC = () => {
  const { workspace } = useAuthStore();

  if (workspace === WorkspaceType.SYSTEM_ADMIN) {
    return <SystemDashboard />;
  }

  return <Navigate to="/unit/dashboard" replace />;
};

export default DashboardRedirect;
