import React, { useState } from "react";
import {
  Box,
  Typography,
  IconButton,
  Tooltip,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";

import { 
  HmuDataTable, 
  type Column, 
  type FilterConfig, 
  HmuConfirmModal,
  HmuSwitch 
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
import { useToggleUnitStatus } from "../../../../../shared/api/admin/admin.hooks";
import { useNotificationStore } from "../../../../../shared/store/useNotificationStore";
import { useTheme } from "@mui/material/styles";

interface UnitsTableProps {
  units: Unit[];
  isLoading: boolean;
  onView: (unit: Unit) => void;
  onEdit: (unit: Unit) => void;
}

const UnitsTable: React.FC<UnitsTableProps> = ({
  units,
  isLoading,
  onView,
  onEdit,
}) => {
  const { mutate: toggleStatus, isPending: isToggling } = useToggleUnitStatus();
  const { showNotification } = useNotificationStore();
  const theme = useTheme();
  
  // Confirmation Modal State
  const [confirmState, setConfirmState] = useState<{
    isOpen: boolean;
    unit: Unit | null;
  }>({
    isOpen: false,
    unit: null,
  });

  const handleOpenConfirm = (unit: Unit) => {
    setConfirmState({ isOpen: true, unit });
  };

  const handleCloseConfirm = () => {
    setConfirmState({ isOpen: false, unit: null });
  };

  const handleStatusToggle = () => {
    const unit = confirmState.unit;
    if (!unit) return;

    toggleStatus(
      { id: unit.id, active: unit.active },
      {
        onSuccess: () => {
          showNotification(
            `Unit ${unit.active ? "deactivated" : "activated"} successfully`,
            "success"
          );
          handleCloseConfirm();
        },
        onError: (error: any) => {
          showNotification(
            error?.response?.data?.message || "Failed to update unit status",
            "error"
          );
          handleCloseConfirm();
        },
      }
    );
  };

  const getStatusConfig = (isActive: boolean) => {
    const p = isActive ? theme.palette.success : theme.palette.error;
    return { 
      bg: p.bg, 
      color: p.text, 
      dot: p.main 
    };
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
        <Typography sx={unitNameStyles}>
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
          <Box sx={statusBadgeStyles(config.bg as string, config.color as string)}>
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
        <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1.5, alignItems: "center" }}>
          <Tooltip title={row.active ? "Deactivate Unit" : "Activate Unit"}>
            <Box onClick={(e) => e.stopPropagation()}>
              <HmuSwitch
                checked={row.active}
                onChange={() => handleOpenConfirm(row)}
                disabled={isToggling}
                sx={{ transform: "scale(0.90)" }}
              />
            </Box>
          </Tooltip>
          
          <Box sx={{ display: "flex", gap: 0.5 }}>
            <Tooltip title="Edit Unit">
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
          </Box>
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
        onRowClick={onView}
        sorting={{
          orderBy: "name",
          order: "asc",
        }}
        search={{
          enabled: true,
          placeholder: "Search units or codes...",
          fields: ["name", "code"],
        }}
        filters={filters}
      />

      <HmuConfirmModal
        open={confirmState.isOpen}
        title={confirmState.unit?.active ? "Deactivate Unit" : "Activate Unit"}
        message={`Are you sure you want to ${
          confirmState.unit?.active ? "deactivate" : "activate"
        } unit "${confirmState.unit?.name}"?`}
        confirmLabel={confirmState.unit?.active ? "Deactivate" : "Activate"}
        confirmVariant={confirmState.unit?.active ? "danger" : "primary"}
        onConfirm={handleStatusToggle}
        onCancel={handleCloseConfirm}
        loading={isToggling}
      />
    </Box>
  );
};

export default UnitsTable;
