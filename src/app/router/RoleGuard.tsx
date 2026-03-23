
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../../shared/store/useAuthStore';

interface RoleGuardProps {
  allowedRoles: string[];
  children: React.ReactNode;
}

export const RoleGuard: React.FC<RoleGuardProps> = ({ allowedRoles, children }) => {
  const { user } = useAuthStore(); 

  if (!user || !user.role) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/forbidden" replace />;
  }

  // If they pass the check, render the page!
  return <>{children}</>;
};
