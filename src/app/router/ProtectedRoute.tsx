import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuthStore } from "../../shared/store/useAuthStore";
import { HmuLoader } from "../../shared/components";

interface ProtectedRouteProps {
  children?: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const location = useLocation();
  const { token, user, isInitializing } = useAuthStore();

  // If the app is still fetching the user profile (on refresh), show a loader
  if (isInitializing && token && !user) {
    return (
      <HmuLoader
        variant="fullscreen"
        message="Authenticating..."
        subMessage="Validating your session"
      />
    );
  }

  // No token? No access.
  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Token but no user? This should only happen if AuthInitializer hasn't finished
  // or the profile query is still pending.
  if (!user) {
    return <HmuLoader variant="fullscreen" message="Preparing Workspace..." />;
  }

  // Authorized.
  return children ? <>{children}</> : <Outlet />;
};

export default ProtectedRoute;
