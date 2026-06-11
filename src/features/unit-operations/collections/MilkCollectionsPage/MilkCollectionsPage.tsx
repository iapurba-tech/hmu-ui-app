import React, { useState, useMemo, useCallback } from "react";
import { Box, Typography, Collapse } from "@mui/material";
import { HmuConfirmModal, HmuButton } from "../../../../shared/components";
import { palette } from "../../../../shared/theme";
import { AddIcon } from "../../../../shared/icons";
import {
  pageContainerStyles,
  pageHeaderStyles,
  pageTitleStyles,
  tableContainerStyles,
} from "./MilkCollectionsPage.styles";
import {
  useGetMilkCollections,
  useCreateMilkCollection,
  useCreateMilkCollectionsBulk,
  useUpdateMilkCollection,
  useDeleteMilkCollection,
} from "../../../../shared/api/unit/collections/milk-collections.hooks";
import { useGetMpcsList } from "../../../../shared/api/unit/mpcs/mpcs.hooks";
import type {
  MilkCollection,
  MilkCollectionCreateRequest,
} from "../types/milk-collection.types";
import { MilkCollectionForm, MilkCollectionTable } from "../components";

const MilkCollectionsPage: React.FC = () => {
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [orderBy, setOrderBy] = useState("collectionDate");
  const [order, setOrder] = useState<"asc" | "desc">("desc");

  const sortParam = useMemo(() => `${orderBy},${order}`, [orderBy, order]);

  const { data: paginatedData, isLoading: isCollectionsLoading } =
    useGetMilkCollections(page, size, sortParam);

  const collections = paginatedData?.content || [];

  const { data: mpcsList = [], isLoading: isMpcsLoading } = useGetMpcsList();

  const createMutation = useCreateMilkCollection();
  const bulkCreateMutation = useCreateMilkCollectionsBulk();
  const updateMutation = useUpdateMilkCollection();
  const deleteMutation = useDeleteMilkCollection();

  const handleSort = useCallback(
    (columnId: string) => {
      const isAsc = orderBy === columnId && order === "asc";
      setOrder(isAsc ? "desc" : "asc");
      setOrderBy(columnId);
      setPage(0);
    },
    [orderBy, order],
  );

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedCollection, setSelectedCollection] =
    useState<MilkCollection | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const handleEdit = useCallback((collection: MilkCollection) => {
    setSelectedCollection(collection);
    setIsFormOpen(true);
  }, []);

  const mpcsOptions = useMemo(
    () => mpcsList.map((m) => ({ label: m.name, value: m.id })),
    [mpcsList],
  );

  const mpcsMap = useMemo(() => {
    const map: Record<string, string> = {};
    mpcsList.forEach((m) => {
      map[m.id] = m.name;
    });
    return map;
  }, [mpcsList]);

  const handleSubmit = useCallback(
    (
      data: MilkCollectionCreateRequest | MilkCollectionCreateRequest[],
      onSuccess?: () => void,
    ) => {
      const mutationOptions = {
        onSuccess: () => {
          onSuccess?.();
          setIsFormOpen(false);
        },
      };

      if (Array.isArray(data)) {
        bulkCreateMutation.mutate(data, mutationOptions);
      } else {
        createMutation.mutate(data, mutationOptions);
      }
    },
    [bulkCreateMutation, createMutation],
  );

  const handleUpdate = useCallback(
    (id: string, data: MilkCollectionCreateRequest, onSuccess?: () => void) => {
      updateMutation.mutate(
        { id, data },
        {
          onSuccess: () => {
            onSuccess?.();
            setSelectedCollection(null);
            setIsFormOpen(false);
          },
        },
      );
    },
    [updateMutation],
  );

  const handleDelete = useCallback(() => {
    if (deleteId) {
      deleteMutation.mutate(deleteId, {
        onSuccess: () => setDeleteId(null),
      });
    }
  }, [deleteId, deleteMutation]);

  return (
    <Box sx={pageContainerStyles}>
      <Box sx={pageHeaderStyles}>
        <Box>
          <Typography variant="h5" sx={pageTitleStyles}>
            Milk Collections
          </Typography>
          <Typography
            variant="body2"
            sx={{ color: palette.text.secondary, mt: 0.5 }}
          >
            Manage and record milk collections from different MPCS.
          </Typography>
        </Box>
        {!isFormOpen && (
          <HmuButton
            label="Add Collection"
            startIcon={<AddIcon />}
            onClick={() => setIsFormOpen(true)}
          />
        )}
      </Box>

      <Collapse in={isFormOpen} mountOnEnter unmountOnExit>
        <MilkCollectionForm
          onSubmit={handleSubmit}
          onUpdate={handleUpdate}
          initialData={selectedCollection}
          mpcsOptions={mpcsOptions}
          isSubmitting={
            createMutation.isPending ||
            bulkCreateMutation.isPending ||
            updateMutation.isPending
          }
          onCancel={() => {
            setSelectedCollection(null);
            setIsFormOpen(false);
          }}
        />
      </Collapse>

      <Box sx={tableContainerStyles}>
        <MilkCollectionTable
          collections={collections}
          isLoading={isCollectionsLoading || isMpcsLoading}
          onEdit={handleEdit}
          onDelete={setDeleteId}
          mpcsMap={mpcsMap}
          pagination={{
            page,
            size,
            totalElements: paginatedData?.totalElements || 0,
            onPageChange: setPage,
            onSizeChange: setSize,
          }}
          sorting={{
            orderBy,
            order,
            onSort: handleSort,
          }}
        />
      </Box>

      <HmuConfirmModal
        open={!!deleteId}
        onCancel={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete Milk Collection"
        message="Are you sure you want to delete this milk collection record? This action cannot be undone."
        loading={deleteMutation.isPending}
      />
    </Box>
  );
};

export default MilkCollectionsPage;
