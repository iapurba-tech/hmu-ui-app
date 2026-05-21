import React, { useState } from "react";
import {
  Box,
  Typography,
  IconButton,
  Tooltip,
  alpha,
  Dialog,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";

import {
  HmuDataTable,
  type Column,
  type FilterConfig,
  HmuConfirmModal,
  HmuSwitch,
  HmuTextField,
  HmuButton,
} from "../../../../../shared/components";
import type { User } from "../../types/user.types";
import { UserRole } from "../../../../auth/constants/roles";
import {
  tableWrapperStyles,
  usernameStyles,
  userNameStyles,
  userEmailStyles,
  roleBadgeStyles,
  statusBadgeStyles,
  statusDotStyles,
  actionButtonStyles,
} from "./UsersTable.styles";
import {
  useToggleUserStatus,
  useDeleteUserPermanent,
} from "../../../../../shared/api/admin/admin.hooks";
import { useNotificationStore } from "../../../../../shared/store/useNotificationStore";
import { useTheme } from "@mui/material/styles";
import { DeleteIcon } from "../../../../../shared/icons";

interface UsersTableProps {
  users: User[];
  isLoading: boolean;
  onView: (user: User) => void;
  onEdit: (user: User) => void;
}

const UsersTable: React.FC<UsersTableProps> = ({
  users,
  isLoading,
  onView,
  onEdit,
}) => {
  const { mutate: toggleStatus, isPending: isToggling } = useToggleUserStatus();
  const { mutate: deletePermanent, isPending: isDeleting } =
    useDeleteUserPermanent();
  const { showNotification } = useNotificationStore();
  const theme = useTheme();

  // Confirmation Modal State (Activation/Deactivation)
  const [confirmState, setConfirmState] = useState<{
    isOpen: boolean;
    user: User | null;
  }>({
    isOpen: false,
    user: null,
  });

  // Permanent Delete Modal State
  const [deleteState, setDeleteState] = useState<{
    isOpen: boolean;
    user: User | null;
    confirmText: string;
  }>({
    isOpen: false,
    user: null,
    confirmText: "",
  });

  const handleOpenConfirm = (user: User) => {
    setConfirmState({ isOpen: true, user });
  };

  const handleCloseConfirm = () => {
    setConfirmState({ isOpen: false, user: null });
  };

  const handleOpenDelete = (user: User) => {
    setDeleteState({ isOpen: true, user, confirmText: "" });
  };

  const handleCloseDelete = () => {
    setDeleteState({ isOpen: false, user: null, confirmText: "" });
  };

  const handleStatusToggle = () => {
    const user = confirmState.user;
    if (!user) return;

    toggleStatus(
      { id: user.id, active: user.active },
      {
        onSuccess: () => {
          showNotification(
            `User ${user.active ? "deactivated" : "activated"} successfully`,
            "success",
          );
          handleCloseConfirm();
        },
        onError: (error: any) => {
          showNotification(
            error?.response?.data?.message || "Failed to update user status",
            "error",
          );
          handleCloseConfirm();
        },
      },
    );
  };

  const handleDeletePermanent = () => {
    const user = deleteState.user;
    if (!user) return;

    deletePermanent(user.id, {
      onSuccess: () => {
        showNotification("User deleted permanently", "success");
        handleCloseDelete();
      },
      onError: (error: any) => {
        showNotification(
          error?.response?.data?.message || "Failed to delete user",
          "error",
        );
      },
    });
  };

  const getStatusConfig = (isActive: boolean) => {
    const p = isActive ? theme.palette.success : theme.palette.error;
    return {
      bg: p.bg,
      color: p.text,
      dot: p.main,
    };
  };

  const getRoleConfig = (role: string) => {
    switch (role) {
      case UserRole.SYSTEM_ADMIN:
        return {
          bg: alpha(theme.palette.primary.main, 0.1),
          color: theme.palette.primary.main,
        };
      case UserRole.UNIT_ADMIN:
        return {
          bg: alpha(theme.palette.secondary.main, 0.1),
          color: theme.palette.secondary.main,
        };
      case UserRole.UNIT_MANAGER:
        return {
          bg: alpha(theme.palette.info.main, 0.1),
          color: theme.palette.info.main,
        };
      default:
        return {
          bg: alpha(theme.palette.grey[500], 0.1),
          color: theme.palette.grey[700],
        };
    }
  };

  const columns: Column<User>[] = [
    {
      id: "name",
      label: "Name",
      sortable: true,
      render: (row) => (
        <Typography sx={userNameStyles}>
          {`${row.firstname} ${row.lastname}`}
        </Typography>
      ),
    },
    {
      id: "username",
      label: "Username",
      sortable: true,
      render: (row) => <Box sx={usernameStyles}>{row.username}</Box>,
    },
    {
      id: "email",
      label: "Email",
      sortable: true,
      render: (row) => (
        <Typography sx={userEmailStyles}>{row.email}</Typography>
      ),
    },
    {
      id: "role",
      label: "Role",
      sortable: true,
      render: (row) => {
        const config = getRoleConfig(row.role);
        return (
          <Box sx={roleBadgeStyles(config.bg, config.color)}>
            {row.role.replace("ROLE_", "").replace("_", " ")}
          </Box>
        );
      },
    },
    {
      id: "status",
      label: "Status",
      align: "center",
      sortable: true,
      render: (row) => {
        const config = getStatusConfig(row.active);
        return (
          <Box
            sx={statusBadgeStyles(config.bg as string, config.color as string)}
          >
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
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            gap: 1.5,
            alignItems: "center",
          }}
        >
          <Tooltip title={row.active ? "Deactivate User" : "Activate User"}>
            <Box onClick={(e) => e.stopPropagation()}>
              <HmuSwitch
                checked={row.active}
                onChange={() => handleOpenConfirm(row)}
                disabled={isToggling}
              />
            </Box>
          </Tooltip>

          <Box sx={{ display: "flex", gap: 0.5 }}>
            <Tooltip title="Edit User">
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
            <Tooltip title="Delete Permanently">
              <IconButton
                size="small"
                sx={{
                  ...actionButtonStyles,
                  color: theme.palette.error.main,
                  "&:hover": {
                    bgcolor: alpha(theme.palette.error.main, 0.08),
                    color: theme.palette.error.dark,
                  },
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  handleOpenDelete(row);
                }}
              >
                <DeleteIcon/>
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
      ),
    },
  ];

  const filters: FilterConfig<User>[] = [
    {
      id: "status",
      label: "Status",
      onFilter: (user, value) => {
        if (value === "active") return user.active;
        if (value === "inactive") return !user.active;
        return true;
      },
      options: [
        { label: "All Statuses", value: "all-statuses" },
        { label: "Active", value: "active" },
        { label: "Inactive", value: "inactive" },
      ],
    },
  ];

  const isDeleteConfirmed =
    deleteState.confirmText === deleteState.user?.username;

  return (
    <Box sx={tableWrapperStyles}>
      <HmuDataTable
        columns={columns}
        data={users}
        loading={isLoading}
        keyExtractor={(row) => row.id}
        onRowClick={onView}
        sorting={{
          orderBy: "name",
          order: "asc",
        }}
        search={{
          enabled: true,
          placeholder: "Search users, email, or username...",
          fields: ["firstname", "lastname", "username", "email"],
        }}
        filters={filters}
      />

      <HmuConfirmModal
        open={confirmState.isOpen}
        title={confirmState.user?.active ? "Deactivate User" : "Activate User"}
        message={`Are you sure you want to ${
          confirmState.user?.active ? "deactivate" : "activate"
        } user "${confirmState.user?.firstname} ${confirmState.user?.lastname}"?`}
        confirmLabel={confirmState.user?.active ? "Deactivate" : "Activate"}
        confirmVariant={confirmState.user?.active ? "danger" : "primary"}
        onConfirm={handleStatusToggle}
        onCancel={handleCloseConfirm}
        loading={isToggling}
      />

      {/* Permanent Delete Modal */}
      <Dialog
        open={deleteState.isOpen}
        onClose={handleCloseDelete}
        slotProps={{
          paper: {
            sx: {
              borderRadius: "16px",
              width: "100%",
              maxWidth: "400px",
              p: 1,
            },
          },
        }}
      >
        <Box sx={{ p: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 800, mb: 1 }}>
            Delete User Permanently
          </Typography>
          <Typography
            variant="body2"
            color="textSecondary"
            sx={{ mb: 3, lineHeight: 1.6 }}
          >
            Are you sure you want to delete user{" "}
            <strong>
              {deleteState.user?.firstname} {deleteState.user?.lastname}
            </strong>{" "}
            ({deleteState.user?.username})? This action cannot be undone.
          </Typography>

          <Box sx={{ mb: 3 }}>
            <Typography
              variant="caption"
              sx={{
                display: "block",
                mb: 1.5,
                fontWeight: 500,
                color: "text.secondary",
              }}
            >
              Please type the username below to confirm:
            </Typography>
            <Box
              sx={{
                mb: 2,
                p: 1.5,
                bgcolor: (theme) => alpha(theme.palette.error.main, 0.05),
                border: "1px dashed",
                borderColor: (theme) => alpha(theme.palette.error.main, 0.3),
                borderRadius: "8px",
                textAlign: "center",
              }}
            >
              <Typography
                variant="body1"
                sx={{
                  fontWeight: 700,
                  fontFamily: "'JetBrains Mono', monospace",
                  color: (theme) => theme.palette.error.main,
                  letterSpacing: "0.5px",
                }}
              >
                {deleteState.user?.username}
              </Typography>
            </Box>
            <HmuTextField
              fullWidth
              placeholder="Type username here"
              value={deleteState.confirmText}
              onChange={(e) =>
                setDeleteState((prev) => ({
                  ...prev,
                  confirmText: e.target.value,
                }))
              }
              autoFocus
            />
          </Box>

          <Box sx={{ display: "flex", gap: 1.5 }}>
            <HmuButton
              label="Cancel"
              variant="secondary"
              onClick={handleCloseDelete}
              disabled={isDeleting}
              sx={{ flex: 1 }}
            />
            <HmuButton
              label="Permanently Delete"
              variant="primary"
              onClick={handleDeletePermanent}
              loading={isDeleting}
              disabled={!isDeleteConfirmed}
              sx={{
                flex: 1.5,
                bgcolor: "#ef4444",
                "&:hover": { bgcolor: "#dc2626" },
                "&.Mui-disabled": {
                  bgcolor: alpha("#ef4444", 0.3),
                  color: alpha("#fff", 0.5),
                },
              }}
            />
          </Box>
        </Box>
      </Dialog>
    </Box>
  );
};

export default UsersTable;
