import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TableSortLabel,
  Box,
  Typography,
  IconButton,
  Pagination,
  Select,
  MenuItem,
} from "@mui/material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import {
  dataTableContainerStyles,
  dataTableStyles,
  dataTableHeadCellStyles,
  dataTableRowStyles,
  dataTableCellStyles,
} from "./HmuDataTable.styles";
import { colors } from "../../theme/colors";
import { HmuLoader } from "../index";

export interface Column<T> {
  id: keyof T | string;
  label: string;
  align?: "left" | "right" | "center";
  sortable?: boolean;
  render?: (row: T) => React.ReactNode;
}

export interface PaginationConfig {
  page: number;
  rowsPerPage: number;
  totalRows: number;
  onPageChange: (page: number) => void;
  onRowsPerPageChange: (rowsPerPage: number) => void;
}

export interface SortingConfig {
  orderBy: string;
  order: "asc" | "desc";
  onSort: (columnId: string) => void;
}

export interface HmuDataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  keyExtractor: (row: T) => string | number;
  loading?: boolean;
  pagination?: PaginationConfig;
  sorting?: SortingConfig;
  emptyMessage?: string;
}

const HmuDataTable = <T extends object>({
  columns,
  data,
  keyExtractor,
  loading = false,
  pagination,
  sorting,
  emptyMessage = "No data available",
}: HmuDataTableProps<T>) => {
  const handlePageChange = (_: unknown, newPage: number) => {
    pagination?.onPageChange(newPage - 1);
  };

  const totalPages = pagination
    ? Math.ceil(pagination.totalRows / pagination.rowsPerPage)
    : 0;
  const startRow = pagination
    ? pagination.page * pagination.rowsPerPage + 1
    : 0;
  const endRow = pagination
    ? Math.min(
        (pagination.page + 1) * pagination.rowsPerPage,
        pagination.totalRows,
      )
    : 0;

  return (
    <Box sx={{ width: "100%", position: "relative" }}>
      <TableContainer
        component={Paper}
        sx={{
          ...dataTableContainerStyles,
          borderRadius: pagination ? 0 : "0 0 12px 12px",
        }}
        elevation={0}
      >
        <Table sx={dataTableStyles} aria-label="dynamic data table">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id as string}
                  align={column.align || "left"}
                  sx={dataTableHeadCellStyles}
                  sortDirection={
                    sorting?.orderBy === column.id ? sorting.order : false
                  }
                >
                  {column.sortable && sorting ? (
                    <TableSortLabel
                      active={sorting.orderBy === column.id}
                      direction={
                        sorting.orderBy === column.id ? sorting.order : "asc"
                      }
                      onClick={() => sorting.onSort(column.id as string)}
                    >
                      {column.label}
                    </TableSortLabel>
                  ) : (
                    column.label
                  )}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={columns.length} sx={{ py: 8 }}>
                  <Box sx={{ display: "flex", justifyContent: "center" }}>
                    <HmuLoader size={40} />
                  </Box>
                </TableCell>
              </TableRow>
            ) : data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length} sx={{ py: 8 }}>
                  <Typography align="center" color="textSecondary">
                    {emptyMessage}
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              data.map((row) => (
                <TableRow key={keyExtractor(row)} sx={dataTableRowStyles}>
                  {columns.map((column) => (
                    <TableCell
                      key={column.id as string}
                      align={column.align || "left"}
                      sx={dataTableCellStyles}
                    >
                      {column.render
                        ? column.render(row)
                        : (row[
                            column.id as keyof T
                          ] as unknown as React.ReactNode)}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {pagination && (
        <Box
          sx={{
            bgcolor: "#f8fafc", // Lighter background for the footer
            px: 2,
            py: 1.5,
            border: `1px solid ${colors.neutral}20`,
            borderTop: "none",
            borderRadius: "0 0 12px 12px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography variant="body2" color="textSecondary">
            Showing {startRow}-{endRow} of {pagination.totalRows} records
          </Typography>

          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Typography
                sx={{
                  fontSize: "0.75rem",
                  color: colors.text.secondary,
                  fontWeight: 600,
                }}
              >
                Rows per page:
              </Typography>
              <Select
                value={pagination.rowsPerPage}
                onChange={(e) =>
                  pagination.onRowsPerPageChange(Number(e.target.value))
                }
                size="small"
                sx={{
                  fontSize: "0.75rem",
                  height: "32px",
                  borderRadius: "6px",
                  bgcolor: "white",
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: `${colors.neutral}30`,
                  },
                  "&:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: `${colors.neutral}50`,
                  },
                }}
              >
                {[5, 10, 25, 50].map((option) => (
                  <MenuItem
                    key={option}
                    value={option}
                    sx={{ fontSize: "0.75rem" }}
                  >
                    {option}
                  </MenuItem>
                ))}
              </Select>
            </Box>

            <Pagination
              count={totalPages}
              page={pagination.page + 1}
              onChange={handlePageChange}
              shape="rounded"
              size="small"
              renderItem={(item) => {
                const { page, selected, type, color, ...itemProps } = item;

                if (type === "previous" || type === "next") {
                  return (
                    <IconButton
                      {...itemProps} // Passes onClick, disabled, etc.
                      size="small"
                      sx={{
                        borderRadius: "8px",
                        border: `1px solid ${colors.neutral}20`,
                        bgcolor: "white",
                        mr: type === "previous" ? 0.5 : 0,
                        ml: type === "next" ? 0.5 : 0,
                        "&:hover": { bgcolor: "#f1f5f9" },
                      }}
                    >
                      {type === "previous" ? (
                        <ChevronLeftIcon fontSize="small" />
                      ) : (
                        <ChevronRightIcon fontSize="small" />
                      )}
                    </IconButton>
                  );
                }
                return (
                  <Box
                    {...item}
                    sx={{
                      minWidth: 32,
                      height: 32,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      borderRadius: "8px",
                      cursor: "pointer",
                      fontSize: "0.75rem",
                      fontWeight: 700,
                      mx: 0.25,
                      bgcolor: item.selected ? colors.primary : "transparent",
                      color: item.selected ? "white" : colors.text.primary,
                      border: item.selected ? "none" : `1px solid transparent`,
                      "&:hover": {
                        bgcolor: item.selected ? colors.primary : "#f1f5f9",
                        border: item.selected
                          ? "none"
                          : `1px solid ${colors.neutral}20`,
                      },
                      transition: "all 0.2s",
                    }}
                  >
                    {item.page}
                  </Box>
                );
              }}
            />
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default HmuDataTable;
