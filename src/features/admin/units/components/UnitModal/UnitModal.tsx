import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Box,
} from "@mui/material";
import UnitForm, { type UnitFormData } from "../UnitForm/UnitForm";
import {
  dialogStyles,
  dialogTitleStyles,
  dialogContentStyles,
} from "./UnitModal.styles";
import {
  useCreateUnit,
  useUpdateUnit,
} from "../../../../../shared/api/admin/admin.hooks";
import { CloseIcon } from "../../../../../shared/icons";
import type { Unit } from "../../types/unit.types";
import { useNotificationStore } from "../../../../../shared/store/useNotificationStore";
import { HmuBanner } from "../../../../../shared/components";

interface UnitModalProps {
  open: boolean;
  onClose: () => void;
  mode: "create" | "edit" | "view";
  unit?: Unit | null;
}

const UnitModal: React.FC<UnitModalProps> = ({ open, onClose, mode, unit }) => {
  const { mutate: createUnit, isPending: isCreating } = useCreateUnit();
  const { mutate: updateUnit, isPending: isUpdating } = useUpdateUnit();
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

  const handleSubmit = (data: UnitFormData) => {
    setLocalBanner(null);
    if (mode === "edit" && unit) {
      updateUnit(
        { ...data, id: unit.id },
        {
          onSuccess: () => {
            showNotification("Unit updated successfully", "success");
            onClose();
          },
          onError: (error: any) => {
            const message = error?.response?.data?.message || "Failed to update unit";
            setLocalBanner({ message, type: "error" });
          },
        },
      );
    } else {
      createUnit(data, {
        onSuccess: () => {
          showNotification("Unit created successfully", "success");
          onClose();
        },
        onError: (error: any) => {
          const message = error?.response?.data?.message || "Failed to create unit";
          setLocalBanner({ message, type: "error" });
        },
      });
    }
  };

  const getTitle = () => {
    switch (mode) {
      case "create":
        return "Add New Unit";
      case "edit":
        return "Edit Unit";
      case "view":
        return "Unit Details";
      default:
        return "Unit";
    }
  };

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
        <UnitForm
          mode={mode}
          onSubmit={handleSubmit}
          onCancel={onClose}
          isLoading={isPending}
          defaultValues={unit || undefined}
        />
      </DialogContent>
    </Dialog>
  );
};

export default UnitModal;
