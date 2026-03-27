import type {
  LoginCredentials,
  LoginResponse,
  UserProfile,
} from "../../../features/auth/types/auth.types";
import { apiClient } from "../apiClient";
import { API_ENDPOINTS } from "../endpoints";

export const authService = {
  login: async (credentials: LoginCredentials): Promise<LoginResponse> => {
    const response = await apiClient.post<LoginResponse>(
      API_ENDPOINTS.AUTH.LOGIN,
      credentials,
    );
    return response.data;
  },

  getMe: async (): Promise<UserProfile> => {
    const response = await apiClient.get<UserProfile>(API_ENDPOINTS.AUTH.ME);
    return response.data;
  },
};
