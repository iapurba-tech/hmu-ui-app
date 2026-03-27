import React, { useState } from "react";
import {
  Modal,
  Box,
  Typography,
  IconButton,
  TextField,
  InputAdornment,
} from "@mui/material";
import {
  ArrowForwardIcon,
  CheckCircleIcon,
  CloseIcon,
  GlobalIcon,
  OrganizationIcon,
  SearchIcon,
  ShieldIcon,
} from "../../../../shared/icons";
import { useAuthStore } from "../../../../shared/store/useAuthStore";
import { UserRole } from "../../constants/roles";
import {
  modalContainerStyles,
  headerStyles,
  technicalLabelStyles,
  searchContainerStyles,
  searchInputStyles,
  unitListStyles,
  unitCardStyles,
  iconBoxStyles,
  footerStyles,
  modalOverlayStyles,
  headerTitleSectionStyles,
  headerAccentStyles,
  headerTitleStyles,
  headerSubtitleStyles,
  closeButtonStyles,
  unitCardContentStyles,
  unitCardHeaderStyles,
  unitNameStyles,
  unitMetaContainerStyles,
  unitCodeBadgeStyles,
  unitDotSeparatorStyles,
  unitStatsContainerStyles,
  statLabelStyles,
  statValueStyles,
  secureAccessBadgeStyles,
} from "./WorkspaceModal.styles";
import { useGetUnits } from "../../../../shared/api/admin/admin.hooks";
import { WorkspaceType } from "../../constants/workspace";
import { HmuButton } from "../../../../shared/components";
import { theme } from "../../../../shared/theme/theme";

interface UnitSearchProps {
  value: string;
  onChange: (value: string) => void;
}

const UnitSearch: React.FC<UnitSearchProps> = ({ value, onChange }) => (
  <Box sx={searchContainerStyles}>
    <TextField
      fullWidth
      placeholder="Search by name, code or status..."
      value={value}
      onChange={(e) => onChange(e.target.value)}
      sx={searchInputStyles}
      slotProps={{
        input: {
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon sx={{ color: "#94a3b8", ml: 1 }} fontSize="small" />
            </InputAdornment>
          ),
        },
      }}
    />
  </Box>
);

interface UnitCardProps {
  unit: any;
  isSelected: boolean;
  onClick: () => void;
}

const UnitCard: React.FC<UnitCardProps> = ({ unit, isSelected, onClick }) => {
  const isGlobal = unit.id === "global";
  const color = unit.color || theme.palette.primary.main;

  return (
    <Box sx={unitCardStyles(isSelected, color)} onClick={onClick}>
      <Box sx={iconBoxStyles(color)}>
        {isGlobal ? <GlobalIcon /> : <OrganizationIcon />}
      </Box>

      <Box sx={unitCardContentStyles}>
        <Box sx={unitCardHeaderStyles}>
          <Typography sx={unitNameStyles}>{unit.name}</Typography>
          {isSelected && (
            <CheckCircleIcon sx={{ color: color }} fontSize="small" />
          )}
        </Box>

        <Box sx={unitMetaContainerStyles}>
          <Typography sx={unitCodeBadgeStyles(color)}>{unit.code}</Typography>
          <Box sx={unitDotSeparatorStyles} />
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
            <Box
              sx={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                bgcolor: unit.status === "active" ? "#22c55e" : "#94a3b8",
              }}
            />
            <Typography
              sx={{
                fontSize: "10px",
                fontWeight: 700,
                color: unit.status === "active" ? "#16a34a" : "#64748b",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
              }}
            >
              {unit.status ?? "active"}
            </Typography>
          </Box>
        </Box>

        <Box sx={unitStatsContainerStyles}>
          <Box>
            <Typography sx={statLabelStyles}>Workspace Type</Typography>
            <Typography sx={statValueStyles}>
              {isGlobal ? "System" : "Unit"}
            </Typography>
          </Box>
          <Box>
            <Typography sx={statLabelStyles}>
              {isGlobal ? "Total Units" : "Total MPCS"}
            </Typography>
            <Typography sx={statValueStyles}>
              {isGlobal ? unit.totalUnits : (unit.mpcsUnits ?? 0)}
            </Typography>
          </Box>
          <Box>
            <Typography sx={statLabelStyles}>
              {isGlobal ? "Active Units" : "Daily Volume"}
            </Typography>
            <Typography sx={statValueStyles}>
              {isGlobal ? unit.activeUnits : (unit.dailyVolume ?? "0.0 L")}
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

interface WorkspaceModalProps {
  open: boolean;
  onClose: () => void;
}

const WorkspaceModal: React.FC<WorkspaceModalProps> = ({ open, onClose }) => {
  const { user, activeUnit, setActiveUnit, setWorkspace } = useAuthStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [tempSelectedId, setTempSelectedId] = useState<string | "global">(
    activeUnit?.id || "global",
  );

  const isSystemAdmin = user?.role === UserRole.SYSTEM_ADMIN;
  const { data: unitList } = useGetUnits({ enabled: isSystemAdmin });

  const globalAdmin = {
    id: "global",
    name: "Global Administration",
    code: "SYSTEM-ROOT",
    status: "active" as const,
    totalUnits: unitList?.length || 0,
    activeUnits: unitList?.length || 0,
    color: "#BC4800",
  };

  const units = isSystemAdmin
    ? [globalAdmin, ...(unitList || [])]
    : user?.units || [];

  const filteredUnits = units.filter(
    (unit) =>
      unit.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      unit.code.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const handleConfirm = () => {
    if (tempSelectedId === "global") {
      setActiveUnit(null);
      setWorkspace(WorkspaceType.SYSTEM_ADMIN);
    } else {
      const unit = units.find((u) => u.id === tempSelectedId);
      if (unit && unit.id !== "global") {
        setActiveUnit(unit);
        setWorkspace(WorkspaceType.UNIT_MANAGEMENT);
      }
    }
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      slotProps={{ backdrop: { sx: modalOverlayStyles } }}
    >
      <Box sx={modalContainerStyles}>
        {/* Header */}
        <Box sx={headerStyles}>
          <Box>
            <Box sx={headerTitleSectionStyles}>
              <Box sx={headerAccentStyles} />
              <Typography sx={technicalLabelStyles}>
                Access Management
              </Typography>
            </Box>
            <Typography variant="h5" sx={headerTitleStyles}>
              Select Workspace
            </Typography>
            <Typography variant="body2" sx={headerSubtitleStyles}>
              Switch between global administration and operational units.
            </Typography>
          </Box>
          <IconButton onClick={onClose} sx={closeButtonStyles}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>

        {/* Search - Visible only if more than 4 items */}
        {units.length > 4 && (
          <UnitSearch value={searchTerm} onChange={setSearchTerm} />
        )}

        {/* List */}
        <Box sx={unitListStyles}>
          {filteredUnits.map((item) => (
            <UnitCard
              key={item.id}
              unit={item}
              isSelected={tempSelectedId === item.id}
              onClick={() => setTempSelectedId(item.id)}
            />
          ))}
        </Box>

        {/* Footer */}
        <Box sx={footerStyles}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <Box sx={secureAccessBadgeStyles}>
              <ShieldIcon fontSize="small" />
            </Box>
            <Box>
              <Typography
                sx={{
                  fontSize: "10px",
                  fontWeight: 800,
                  color: "#0f172a",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                }}
              >
                User Verified
              </Typography>
              <Typography
                sx={{ fontSize: "9px", color: "#94a3b8", fontWeight: 600 }}
              >
                {user?.username}
              </Typography>
            </Box>
          </Box>
          <Box sx={{ display: "flex", gap: 1.5 }}>
            <HmuButton
              variant="text"
              label="Cancel"
              onClick={onClose}
              sx={{
                color: "#64748b",
                fontWeight: 700,
                fontSize: "14px",
                px: 3,
                "&:hover": { color: "#0f172a", bgcolor: "rgba(0,0,0,0.03)" },
              }}
            />
            <HmuButton
              variant="primary"
              label="Switch to Workspace"
              onClick={handleConfirm}
              rounded
              endIcon={<ArrowForwardIcon />}
              sx={{
                px: 3,
                py: 1.5,
                fontSize: "14px",
                boxShadow: "0 12px 24px -8px rgba(0, 119, 184, 0.4)",
                "&:hover": {
                  boxShadow: "0 16px 32px -12px rgba(0, 119, 184, 0.5)",
                },
              }}
            />
          </Box>
        </Box>
      </Box>
    </Modal>
  );
};

export default WorkspaceModal;
