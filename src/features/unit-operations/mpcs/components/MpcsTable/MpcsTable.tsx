import React, { useState, useMemo } from "react";
import { Box, Typography, IconButton, Tooltip } from "@mui/material";
import { HmuDataTable, type Column } from "../../../../../shared/components";
import type { Mpcs } from "../../types/mpcs.types";
import {
  tableWrapperStyles,
  nameStyles,
  contactStyles,
  statusBadgeStyles,
  statusDotStyles,
  actionButtonStyles,
  deleteButtonStyles,
} from "./MpcsTable.styles";
import { useDeleteMpcs } from "../../../../../shared/api/unit/mpcs/mpcs.hooks";
import { EditIcon, DeleteIcon } from "../../../../../shared/icons";
import { MpcsDeleteModal } from "..";

interface MpcsTableProps {
  mpcsList: Mpcs[];
  isLoading: boolean;
  onView: (mpcs: Mpcs) => void;
  onEdit: (mpcs: Mpcs) => void;
}

const MpcsTable: React.FC<MpcsTableProps> = ({
  mpcsList,
  isLoading,
  onView,
  onEdit,
}) => {
  const { mutate: deleteMpcs, isPending: isDeleting } = useDeleteMpcs();
  const [deleteState, setDeleteState] = useState<{
    isOpen: boolean;
    mpcs: Mpcs | null;
  }>({
    isOpen: false,
    mpcs: null,
  });

  const handleOpenDelete = (mpcs: Mpcs) => {
    setDeleteState({ isOpen: true, mpcs });
  };

  const handleCloseDelete = () => {
    setDeleteState({ isOpen: false, mpcs: null });
  };

  const handleDelete = (id: string) => {
    deleteMpcs(id, {
      onSuccess: () => {
        handleCloseDelete();
      },
    });
  };

  const columns: Column<Mpcs>[] = useMemo(
    () => [
      {
        id: "name",
        label: "MPCS Name",
        sortable: true,
        render: (row) => (
          <Box>
            <Typography sx={nameStyles}>{row.name}</Typography>
            <Typography sx={contactStyles}>{row.contactPerson}</Typography>
          </Box>
        ),
      },
      {
        id: "contactNumber",
        label: "Contact",
        render: (row) => (
          <Box>
            <Typography sx={contactStyles}>{row.contactNumber}</Typography>
            {row.contactEmail && (
              <Typography sx={contactStyles}>{row.contactEmail}</Typography>
            )}
          </Box>
        ),
      },
      {
        id: "registrationDate",
        label: "Reg. Date",
        render: (row) => (
          <Typography sx={contactStyles}>{row.registrationDate}</Typography>
        ),
      },
      {
        id: "active",
        label: "Status",
        render: (row) => (
          <Box sx={statusBadgeStyles(row.active)}>
            <Box sx={statusDotStyles(row.active)} />
            {row.active ? "Active" : "Inactive"}
          </Box>
        ),
      },
      {
        id: "actions",
        label: "Actions",
        align: "right",
        render: (row) => (
          <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 0.5 }}>
            <Tooltip title="Edit MPCS">
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
            <Tooltip title="Delete MPCS">
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
    [onEdit],
  );

  return (
    <Box sx={tableWrapperStyles}>
      <HmuDataTable
        columns={columns}
        data={mpcsList}
        loading={isLoading}
        keyExtractor={(row) => row.id}
        onRowClick={onView}
        sorting={{
          orderBy: "name",
          order: "asc",
        }}
        search={{
          enabled: true,
          placeholder: "Search MPCS name, contact person or number...",
          fields: ["name", "contactPerson", "contactNumber"],
        }}
      />

      <MpcsDeleteModal
        open={deleteState.isOpen}
        onClose={handleCloseDelete}
        onConfirm={handleDelete}
        mpcs={deleteState.mpcs}
        loading={isDeleting}
      />
    </Box>
  );
};

export default MpcsTable;
