import React, { useState, useCallback } from "react";
import { Box, Typography } from "@mui/material";
import { HmuButton } from "../../../../shared/components";
import { palette } from "../../../../shared/theme";
import {
  pageContainerStyles,
  pageHeaderStyles,
  pageTitleStyles,
} from "./MpcsPage.styles";
import { useGetMpcsList } from "../../../../shared/api/unit/mpcs/mpcs.hooks";
import type { Mpcs } from "../types/mpcs.types";
import { MpcsModal, MpcsTable } from "../components";
import { AddIcon } from "../../../../shared/icons";

const MpcsPage: React.FC = () => {
  const { data: mpcsList = [], isLoading } = useGetMpcsList();

  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    mode: "create" | "edit" | "view";
    selectedMpcs: Mpcs | null;
  }>({
    isOpen: false,
    mode: "create",
    selectedMpcs: null,
  });

  const handleOpenModal = useCallback(
    (mode: "create" | "edit" | "view", mpcs: Mpcs | null = null) => {
      setModalState({
        isOpen: true,
        mode,
        selectedMpcs: mpcs,
      });
    },
    [],
  );

  const handleCloseModal = useCallback(() => {
    setModalState((prev) => ({ ...prev, isOpen: false }));
  }, []);

  return (
    <Box sx={pageContainerStyles}>
      <Box sx={pageHeaderStyles}>
        <Box>
          <Typography variant="h5" sx={pageTitleStyles}>
            MPCS Management
          </Typography>
          <Typography
            variant="body2"
            sx={{ color: palette.text.secondary, mt: 0.5 }}
          >
            Manage Milk Producers Cooperative Societies (MPCS) and their configurations.
          </Typography>
        </Box>
        <HmuButton
          label="Add MPCS"
          startIcon={<AddIcon />}
          onClick={() => handleOpenModal("create")}
          sx={{ px: 2, py: 1, borderRadius: "8px", height: "fit-content" }}
        />
      </Box>

      <MpcsTable
        mpcsList={mpcsList}
        isLoading={isLoading}
        onView={(mpcs) => handleOpenModal("view", mpcs)}
        onEdit={(mpcs) => handleOpenModal("edit", mpcs)}
      />

      <MpcsModal
        open={modalState.isOpen}
        onClose={handleCloseModal}
        mode={modalState.mode}
        mpcs={modalState.selectedMpcs}
      />
    </Box>
  );
};

export default MpcsPage;
