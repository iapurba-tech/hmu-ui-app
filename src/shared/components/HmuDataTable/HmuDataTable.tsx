import React, { useState, useMemo } from "react";
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
  TextField,
  InputAdornment,
  FormControl,
  type SxProps,
  type Theme,
} from "@mui/material";
import { SearchIcon, ChevronLeftIcon, ChevronRightIcon } from "../../icons";
import {
  dataTableContainerStyles,
  dataTableStyles,
  dataTableHeadCellStyles,
  dataTableRowStyles,
  dataTableCellStyles,
  paginationFooterStyles,
  rowsPerPageLabelStyles,
  rowsPerPageSelectStyles,
  paginationIconButtonStyles,
  paginationItemStyles,
  filterBarStyles,
  searchFieldStyles,
  filterSelectStyles,
  searchIconStyles,
} from "./HmuDataTable.styles";
import { HmuLoader } from "../index";

export interface Column<T> {
  id: keyof T | string;
  label: string;
  align?: "left" | "right" | "center";
  sortable?: boolean;
  render?: (row: T) => React.ReactNode;
  width?: string | number;
}

export interface PaginationConfig {
  page?: number;
  rowsPerPage?: number;
  totalRows?: number;
  onPageChange?: (page: number) => void;
  onRowsPerPageChange?: (rowsPerPage: number) => void;
  isServerSide?: boolean;
  rowsPerPageThreshold?: number;
}

export interface SortingConfig {
  orderBy: string;
  order: "asc" | "desc";
  onSort?: (columnId: string) => void;
}

export interface SearchConfig<T> {
  enabled?: boolean;
  placeholder?: string;
  fields?: (keyof T)[];
}

export interface FilterOption {
  label: string;
  value: any;
}

export interface FilterConfig<T> {
  id: string;
  label: string;
  options: FilterOption[];
  field?: keyof T;
  onFilter?: (item: T, value: any) => boolean;
}

export interface HmuDataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  keyExtractor: (row: T) => string | number;
  loading?: boolean;
  pagination?: PaginationConfig;
  sorting?: SortingConfig;
  search?: SearchConfig<T>;
  filters?: FilterConfig<T>[];
  emptyMessage?: string;
  onRowClick?: (row: T) => void;
  containerSx?: SxProps<Theme>;
  isPinned?: (row: T) => "top" | "bottom" | null;
  omitTopRadius?: boolean;
}

const HmuDataTable = <T extends object>({
  columns,
  data,
  keyExtractor,
  loading = false,
  pagination,
  sorting,
  search,
  filters,
  emptyMessage = "No data available",
  onRowClick,
  containerSx,
  isPinned,
  omitTopRadius = false,
}: HmuDataTableProps<T>) => {
  // Internal state for uncontrolled mode
  const [internalPage, setInternalPage] = useState(0);
  const [internalRowsPerPage, setInternalRowsPerPage] = useState(10);

  // Internal state for sorting (initialized from props if available)
  const [internalOrderBy, setInternalOrderBy] = useState<string>(
    sorting?.orderBy || "",
  );
  const [internalOrder, setInternalOrder] = useState<"asc" | "desc">(
    sorting?.order || "asc",
  );

  // Internal state for search and filters
  const [searchTerm, setSearchTerm] = useState("");
  const [filterValues, setFilterValues] = useState<Record<string, any>>(() => {
    const defaults: Record<string, any> = {};
    filters?.forEach((f) => {
      defaults[f.id] = f.options[0]?.value ?? "";
    });
    return defaults;
  });

  // Derived sorting values
  // Only use internal state if onSort is NOT provided (uncontrolled)
  const orderBy = sorting?.onSort ? sorting.orderBy : internalOrderBy;
  const order = sorting?.onSort ? sorting.order : internalOrder;

  const handleSort = (columnId: string) => {
    if (sorting?.onSort) {
      sorting.onSort(columnId);
    } else {
      const isAsc = internalOrderBy === columnId && internalOrder === "asc";
      const newOrder = isAsc ? "desc" : "asc";
      setInternalOrder(newOrder);
      setInternalOrderBy(columnId);
    }
  };

  // Logic for filtering and sorting
  const processedData = useMemo(() => {
    // If it's server-side, we assume data is already processed
    if (pagination?.isServerSide) return data;

    let result = [...data];

    // 1. Search
    if (search?.enabled && searchTerm) {
      const lowerSearch = searchTerm.toLowerCase();
      const searchFields =
        search.fields ||
        (columns
          .filter((c) => typeof c.id === "string" && c.id !== "actions")
          .map((c) => c.id) as (keyof T)[]);

      result = result.filter((item) =>
        searchFields.some((field) => {
          const value = item[field];
          return String(value || "")
            .toLowerCase()
            .includes(lowerSearch);
        }),
      );
    }

    // 2. Filters
    if (filters && filters.length > 0) {
      filters.forEach((filter) => {
        const selectedValue = filterValues[filter.id];
        // Skip if 'all' or default first option is selected (assuming first is 'All')
        if (
          selectedValue === "all" ||
          selectedValue === "" ||
          selectedValue === "all-statuses"
        ) {
          return;
        }

        if (filter.onFilter) {
          result = result.filter((item) =>
            filter.onFilter!(item, selectedValue),
          );
        } else if (filter.field) {
          const field = filter.field;
          result = result.filter((item) => item[field] === selectedValue);
        }
      });
    }

    // 3. Sort
    if (orderBy) {
      result.sort((a, b) => {
        // 0. Handle pinning
        if (isPinned) {
          const aPinned = isPinned(a);
          const bPinned = isPinned(b);

          if (aPinned === "top" && bPinned !== "top") return -1;
          if (bPinned === "top" && aPinned !== "top") return 1;
          if (aPinned === "bottom" && bPinned !== "bottom") return 1;
          if (bPinned === "bottom" && aPinned !== "bottom") return -1;
        }

        const aValue = a[orderBy as keyof T];
        const bValue = b[orderBy as keyof T];

        if (aValue === bValue) return 0;
        if (aValue === null || aValue === undefined) return 1;
        if (bValue === null || bValue === undefined) return -1;

        if (aValue < bValue) return order === "asc" ? -1 : 1;
        if (aValue > bValue) return order === "asc" ? 1 : -1;
        return 0;
      });
    }

    return result;
  }, [
    data,
    searchTerm,
    filterValues,
    orderBy,
    order,
    search,
    filters,
    pagination?.isServerSide,
    columns,
    isPinned,
  ]);

  // Derive active values (favor controlled props if provided)
  const isControlledPage =
    pagination?.page !== undefined && pagination?.onPageChange !== undefined;
  const page = isControlledPage
    ? (pagination?.page ?? internalPage)
    : internalPage;
  const rowsPerPage =
    pagination?.rowsPerPage !== undefined
      ? pagination.rowsPerPage
      : internalRowsPerPage;
  const totalRows = pagination?.totalRows ?? processedData.length;
  const isServerSide = pagination?.isServerSide ?? false;
  const threshold = pagination?.rowsPerPageThreshold ?? 10;

  // Calculate effective page to handle out-of-bounds cases (e.g. after deletion)
  const totalPages = Math.ceil(totalRows / rowsPerPage);
  const maxPage = Math.max(0, totalPages - 1);
  const effectivePage = Math.min(page, maxPage);

  const handlePageChange = (_: unknown, newPage: number) => {
    const zeroBasedPage = newPage - 1;
    if (isControlledPage) {
      pagination.onPageChange?.(zeroBasedPage);
    } else {
      setInternalPage(zeroBasedPage);
    }
  };

  const handleRowsPerPageChange = (newRows: number) => {
    if (pagination?.onRowsPerPageChange) {
      pagination.onRowsPerPageChange(newRows);
    } else {
      setInternalRowsPerPage(newRows);
      setInternalPage(0);
    }
  };

  const startRow = totalRows === 0 ? 0 : effectivePage * rowsPerPage + 1;
  const endRow = Math.min((effectivePage + 1) * rowsPerPage, totalRows);

  // Slice data only if it's client-side pagination
  const displayData = isServerSide
    ? processedData
    : processedData.slice(
        effectivePage * rowsPerPage,
        (effectivePage + 1) * rowsPerPage,
      );

  const showPagination = totalRows > threshold;
  const hasFilters = !!(search?.enabled || (filters && filters.length > 0));

  return (
    <Box sx={{ width: "100%", position: "relative" }}>
      {hasFilters && (
        <Box sx={filterBarStyles(omitTopRadius)}>
          {search?.enabled && (
            <TextField
              placeholder={search.placeholder || "Search..."}
              size="small"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setInternalPage(0);
              }}
              sx={searchFieldStyles}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon fontSize="small" sx={searchIconStyles} />
                    </InputAdornment>
                  ),
                },
              }}
            />
          )}

          {filters?.map((filter) => (
            <FormControl key={filter.id} size="small" sx={filterSelectStyles}>
              <Select
                value={filterValues[filter.id]}
                onChange={(e) => {
                  setFilterValues((prev) => ({
                    ...prev,
                    [filter.id]: e.target.value,
                  }));
                  setInternalPage(0);
                }}
              >
                {filter.options.map((option) => (
                  <MenuItem key={String(option.value)} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          ))}
        </Box>
      )}

      <TableContainer
        component={Paper}
        sx={[
          ...(Array.isArray(
            dataTableContainerStyles(showPagination, hasFilters, omitTopRadius),
          )
            ? (dataTableContainerStyles(
                showPagination,
                hasFilters,
                omitTopRadius,
              ) as any)
            : [
                dataTableContainerStyles(
                  showPagination,
                  hasFilters,
                  omitTopRadius,
                ),
              ]),
          ...(Array.isArray(containerSx)
            ? containerSx
            : containerSx
              ? [containerSx]
              : []),
        ]}
        elevation={0}
      >
        <Table sx={dataTableStyles} aria-label="dynamic data table">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id as string}
                  align={column.align || "left"}
                  sx={{ ...dataTableHeadCellStyles, width: column.width }}
                  sortDirection={orderBy === column.id ? order : false}
                >
                  {column.sortable ? (
                    <TableSortLabel
                      active={orderBy === column.id}
                      direction={orderBy === column.id ? order : "asc"}
                      onClick={() => handleSort(column.id as string)}
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
            ) : displayData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length} sx={{ py: 8 }}>
                  <Typography align="center" color="textSecondary">
                    {emptyMessage}
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              displayData.map((row) => (
                <TableRow
                  key={keyExtractor(row)}
                  sx={{
                    ...dataTableRowStyles,
                    cursor: onRowClick ? "pointer" : "default",
                  }}
                  onClick={() => onRowClick?.(row)}
                >
                  {columns.map((column) => (
                    <TableCell
                      key={column.id as string}
                      align={column.align || "left"}
                      sx={{ ...dataTableCellStyles, width: column.width }}
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

      {showPagination && (
        <Box sx={paginationFooterStyles(showPagination)}>
          <Typography variant="body2" color="textSecondary">
            Showing {startRow}-{endRow} of {totalRows} records
          </Typography>

          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Typography sx={rowsPerPageLabelStyles}>
                Rows per page:
              </Typography>
              <Select
                value={rowsPerPage}
                onChange={(e) =>
                  handleRowsPerPageChange(Number(e.target.value))
                }
                size="small"
                sx={rowsPerPageSelectStyles}
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
              page={effectivePage + 1}
              onChange={handlePageChange}
              shape="rounded"
              size="small"
              renderItem={(item) => {
                const { page: itemPage, selected, type, ...itemProps } = item;

                if (type === "previous" || type === "next") {
                  return (
                    <IconButton
                      {...(itemProps as any)}
                      size="small"
                      sx={paginationIconButtonStyles(type)}
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
                    {...(item as any)}
                    sx={paginationItemStyles(!!item.selected)}
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
