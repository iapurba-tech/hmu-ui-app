import React from "react";
import { Box, Typography, Grid, Paper, Stack, alpha } from "@mui/material";
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
  metrics,
  collectionData,
  salesData,
  unitPerformanceData,
  pricingTrendData,
} from "./mockData";
import {
  UsersIcon,
  OrganizationIcon as UnitIcon,
  MilkCanIcon,
  TrendingUpIcon,
} from "../../../../shared/icons";

const StatCard: React.FC<{
  title: string;
  value: string | number;
  subtitle: string;
  icon: React.ReactNode;
  color: string;
  trend?: string;
}> = ({ title, value, subtitle, icon, color, trend }) => (
  <Paper
    elevation={0}
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
    <Stack
      direction="row"
      justifyContent="space-between"
      alignItems="flex-end"
      sx={{ mt: 2 }}
    >
      <Typography variant="caption" color="text.secondary" fontWeight={500}>
        {subtitle}
      </Typography>
      {trend && (
        <Typography
          variant="caption"
          fontWeight={800}
          sx={{
            color: "success.main",
            display: "flex",
            alignItems: "center",
            gap: 0.5,
          }}
        >
          <TrendingUpIcon fontSize="inherit" />
          {trend}
        </Typography>
      )}
    </Stack>
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
  if (value >= 10000000) return `₹${(value / 10000000).toFixed(2)}Cr`;
  if (value >= 100000) return `₹${(value / 100000).toFixed(2)}L`;
  if (value >= 1000) return `₹${(value / 1000).toFixed(1)}K`;
  return `₹${value}`;
};

const SystemDashboard: React.FC = () => {
  useDocumentTitle();

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
      {/* KPI Cards */}
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard
            title="Total Revenue"
            value={formatCurrency(metrics.totalSales)}
            subtitle="Current Month Sales"
            icon={<TrendingUpIcon />}
            color={palette.success.main}
            trend="+12.5%"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard
            title="Milk Collections"
            value={`${(metrics.totalCollections / 1000).toFixed(1)} Tonnes`}
            subtitle="Current Month Volume"
            icon={<MilkCanIcon />}
            color={palette.primary.main}
            trend="+8.2%"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard
            title="Active Units"
            value={`${metrics.activeUnits} / ${metrics.totalUnits}`}
            subtitle="Operational Unions"
            icon={<UnitIcon />}
            color={palette.warning.main}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard
            title="Active Users"
            value={metrics.activeUsers}
            subtitle={`Out of ${metrics.totalUsers} registered`}
            icon={<UsersIcon />}
            color={palette.info.main}
            trend="+12 New"
          />
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {/* Collections Area Chart */}
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
                  data={collectionData}
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

        {/* Unit Performance Pie Chart */}
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
                Volume by Unit
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Percentage contribution to total volume
              </Typography>
            </Box>
            <Box sx={{ width: "100%", flex: 1, minHeight: 300 }}>
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={unitPerformanceData}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                    stroke="none"
                  >
                    {unitPerformanceData.map((_, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <RechartsTooltip
                    formatter={(value: any) => [`${value}%`, "Volume"]}
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

        {/* Sales Breakdown Bar Chart */}
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
                Product Sales Breakdown
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Revenue contribution by product category
              </Typography>
            </Box>
            <Box sx={{ width: "100%", height: 300 }}>
              <ResponsiveContainer>
                <BarChart
                  data={salesData}
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
                    tickFormatter={(value) => `₹${value / 100000}L`}
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
                    formatter={(value: any) => [
                      formatCurrency(value),
                      "Revenue",
                    ]}
                    cursor={{ fill: alpha(palette.primary.main, 0.05) }}
                    contentStyle={{
                      borderRadius: "8px",
                      border: "none",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                    }}
                  />
                  <Bar
                    dataKey="revenue"
                    fill={palette.primary.main}
                    radius={[0, 4, 4, 0]}
                  >
                    {salesData.map((_, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Grid>

        {/* Pricing Trend Line Chart */}
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
                Pricing Trend (YTD)
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Effective Fat & SNF rate evolution over months
              </Typography>
            </Box>
            <Box sx={{ width: "100%", height: 300 }}>
              <ResponsiveContainer>
                <LineChart
                  data={pricingTrendData}
                  margin={{ top: 5, right: 20, left: -20, bottom: 0 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke={alpha(palette.divider, 0.5)}
                  />
                  <XAxis
                    dataKey="month"
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
                    dataKey="fatPrice"
                    name="Fat Rate (₹)"
                    stroke={palette.warning.main}
                    strokeWidth={3}
                    dot={{ r: 4, strokeWidth: 2 }}
                    activeDot={{ r: 6 }}
                  />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="snfPrice"
                    name="SNF Rate (₹)"
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

export default SystemDashboard;
