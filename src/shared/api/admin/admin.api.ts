import type { Unit } from "../../../features/admin/units/types/unit.types";
import type {
  User,
  CreateUserRequest,
} from "../../../features/admin/users/types/user.types";
import { apiClient } from "../apiClient";
import { API_ENDPOINTS } from "../endpoints";

export const adminApi = {
  // Unit APIs
  getAllUnits: async (): Promise<Unit[]> => {
    const response = await apiClient.get<Unit[]>(API_ENDPOINTS.ADMIN.UNIT.LIST);
    return response.data;
  },

  createUnit: async (unitData: Partial<Unit>): Promise<Unit> => {
    const response = await apiClient.post<Unit>(
      API_ENDPOINTS.ADMIN.UNIT.CREATE,
      unitData,
    );
    return response.data;
  },

  updateUnit: async ({
    id,
    ...unitData
  }: Partial<Unit> & { id: string }): Promise<Unit> => {
    const response = await apiClient.put<Unit>(
      `${API_ENDPOINTS.ADMIN.UNIT.LIST}/${id}`,
      unitData,
    );
    return response.data;
  },

  activateUnit: async (id: string): Promise<void> => {
    await apiClient.patch(API_ENDPOINTS.ADMIN.UNIT.ACTIVATE(id));
  },

  deactivateUnit: async (id: string): Promise<void> => {
    await apiClient.patch(API_ENDPOINTS.ADMIN.UNIT.DEACTIVATE(id));
  },

  // User APIs
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
    await apiClient.delete(API_ENDPOINTS.ADMIN.USER.DEACTIVATE(id));
  },

  deleteUserPermanent: async (id: string): Promise<void> => {
    await apiClient.delete(API_ENDPOINTS.ADMIN.USER.PERMANENT(id));
  },
};
