import React, { useState } from "react";
import { Box, Typography, IconButton, Tooltip, alpha } from "@mui/material";

import {
  HmuDataTable,
  type Column,
  type FilterConfig,
  HmuConfirmModal,
  HmuSwitch,
} from "../../../../../shared/components";
import { UserDeleteModal } from "..";
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
import { EditIcon, DeleteIcon } from "../../../../../shared/icons";

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
  }>({
    isOpen: false,
    user: null,
  });

  const handleOpenConfirm = (user: User) => {
    setConfirmState({ isOpen: true, user });
  };

  const handleCloseConfirm = () => {
    setConfirmState({ isOpen: false, user: null });
  };

  const handleOpenDelete = (user: User) => {
    setDeleteState({ isOpen: true, user });
  };

  const handleCloseDelete = () => {
    setDeleteState({ isOpen: false, user: null });
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

  const handleDeletePermanent = (userId: string) => {
    deletePermanent(userId, {
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
                sx={{ transform: "scale(0.90)" }}
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
                <DeleteIcon fontSize="small" />
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
      <UserDeleteModal
        open={deleteState.isOpen}
        onClose={handleCloseDelete}
        onConfirm={handleDeletePermanent}
        user={deleteState.user}
        loading={isDeleting}
      />
    </Box>
  );
};

export default UsersTable;
