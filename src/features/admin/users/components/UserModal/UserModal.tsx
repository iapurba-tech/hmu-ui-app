import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Box,
} from "@mui/material";
import UserForm, { type UserFormData } from "../UserForm/UserForm";
import {
  dialogStyles,
  dialogTitleStyles,
  dialogContentStyles,
} from "./UserModal.styles";
import {
  useCreateUser,
  useUpdateUser,
} from "../../../../../shared/api/admin/admin.hooks";
import { CloseIcon } from "../../../../../shared/icons";
import type { User } from "../../types/user.types";
import { useNotificationStore } from "../../../../../shared/store/useNotificationStore";
import { HmuBanner } from "../../../../../shared/components";

interface UserModalProps {
  open: boolean;
  onClose: () => void;
  mode: "create" | "edit" | "view";
  user?: User | null;
}

const UserModal: React.FC<UserModalProps> = ({ open, onClose, mode, user }) => {
  const { mutate: createUser, isPending: isCreating } = useCreateUser();
  const { mutate: updateUser, isPending: isUpdating } = useUpdateUser();
  const { showNotification } = useNotificationStore();
  const [localBanner, setLocalBanner] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  const isPending = isCreating || isUpdating;

  React.useEffect(() => {
    if (open) {
      setLocalBanner(null);
    }
  }, [open]);

  const handleSubmit = (data: UserFormData) => {
    setLocalBanner(null);
    if (mode === "edit" && user) {
      updateUser(
        { ...data, id: user.id },
        {
          onSuccess: () => {
            showNotification("User updated successfully", "success");
            onClose();
          },
          onError: (error: any) => {
            const message =
              error?.response?.data?.message || "Failed to update user";
            setLocalBanner({ message, type: "error" });
          },
        },
      );
    } else {
      createUser(data as any, {
        onSuccess: () => {
          showNotification("User created successfully", "success");
          onClose();
        },
        onError: (error: any) => {
          const message =
            error?.response?.data?.message || "Failed to create user";
          setLocalBanner({ message, type: "error" });
        },
      });
    }
  };

  const getTitle = () => {
    switch (mode) {
      case "create":
        return "Add New User";
      case "edit":
        return "Edit User";
      case "view":
        return "User Details";
      default:
        return "User";
    }
  };

  // Prepare default values for the form
  const defaultValues = user
    ? {
        ...user,
        unitIds: user.units?.map((u) => u.id) || [],
      }
    : undefined;

  return (
    <Dialog open={open} onClose={onClose} sx={dialogStyles}>
      <DialogTitle sx={dialogTitleStyles}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          {getTitle()}
          <IconButton onClick={onClose} size="small" disabled={isPending}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent sx={dialogContentStyles}>
        {localBanner && (
          <HmuBanner
            message={localBanner.message}
            type={localBanner.type}
            onClose={() => setLocalBanner(null)}
          />
        )}
        <UserForm
          mode={mode}
          onSubmit={handleSubmit}
          onCancel={onClose}
          isLoading={isPending}
          defaultValues={defaultValues as any}
        />
      </DialogContent>
    </Dialog>
  );
};

export default UserModal;
