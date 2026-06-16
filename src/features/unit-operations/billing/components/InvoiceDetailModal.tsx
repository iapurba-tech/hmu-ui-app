import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Divider,
  Grid,
  IconButton,
  Stack,
  Chip,
  alpha,
  CircularProgress,
} from "@mui/material";
import { CloseIcon, BankIcon, MpcsIcon, InvoiceIcon, PricingIcon, DownloadIcon } from "../../../../shared/icons";
import { palette } from "../../../../shared/theme";
import type { InvoiceDetailResponse } from "../types/billing.types";
import { HmuLoader } from "../../../../shared/components";
import dayjs from "dayjs";
import { pdf } from "@react-pdf/renderer";
import InvoicePDFDocument from "./InvoicePDFDocument";
import { useNotificationStore } from "../../../../shared/store/useNotificationStore";

interface InvoiceDetailModalProps {
  open: boolean;
  onClose: () => void;
  data: InvoiceDetailResponse | undefined;
  isLoading: boolean;
  mpcsName: string;
}

const InvoiceDetailModal: React.FC<InvoiceDetailModalProps> = ({
  open,
  onClose,
  data,
  isLoading,
  mpcsName,
}) => {
  const { showNotification } = useNotificationStore();
  const [isDownloading, setIsDownloading] = useState(false);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const handleDownload = async () => {
    if (!data) return;
    try {
      setIsDownloading(true);
      const blob = await pdf(<InvoicePDFDocument data={data} mpcsName={mpcsName} />).toBlob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `Invoice-${data.invoice.invoiceNumber}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      showNotification("Invoice downloaded successfully", "success");
    } catch (error) {
      console.error("Failed to download invoice:", error);
      showNotification("Failed to download invoice", "error");
    } finally {
      setIsDownloading(false);
    }
  };

  if (isLoading) {
    return (
      <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
        <DialogContent sx={{ py: 10, display: "flex", justifyContent: "center" }}>
          <HmuLoader size={40} />
        </DialogContent>
      </Dialog>
    );
  }

  if (!data) return null;

  const { invoice, collections, sales, pricing } = data;

  // Use the name from the invoice object if available, otherwise fallback to the prop
  const displayName = invoice.mpcsName || mpcsName;

  const CardPaper = ({ children, sx = {} }: { children: React.ReactNode, sx?: any }) => (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        borderRadius: "12px",
        border: `1px solid ${palette.divider}`,
        backgroundColor: palette.background.paper,
        ...sx
      }}
    >
      {children}
    </Paper>
  );

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="md" 
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: "16px",
          height: { xs: "100%", sm: "auto" },
          maxHeight: { xs: "100%", sm: "calc(100% - 64px)" },
          backgroundColor: palette.background.default
        }
      }}
    >
      <DialogTitle sx={{ 
        display: "flex", 
        justifyContent: "space-between", 
        alignItems: "center", 
        p: 3,
        borderBottom: `1px solid ${palette.divider}`,
        backgroundColor: palette.background.paper
      }}>
        <Stack direction="row" alignItems="center" spacing={1.5}>
          <Box sx={{ p: 1, borderRadius: 1.5, bgcolor: alpha(palette.primary.main, 0.1), color: "primary.main", display: "flex" }}>
            <InvoiceIcon fontSize="small" />
          </Box>
          <Typography variant="h6" fontWeight={800} color="text.primary">
            Invoice Details
          </Typography>
        </Stack>
        <Stack direction="row" spacing={1}>
          <IconButton 
            onClick={handleDownload} 
            size="small" 
            sx={{ bgcolor: alpha(palette.primary.main, 0.05), color: "primary.main" }}
            disabled={isDownloading}
          >
            {isDownloading ? <CircularProgress size={20} color="inherit" /> : <DownloadIcon fontSize="small" />}
          </IconButton>
          <IconButton onClick={onClose} size="small" sx={{ bgcolor: alpha(palette.text.primary, 0.05) }}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </Stack>
      </DialogTitle>

      <DialogContent sx={{ p: 3 }}>
        <Stack spacing={3}>
          
          {/* Block 1: Header / MPCS / Bank / Invoice Info */}
          <CardPaper>
            <Grid container spacing={4} alignItems="flex-start">
              <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                <Stack direction="row" spacing={1.5} alignItems="flex-start">
                  <MpcsIcon color="action" />
                  <Box>
                    <Typography variant="caption" fontWeight={700} color="text.secondary" sx={{ textTransform: "uppercase" }}>
                      Billed To
                    </Typography>
                    <Typography variant="subtitle1" fontWeight={800} color="text.primary">
                      {displayName}
                    </Typography>
                  </Box>
                </Stack>
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                <Stack direction="row" spacing={1.5} alignItems="flex-start">
                  <BankIcon color="action" />
                  <Box>
                    <Typography variant="caption" fontWeight={700} color="text.secondary" sx={{ textTransform: "uppercase" }}>
                      Bank Account
                    </Typography>
                    <Typography variant="body2" fontWeight={700} color="text.primary">
                      {invoice.bankName || "N/A"}
                    </Typography>
                    <Typography variant="body2" sx={{ fontFamily: "monospace" }}>
                      {invoice.bankAccountNumber} {invoice.bankIfscCode && `| ${invoice.bankIfscCode}`}
                    </Typography>
                  </Box>
                </Stack>
              </Grid>
              <Grid size={{ xs: 12, md: 4 }}>
                <Stack spacing={1}>
                  <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                    <Typography variant="body2" color="text.secondary">Invoice Number</Typography>
                    <Typography variant="body2" fontWeight={700} sx={{ fontFamily: "monospace" }}>{invoice.invoiceNumber}</Typography>
                  </Box>
                  <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                    <Typography variant="body2" color="text.secondary">Generated On</Typography>
                    <Typography variant="body2" fontWeight={700}>{dayjs(invoice.createdAt).format("DD MMM YYYY, HH:mm")}</Typography>
                  </Box>
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <Typography variant="body2" color="text.secondary">Status</Typography>
                    <Chip label={invoice.status} size="small" color={invoice.status === "GENERATED" ? "success" : "warning"} sx={{ fontWeight: 800 }} />
                  </Box>
                </Stack>
              </Grid>
            </Grid>
          </CardPaper>

          {/* Block 2: Effective Pricing Chart */}
          <CardPaper>
            <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 3 }}>
              <PricingIcon fontSize="small" color="action" />
              <Typography variant="subtitle2" fontWeight={800} color="text.primary">
                Effective Rates Applied
              </Typography>
            </Stack>
            <Grid container spacing={3}>
              <Grid size={{ xs: 6, sm: 3 }}>
                <Box sx={{ p: 2, bgcolor: alpha(palette.primary.main, 0.03), borderRadius: "8px", border: `1px solid ${alpha(palette.primary.main, 0.1)}` }}>
                  <Typography variant="caption" color="text.secondary" fontWeight={600} display="block" mb={0.5}>Fat Rate</Typography>
                  <Typography variant="h6" fontWeight={800}>{formatCurrency(pricing?.effectiveFatRate || 0)} <Typography component="span" variant="caption" color="text.secondary">/kg</Typography></Typography>
                </Box>
              </Grid>
              <Grid size={{ xs: 6, sm: 3 }}>
                <Box sx={{ p: 2, bgcolor: alpha(palette.primary.main, 0.03), borderRadius: "8px", border: `1px solid ${alpha(palette.primary.main, 0.1)}` }}>
                  <Typography variant="caption" color="text.secondary" fontWeight={600} display="block" mb={0.5}>SNF Rate</Typography>
                  <Typography variant="h6" fontWeight={800}>{formatCurrency(pricing?.effectiveSnfRate || 0)} <Typography component="span" variant="caption" color="text.secondary">/kg</Typography></Typography>
                </Box>
              </Grid>
              <Grid size={{ xs: 6, sm: 3 }}>
                <Box sx={{ p: 2, bgcolor: alpha(palette.primary.main, 0.03), borderRadius: "8px", border: `1px solid ${alpha(palette.primary.main, 0.1)}` }}>
                  <Typography variant="caption" color="text.secondary" fontWeight={600} display="block" mb={0.5}>Commission</Typography>
                  <Typography variant="h6" fontWeight={800}>{formatCurrency(pricing?.effectiveCommissionRate || 0)}</Typography>
                </Box>
              </Grid>
              <Grid size={{ xs: 6, sm: 3 }}>
                <Box sx={{ p: 2, bgcolor: alpha(palette.primary.main, 0.03), borderRadius: "8px", border: `1px solid ${alpha(palette.primary.main, 0.1)}` }}>
                  <Typography variant="caption" color="text.secondary" fontWeight={600} display="block" mb={0.5}>Incentive</Typography>
                  <Typography variant="h6" fontWeight={800}>{formatCurrency(pricing?.effectiveIncentiveRate || 0)}</Typography>
                </Box>
              </Grid>
            </Grid>
          </CardPaper>

          {/* Block 3: Collection Records */}
          <CardPaper>
            <Typography variant="subtitle1" fontWeight={800} color="text.primary" sx={{ mb: 2 }}>
              Milk Collections
            </Typography>
            <TableContainer sx={{ border: `1px solid ${palette.divider}`, borderRadius: "8px" }}>
              <Table size="small">
                <TableHead sx={{ backgroundColor: alpha(palette.primary.main, 0.03) }}>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 700 }}>Date</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Shift</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 700 }}>Qty (kg)</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 700 }}>Fat %</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 700 }}>SNF %</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 700 }}>Fat KG</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 700 }}>SNF KG</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {collections.map((col) => (
                    <TableRow key={col.id} hover>
                      <TableCell sx={{ fontWeight: 500 }}>{dayjs(col.collectionDate).format("DD MMM YYYY")}</TableCell>
                      <TableCell>
                        <Chip 
                          label={col.shift} 
                          size="small" 
                          sx={{ 
                            fontSize: "0.7rem", 
                            fontWeight: 700, 
                            backgroundColor: col.shift === "MORNING" ? "#FFF8E1" : "#E8EAF6", 
                            color: col.shift === "MORNING" ? "#F57C00" : "#3F51B5" 
                          }} 
                        />
                      </TableCell>
                      <TableCell align="right" sx={{ fontWeight: 600 }}>{col.quantity.toFixed(2)}</TableCell>
                      <TableCell align="right">{col.fatPercentage.toFixed(2)}</TableCell>
                      <TableCell align="right">{col.snfPercentage.toFixed(2)}</TableCell>
                      <TableCell align="right">{col.fatKg.toFixed(3)}</TableCell>
                      <TableCell align="right">{col.snfKg.toFixed(3)}</TableCell>
                    </TableRow>
                  ))}
                  {/* Collections Total Row */}
                  <TableRow sx={{ backgroundColor: alpha(palette.primary.main, 0.02) }}>
                    <TableCell colSpan={2} sx={{ fontWeight: 800, color: "primary.main" }}>Total</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 800, color: "primary.main" }}>{invoice.totalMilkQuantity.toFixed(2)}</TableCell>
                    <TableCell align="right" />
                    <TableCell align="right" />
                    <TableCell align="right" sx={{ fontWeight: 800, color: "primary.main" }}>{invoice.totalFatKg.toFixed(3)}</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 800, color: "primary.main" }}>{invoice.totalSnfKg.toFixed(3)}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </CardPaper>

          {/* Block 4: Sales Record */}
          {sales.length > 0 && (
            <CardPaper>
              <Box>
                <Typography variant="subtitle1" fontWeight={800} color="text.primary" sx={{ mb: 2 }}>
                  Product Sales Deductions
                </Typography>
                <TableContainer sx={{ border: `1px solid ${palette.divider}`, borderRadius: "8px" }}>
                  <Table size="small">
                    <TableHead sx={{ backgroundColor: alpha(palette.error.main, 0.03) }}>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 700 }}>Date</TableCell>
                        <TableCell sx={{ fontWeight: 700 }}>Product Name</TableCell>
                        <TableCell align="right" sx={{ fontWeight: 700 }}>Qty</TableCell>
                        <TableCell align="right" sx={{ fontWeight: 700 }}>Price</TableCell>
                        <TableCell align="right" sx={{ fontWeight: 700 }}>Total Deduction</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {sales.map((sale) => (
                        <TableRow key={sale.id} hover>
                          <TableCell>{dayjs(sale.saleDate).format("DD MMM YYYY")}</TableCell>
                          <TableCell sx={{ fontWeight: 600 }}>{sale.productName}</TableCell>
                          <TableCell align="right">{sale.quantity.toFixed(2)}</TableCell>
                          <TableCell align="right">{formatCurrency(sale.price)}</TableCell>
                          <TableCell align="right" sx={{ fontWeight: 600, color: "error.main" }}>{formatCurrency(sale.totalAmount)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>
            </CardPaper>
          )}

          {/* Block 5: Financial Summary / Calculations */}
          <CardPaper sx={{ backgroundColor: alpha(palette.primary.main, 0.03), border: `2px solid ${alpha(palette.primary.main, 0.2)}` }}>
            <Typography variant="h6" fontWeight={900} color="primary.main" sx={{ mb: 3 }}>
              Payment Summary
            </Typography>
            
            <Stack spacing={2.5}>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Typography variant="body1" color="text.secondary" fontWeight={600}>Base Milk Amount</Typography>
                <Typography variant="h6" fontWeight={700} color="text.primary">{formatCurrency(invoice.baseMilkAmount)}</Typography>
              </Box>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Typography variant="body1" color="text.secondary" fontWeight={600}>Total Additions (+)</Typography>
                <Typography variant="h6" color="success.main" fontWeight={700}>+{formatCurrency(invoice.totalAdditions)}</Typography>
              </Box>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Typography variant="body1" color="text.secondary" fontWeight={600}>Total Deductions (-)</Typography>
                <Typography variant="h6" color="error.main" fontWeight={700}>-{formatCurrency(invoice.totalDeductions)}</Typography>
              </Box>
              
              <Divider sx={{ borderStyle: "dashed", borderColor: alpha(palette.divider, 0.8) }} />
              
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", pt: 1 }}>
                <Typography variant="h5" fontWeight={900} color="text.primary">Net Payable Amount</Typography>
                <Typography variant="h4" fontWeight={900} color="primary.main">{formatCurrency(invoice.netPayableAmount)}</Typography>
              </Box>
            </Stack>
          </CardPaper>

        </Stack>
      </DialogContent>
    </Dialog>
  );
};

export default InvoiceDetailModal;
