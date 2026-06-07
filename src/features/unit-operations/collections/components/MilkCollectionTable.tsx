import React from "react";
import { Box, IconButton, Tooltip, Chip } from "@mui/material";
import { HmuDataTable } from "../../../../shared/components";
import { EditIcon, DeleteIcon } from "../../../../shared/icons";
import { formatDate } from "../../../../shared/utils/dateUtils";
import type { MilkCollection } from "../types/milk-collection.types";
import type { Column } from "../../../../shared/components/HmuDataTable/HmuDataTable";

interface MilkCollectionTableProps {
  collections: MilkCollection[];
  isLoading: boolean;
  onEdit: (collection: MilkCollection) => void;
  onDelete: (id: string) => void;
  mpcsMap: Record<string, string>;
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

const MilkCollectionTable: React.FC<MilkCollectionTableProps> = ({
  collections,
  isLoading,
  onEdit,
  onDelete,
  mpcsMap,
  pagination,
  sorting,
}) => {
  const columns: Column<MilkCollection>[] = [
    {
      id: "collectionDate",
      label: "Date",
      render: (row) => formatDate(row.collectionDate),
      sortable: true,
      width: "120px",
    },
    {
      id: "shift",
      label: "Shift",
      render: (row) => {
        const isMorning = row.shift === "MORNING";
        return (
          <Chip
            label={isMorning ? "Morning" : "Evening"}
            size="small"
            sx={{
              fontWeight: 700,
              fontSize: "0.7rem",
              textTransform: "uppercase",
              backgroundColor: isMorning ? "#FFF8E1" : "#E8EAF6",
              color: isMorning ? "#F57C00" : "#3F51B5",
              border: `1px solid ${isMorning ? "#FFE082" : "#C5CAE9"}`,
              height: "24px",
            }}
          />
        );
      },
      sortable: true,
      width: "100px",
    },
    {
      id: "mpcsId",
      label: "MPCS",
      render: (row) => mpcsMap[row.mpcsId] || row.mpcsId,
      sortable: true,
    },
    {
      id: "quantity",
      label: "Qty (kg)",
      align: "right",
      sortable: true,
    },
    {
      id: "fatPercentage",
      label: "Fat %",
      align: "right",
      sortable: true,
    },
    {
      id: "snfPercentage",
      label: "SNF %",
      align: "right",
      sortable: true,
    },
    {
      id: "clr",
      label: "CLR",
      align: "right",
      sortable: true,
    },
    {
      id: "fatKg",
      label: "Fat KG",
      align: "right",
      sortable: true,
    },
    {
      id: "snfKg",
      label: "SNF KG",
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
      data={collections}
      keyExtractor={(row) => row.id}
      loading={isLoading}
      search={{
        enabled: true,
        placeholder: "Search collections...",
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
      emptyMessage="No milk collections found"
    />
  );
};

export default MilkCollectionTable;
