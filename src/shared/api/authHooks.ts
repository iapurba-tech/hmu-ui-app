import { useMutation, useQuery } from "@tanstack/react-query";
import { useAuthStore } from "../store/useAuthStore";
import type { LoginCredentials } from "../../features/auth/types/auth.types";
import { authService } from "./authService";

// Query Keys (For caching)
export const authKeys = {
  me: ["auth", "me"] as const,
};

export const useLoginMutation = () => {
  //   const setToken = useAuthStore((state) => state.setToken);
  const setUser = useAuthStore((state) => state.setUser);
  const logout = useAuthStore((state) => state.logout);

  return useMutation({
    mutationFn: async (credentials: LoginCredentials) => {
      const { token } = await authService.login(credentials);

      useAuthStore.getState().setToken(token);

      const userProfile = await authService.getMe();
      return userProfile;
    },
    onSuccess: (userProfile) => {
      setUser(userProfile);
    },
    onError: (error) => {
      console.error("Login Failed:", error);
      logout();
    },
  });
};

export const useProfileQuery = () => {
  const token = useAuthStore((state) => state.token);
  return useQuery({
    queryKey: authKeys.me,
    queryFn: authService.getMe,
    enabled: !!token,
    staleTime: 1000 * 60 * 30,
    retry: false,
  });
};
