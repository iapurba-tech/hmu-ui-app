import React, { useState } from "react";
import { Box, Typography } from "@mui/material";

import { HmuButton } from "../../../../shared/components";
import { palette } from "../../../../shared/theme";
import {
  pageContainerStyles,
  pageHeaderStyles,
  pageTitleStyles,
} from "./UnitsPage.styles";
import { useGetUnits } from "../../../../shared/api/admin/admin.hooks";
import type { Unit } from "../types/unit.types";
import { UnitModal, UnitsTable } from "../components";
import { AddIcon } from "../../../../shared/icons";

const UnitsPage: React.FC = () => {
  // API Data
  const { data: units = [], isLoading } = useGetUnits();

  // Modal State
  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    mode: "create" | "edit" | "view";
    selectedUnit: Unit | null;
  }>({
    isOpen: false,
    mode: "create",
    selectedUnit: null,
  });

  const handleOpenModal = (
    mode: "create" | "edit" | "view",
    unit: Unit | null = null,
  ) => {
    setModalState({
      isOpen: true,
      mode,
      selectedUnit: unit,
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
            Unit Management
          </Typography>
          <Typography
            variant="body2"
            sx={{ color: palette.text.secondary, mt: 0.5 }}
          >
            Manage and monitor all organizational units and chilling plants.
          </Typography>
        </Box>
        <HmuButton
          label="Add New Unit"
          startIcon={<AddIcon />}
          onClick={() => handleOpenModal("create")}
          sx={{ px: 2, py: 1, borderRadius: "8px", height: "fit-content" }}
        />
      </Box>

      {/* Table Section */}
      <UnitsTable
        units={units}
        isLoading={isLoading}
        onView={(unit) => handleOpenModal("view", unit)}
        onEdit={(unit) => handleOpenModal("edit", unit)}
      />

      <UnitModal
        open={modalState.isOpen}
        onClose={handleCloseModal}
        mode={modalState.mode}
        unit={modalState.selectedUnit}
      />
    </Box>
  );
};

export default UnitsPage;
