import {
  useQuery,
  useMutation,
  useQueryClient,
  type UseQueryOptions,
} from "@tanstack/react-query";
import type { User } from "../../../features/admin/users/types/user.types";
import { userApi } from "./user.api";

export const userKeys = {
  all: ["users"] as const,
};

export const useGetUsers = (
  options?: Omit<
    UseQueryOptions<User[], Error, User[], readonly string[]>,
    "queryKey" | "queryFn"
  >,
) => {
  return useQuery({
    queryKey: userKeys.all,
    queryFn: userApi.getAllUsers,
    staleTime: 1000 * 60 * 30,
    ...options,
  });
};

export const useCreateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: userApi.createUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.all });
    },
  });
};

export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: userApi.updateUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.all });
    },
  });
};

export const useToggleUserStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, active }: { id: string; active: boolean }) =>
      active ? userApi.deactivateUser(id) : userApi.activateUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.all });
    },
  });
};

export const useDeleteUserPermanent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: userApi.deleteUserPermanent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.all });
    },
  });
};
