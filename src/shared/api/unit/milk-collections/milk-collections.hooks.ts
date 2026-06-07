import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { milkCollectionsApi } from "./milk-collections.api";
import { useNotificationStore } from "../../../store/useNotificationStore";
import { useAuthStore } from "../../../store/useAuthStore";
import type {
  MilkCollectionCreateRequest,
  MilkCollectionUpdateRequest,
} from "../../../../features/unit-operations/milk-collections/types/milk-collection.types";

const MILK_COLLECTION_KEYS = {
  all: ["milk-collections"] as const,
  lists: (unitId?: string) =>
    [...MILK_COLLECTION_KEYS.all, "list", { unitId }] as const,
};

export const useGetMilkCollections = (page = 0, size = 10, sort?: string) => {
  const { activeUnit } = useAuthStore();

  return useQuery({
    queryKey: [
      ...MILK_COLLECTION_KEYS.lists(activeUnit?.id),
      { page, size, sort },
    ],
    queryFn: () => milkCollectionsApi.list(page, size, sort),
    enabled: !!activeUnit?.id,
  });
};

export const useCreateMilkCollection = () => {
  const queryClient = useQueryClient();
  const { showNotification } = useNotificationStore();
  const { activeUnit } = useAuthStore();

  return useMutation({
    mutationFn: (data: MilkCollectionCreateRequest) =>
      milkCollectionsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: MILK_COLLECTION_KEYS.lists(activeUnit?.id),
      });
      showNotification("Milk collection recorded successfully", "success");
    },
    onError: () => {
      showNotification("Failed to record milk collection", "error");
    },
  });
};

export const useCreateMilkCollectionsBulk = () => {
  const queryClient = useQueryClient();
  const { showNotification } = useNotificationStore();
  const { activeUnit } = useAuthStore();

  return useMutation({
    mutationFn: (data: MilkCollectionCreateRequest[]) =>
      milkCollectionsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: MILK_COLLECTION_KEYS.lists(activeUnit?.id),
      });
      showNotification("All milk collections recorded successfully", "success");
    },
    onError: () => {
      showNotification("Failed to record milk collections", "error");
    },
  });
};

export const useUpdateMilkCollection = () => {
  const queryClient = useQueryClient();
  const { showNotification } = useNotificationStore();
  const { activeUnit } = useAuthStore();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: MilkCollectionUpdateRequest;
    }) => milkCollectionsApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: MILK_COLLECTION_KEYS.lists(activeUnit?.id),
      });
      showNotification("Milk collection updated successfully", "success");
    },
    onError: () => {
      showNotification("Failed to update milk collection", "error");
    },
  });
};

export const useDeleteMilkCollection = () => {
  const queryClient = useQueryClient();
  const { showNotification } = useNotificationStore();
  const { activeUnit } = useAuthStore();

  return useMutation({
    mutationFn: (id: string) => milkCollectionsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: MILK_COLLECTION_KEYS.lists(activeUnit?.id),
      });
      showNotification("Milk collection deleted successfully", "success");
    },
    onError: () => {
      showNotification("Failed to delete milk collection", "error");
    },
  });
};
