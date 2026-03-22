
import React from 'react';
import { Navigate } from 'react-router-dom';
// import { useAuthStore } from '../store/useAuthStore'; // Zustand store

interface RoleGuardProps {
  allowedRoles: string[];
  children: React.ReactNode;
}

export const RoleGuard: React.FC<RoleGuardProps> = ({ allowedRoles, children }) => {
  // Replace this with your actual Zustand auth hook
  // const { user } = useAuthStore(); 
  const user = { role: 'ROLE_UNIT_MANAGER' }; // Mock user for now

  if (!user || !user.role) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/forbidden" replace />;
  }

  // If they pass the check, render the page!
  return <>{children}</>;
};