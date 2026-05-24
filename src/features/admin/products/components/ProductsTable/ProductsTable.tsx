import React, { useState, useMemo } from "react";
import { Box, Typography, IconButton, Tooltip } from "@mui/material";

import {
  HmuDataTable,
  type Column,
  type FilterConfig,
} from "../../../../../shared/components";
import { ProductDeleteModal } from "..";
import type { Product } from "../../types/product.types";
import {
  tableWrapperStyles,
  codeStyles,
  nameStyles,
  categoryBadgeStyles,
  priceStyles,
  actionButtonStyles,
  deleteButtonStyles,
} from "./ProductsTable.styles";
import { useDeleteProduct } from "../../../../../shared/api/admin/product/product.hooks";
import { useNotificationStore } from "../../../../../shared/store/useNotificationStore";
import { EditIcon, DeleteIcon } from "../../../../../shared/icons";

interface ProductsTableProps {
  products: Product[];
  isLoading: boolean;
  onView: (product: Product) => void;
  onEdit: (product: Product) => void;
}

const ProductsTable: React.FC<ProductsTableProps> = ({
  products,
  isLoading,
  onView,
  onEdit,
}) => {
  const { mutate: deleteProduct, isPending: isDeleting } = useDeleteProduct();
  const { showNotification } = useNotificationStore();

  const [deleteState, setDeleteState] = useState<{
    isOpen: boolean;
    product: Product | null;
  }>({
    isOpen: false,
    product: null,
  });

  const handleOpenDelete = (product: Product) => {
    setDeleteState({ isOpen: true, product });
  };

  const handleCloseDelete = () => {
    setDeleteState({ isOpen: false, product: null });
  };

  const handleDelete = (productId: string) => {
    deleteProduct(productId, {
      onSuccess: () => {
        showNotification("Product deleted successfully", "success");
        handleCloseDelete();
      },
      onError: (error: any) => {
        showNotification(
          error?.response?.data?.message || "Failed to delete product",
          "error",
        );
      },
    });
  };

  const columns: Column<Product>[] = useMemo(
    () => [
      {
        id: "code",
        label: "Code",
        sortable: true,
        render: (row) => <Box sx={codeStyles}>{row.code}</Box>,
      },
      {
        id: "name",
        label: "Product Name",
        sortable: true,
        render: (row) => <Typography sx={nameStyles}>{row.name}</Typography>,
      },
      {
        id: "category",
        label: "Category",
        sortable: true,
        render: (row) => (
          <Box sx={categoryBadgeStyles(row.category)}>{row.category}</Box>
        ),
      },
      {
        id: "uom",
        label: "Unit",
        render: (row) => (
          <Typography sx={{ fontSize: "0.8125rem", color: "text.secondary" }}>
            {row.uom}
          </Typography>
        ),
      },
      {
        id: "isInStock",
        label: "In Stock",
        sortable: true,
        render: (row) => (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              color: row.isInStock ? "success.main" : "error.main",
              fontSize: "0.8125rem",
              fontWeight: 600,
            }}
          >
            <Box
              sx={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                bgcolor: row.isInStock ? "success.main" : "error.main",
              }}
            />
            {row.isInStock ? "In Stock" : "Out of Stock"}
          </Box>
        ),
      },
      {
        id: "defaultPrice",
        label: "MRP",
        sortable: true,
        render: (row) => (
          <Typography sx={priceStyles}>
            ₹{row.defaultPrice.toFixed(2)}
          </Typography>
        ),
      },
      {
        id: "actions",
        label: "Actions",
        align: "right",
        render: (row) => (
          <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 0.5 }}>
            <Tooltip title="Edit Product">
              <IconButton
                size="small"
                sx={actionButtonStyles}
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(row);
                }}
              >
                <EditIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Delete Product">
              <IconButton
                size="small"
                sx={deleteButtonStyles}
                onClick={(e) => {
                  e.stopPropagation();
                  handleOpenDelete(row);
                }}
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>
        ),
      },
    ],
    [onEdit],
  );

  const filters: FilterConfig<Product>[] = useMemo(
    () => [
      {
        id: "category",
        label: "Category",
        options: [
          { label: "All Categories", value: "all" },
          { label: "Feed", value: "FEED" },
          { label: "Stationery", value: "STATIONERY" },
          { label: "Other", value: "OTHER" },
        ],
        onFilter: (product, value) => {
          if (value === "all") return true;
          return product.category === value;
        },
      },
      {
        id: "stockStatus",
        label: "Stock Status",
        options: [
          { label: "All Status", value: "all" },
          { label: "In Stock", value: "in-stock" },
          { label: "Out of Stock", value: "out-of-stock" },
        ],
        onFilter: (product, value) => {
          if (value === "all") return true;
          if (value === "in-stock") return product.isInStock;
          if (value === "out-of-stock") return !product.isInStock;
          return true;
        },
      },
    ],
    [],
  );

  return (
    <Box sx={tableWrapperStyles}>
      <HmuDataTable
        columns={columns}
        data={products}
        loading={isLoading}
        keyExtractor={(row) => row.id}
        onRowClick={onView}
        sorting={{
          orderBy: "name",
          order: "asc",
        }}
        search={{
          enabled: true,
          placeholder: "Search products by name or code...",
          fields: ["name", "code", "description"],
        }}
        filters={filters}
      />

      <ProductDeleteModal
        open={deleteState.isOpen}
        onClose={handleCloseDelete}
        onConfirm={handleDelete}
        product={deleteState.product}
        loading={isDeleting}
      />
    </Box>
  );
};

export default ProductsTable;
