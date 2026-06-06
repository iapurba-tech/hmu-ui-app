import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { mpcsApi } from "./mpcs.api";
import { useNotificationStore } from "../../../store/useNotificationStore";
import { useAuthStore } from "../../../store/useAuthStore";
import type {
  MpcsCreateRequest,
  MpcsDetailsRequest,
  MpcsConfigurationRequest,
} from "../../../../features/unit-operations/mpcs/types/mpcs.types";

const MPCS_KEYS = {
  all: ["mpcs"] as const,
  lists: (unitId?: string) => [...MPCS_KEYS.all, "list", { unitId }] as const,
  details: (id: string) => [...MPCS_KEYS.all, "detail", id] as const,
};

export const useGetMpcsList = () => {
  const { activeUnit } = useAuthStore();

  return useQuery({
    queryKey: MPCS_KEYS.lists(activeUnit?.id),
    queryFn: mpcsApi.list,
    enabled: !!activeUnit?.id,
  });
};

export const useGetMpcsDetail = (id: string) => {
  return useQuery({
    queryKey: MPCS_KEYS.details(id),
    queryFn: () => mpcsApi.get(id),
    enabled: !!id,
  });
};

export const useCreateMpcs = () => {
  const queryClient = useQueryClient();
  const { showNotification } = useNotificationStore();
  const { activeUnit } = useAuthStore();

  return useMutation({
    mutationFn: (data: MpcsCreateRequest) => mpcsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: MPCS_KEYS.lists(activeUnit?.id),
      });
      showNotification("MPCS created successfully", "success");
    },
    onError: () => {
      showNotification("Failed to create MPCS", "error");
    },
  });
};

export const useUpdateMpcsDetails = () => {
  const queryClient = useQueryClient();
  const { showNotification } = useNotificationStore();
  const { activeUnit } = useAuthStore();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: MpcsDetailsRequest }) =>
      mpcsApi.updateDetails(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({
        queryKey: MPCS_KEYS.lists(activeUnit?.id),
      });
      queryClient.invalidateQueries({ queryKey: MPCS_KEYS.details(id) });
      showNotification("MPCS details updated successfully", "success");
    },
    onError: () => {
      showNotification("Failed to update MPCS details", "error");
    },
  });
};

export const useUpdateMpcsConfiguration = () => {
  const queryClient = useQueryClient();
  const { showNotification } = useNotificationStore();
  const { activeUnit } = useAuthStore();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: MpcsConfigurationRequest;
    }) => mpcsApi.updateConfiguration(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({
        queryKey: MPCS_KEYS.lists(activeUnit?.id),
      });
      queryClient.invalidateQueries({ queryKey: MPCS_KEYS.details(id) });
      showNotification("MPCS configuration updated successfully", "success");
    },
    onError: () => {
      showNotification("Failed to update MPCS configuration", "error");
    },
  });
};

export const useDeleteMpcs = () => {
  const queryClient = useQueryClient();
  const { showNotification } = useNotificationStore();
  const { activeUnit } = useAuthStore();

  return useMutation({
    mutationFn: (id: string) => mpcsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: MPCS_KEYS.lists(activeUnit?.id),
      });
      showNotification("MPCS deleted successfully", "success");
    },
    onError: () => {
      showNotification("Failed to delete MPCS", "error");
    },
  });
};
