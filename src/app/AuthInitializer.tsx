import React, { useEffect } from "react";
import { useAuthStore } from "../shared/store/useAuthStore";
import { useProfileQuery } from "../shared/api/auth/auth.hooks";
import { HmuLoader } from "../shared/components";

interface AuthInitializerProps {
  children: React.ReactNode;
}

const AuthInitializer: React.FC<AuthInitializerProps> = ({ children }) => {
  const { token, user, setUser, setInitializing, isInitializing, logout } =
    useAuthStore();
  const { data: profile, isLoading, isError, error } = useProfileQuery();

  useEffect(() => {
    // If token is present and the profile is fetched, update the store
    if (profile && !user) {
      setUser(profile);
      setInitializing(false);
    }
  }, [profile, user, setUser, setInitializing]);

  useEffect(() => {
    // If there is no token, we are done initializing
    if (!token) {
      setInitializing(false);
    }
  }, [token, setInitializing]);

  useEffect(() => {
    // If the profile fetch fails, logout the user as the token is likely invalid
    if (isError) {
      console.error("Auth initialization failed:", error);
      logout();
      setInitializing(false);
    }
  }, [isError, error, logout, setInitializing]);

  // While initializing, show a full-screen loader
  if (isInitializing && token && isLoading) {
    return (
      <HmuLoader
        variant="fullscreen"
        message="Initializing Application..."
        subMessage="Fetching your profile and permissions"
      />
    );
  }

  return <>{children}</>;
};

export default AuthInitializer;
