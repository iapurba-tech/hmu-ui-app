import React, { useMemo } from "react";
import { Box, Typography, Grid, Paper, Stack, alpha } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useDocumentTitle } from "../../../../shared/hooks/useDocumentTitle";
import { palette } from "../../../../shared/theme";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts";
import {
  collectionByShiftData,
  top10MpcsData,
  salesByCategoryData,
  qualityTrendData,
} from "./mockData";
import {
  MpcsIcon,
  MilkCanIcon,
  SalesIcon,
  InvoiceIcon,
} from "../../../../shared/icons";

import { useGetMpcsList } from "../../../../shared/api/unit/mpcs/mpcs.hooks";
import { useGetMilkCollections } from "../../../../shared/api/unit/collections/milk-collections.hooks";
import { useGetProductSales } from "../../../../shared/api/unit/sales/product-sales.hooks";
import { useGetBillingRuns } from "../../../../shared/api/unit/billing/billing.hooks";
import { useGetBankAdvices } from "../../../../shared/api/unit/billing/bank-advice.hooks";

const StatCard: React.FC<{
  title: string;
  value: string | number;
  subtitle: string;
  icon: React.ReactNode;
  color: string;
  onClick?: () => void;
}> = ({ title, value, subtitle, icon, color, onClick }) => (
  <Paper
    elevation={0}
    onClick={onClick}
    sx={{
      p: 3,
      borderRadius: "16px",
      border: `1px solid ${alpha(color, 0.2)}`,
      background: `linear-gradient(135deg, ${alpha(color, 0.05)} 0%, ${alpha(
        color,
        0.01,
      )} 100%)`,
      height: "100%",
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
      cursor: onClick ? "pointer" : "default",
      transition: "transform 0.2s, box-shadow 0.2s",
      "&:hover": onClick
        ? {
            transform: "translateY(-4px)",
            boxShadow: `0 8px 24px ${alpha(color, 0.15)}`,
          }
        : {},
    }}
  >
    <Stack
      direction="row"
      justifyContent="space-between"
      alignItems="flex-start"
    >
      <Box>
        <Typography
          variant="body2"
          color="text.secondary"
          fontWeight={700}
          sx={{ mb: 1, textTransform: "uppercase", letterSpacing: 0.5 }}
        >
          {title}
        </Typography>
        <Typography
          variant="h4"
          fontWeight={900}
          sx={{ color: "text.primary" }}
        >
          {value}
        </Typography>
      </Box>
      <Box
        sx={{
          p: 1.5,
          borderRadius: "12px",
          backgroundColor: alpha(color, 0.1),
          color: color,
          display: "flex",
        }}
      >
        {icon}
      </Box>
    </Stack>
    <Box sx={{ mt: 2 }}>
      <Typography variant="caption" color="text.secondary" fontWeight={500}>
        {subtitle}
      </Typography>
    </Box>
  </Paper>
);

const COLORS = [
  palette.primary.main,
  palette.secondary.main,
  palette.info.main,
  palette.warning.main,
  palette.success.main,
  palette.error.main,
];

const formatCurrency = (value: number) => {
  if (value >= 100000) return `₹${(value / 100000).toFixed(2)}L`;
  if (value >= 1000) return `₹${(value / 1000).toFixed(1)}K`;
  return `₹${value}`;
};

const UnitDashboard: React.FC = () => {
  const navigate = useNavigate();
  useDocumentTitle();

  const { data: mpcsList = [] } = useGetMpcsList();
  const { data: collectionsPage } = useGetMilkCollections(0, 1000);
  const { data: salesPage } = useGetProductSales(0, 1000);
  const { data: billingRuns = [] } = useGetBillingRuns();
  const { data: advices = [] } = useGetBankAdvices();

  const metrics = useMemo(() => {
    const activeMpcs = mpcsList.filter((m: any) => m.active).length;
    const totalMpcs = mpcsList.length;

    // For "Today's", we are taking total for simplicity of real data demonstration.
    // In a real scenario, API would be filtered by date.
    const collectionsContent = collectionsPage?.content || [];
    const totalCollection = collectionsContent.reduce(
      (sum: number, item: any) => sum + item.quantity,
      0,
    );

    const salesContent = salesPage?.content || [];
    const totalSales = salesContent.reduce(
      (sum: number, item: any) => sum + item.totalAmount,
      0,
    );

    const pendingBills = billingRuns.filter(
      (r: any) => r.status === "PENDING",
    ).length;
    const unprocessedAdvices = advices.filter(
      (a: any) => a.status !== "COMPLETED",
    ).length;

    return {
      activeMpcs,
      totalMpcs,
      totalCollection,
      totalSales,
      pendingBills,
      unprocessedAdvices,
    };
  }, [mpcsList, collectionsPage, salesPage, billingRuns, advices]);

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
      {/* KPI Cards */}
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard
            title="Active MPCS"
            value={`${metrics.activeMpcs} / ${metrics.totalMpcs}`}
            subtitle="Currently operational"
            icon={<MpcsIcon />}
            color={palette.primary.main}
            onClick={() => navigate("/unit/mpcs")}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard
            title="Total Collection"
            value={`${(metrics.totalCollection / 1000).toFixed(1)} Tonnes`}
            subtitle="Overall volume"
            icon={<MilkCanIcon />}
            color={palette.success.main}
            onClick={() => navigate("/unit/procurement/milk-collections")}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard
            title="Total Sales"
            value={formatCurrency(metrics.totalSales)}
            subtitle="Overall sales"
            icon={<SalesIcon />}
            color={palette.info.main}
            onClick={() => navigate("/unit/sales/transactions")}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard
            title="Billing Action Needed"
            value={metrics.pendingBills + metrics.unprocessedAdvices}
            subtitle={`${metrics.pendingBills} Pending Runs, ${metrics.unprocessedAdvices} Advices`}
            icon={<InvoiceIcon />}
            color={palette.warning.main}
            onClick={() => navigate("/unit/billing/runs")}
          />
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {/* Collection by Shift Area Chart */}
        <Grid size={{ xs: 12, lg: 8 }}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: "16px",
              border: `1px solid ${palette.divider}`,
            }}
          >
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" fontWeight={800}>
                7-Day Collection Volume
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Morning vs Evening shift comparisons (in KG)
              </Typography>
            </Box>
            <Box sx={{ width: "100%", height: 350 }}>
              <ResponsiveContainer>
                <AreaChart
                  data={collectionByShiftData}
                  margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
                  <defs>
                    <linearGradient
                      id="colorMorning"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="5%"
                        stopColor={palette.primary.main}
                        stopOpacity={0.8}
                      />
                      <stop
                        offset="95%"
                        stopColor={palette.primary.main}
                        stopOpacity={0}
                      />
                    </linearGradient>
                    <linearGradient
                      id="colorEvening"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="5%"
                        stopColor={palette.secondary.main}
                        stopOpacity={0.8}
                      />
                      <stop
                        offset="95%"
                        stopColor={palette.secondary.main}
                        stopOpacity={0}
                      />
                    </linearGradient>
                  </defs>
                  <XAxis
                    dataKey="date"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: palette.text.secondary }}
                    dy={10}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: palette.text.secondary }}
                    dx={-10}
                  />
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke={alpha(palette.divider, 0.5)}
                  />
                  <RechartsTooltip
                    contentStyle={{
                      borderRadius: "8px",
                      border: `1px solid ${palette.divider}`,
                      boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                    }}
                  />
                  <Legend
                    iconType="circle"
                    wrapperStyle={{ paddingTop: "20px" }}
                  />
                  <Area
                    type="monotone"
                    dataKey="morning"
                    name="Morning Shift"
                    stroke={palette.primary.main}
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#colorMorning)"
                  />
                  <Area
                    type="monotone"
                    dataKey="evening"
                    name="Evening Shift"
                    stroke={palette.secondary.main}
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#colorEvening)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Grid>

        {/* Sales Breakdown Pie Chart */}
        <Grid size={{ xs: 12, lg: 4 }}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: "16px",
              border: `1px solid ${palette.divider}`,
              height: "100%",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Box sx={{ mb: 1 }}>
              <Typography variant="h6" fontWeight={800}>
                Sales Breakdown
              </Typography>
              <Typography variant="caption" color="text.secondary">
                By product category
              </Typography>
            </Box>
            <Box sx={{ width: "100%", flex: 1, minHeight: 300 }}>
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={salesByCategoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                    stroke="none"
                  >
                    {salesByCategoryData.map((_, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <RechartsTooltip
                    formatter={(value: any) => [formatCurrency(value), "Sales"]}
                    contentStyle={{
                      borderRadius: "8px",
                      border: "none",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                    }}
                  />
                  <Legend
                    verticalAlign="bottom"
                    height={36}
                    iconType="circle"
                  />
                </PieChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Grid>

        {/* Top 10 MPCS Bar Chart */}
        <Grid size={{ xs: 12, lg: 6 }}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: "16px",
              border: `1px solid ${palette.divider}`,
            }}
          >
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" fontWeight={800}>
                Top 10 MPCS
              </Typography>
              <Typography variant="caption" color="text.secondary">
                By collection volume (KG)
              </Typography>
            </Box>
            <Box sx={{ width: "100%", height: 350 }}>
              <ResponsiveContainer>
                <BarChart
                  data={top10MpcsData}
                  margin={{ top: 0, right: 0, left: 20, bottom: 0 }}
                  layout="vertical"
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    horizontal={false}
                    stroke={alpha(palette.divider, 0.5)}
                  />
                  <XAxis
                    type="number"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: palette.text.secondary }}
                  />
                  <YAxis
                    dataKey="name"
                    type="category"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: palette.text.secondary }}
                    width={80}
                  />
                  <RechartsTooltip
                    cursor={{ fill: alpha(palette.primary.main, 0.05) }}
                    contentStyle={{
                      borderRadius: "8px",
                      border: "none",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                    }}
                  />
                  <Bar
                    dataKey="collection"
                    fill={palette.primary.main}
                    radius={[0, 4, 4, 0]}
                  >
                    {top10MpcsData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={palette.primary.main} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Grid>

        {/* Quality Trend Line Chart */}
        <Grid size={{ xs: 12, lg: 6 }}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: "16px",
              border: `1px solid ${palette.divider}`,
            }}
          >
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" fontWeight={800}>
                Quality Trend (7 Days)
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Average FAT & SNF percentage
              </Typography>
            </Box>
            <Box sx={{ width: "100%", height: 350 }}>
              <ResponsiveContainer>
                <LineChart
                  data={qualityTrendData}
                  margin={{ top: 5, right: 20, left: -20, bottom: 0 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke={alpha(palette.divider, 0.5)}
                  />
                  <XAxis
                    dataKey="date"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: palette.text.secondary }}
                    dy={10}
                  />
                  <YAxis
                    yAxisId="left"
                    orientation="left"
                    domain={["auto", "auto"]}
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: palette.text.secondary }}
                  />
                  <YAxis
                    yAxisId="right"
                    orientation="right"
                    domain={["auto", "auto"]}
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: palette.text.secondary }}
                  />
                  <RechartsTooltip
                    contentStyle={{
                      borderRadius: "8px",
                      border: `1px solid ${palette.divider}`,
                      boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                    }}
                  />
                  <Legend
                    iconType="plainline"
                    wrapperStyle={{ paddingTop: "10px" }}
                  />
                  <Line
                    yAxisId="left"
                    type="monotone"
                    dataKey="fat"
                    name="Avg FAT %"
                    stroke={palette.warning.main}
                    strokeWidth={3}
                    dot={{ r: 4, strokeWidth: 2 }}
                    activeDot={{ r: 6 }}
                  />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="snf"
                    name="Avg SNF %"
                    stroke={palette.info.main}
                    strokeWidth={3}
                    dot={{ r: 4, strokeWidth: 2 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default UnitDashboard;
