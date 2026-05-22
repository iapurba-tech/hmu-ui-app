import React, { useState } from "react";
import { Box, Typography } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

import { HmuButton } from "../../../../shared/components";
import { palette } from "../../../../shared/theme";
import {
  pageContainerStyles,
  pageHeaderStyles,
  pageTitleStyles,
} from "./UsersPage.styles";
import { useGetUsers } from "../../../../shared/api/admin/admin.hooks";
import type { User } from "../types/user.types";
import { UserModal, UsersTable } from "../components";

const UsersPage: React.FC = () => {
  // API Data
  const { data: users = [], isLoading } = useGetUsers();

  // Modal State
  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    mode: "create" | "edit" | "view";
    selectedUser: User | null;
  }>({
    isOpen: false,
    mode: "create",
    selectedUser: null,
  });

  const handleOpenModal = (
    mode: "create" | "edit" | "view",
    user: User | null = null,
  ) => {
    setModalState({
      isOpen: true,
      mode,
      selectedUser: user,
    });
  };

  const handleCloseModal = () => {
    setModalState((prev) => ({ ...prev, isOpen: false }));
  };

  return (
    <Box sx={pageContainerStyles}>
      {/* Header */}
      <Box sx={pageHeaderStyles}>
        <Box>
          <Typography variant="h5" sx={pageTitleStyles}>
            User Management
          </Typography>
          <Typography
            variant="body2"
            sx={{ color: palette.text.secondary, mt: 0.5 }}
          >
            Manage and monitor system users, administrators and their roles.
          </Typography>
        </Box>
        <HmuButton
          label="Add New User"
          startIcon={<AddIcon />}
          onClick={() => handleOpenModal("create")}
          sx={{ px: 2, py: 1, borderRadius: "8px", height: "fit-content" }}
        />
      </Box>

      {/* Table Section */}
      <UsersTable
        users={users}
        isLoading={isLoading}
        onView={(user) => handleOpenModal("view", user)}
        onEdit={(user) => handleOpenModal("edit", user)}
      />

      <UserModal
        open={modalState.isOpen}
        onClose={handleCloseModal}
        mode={modalState.mode}
        user={modalState.selectedUser}
      />
    </Box>
  );
};

export default UsersPage;
