import React from "react";
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import type { InvoiceDetailResponse } from "../types/billing.types";
import dayjs from "dayjs";

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 10,
    fontFamily: "Helvetica",
    color: "#333",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 30,
  },
  headerLeft: {
    flexDirection: "column",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    fontFamily: "Helvetica-Bold",
    color: "#1976d2",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 10,
    color: "#666",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  headerRight: {
    flexDirection: "column",
    alignItems: "flex-end",
  },
  invoiceMetaLabel: {
    fontSize: 8,
    color: "#666",
    textTransform: "uppercase",
    marginBottom: 2,
  },
  invoiceMetaValue: {
    fontSize: 12,
    fontWeight: "bold",
    fontFamily: "Helvetica-Bold",
  },
  grid: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  gridCol: {
    width: "48%",
  },
  box: {
    padding: 12,
    border: "1pt solid #e0e0e0",
    borderRadius: 4,
  },
  boxTitle: {
    fontSize: 8,
    fontWeight: "bold",
    fontFamily: "Helvetica-Bold",
    color: "#666",
    textTransform: "uppercase",
    marginBottom: 8,
  },
  textBold: {
    fontWeight: "bold",
    fontFamily: "Helvetica-Bold",
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: "bold",
    fontFamily: "Helvetica-Bold",
    marginBottom: 8,
    color: "#1976d2",
  },
  table: {
    display: "flex",
    flexDirection: "column",
    border: "1pt solid #e0e0e0",
    borderRadius: 4,
    marginBottom: 20,
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#f5f5f5",
    borderBottom: "1pt solid #e0e0e0",
    padding: 8,
  },
  tableRow: {
    flexDirection: "row",
    borderBottom: "1pt solid #e0e0e0",
    padding: 8,
  },
  tableRowLast: {
    flexDirection: "row",
    padding: 8,
  },
  tableCell: {
    flex: 1,
  },
  tableCellRight: {
    flex: 1,
    textAlign: "right",
  },
  tableHeaderCell: {
    flex: 1,
    fontWeight: "bold",
    fontFamily: "Helvetica-Bold",
    color: "#666",
  },
  tableHeaderCellRight: {
    flex: 1,
    fontWeight: "bold",
    fontFamily: "Helvetica-Bold",
    textAlign: "right",
    color: "#666",
  },
  summaryContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  summaryBox: {
    padding: 16,
    backgroundColor: "#f0f7ff",
    borderRadius: 4,
    width: "50%",
    border: "1pt solid #bbdefb",
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  summaryDivider: {
    borderBottom: "1pt dashed #90caf9",
    marginVertical: 8,
  },
  summaryTotalText: {
    fontSize: 14,
    fontWeight: "bold",
    fontFamily: "Helvetica-Bold",
    color: "#1976d2",
  },
  footer: {
    position: "absolute",
    bottom: 40,
    left: 40,
    right: 40,
    borderTop: "1pt solid #e0e0e0",
    paddingTop: 10,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  terms: {
    width: "70%",
  },
  termsTitle: {
    fontSize: 8,
    fontWeight: "bold",
    fontFamily: "Helvetica-Bold",
    color: "#666",
    textTransform: "uppercase",
    marginBottom: 4,
  },
  termsText: {
    fontSize: 8,
    color: "#666",
    lineHeight: 1.5,
  },
  statusGenerated: {
    fontSize: 10,
    fontWeight: "bold",
    fontFamily: "Helvetica-Bold",
    color: "#2e7d32",
  },
  statusPending: {
    fontSize: 10,
    fontWeight: "bold",
    fontFamily: "Helvetica-Bold",
    color: "#ed6c02",
  },
});

interface InvoicePDFDocumentProps {
  data: InvoiceDetailResponse;
  mpcsName: string;
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(amount);
};

const InvoicePDFDocument: React.FC<InvoicePDFDocumentProps> = ({ data, mpcsName }) => {
  const { invoice, collections, sales, pricing } = data;
  const displayName = invoice.mpcsName || mpcsName;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={styles.title}>INVOICE</Text>
            <Text style={styles.subtitle}>Howrah Milk Union</Text>
          </View>
          <View style={styles.headerRight}>
            <Text style={styles.invoiceMetaLabel}>Invoice Number</Text>
            <Text style={styles.invoiceMetaValue}>{invoice.invoiceNumber}</Text>
            <Text style={{ marginTop: 8, color: "#666" }}>
              Date: <Text style={styles.textBold}>{dayjs(invoice.createdAt).format("DD MMM YYYY")}</Text>
            </Text>
            <Text style={{ marginTop: 4 }}>
              Status:{" "}
              <Text style={invoice.status === "GENERATED" ? styles.statusGenerated : styles.statusPending}>
                {invoice.status}
              </Text>
            </Text>
          </View>
        </View>

        {/* Bill To & Rates */}
        <View style={styles.grid}>
          <View style={styles.gridCol}>
            <View style={styles.box}>
              <Text style={styles.boxTitle}>Billed To</Text>
              <Text style={[styles.textBold, { fontSize: 12, marginBottom: 8 }]}>{displayName}</Text>
              <Text style={{ color: "#666", marginBottom: 2 }}>Bank Details:</Text>
              <Text style={styles.textBold}>{invoice.bankName || "N/A"}</Text>
              <Text>
                A/C: {invoice.bankAccountNumber} {invoice.bankIfscCode && `| IFSC: ${invoice.bankIfscCode}`}
              </Text>
            </View>
          </View>
          <View style={styles.gridCol}>
            <View style={styles.box}>
              <Text style={styles.boxTitle}>Effective Rates</Text>
              <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
                <View style={{ width: "50%", marginBottom: 8 }}>
                  <Text style={{ color: "#666", fontSize: 8 }}>Fat Rate (/kg)</Text>
                  <Text style={styles.textBold}>{formatCurrency(pricing?.effectiveFatRate || 0)}</Text>
                </View>
                <View style={{ width: "50%", marginBottom: 8 }}>
                  <Text style={{ color: "#666", fontSize: 8 }}>SNF Rate (/kg)</Text>
                  <Text style={styles.textBold}>{formatCurrency(pricing?.effectiveSnfRate || 0)}</Text>
                </View>
                <View style={{ width: "50%" }}>
                  <Text style={{ color: "#666", fontSize: 8 }}>Commission</Text>
                  <Text style={styles.textBold}>{formatCurrency(pricing?.effectiveCommissionRate || 0)}</Text>
                </View>
                <View style={{ width: "50%" }}>
                  <Text style={{ color: "#666", fontSize: 8 }}>Incentive</Text>
                  <Text style={styles.textBold}>{formatCurrency(pricing?.effectiveIncentiveRate || 0)}</Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* Milk Collections */}
        <Text style={styles.sectionTitle}>Milk Collections</Text>
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={styles.tableHeaderCell}>Date</Text>
            <Text style={styles.tableHeaderCell}>Shift</Text>
            <Text style={styles.tableHeaderCellRight}>Qty (kg)</Text>
            <Text style={styles.tableHeaderCellRight}>Fat %</Text>
            <Text style={styles.tableHeaderCellRight}>SNF %</Text>
            <Text style={styles.tableHeaderCellRight}>Fat KG</Text>
            <Text style={styles.tableHeaderCellRight}>SNF KG</Text>
          </View>
          {collections.map((col) => (
            <View key={col.id} style={styles.tableRow}>
              <Text style={styles.tableCell}>{dayjs(col.collectionDate).format("DD MMM YYYY")}</Text>
              <Text style={styles.tableCell}>{col.shift}</Text>
              <Text style={styles.tableCellRight}>{col.quantity.toFixed(2)}</Text>
              <Text style={styles.tableCellRight}>{col.fatPercentage.toFixed(2)}</Text>
              <Text style={styles.tableCellRight}>{col.snfPercentage.toFixed(2)}</Text>
              <Text style={styles.tableCellRight}>{col.fatKg.toFixed(3)}</Text>
              <Text style={styles.tableCellRight}>{col.snfKg.toFixed(3)}</Text>
            </View>
          ))}
          <View style={[styles.tableRowLast, { backgroundColor: "#fafafa" }]}>
            <Text style={[styles.tableCell, styles.textBold, { flex: 2, color: "#1976d2" }]}>Total</Text>
            <Text style={[styles.tableCellRight, styles.textBold, { color: "#1976d2" }]}>{invoice.totalMilkQuantity.toFixed(2)}</Text>
            <Text style={styles.tableCellRight}></Text>
            <Text style={styles.tableCellRight}></Text>
            <Text style={[styles.tableCellRight, styles.textBold, { color: "#1976d2" }]}>{invoice.totalFatKg.toFixed(3)}</Text>
            <Text style={[styles.tableCellRight, styles.textBold, { color: "#1976d2" }]}>{invoice.totalSnfKg.toFixed(3)}</Text>
          </View>
        </View>

        {/* Sales */}
        {sales.length > 0 && (
          <View wrap={false}>
            <Text style={[styles.sectionTitle, { color: "#d32f2f" }]}>Product Sales Deductions</Text>
            <View style={styles.table}>
              <View style={[styles.tableHeader, { backgroundColor: "#ffebee" }]}>
                <Text style={styles.tableHeaderCell}>Date</Text>
                <Text style={[styles.tableHeaderCell, { flex: 2 }]}>Product Name</Text>
                <Text style={styles.tableHeaderCellRight}>Qty</Text>
                <Text style={styles.tableHeaderCellRight}>Price</Text>
                <Text style={styles.tableHeaderCellRight}>Total</Text>
              </View>
              {sales.map((sale, i) => (
                <View key={sale.id} style={i === sales.length - 1 ? styles.tableRowLast : styles.tableRow}>
                  <Text style={styles.tableCell}>{dayjs(sale.saleDate).format("DD MMM YYYY")}</Text>
                  <Text style={[styles.tableCell, { flex: 2 }]}>{sale.productName}</Text>
                  <Text style={styles.tableCellRight}>{sale.quantity.toFixed(2)}</Text>
                  <Text style={styles.tableCellRight}>{formatCurrency(sale.price)}</Text>
                  <Text style={[styles.tableCellRight, { color: "#d32f2f", fontFamily: "Helvetica-Bold" }]}>
                    {formatCurrency(sale.totalAmount)}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Financial Summary */}
        <View wrap={false} style={styles.summaryContainer}>
          <View style={styles.summaryBox}>
            <Text style={[styles.boxTitle, { color: "#1976d2", marginBottom: 12 }]}>Payment Summary</Text>
            
            <View style={styles.summaryRow}>
              <Text style={{ color: "#666" }}>Base Milk Amount</Text>
              <Text style={styles.textBold}>{formatCurrency(invoice.baseMilkAmount)}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={{ color: "#666" }}>Total Additions (+)</Text>
              <Text style={[styles.textBold, { color: "#2e7d32" }]}>+{formatCurrency(invoice.totalAdditions)}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={{ color: "#666" }}>Total Deductions (-)</Text>
              <Text style={[styles.textBold, { color: "#d32f2f" }]}>-{formatCurrency(invoice.totalDeductions)}</Text>
            </View>
            
            <View style={styles.summaryDivider} />
            
            <View style={styles.summaryRow}>
              <Text style={styles.summaryTotalText}>Net Payable Amount</Text>
              <Text style={styles.summaryTotalText}>{formatCurrency(invoice.netPayableAmount)}</Text>
            </View>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer} fixed>
          <View style={{ flex: 1, alignItems: "flex-end" }}>
            <Text style={styles.termsText}>Generated by:</Text>
            <Text style={[styles.textBold, { fontSize: 8 }]}>Howrah Milk Union</Text>
          </View>
        </View>
      </Page>
    </Document>
  );
};

export default InvoicePDFDocument;
