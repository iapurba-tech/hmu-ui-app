import type {
  User,
  CreateUserRequest,
} from "../../../../features/admin/users/types/user.types";
import { apiClient } from "../../apiClient";
import { API_ENDPOINTS } from "../../endpoints";

export const userApi = {
  getAllUsers: async (): Promise<User[]> => {
    const response = await apiClient.get<User[]>(API_ENDPOINTS.ADMIN.USER.LIST);
    return response.data;
  },

  createUser: async (userData: CreateUserRequest): Promise<User> => {
    const response = await apiClient.post<User>(
      API_ENDPOINTS.ADMIN.USER.CREATE,
      userData,
    );
    return response.data;
  },

  updateUser: async ({
    id,
    ...userData
  }: Partial<CreateUserRequest> & { id: string }): Promise<User> => {
    const response = await apiClient.patch<User>(
      API_ENDPOINTS.ADMIN.USER.UPDATE(id),
      userData,
    );
    return response.data;
  },

  activateUser: async (id: string): Promise<void> => {
    await apiClient.patch(API_ENDPOINTS.ADMIN.USER.ACTIVATE(id));
  },

  deactivateUser: async (id: string): Promise<void> => {
    await apiClient.patch(API_ENDPOINTS.ADMIN.USER.DEACTIVATE(id));
  },

  deleteUserPermanent: async (id: string): Promise<void> => {
    await apiClient.delete(API_ENDPOINTS.ADMIN.USER.PERMANENT(id));
  },
};
