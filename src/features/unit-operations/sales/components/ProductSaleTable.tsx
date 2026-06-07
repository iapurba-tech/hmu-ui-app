import React from "react";
import { Box, IconButton, Tooltip } from "@mui/material";
import { HmuDataTable } from "../../../../shared/components";
import { EditIcon, DeleteIcon } from "../../../../shared/icons";
import { formatDate } from "../../../../shared/utils/dateUtils";
import type { ProductSale } from "../types/product-sale.types";
import type { Column } from "../../../../shared/components/HmuDataTable/HmuDataTable";

interface ProductSaleTableProps {
  sales: ProductSale[];
  isLoading: boolean;
  onEdit: (sale: ProductSale) => void;
  onDelete: (id: string) => void;
  mpcsMap: Record<string, string>;
  productMap: Record<string, string>;
  pagination: {
    page: number;
    size: number;
    totalElements: number;
    onPageChange: (page: number) => void;
    onSizeChange: (size: number) => void;
  };
  sorting: {
    orderBy: string;
    order: "asc" | "desc";
    onSort: (columnId: string) => void;
  };
}

const ProductSaleTable: React.FC<ProductSaleTableProps> = ({
  sales,
  isLoading,
  onEdit,
  onDelete,
  mpcsMap,
  productMap,
  pagination,
  sorting,
}) => {
  const columns: Column<ProductSale>[] = [
    {
      id: "saleDate",
      label: "Date",
      render: (row) => formatDate(row.saleDate),
      sortable: true,
      width: "120px",
    },
    {
      id: "mpcsId",
      label: "MPCS",
      render: (row) => mpcsMap[row.mpcsId] || row.mpcsId,
      sortable: true,
    },
    {
      id: "productId",
      label: "Product",
      render: (row) => productMap[row.productId] || row.productId,
      sortable: true,
    },
    {
      id: "quantity",
      label: "Qty",
      align: "right",
      sortable: true,
    },
    {
      id: "price",
      label: "Price",
      render: (row) =>
        `₹${row.price.toLocaleString("en-IN", { minimumFractionDigits: 2 })}`,
      align: "right",
      sortable: true,
    },
    {
      id: "totalAmount",
      label: "Amount",
      render: (row) =>
        `₹${row.totalAmount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}`,
      align: "right",
      sortable: true,
    },
    {
      id: "actions",
      label: "Actions",
      align: "center",
      render: (row) => (
        <Box sx={{ display: "flex", justifyContent: "center", gap: 1 }}>
          <Tooltip title="Edit">
            <IconButton
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                onEdit(row);
              }}
              sx={{ color: "primary.main" }}
            >
              <EditIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete">
            <IconButton
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(row.id);
              }}
              sx={{ color: "error.main" }}
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      ),
      width: "100px",
    },
  ];

  return (
    <HmuDataTable
      columns={columns}
      data={sales}
      keyExtractor={(row) => row.id}
      loading={isLoading}
      search={{
        enabled: true,
        placeholder: "Search sales...",
      }}
      pagination={{
        page: pagination.page,
        rowsPerPage: pagination.size,
        totalRows: pagination.totalElements,
        onPageChange: pagination.onPageChange,
        onRowsPerPageChange: pagination.onSizeChange,
        isServerSide: true,
      }}
      sorting={sorting}
      emptyMessage="No product sales found"
    />
  );
};

export default ProductSaleTable;
