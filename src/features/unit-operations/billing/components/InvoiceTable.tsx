import React, { useState } from "react";
import { Box, Typography, Tooltip, IconButton, Stack, CircularProgress, Chip } from "@mui/material";
import { HmuDataTable } from "../../../../shared/components";
import type { Column } from "../../../../shared/components/HmuDataTable/HmuDataTable";
import type { BillingInvoice } from "../types/billing.types";
import { palette } from "../../../../shared/theme";
import { CopyIcon, VisibilityIcon, DownloadIcon } from "../../../../shared/icons";
import { useNotificationStore } from "../../../../shared/store/useNotificationStore";
import { useGetInvoiceDetail } from "../../../../shared/api/unit/billing/billing.hooks";
import { billingApi } from "../../../../shared/api/unit/billing/billing.api";
import { useQueryClient } from "@tanstack/react-query";
import { pdf } from "@react-pdf/renderer";
import InvoiceDetailModal from "./InvoiceDetailModal";
import InvoicePDFDocument from "./InvoicePDFDocument";

interface InvoiceTableProps {
  invoices: BillingInvoice[];
  isLoading: boolean;
  mpcsMap: Record<string, string>;
}

const InvoiceTable: React.FC<InvoiceTableProps> = ({
  invoices,
  isLoading,
  mpcsMap,
}) => {
  const { showNotification } = useNotificationStore();
  const queryClient = useQueryClient();
  const [selectedInvoiceId, setSelectedInvoiceId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  const { data: invoiceDetail, isLoading: isDetailLoading } = useGetInvoiceDetail(selectedInvoiceId);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    showNotification("Invoice number copied to clipboard", "success");
  };

  const handleViewDetail = (id: string) => {
    setSelectedInvoiceId(id);
    setIsModalOpen(true);
  };

  const handleDownloadInvoice = async (id: string, mpcsName: string) => {
    try {
      setDownloadingId(id);
      const detail = await queryClient.fetchQuery({
        queryKey: ["billing", "invoice", id, "detail"],
        queryFn: () => billingApi.getInvoiceDetail(id),
      });

      const blob = await pdf(<InvoicePDFDocument data={detail} mpcsName={mpcsName} />).toBlob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `Invoice-${detail.invoice.invoiceNumber}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      showNotification("Invoice downloaded successfully", "success");
    } catch (error) {
      console.error("Failed to download invoice:", error);
      showNotification("Failed to download invoice", "error");
    } finally {
      setDownloadingId(null);
    }
  };

  const columns: Column<BillingInvoice>[] = [
    {
      id: "invoiceNumber",
      label: "Invoice #",
      width: "180px",
      render: (row) => (
        <Stack direction="row" alignItems="center" spacing={0.5}>
          <Tooltip title={row.invoiceNumber}>
            <Typography
              variant="body2"
              sx={{
                fontFamily: "monospace",
                fontWeight: 600,
                color: "text.primary",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                maxWidth: "120px",
              }}
            >
              {row.invoiceNumber}
            </Typography>
          </Tooltip>
          <Tooltip title="Copy Invoice Number">
            <IconButton
              size="small"
              onClick={() => handleCopy(row.invoiceNumber)}
              sx={{ color: "text.secondary", padding: "4px" }}
            >
              <CopyIcon sx={{ fontSize: "1rem" }} />
            </IconButton>
          </Tooltip>
        </Stack>
      ),
    },
    {
      id: "mpcsId",
      label: "MPCS Name",
      render: (row) => {
        const name = mpcsMap[row.mpcsId] || row.mpcsId;
        return (
          <Tooltip title={name}>
            <Typography variant="body2" noWrap sx={{ maxWidth: "200px" }}>
              {name}
            </Typography>
          </Tooltip>
        );
      },
    },
    {
      id: "totalMilkQuantity",
      label: "Total Qty",
      align: "right",
      render: (row) => (
        <Typography variant="body2">
          {row.totalMilkQuantity.toFixed(2)}
        </Typography>
      ),
    },
    {
      id: "grossAmount",
      label: "Gross Amount",
      align: "right",
      render: (row) => {
        const gross = row.baseMilkAmount + row.totalAdditions;
        return (
          <Typography variant="body2">{formatCurrency(gross)}</Typography>
        );
      },
    },
    {
      id: "totalDeductions",
      label: "Deduction",
      align: "right",
      render: (row) => (
        <Typography variant="body2" color="error.main">
          {formatCurrency(row.totalDeductions)}
        </Typography>
      ),
    },
    {
      id: "netPayableAmount",
      label: "Net Payable",
      align: "right",
      render: (row) => (
        <Typography variant="body2" fontWeight={700} color="primary.main">
          {formatCurrency(row.netPayableAmount)}
        </Typography>
      ),
    },
    {
      id: "status",
      label: "Status",
      align: "center",
      render: (row) => (
        <Chip
          label={row.status}
          size="small"
          variant="outlined"
          color={row.status === "GENERATED" ? "success" : "default"}
        />
      ),
    },
    {
      id: "actions",
      label: "Actions",
      align: "center",
      render: (row) => (
        <Stack direction="row" spacing={1} justifyContent="center">
          <Tooltip title="Download PDF">
            <span>
              <IconButton
                size="small"
                onClick={() => handleDownloadInvoice(row.id, mpcsMap[row.mpcsId] || row.mpcsId)}
                sx={{ color: "text.secondary" }}
                disabled={downloadingId === row.id}
              >
                {downloadingId === row.id ? (
                  <CircularProgress size={16} color="inherit" />
                ) : (
                  <DownloadIcon fontSize="small" />
                )}
              </IconButton>
            </span>
          </Tooltip>
          <Tooltip title="View Detailed Invoice">
            <IconButton
              size="small"
              onClick={() => handleViewDetail(row.id)}
              sx={{ color: "primary.main" }}
            >
              <VisibilityIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Stack>
      ),
    },
  ];

  return (
    <Box
      sx={{
        mt: 3,
        pt: 3,
        borderTop: `1px solid ${palette.divider}`,
      }}
    >
      <Box sx={{ mb: 2 }}>
        <Typography variant="h6" fontWeight={700}>
          Generated Invoices
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Detailed breakdown of payments for each MPCS in this billing run.
        </Typography>
      </Box>
      <HmuDataTable
        columns={columns}
        data={invoices}
        keyExtractor={(row) => row.id}
        loading={isLoading}
        emptyMessage="No invoices generated for this run"
        search={{
          enabled: true,
          placeholder: "Search by Invoice # or MPCS...",
          fields: ["invoiceNumber"],
        }}
      />

      <InvoiceDetailModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        data={invoiceDetail}
        isLoading={isDetailLoading}
        mpcsName={selectedInvoiceId ? (mpcsMap[invoices.find(i => i.id === selectedInvoiceId)?.mpcsId || ""] || "Unknown MPCS") : ""}
      />
    </Box>
  );
};

export default InvoiceTable;
