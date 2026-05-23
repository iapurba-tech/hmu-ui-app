import React, { useState, useMemo } from "react";
import { Box, Typography, IconButton, Tooltip } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

import { HmuDataTable, type Column } from "../../../../../shared/components";
import { BankDeleteModal } from "..";
import type { Bank } from "../../types/bank.types";
import {
  tableWrapperStyles,
  codeStyles,
  nameStyles,
  maskedAccountStyles,
  branchTextStyles,
  typeBadgeStyles,
  actionButtonStyles,
  deleteButtonStyles,
} from "./BanksTable.styles";
import { useDeleteBankAccount } from "../../../../../shared/api/admin/admin.hooks";
import { useNotificationStore } from "../../../../../shared/store/useNotificationStore";
import { DeleteIcon } from "../../../../../shared/icons";

interface BanksTableProps {
  banks: Bank[];
  isLoading: boolean;
  onView: (bank: Bank) => void;
  onEdit: (bank: Bank) => void;
}

const BanksTable: React.FC<BanksTableProps> = ({
  banks,
  isLoading,
  onView,
  onEdit,
}) => {
  const { mutate: deleteBank, isPending: isDeleting } = useDeleteBankAccount();
  const { showNotification } = useNotificationStore();

  const [deleteState, setDeleteState] = useState<{
    isOpen: boolean;
    bank: Bank | null;
  }>({
    isOpen: false,
    bank: null,
  });

  const [visibleAccounts, setVisibleAccounts] = useState<
    Record<string, boolean>
  >({});

  const toggleAccountVisibility = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setVisibleAccounts((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleOpenDelete = (bank: Bank) => {
    setDeleteState({ isOpen: true, bank });
  };

  const handleCloseDelete = () => {
    setDeleteState({ isOpen: false, bank: null });
  };

  const handleDelete = (bankId: string) => {
    deleteBank(bankId, {
      onSuccess: () => {
        showNotification("Bank account deleted successfully", "success");
        handleCloseDelete();
      },
      onError: (error: any) => {
        showNotification(
          error?.response?.data?.message || "Failed to delete bank account",
          "error",
        );
      },
    });
  };

  const maskAccount = (account: string) => {
    if (!account) return "";
    return account.slice(0, -4).replace(/./g, "*") + " " + account.slice(-4);
  };

  const columns: Column<Bank>[] = useMemo(
    () => [
      {
        id: "code",
        label: "Code",
        sortable: true,
        render: (row) => <Box sx={codeStyles}>{row.code}</Box>,
      },
      {
        id: "accountHolderName",
        label: "Account Holder",
        sortable: true,
        render: (row) => (
          <Typography sx={nameStyles}>{row.accountHolderName}</Typography>
        ),
      },
      {
        id: "bankName",
        label: "Bank Name",
        render: (row) => (
          <Box>
            <Typography sx={{ fontSize: "0.875rem", fontWeight: 600 }}>
              {row.bankName}
            </Typography>
            <Typography sx={branchTextStyles}>{row.branchName}</Typography>
          </Box>
        ),
      },
      {
        id: "accountNumber",
        label: "Account Number",
        render: (row) => (
          <Box sx={maskedAccountStyles}>
            <Typography
              sx={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: "0.8125rem",
              }}
            >
              {visibleAccounts[row.id]
                ? row.accountNumber
                : maskAccount(row.accountNumber)}
            </Typography>
            <IconButton
              size="small"
              onClick={(e) => toggleAccountVisibility(row.id, e)}
              sx={{ p: 0.5 }}
            >
              {visibleAccounts[row.id] ? (
                <VisibilityOffIcon sx={{ fontSize: "1rem", opacity: 0.6 }} />
              ) : (
                <VisibilityIcon sx={{ fontSize: "1rem", opacity: 0.6 }} />
              )}
            </IconButton>
          </Box>
        ),
      },
      {
        id: "accountType",
        label: "Type",
        sortable: true,
        render: (row) => (
          <Box sx={typeBadgeStyles(row.accountType === "SAVINGS")}>
            {row.accountType}
          </Box>
        ),
      },
      {
        id: "unit",
        label: "Associated Unit",
        render: (row) => (
          <Typography
            sx={{
              fontSize: "0.8125rem",
              color: "text.primary",
              fontWeight: 500,
            }}
          >
            {row.unit.name}
          </Typography>
        ),
      },
      {
        id: "actions",
        label: "Actions",
        align: "right",
        render: (row) => (
          <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 0.5 }}>
            <Tooltip title="Edit Account">
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
            <Tooltip title="Delete Account">
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
    [onEdit, visibleAccounts],
  );

  return (
    <Box sx={tableWrapperStyles}>
      <HmuDataTable
        columns={columns}
        data={banks}
        loading={isLoading}
        keyExtractor={(row) => row.id}
        onRowClick={onView}
        sorting={{
          orderBy: "accountHolderName",
          order: "asc",
        }}
        search={{
          enabled: true,
          placeholder: "Search accounts, holders or banks...",
          fields: [
            "accountHolderName",
            "bankName",
            "accountNumber",
            "code",
            "branchName",
          ],
        }}
      />

      <BankDeleteModal
        open={deleteState.isOpen}
        onClose={handleCloseDelete}
        onConfirm={handleDelete}
        bank={deleteState.bank}
        loading={isDeleting}
      />
    </Box>
  );
};

export default BanksTable;
