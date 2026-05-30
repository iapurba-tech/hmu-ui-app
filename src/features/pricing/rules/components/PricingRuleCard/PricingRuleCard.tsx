import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Button,
  IconButton,
  Tooltip,
  Grid,
} from "@mui/material";
import dayjs from "dayjs";
import {
  CalendarTodayIcon,
  HistoryIcon,
  EditIcon,
  AddIcon,
} from "../../../../../shared/icons";
import {
  useGetPricingRules,
  useCreatePricingRule,
} from "../../../../../shared/api/pricing/rule/pricing-rule.hooks";
import { useNotificationStore } from "../../../../../shared/store/useNotificationStore";
import {
  HmuTextField,
  HmuDatePicker,
  HmuConfirmModal,
} from "../../../../../shared/components";
import type { PricingRuleType } from "../../types/pricing-rule.types";
import { formatDate } from "../../../../../shared/utils";
import {
  cardStyles,
  cardHeaderStyles,
  titleStyles,
  rateDisplayContainerStyles,
  currentRateLabelStyles,
  rateValueStyles,
  effectiveDateStyles,
  actionAreaStyles,
  editFormStyles,
  editHeaderStyles,
  editButtonCancelStyles,
  viewHistoryButtonStyles,
  editIconButtonStyles,
} from "./PricingRuleCard.styles";

interface PricingRuleCardProps {
  type: PricingRuleType;
  title: string;
  showViewHistory?: boolean;
  disableNavigation?: boolean;
}

const PricingRuleCard: React.FC<PricingRuleCardProps> = ({
  type,
  title,
  showViewHistory = true,
  disableNavigation = false,
}) => {
  const navigate = useNavigate();
  const { showNotification } = useNotificationStore();
  const { data: rules = [], isLoading } = useGetPricingRules(type);
  const { mutate: createRule, isPending: isCreating } = useCreatePricingRule();

  const [isEditing, setIsEditing] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [editValues, setEditValues] = useState({
    rate: 0,
    effectiveFrom: dayjs().format("YYYY-MM-DD"),
  });

  const latestRule = rules.length > 0 ? rules[0] : null;

  const handleNavigate = () => {
    if (!isEditing && !disableNavigation) {
      navigate(type.toLowerCase());
    }
  };

  const handleStartEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (latestRule) {
      setEditValues({
        rate: latestRule.rate,
        effectiveFrom: dayjs().format("YYYY-MM-DD"),
      });
    } else {
      setEditValues({
        rate: 0,
        effectiveFrom: dayjs().format("YYYY-MM-DD"),
      });
    }
    setIsEditing(true);
  };

  const handleCancelEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsEditing(false);
  };

  const handleConfirmSave = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowConfirmModal(true);
  };

  const handleSave = () => {
    createRule(
      {
        ruleType: type,
        rate: Number(editValues.rate),
        effectiveFrom: editValues.effectiveFrom,
      },
      {
        onSuccess: () => {
          showNotification(`${title} updated successfully`, "success");
          setIsEditing(false);
          setShowConfirmModal(false);
        },
        onError: (error: any) => {
          showNotification(
            error?.response?.data?.message || `Failed to update ${title}`,
            "error",
          );
          setShowConfirmModal(false);
        },
      },
    );
  };

  return (
    <Box sx={cardStyles(type, isEditing)} onClick={handleNavigate}>
      {/* Card Header */}
      <Box sx={cardHeaderStyles(type)}>
        <Typography sx={titleStyles(type)}>{title}</Typography>
        {!isEditing && (
          <Tooltip title={latestRule ? "Update Rate" : "Set Initial Rate"}>
            <IconButton
              size="small"
              onClick={handleStartEdit}
              disabled={isLoading}
              sx={editIconButtonStyles}
            >
              {latestRule ? (
                <EditIcon fontSize="small" />
              ) : (
                <AddIcon fontSize="small" />
              )}
            </IconButton>
          </Tooltip>
        )}
      </Box>

      {/* Top Display Section */}
      <Box sx={rateDisplayContainerStyles(isEditing)}>
        {isEditing ? (
          <Box sx={editFormStyles} onClick={(e) => e.stopPropagation()}>
            <Typography variant="caption" sx={editHeaderStyles}>
              Quick Update
            </Typography>
            <Grid container spacing={1.5}>
              <Grid size={12}>
                <HmuTextField
                  id="rate-input"
                  label="Rate (₹)"
                  type="number"
                  fullWidth
                  value={editValues.rate}
                  onChange={(e) =>
                    setEditValues((prev) => ({
                      ...prev,
                      rate: Number(e.target.value),
                    }))
                  }
                  autoFocus
                />
              </Grid>
              <Grid size={12}>
                <HmuDatePicker
                  label="Effective From"
                  value={dayjs(editValues.effectiveFrom)}
                  onChange={(date: dayjs.Dayjs | null) =>
                    setEditValues((prev) => ({
                      ...prev,
                      effectiveFrom: date?.format("YYYY-MM-DD") || "",
                    }))
                  }
                  minDate={dayjs()}
                />
              </Grid>
            </Grid>
            <Box sx={{ display: "flex", gap: 1, mt: 1 }}>
              <Button
                variant="contained"
                size="small"
                fullWidth
                disableElevation
                onClick={handleConfirmSave}
                disabled={isCreating}
              >
                Save
              </Button>
              <Button
                variant="outlined"
                size="small"
                fullWidth
                color="inherit"
                onClick={handleCancelEdit}
                disabled={isCreating}
                sx={editButtonCancelStyles}
              >
                Cancel
              </Button>
            </Box>
          </Box>
        ) : (
          <>
            <Typography sx={currentRateLabelStyles}>Current Rate</Typography>
            <Typography sx={rateValueStyles}>
              <span className="currency">₹</span>
              {latestRule ? latestRule.rate.toFixed(2) : "0.00"}
            </Typography>
            {latestRule && (
              <Typography sx={effectiveDateStyles}>
                <CalendarTodayIcon sx={{ fontSize: "0.9rem" }} />
                Since {formatDate(latestRule.effectiveFrom)}
              </Typography>
            )}
          </>
        )}
      </Box>

      {/* Action Area */}
      {!isEditing && (
        <Box sx={actionAreaStyles}>
          {showViewHistory ? (
            <Button
              variant="outlined"
              size="small"
              fullWidth
              startIcon={<HistoryIcon sx={{ fontSize: "1rem" }} />}
              onClick={(e) => {
                e.stopPropagation();
                handleNavigate();
              }}
              sx={viewHistoryButtonStyles}
            >
              View History
            </Button>
          ) : (
            <Button
              variant="outlined"
              size="small"
              fullWidth
              startIcon={<EditIcon sx={{ fontSize: "1rem" }} />}
              onClick={handleStartEdit}
              sx={viewHistoryButtonStyles}
            >
              Update Rate
            </Button>
          )}
        </Box>
      )}

      <HmuConfirmModal
        open={showConfirmModal}
        title="Confirm Quick Update"
        message={
          <span>
            Are you sure you want to update the <strong>{title}</strong> rate to{" "}
            <strong>₹{editValues.rate.toFixed(2)}</strong>? This change will be
            effective from{" "}
            <strong>{formatDate(editValues.effectiveFrom)}</strong>.
          </span>
        }
        onConfirm={handleSave}
        onCancel={() => setShowConfirmModal(false)}
        loading={isCreating}
      />
    </Box>
  );
};

export default PricingRuleCard;
