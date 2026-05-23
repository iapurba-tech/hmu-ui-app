import React, { useState } from "react";
import {
  Modal,
  Box,
  Typography,
  IconButton,
  TextField,
  InputAdornment,
  alpha,
} from "@mui/material";
import {
  ArrowForwardIcon,
  CheckCircleIcon,
  CloseIcon,
  GlobalIcon,
  OrganizationIcon,
  SearchIcon,
  ShieldIcon,
  LockIcon,
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
  unitStatsContainerStyles,
  statLabelStyles,
  statValueStyles,
  secureAccessBadgeStyles,
  unitStatusBadgeStyles,
  statusDotStyles,
} from "./WorkspaceModal.styles";
import { useGetUnits } from "../../../../shared/api/admin/unit/unit.hooks";
import { WorkspaceType } from "../../constants/workspace";
import { HmuButton } from "../../../../shared/components";
import { theme } from "../../../../shared/theme";
import { useNavigate } from "react-router-dom";

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

// Unified type for units in the modal to avoid TS errors
interface WorkspaceItem {
  id: string;
  name: string;
  code: string;
  active?: boolean;
  status?: string;
  dailyVolume?: string;
  mpcsUnits?: number;
  totalUnits?: number;
  activeUnits?: number;
  farmerCount?: string;
  totalFarmers?: string;
}

const getItemActiveStatus = (item: WorkspaceItem): boolean => {
  if (item.id === "global") return true;
  if (typeof item.active === "boolean") return item.active;
  return item.status === "active";
};

interface UnitCardProps {
  unit: WorkspaceItem;
  isSelected: boolean;
  onClick: () => void;
}

const UnitCard: React.FC<UnitCardProps> = ({ unit, isSelected, onClick }) => {
  const isGlobal = unit.id === "global";
  const isActive = getItemActiveStatus(unit);
  
  // Selection checkmark color logic
  let accentColor = isActive ? theme.palette.primary.main : theme.palette.error.main;
  if (isGlobal) accentColor = "#4F46E5";

  return (
    <Box sx={unitCardStyles(isSelected, isGlobal, isActive)} onClick={onClick}>
      <Box sx={iconBoxStyles(isGlobal, isActive)}>
        {isGlobal ? <GlobalIcon /> : <OrganizationIcon />}
      </Box>

      <Box sx={unitCardContentStyles}>
        <Box sx={unitCardHeaderStyles}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Typography sx={unitNameStyles}>{unit.name}</Typography>
            {!isActive && (
              <Box sx={{ 
                display: "flex", 
                alignItems: "center", 
                gap: 0.5, 
                color: theme.palette.error.main,
                bgcolor: alpha(theme.palette.error.main, 0.08),
                px: 1,
                py: 0.25,
                borderRadius: "4px",
                border: `1px solid ${alpha(theme.palette.error.main, 0.1)}`
              }}>
                <LockIcon sx={{ fontSize: "10px" }} />
                <Typography sx={{ fontSize: "9px", fontWeight: 700, textTransform: "uppercase" }}>
                  Restricted
                </Typography>
              </Box>
            )}
          </Box>
          {isSelected && (
            <CheckCircleIcon sx={{ color: accentColor }} fontSize="small" />
          )}
        </Box>

        <Box sx={unitMetaContainerStyles}>
          <Typography sx={unitCodeBadgeStyles(isGlobal, isActive)}>{unit.code}</Typography>
          {/* <Box sx={unitDotSeparatorStyles} /> */}
          <Box sx={unitStatusBadgeStyles(isActive)}>
            <Box sx={statusDotStyles(isActive)} />
            {isActive ? "Active" : "Inactive"}
          </Box>
        </Box>

        <Box sx={unitStatsContainerStyles}>
          <Box>
            <Typography sx={statLabelStyles}>Avg Daily Volume</Typography>
            <Typography sx={statValueStyles}>
              {isGlobal ? unit.dailyVolume : (unit.dailyVolume ?? "0.0 L")}
            </Typography>
          </Box>
          <Box>
            <Typography sx={statLabelStyles}>Total MPCS</Typography>
            <Typography sx={statValueStyles}>
              {isGlobal ? unit.totalUnits : (unit.mpcsUnits ?? 0)}
            </Typography>
          </Box>
          <Box>
            <Typography sx={statLabelStyles}>Member Farmers</Typography>
            <Typography sx={statValueStyles}>
              {isGlobal ? unit.totalFarmers : (unit.farmerCount ?? "0")}
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
  const navigate = useNavigate();

  const isSystemAdmin = user?.role === UserRole.SYSTEM_ADMIN;
  const { data: unitList } = useGetUnits({ enabled: isSystemAdmin });

  const globalAdmin: WorkspaceItem = {
    id: "global",
    name: "Global Administration",
    code: "SYSTEM",
    status: "active",
    totalUnits: unitList?.length || 0,
    activeUnits: unitList?.length || 0,
    totalFarmers: "12,450",
    dailyVolume: "525.4 KL",
  };

  const units: WorkspaceItem[] = isSystemAdmin
    ? [globalAdmin, ...(unitList || [])]
    : (user?.units || []).map(u => ({ ...u } as WorkspaceItem));

  const filteredUnits = units
    .filter(
      (unit) =>
        unit.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        unit.code.toLowerCase().includes(searchTerm.toLowerCase()),
    )
    .sort((a, b) => {
      // 1. Global always first
      if (a.id === "global") return -1;
      if (b.id === "global") return 1;

      const aActive = getItemActiveStatus(a);
      const bActive = getItemActiveStatus(b);

      // 2. Sort by active status (Active first)
      if (aActive && !bActive) return -1;
      if (!aActive && bActive) return 1;

      // 3. Alphabetical within same status
      return a.name.localeCompare(b.name);
    });

  const handleConfirm = () => {
    if (tempSelectedId === "global") {
      setActiveUnit(null);
      setWorkspace(WorkspaceType.SYSTEM_ADMIN);
    } else {
      const unit = units.find((u) => u.id === tempSelectedId);
      if (unit && unit.id !== "global") {
        // Safe cast to UserUnit as WorkspaceItem contains all required fields
        setActiveUnit(unit as any);
        setWorkspace(WorkspaceType.UNIT_MANAGEMENT);
      }
    }
    navigate("/dashboard");
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
        {units.length > 3 && (
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
