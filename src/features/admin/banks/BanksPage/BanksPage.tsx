import React, { useState, useCallback } from "react";
import { Box, Typography } from "@mui/material";
import { HmuButton } from "../../../../shared/components";
import { palette } from "../../../../shared/theme";
import {
  pageContainerStyles,
  pageHeaderStyles,
  pageTitleStyles,
} from "./BanksPage.styles";
import { useGetBankAccounts } from "../../../../shared/api/admin/bank/bank.hooks";
import type { Bank } from "../types/bank.types";
import { BankModal, BanksTable } from "../components";
import { AddIcon } from "../../../../shared/icons";

const BanksPage: React.FC = () => {

  const { data: banks = [], isLoading } = useGetBankAccounts();

  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    mode: "create" | "edit" | "view";
    selectedBank: Bank | null;
  }>({
    isOpen: false,
    mode: "create",
    selectedBank: null,
  });

  const handleOpenModal = useCallback((
    mode: "create" | "edit" | "view",
    bank: Bank | null = null,
  ) => {
    setModalState({
      isOpen: true,
      mode,
      selectedBank: bank,
    });
  }, []);

  const handleCloseModal = useCallback(() => {
    setModalState((prev) => ({ ...prev, isOpen: false }));
  }, []);

  return (
    <Box sx={pageContainerStyles}>
      <Box sx={pageHeaderStyles}>
        <Box>
          <Typography variant="h5" sx={pageTitleStyles}>
            Bank Management
          </Typography>
          <Typography
            variant="body2"
            sx={{ color: palette.text.secondary, mt: 0.5 }}
          >
            Manage bank accounts associated with various units and plants.
          </Typography>
        </Box>
        <HmuButton
          label="Add Bank Account"
          startIcon={<AddIcon />}
          onClick={() => handleOpenModal("create")}
          sx={{ px: 2, py: 1, borderRadius: "8px", height: "fit-content" }}
        />
      </Box>

      <BanksTable
        banks={banks}
        isLoading={isLoading}
        onView={(bank) => handleOpenModal("view", bank)}
        onEdit={(bank) => handleOpenModal("edit", bank)}
      />

      <BankModal
        open={modalState.isOpen}
        onClose={handleCloseModal}
        mode={modalState.mode}
        bank={modalState.selectedBank}
      />
    </Box>
  );
};

export default BanksPage;
