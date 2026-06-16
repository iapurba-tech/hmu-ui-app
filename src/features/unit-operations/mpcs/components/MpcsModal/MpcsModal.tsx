import React, { useCallback } from "react";
import { Dialog, DialogTitle, DialogContent } from "@mui/material";
import {
  dialogStyles,
  dialogTitleStyles,
  dialogContentStyles,
} from "./MpcsModal.styles";
import MpcsForm from "../MpcsForm/MpcsForm";
import type { Mpcs, MpcsFormValues } from "../../types/mpcs.types";
import {
  useCreateMpcs,
  useUpdateMpcsDetails,
  useUpdateMpcsConfiguration,
} from "../../../../../shared/api/unit/mpcs/mpcs.hooks";

interface MpcsModalProps {
  open: boolean;
  onClose: () => void;
  mode: "create" | "edit" | "view";
  mpcs: Mpcs | null;
}

const MpcsModal: React.FC<MpcsModalProps> = ({ open, onClose, mode, mpcs }) => {
  const { mutate: createMpcs, isPending: isCreating } = useCreateMpcs();
  const { mutate: updateDetails, isPending: isUpdatingDetails } =
    useUpdateMpcsDetails();
  const { mutate: updateConfig, isPending: isUpdatingConfig } =
    useUpdateMpcsConfiguration();

  const isViewMode = mode === "view";
  const isLoading = isCreating || isUpdatingDetails || isUpdatingConfig;

  const getTitle = () => {
    if (isViewMode) return "MPCS Details";
    return mode === "create" ? "Add New MPCS" : "Edit MPCS";
  };

  const handleSubmit = useCallback(
    async (data: MpcsFormValues) => {
      if (mode === "create") {
        createMpcs(data, {
          onSuccess: () => onClose(),
        });
      } else if (mode === "edit" && mpcs) {
        // For edit, we need to call both details and configuration updates
        const detailsData = {
          name: data.name,
          contactPerson: data.contactPerson,
          contactNumber: data.contactNumber,
          contactEmail: data.contactEmail,
          bankAccountNumber: data.bankAccountNumber,
          bankIfsc: data.bankIfsc,
          bankName: data.bankName,
          address: data.address,
          payoutBankId: data.payoutBankId,
          headLoadCategoryId: data.headLoadCategoryId,
          registrationDate: data.registrationDate,
          closureDate: data.closureDate,
        };

        const configData = {
          active: data.active,
          paymentPaused: data.paymentPaused,
          subsidyAllowed: data.subsidyAllowed,
          headLoadAllowed: data.headLoadAllowed,
          incentiveAllowed: data.incentiveAllowed,
          commissionAllowed: data.commissionAllowed,
        };

        // We can run these in parallel or sequence.
        // Using Promise.all with mutateAsync if we want to wait for both.
        // But here we use mutate with onSuccess.

        updateDetails(
          { id: mpcs.id, data: detailsData },
          {
            onSuccess: () => {
              updateConfig(
                { id: mpcs.id, data: configData },
                {
                  onSuccess: () => onClose(),
                },
              );
            },
          },
        );
      }
    },
    [mode, mpcs, createMpcs, updateDetails, updateConfig, onClose],
  );

  return (
    <Dialog open={open} onClose={onClose} sx={dialogStyles} scroll="body">
      <DialogTitle sx={dialogTitleStyles}>{getTitle()}</DialogTitle>
      <DialogContent sx={dialogContentStyles}>
        <MpcsForm
          mode={mode}
          onSubmit={handleSubmit}
          onCancel={onClose}
          isLoading={isLoading}
          defaultValues={mpcs || undefined}
        />
      </DialogContent>
    </Dialog>
  );
};

export default MpcsModal;
