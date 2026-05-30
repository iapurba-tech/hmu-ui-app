import React, { useState, useMemo, useCallback } from "react";
import { Box, Typography, IconButton, Tooltip, TextField } from "@mui/material";
import { useNavigate } from "react-router-dom";

import {
  HmuDataTable,
  type Column,
  HmuButton,
  HmuConfirmModal,
} from "../../../../../shared/components";
import type { HeadLoadCategory } from "../../types/head-load-category.types";
import {
  codeStyles,
  descriptionStyles,
  activeBadgeStyles,
  actionButtonStyles,
  deleteButtonStyles,
} from "./HLCategoryTable.styles";
import {
  useDeleteHeadLoadCategory,
  useUpdateHeadLoadCategory,
  useCreateHeadLoadCategory,
} from "../../../../../shared/api/pricing/head-load/head-load-category.hooks";
import { useNotificationStore } from "../../../../../shared/store/useNotificationStore";
import {
  EditIcon,
  DeleteIcon,
  SaveIcon,
  CancelIcon,
  PricingIcon,
  AddIcon,
} from "../../../../../shared/icons";
import { HmuSwitch } from "../../../../../shared/components";

import {
  tableCardStyles,
  sectionHeaderStyles,
} from "../../pages/HLSummary/HLSummary.styles";

interface HLCategoryTableProps {
  categories: HeadLoadCategory[];
  isLoading: boolean;
}

const HLCategoryTable: React.FC<HLCategoryTableProps> = ({
  categories: initialCategories,
  isLoading,
}) => {
  const navigate = useNavigate();
  const { mutate: deleteCategory, isPending: isDeleting } =
    useDeleteHeadLoadCategory();
  const { mutate: updateCategory, isPending: isUpdating } =
    useUpdateHeadLoadCategory();
  const { mutate: createCategory, isPending: isCreating } =
    useCreateHeadLoadCategory();
  const { showNotification } = useNotificationStore();

  const [editingId, setEditingId] = useState<number | "new" | null>(null);
  const [editValues, setEditValues] = useState<Partial<HeadLoadCategory>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [deleteState, setDeleteState] = useState<{
    isOpen: boolean;
    category: HeadLoadCategory | null;
  }>({
    isOpen: false,
    category: null,
  });

  const handleOpenDelete = useCallback((category: HeadLoadCategory) => {
    setDeleteState({ isOpen: true, category });
  }, []);

  const handleCloseDelete = useCallback(() => {
    setDeleteState({ isOpen: false, category: null });
  }, []);

  const handleDelete = useCallback(
    (id: number) => {
      deleteCategory(id, {
        onSuccess: () => {
          showNotification("Category deleted successfully", "success");
          handleCloseDelete();
        },
        onError: (error: any) => {
          showNotification(
            error?.response?.data?.message || "Failed to delete category",
            "error",
          );
        },
      });
    },
    [deleteCategory, showNotification, handleCloseDelete],
  );

  const handleStartEdit = useCallback((category: HeadLoadCategory) => {
    setEditingId(category.id);
    setEditValues(category);
    setErrors({});
  }, []);

  const handleCancelEdit = useCallback(() => {
    setEditingId(null);
    setEditValues({});
    setErrors({});
  }, []);

  const validate = useCallback(() => {
    const newErrors: Record<string, string> = {};

    // Code validation: HL-<4 alphanumeric> all uppercase
    if (editingId === "new") {
      const codeRegex = /^HL-[A-Z0-9]{4}$/;
      if (!editValues.code) {
        newErrors.code = "Required";
      } else if (!codeRegex.test(editValues.code)) {
        newErrors.code = "Format: HL-XXXX";
      }
    }

    // Description validation: alphanumeric with space and -
    const descRegex = /^[a-zA-Z0-9\s-]+$/;
    if (!editValues.description) {
      newErrors.description = "Required";
    } else if (!descRegex.test(editValues.description)) {
      newErrors.description = "Alphanumeric, space, - only";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [editValues, editingId]);

  const handleSaveEdit = useCallback(() => {
    if (!validate()) return;

    if (editingId === "new") {
      createCategory(editValues as any, {
        onSuccess: () => {
          showNotification("Category created successfully", "success");
          setEditingId(null);
          setEditValues({});
          setErrors({});
        },
        onError: (error: any) => {
          showNotification(
            error?.response?.data?.message || "Failed to create category",
            "error",
          );
        },
      });
    } else if (editingId !== null) {
      updateCategory(editValues as any, {
        onSuccess: () => {
          showNotification("Category updated successfully", "success");
          setEditingId(null);
          setEditValues({});
          setErrors({});
        },
        onError: (error: any) => {
          showNotification(
            error?.response?.data?.message || "Failed to update category",
            "error",
          );
        },
      });
    }
  }, [
    editingId,
    editValues,
    createCategory,
    updateCategory,
    showNotification,
    validate,
  ]);

  const handleStartCreate = useCallback(() => {
    setEditingId("new");
    setEditValues({ code: "HL-", description: "", active: true });
    setErrors({});
  }, []);

  const categoriesWithNew = useMemo(() => {
    if (editingId === "new") {
      return [
        { id: 0, ...editValues } as HeadLoadCategory,
        ...initialCategories,
      ];
    }
    return initialCategories;
  }, [initialCategories, editingId, editValues]);

  const columns: Column<HeadLoadCategory>[] = useMemo(
    () => [
      {
        id: "code",
        label: "Code",
        sortable: true,
        // width: "80px",
        render: (row) => {
          const isNew = row.id === 0;
          const isEditing = editingId === (isNew ? "new" : row.id);

          if (isEditing && isNew) {
            return (
              <TextField
                size="small"
                value={editValues.code || ""}
                onChange={(e) => {
                  const val = e.target.value.toUpperCase();
                  if (val.length <= 7) {
                    setEditValues({ ...editValues, code: val });
                    if (errors.code) setErrors({ ...errors, code: "" });
                  }
                }}
                error={!!errors.code}
                helperText={errors.code}
                variant="outlined"
                placeholder="HL-XXXX"
                fullWidth
                autoFocus
                slotProps={{
                  formHelperText: {
                    sx: {
                      fontSize: "0.65rem",
                      mt: 0,
                      position: "absolute",
                      bottom: -16,
                    },
                  },
                  input: {
                    sx: {
                      fontSize: "0.75rem",
                      fontFamily: "'JetBrains Mono', monospace",
                      fontWeight: 700,
                      height: "32px",
                    },
                  },
                }}
              />
            );
          }
          return <Box sx={codeStyles}>{row.code}</Box>;
        },
      },
      {
        id: "description",
        label: "Description",
        sortable: true,
        render: (row) => {
          const isEditing = editingId === (row.id === 0 ? "new" : row.id);
          if (isEditing) {
            return (
              <TextField
                size="small"
                value={editValues.description || ""}
                onChange={(e) => {
                  setEditValues({ ...editValues, description: e.target.value });
                  if (errors.description)
                    setErrors({ ...errors, description: "" });
                }}
                error={!!errors.description}
                helperText={errors.description}
                variant="outlined"
                placeholder="Description"
                fullWidth
                slotProps={{
                  formHelperText: {
                    sx: {
                      fontSize: "0.65rem",
                      mt: 0,
                      position: "absolute",
                      bottom: -16,
                    },
                  },
                  input: {
                    sx: { fontSize: "0.875rem", height: "32px" },
                  },
                }}
              />
            );
          }
          return (
            <Typography sx={descriptionStyles}>{row.description}</Typography>
          );
        },
      },
      {
        id: "active",
        label: "Status",
        sortable: true,
        width: "100px",
        render: (row) => {
          const isEditing = editingId === (row.id === 0 ? "new" : row.id);
          if (isEditing) {
            return (
              <Box
                sx={{ display: "flex", alignItems: "center", height: "32px" }}
              >
                <HmuSwitch
                  checked={!!editValues.active}
                  onChange={(_, checked) =>
                    setEditValues({ ...editValues, active: checked })
                  }
                />
              </Box>
            );
          }
          return (
            <Box sx={activeBadgeStyles(row.active)}>
              {row.active ? "Active" : "Inactive"}
            </Box>
          );
        },
      },
      {
        id: "actions",
        label: "Actions",
        align: "right",
        width: "90px",
        render: (row) => {
          const isEditing = editingId === (row.id === 0 ? "new" : row.id);
          const isProcessing = isUpdating || isCreating;

          if (isEditing) {
            return (
              <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                <Tooltip title="Save">
                  <IconButton
                    size="small"
                    sx={{
                      ...actionButtonStyles,
                      color: "success.main",
                      p: 0.5,
                    }}
                    onClick={handleSaveEdit}
                    disabled={isProcessing}
                  >
                    <SaveIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Cancel">
                  <IconButton
                    size="small"
                    sx={{ ...actionButtonStyles, color: "error.main", p: 0.5 }}
                    onClick={handleCancelEdit}
                    disabled={isProcessing}
                  >
                    <CancelIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Box>
            );
          }

          return (
            <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
              <Tooltip title="See Pricing Details">
                <IconButton
                  size="small"
                  sx={{ ...actionButtonStyles, color: "primary.main", p: 0.5 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`${row.id}/pricing`);
                  }}
                >
                  <PricingIcon fontSize="small" />
                </IconButton>
              </Tooltip>
              <Tooltip title="Edit Category">
                <IconButton
                  size="small"
                  sx={{ ...actionButtonStyles, p: 0.5 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleStartEdit(row);
                  }}
                >
                  <EditIcon fontSize="small" />
                </IconButton>
              </Tooltip>
              <Tooltip title="Delete Category">
                <IconButton
                  size="small"
                  sx={{ ...deleteButtonStyles, p: 0.5 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleOpenDelete(row);
                  }}
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </Box>
          );
        },
      },
    ],
    [
      editingId,
      editValues,
      errors,
      isUpdating,
      isCreating,
      handleSaveEdit,
      handleCancelEdit,
      handleStartEdit,
      handleOpenDelete,
      navigate,
    ],
  );

  return (
    <Box sx={tableCardStyles}>
      <Box sx={sectionHeaderStyles}>
        <Typography
          variant="subtitle2"
          sx={{
            fontWeight: 800,
            textTransform: "uppercase",
            letterSpacing: "0.05em",
          }}
        >
          Head Load Categories
        </Typography>
        <HmuButton
          label="Add Category"
          startIcon={<AddIcon />}
          onClick={handleStartCreate}
          disabled={editingId !== null}
          sx={{ borderRadius: "8px", py: 0.5 }}
        />
      </Box>
      <HmuDataTable
        columns={columns}
        data={categoriesWithNew}
        loading={isLoading}
        keyExtractor={(row) => row.id.toString()}
        emptyMessage="No categories available"
        sorting={{
          orderBy: "description",
          order: "asc",
        }}
        search={{
          enabled: true,
          placeholder: "Search...",
          fields: ["description", "code"],
        }}
        filters={[
          {
            id: "status",
            label: "Status",
            options: [
              { label: "All Status", value: "all" },
              { label: "Active", value: true },
              { label: "Inactive", value: false },
            ],
            field: "active",
          },
        ]}
        containerSx={{
          border: "none",
        }}
        isPinned={(row) => (row.id === 0 ? "top" : null)}
        omitTopRadius={true}
      />

      <HmuConfirmModal
        open={deleteState.isOpen}
        onCancel={handleCloseDelete}
        onConfirm={() =>
          deleteState.category && handleDelete(deleteState.category.id)
        }
        title="Delete Head Load Category"
        message={
          <>
            Are you sure you want to delete the head load category{" "}
            <strong>{deleteState.category?.description}</strong>? This action
            cannot be undone.
          </>
        }
        confirmLabel="Delete Category"
        confirmVariant="danger"
        loading={isDeleting}
      />
    </Box>
  );
};

export default HLCategoryTable;
