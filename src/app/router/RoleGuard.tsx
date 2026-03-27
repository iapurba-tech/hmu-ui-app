import React from "react";
import { Navigate } from "react-router-dom";
import { useAuthStore } from "../../shared/store/useAuthStore";

interface RoleGuardProps {
  allowedRoles: string[];
  children: React.ReactNode;
}

export const RoleGuard: React.FC<RoleGuardProps> = ({
  allowedRoles,
  children,
}) => {
  const { user } = useAuthStore();

  // Defensive fallback just in case the state hasn't painted yet
  // This should ideally never happen since ProtectedRoute should handle auth first
  if (!user || !user.role) return null;

  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/forbidden" replace />;
  }

  return <>{children}</>;
};
