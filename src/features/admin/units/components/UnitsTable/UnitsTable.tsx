import React from "react";
import { Box, Typography, IconButton, Tooltip } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";

import {
  HmuDataTable,
  type Column,
  type FilterConfig,
} from "../../../../../shared/components";
import type { Unit } from "../../types/unit.types";
import {
  tableWrapperStyles,
  unitCodeStyles,
  unitNameStyles,
  unitAddressStyles,
  statusBadgeStyles,
  statusDotStyles,
  actionButtonStyles,
} from "./UnitsTable.styles";

interface UnitsTableProps {
  units: Unit[];
  isLoading: boolean;
  onView: (unit: Unit) => void;
  onEdit: (unit: Unit) => void;
  onDelete: (unit: Unit) => void;
}

const UnitsTable: React.FC<UnitsTableProps> = ({
  units,
  isLoading,
  onView,
  onEdit,
  onDelete,
}) => {
  const getStatusConfig = (isActive: boolean) => {
    return isActive
      ? { bg: "#dcfce7", color: "#166534", dot: "#22c55e" }
      : { bg: "#f1f5f9", color: "#475569", dot: "#94a3b8" };
  };

  const columns: Column<Unit>[] = [
    {
      id: "code",
      label: "Code",
      sortable: true,
      render: (row) => <Box sx={unitCodeStyles}>{row.code}</Box>,
    },
    {
      id: "name",
      label: "Name",
      sortable: true,
      render: (row) => (
        <Typography onClick={() => onView(row)} sx={unitNameStyles}>
          {row.name}
        </Typography>
      ),
    },
    {
      id: "address",
      label: "Address",
      render: (row) => (
        <Typography sx={unitAddressStyles}>
          {typeof row.address === "object" && row.address !== null
            ? [
                row.address.addressLine1,
                row.address.city,
                row.address.postalCode,
              ]
                .filter(Boolean)
                .join(", ")
            : row.address || "N/A"}
        </Typography>
      ),
    },
    {
      id: "status",
      label: "Status",
      align: "center",
      sortable: true,
      render: (row) => {
        const config = getStatusConfig(row.active);
        return (
          <Box sx={statusBadgeStyles(config.bg, config.color)}>
            <Box sx={statusDotStyles(config.dot)} />
            {row?.active ? "Active" : "Inactive"}
          </Box>
        );
      },
    },
    {
      id: "actions",
      label: "Actions",
      align: "right",
      render: (row) => (
        <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 0.5 }}>
          <Tooltip title="View Details">
            <IconButton
              size="small"
              sx={actionButtonStyles}
              onClick={() => onView(row)}
            >
              <VisibilityIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Edit Unit">
            <IconButton
              size="small"
              sx={actionButtonStyles}
              onClick={() => onEdit(row)}
            >
              <EditIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete Unit">
            <IconButton
              size="small"
              sx={actionButtonStyles}
              onClick={() => onDelete(row)}
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      ),
    },
  ];

  const filters: FilterConfig<Unit>[] = [
    {
      id: "status",
      label: "Status",
      onFilter: (unit, value) => {
        if (value === "active") return unit.active;
        if (value === "inactive") return !unit.active;
        return true;
      },
      options: [
        { label: "All Statuses", value: "all-statuses" },
        { label: "Active", value: "active" },
        { label: "Inactive", value: "inactive" },
      ],
    },
  ];

  return (
    <Box sx={tableWrapperStyles}>
      <HmuDataTable
        columns={columns}
        data={units}
        loading={isLoading}
        keyExtractor={(row) => row.id}
        search={{
          enabled: true,
          placeholder: "Search units or codes...",
          fields: ["name", "code"],
        }}
        filters={filters}
      />
    </Box>
  );
};

export default UnitsTable;
