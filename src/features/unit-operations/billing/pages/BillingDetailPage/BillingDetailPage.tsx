import React, { useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Box, Typography, Paper, Grid, Stack } from "@mui/material";
import { palette } from "../../../../../shared/theme";
import {
  useGetBillingRun,
  useGetBillingInvoices,
} from "../../../../../shared/api/unit/billing/billing.hooks";
import { useGetMpcsList } from "../../../../../shared/api/unit/mpcs/mpcs.hooks";
import InvoiceTable from "../../components/InvoiceTable";
import { HmuLoader, HmuBreadcrumb, HmuButton } from "../../../../../shared/components";
import { ArrowBackIcon } from "../../../../../shared/icons";
import dayjs from "dayjs";

const BillingDetailPage: React.FC = () => {
  const { runId } = useParams<{ runId: string }>();
  const navigate = useNavigate();
  
  const { data: run, isLoading: isRunLoading } = useGetBillingRun(runId!);
  const { data: invoices = [], isLoading: isInvoicesLoading } = useGetBillingInvoices(runId!);
  const { data: mpcsList = [] } = useGetMpcsList();

  const mpcsMap = useMemo(() => {
    const map: Record<string, string> = {};
    mpcsList.forEach((m) => {
      map[m.id] = m.name;
    });
    return map;
  }, [mpcsList]);

  const breadcrumbItems = [
    { label: "Billing", path: "/unit/billing/runs" },
    { label: "Invoice Details" },
  ];

  if (isRunLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
        <HmuLoader size={40} />
      </Box>
    );
  }

  if (!run) {
    return (
      <Box sx={{ p: 4 }}>
        <Typography variant="h6" color="error">
          Billing run not found.
        </Typography>
        <HmuButton
          label="Back to Billing"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate("/unit/billing/runs")}
          sx={{ mt: 2 }}
        />
      </Box>
    );
  }

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <HmuBreadcrumb items={breadcrumbItems} />
        <HmuButton
          label="Back"
          variant="text"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate("/unit/billing/runs")}
          sx={{ color: palette.text.secondary }}
        />
      </Stack>

      <Box>
        <Typography variant="h5" fontWeight={900}>
          Billing Run Details
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Summary and invoices for the period {dayjs(run.periodStartDate).format("DD MMM, YYYY")} to {dayjs(run.periodEndDate).format("DD MMM, YYYY")}
        </Typography>
      </Box>

      <Paper
        elevation={0}
        sx={{
          p: 3,
          borderRadius: "12px",
          border: `1px solid ${palette.divider}`,
          backgroundColor: palette.background.paper,
        }}
      >
        <Grid container spacing={4}>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Stack spacing={0.5}>
              <Typography variant="caption" color="text.secondary" fontWeight={700} sx={{ textTransform: 'uppercase' }}>
                Status
              </Typography>
              <Typography variant="body1" fontWeight={600}>
                {run.status}
              </Typography>
            </Stack>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Stack spacing={0.5}>
              <Typography variant="caption" color="text.secondary" fontWeight={700} sx={{ textTransform: 'uppercase' }}>
                Period Start
              </Typography>
              <Typography variant="body1" fontWeight={600}>
                {dayjs(run.periodStartDate).format("DD/MM/YYYY")}
              </Typography>
            </Stack>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Stack spacing={0.5}>
              <Typography variant="caption" color="text.secondary" fontWeight={700} sx={{ textTransform: 'uppercase' }}>
                Period End
              </Typography>
              <Typography variant="body1" fontWeight={600}>
                {dayjs(run.periodEndDate).format("DD/MM/YYYY")}
              </Typography>
            </Stack>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Stack spacing={0.5}>
              <Typography variant="caption" color="text.secondary" fontWeight={700} sx={{ textTransform: 'uppercase' }}>
                Created At
              </Typography>
              <Typography variant="body1" fontWeight={600}>
                {dayjs(run.createdAt).format("DD/MM/YYYY HH:mm")}
              </Typography>
            </Stack>
          </Grid>
        </Grid>
      </Paper>

      <InvoiceTable
        invoices={invoices}
        isLoading={isInvoicesLoading}
        mpcsMap={mpcsMap}
      />
    </Box>
  );
};

export default BillingDetailPage;
