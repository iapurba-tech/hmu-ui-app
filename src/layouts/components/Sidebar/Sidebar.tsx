import React from "react";
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  LinearProgress,
} from "@mui/material";
import {
  DashboardRounded as Dashboard,
  FactoryRounded as Factory,
  GroupRounded as Group,
  AccountBalanceRounded as AccountBalance,
  PaymentsRounded as Payments,
  CategoryRounded as Category,
  StoreRounded as Store,
  LocalDrinkRounded as LocalDrink,
  ShoppingCartRounded as ShoppingCart,
  ReceiptRounded as Receipt,
  DescriptionRounded as Description,
  AdminPanelSettingsRounded as AdminPanelSettings,
  LocalShippingRounded as LocalShipping,
  ClassRounded as Class,
} from '@mui/icons-material';
import { Link, useLocation } from "react-router-dom";
import { useLayoutStore } from "../../../shared/store/useLayoutStore";
import { useAuthStore } from "../../../shared/store/useAuthStore";
import {
  drawerStyles,
  sectionTitleStyles,
  listItemButtonStyles,
  systemHealthBoxStyles,
  unitHeaderStyles,
  unitIconBoxStyles,
} from "./Sidebar.styles";

interface MenuItem {
  text: string;
  icon: React.ReactNode;
  path: string;
}

interface MenuSection {
  title: string;
  items: MenuItem[];
}

const adminMenu: MenuSection[] = [
  {
    title: "Main Menu",
    items: [{ text: "Dashboard", icon: <Dashboard />, path: "/dashboard" }],
  },
  {
    title: "Organization & Finance",
    items: [
      { text: "Units", icon: <Factory />, path: "/admin/units" },
      { text: "User", icon: <Group />, path: "/admin/users" },
      {
        text: "Bank Accounts",
        icon: <AccountBalance />,
        path: "/admin/bank-accounts",
      },
    ],
  },
  {
    title: "Catalog & Pricing",
    items: [
      { text: "Pricing", icon: <Payments />, path: "/admin/pricing" },
      { text: "Products", icon: <Category />, path: "/admin/products" },
      {
        text: "Head Load",
        icon: <Class />,
        path: "/admin/head-load-categories",
      },
    ],
  },
];

const managementMenu: MenuSection[] = [
  {
    title: "Main Menu",
    items: [
      { text: "Dashboard", icon: <Dashboard />, path: "/dashboard" },
      { text: "MPCS", icon: <Store />, path: "/unit/mpcs" },
    ],
  },
  {
    title: "Daily Operations",
    items: [
      {
        text: "Milk Collections",
        icon: <LocalDrink />,
        path: "/unit/procurement/milk-collections",
      },
      {
        text: "Sales",
        icon: <ShoppingCart />,
        path: "/unit/sales/transactions",
      },
      {
        text: "Dispatch",
        icon: <LocalShipping />,
        path: "/unit/dispatch/tankers",
      },
    ],
  },
  {
    title: "Finance",
    items: [
      { text: "Billing", icon: <Receipt />, path: "/unit/billing/invoices" },
      {
        text: "Bank Advice",
        icon: <Description />,
        path: "/unit/billing/bank-advice",
      },
    ],
  },
];

const Sidebar: React.FC = () => {
  const location = useLocation();
  const { isSidebarOpen } = useLayoutStore();
  const { portal, selectedUnit } = useAuthStore();

  const isManagementPortal = portal === "management";
  const sections = isManagementPortal ? managementMenu : adminMenu;

  return (
    <Drawer
      variant="persistent"
      anchor="left"
      open={isSidebarOpen}
      role="navigation"
      sx={drawerStyles}
    >
      <Box sx={unitHeaderStyles}>
        <Box sx={unitIconBoxStyles}>
          {isManagementPortal ? (
            <Factory fontSize="small" />
          ) : (
            <AdminPanelSettings fontSize="small" />
          )}
        </Box>
        <Box>
          <Typography
            variant="body2"
            sx={{ fontWeight: 800, color: "text.primary", lineHeight: 1.2 }}
          >
            {isManagementPortal ? (selectedUnit?.name || "Select Unit") : "HMU Global"}
          </Typography>

          <Typography
            variant="caption"
            sx={{ fontWeight: 600, color: "primary.main", display: "block" }}
          >
            {isManagementPortal ? "Management Portal" : "Administration Portal"}
          </Typography>
        </Box>
      </Box>

      {sections.map((section) => (
        <Box key={section.title} sx={{ mb: 3 }}>
          <Typography variant="caption" sx={sectionTitleStyles}>
            {section.title}
          </Typography>
          <List disablePadding>
            {section.items.map((item) => (
              <ListItem key={item.text} disablePadding sx={{ mb: 0.5 }}>
                <ListItemButton
                  component={Link}
                  to={item.path}
                  selected={location.pathname === item.path}
                  sx={listItemButtonStyles(location.pathname === item.path)}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 40,
                      color:
                        location.pathname === item.path
                          ? "white"
                          : "text.secondary",
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={item.text}
                    primaryTypographyProps={{
                      fontSize: "14px",
                      fontWeight: location.pathname === item.path ? 700 : 500,
                    }}
                  />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>
      ))}

      <Box sx={{ flexGrow: 1 }} />

      <Box sx={systemHealthBoxStyles}>
        <Typography
          variant="caption"
          sx={{
            fontWeight: 800,
            color: "primary.main",
            display: "block",
            mb: 1,
          }}
        >
          System Health
        </Typography>
        <LinearProgress
          variant="determinate"
          value={80}
          sx={{
            height: 6,
            borderRadius: 3,
            bgcolor: "rgba(0, 0, 0, 0.05)",
            "& .MuiLinearProgress-bar": { borderRadius: 3 },
          }}
        />
        <Typography
          variant="caption"
          sx={{
            color: "text.secondary",
            mt: 1,
            display: "block",
            fontSize: "10px",
          }}
        >
          All systems operational. 98% uptime this month.
        </Typography>
      </Box>
    </Drawer>
  );
};

export default Sidebar;
