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
  alpha,
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
  TrendingUpRounded as TrendingUp,
} from '@mui/icons-material';
import { Link, useLocation } from "react-router-dom";
import { useLayoutStore } from "../../../shared/store/useLayoutStore";
import {
  drawerStyles,
  sectionTitleStyles,
  listItemButtonStyles,
  operationStatusBoxStyles,
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
  const { isSidebarOpen, portal } = useLayoutStore();

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
            {isManagementPortal ? "Shyampur Unit" : "HMU Global"}
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

      <Box sx={operationStatusBoxStyles}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
          <Typography
            variant="caption"
            sx={{
              fontWeight: 800,
              color: "text.primary",
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              fontSize: '10px',
            }}
          >
            Procurement Goal
          </Typography>
          <Box sx={{ 
            px: 1, 
            py: 0.25, 
            borderRadius: 1, 
            bgcolor: (theme) => alpha(theme.palette.success.main, 0.1),
            display: 'flex',
            alignItems: 'center',
          }}>
             <Typography variant="caption" sx={{ fontWeight: 800, fontSize: '10px', color: 'success.main' }}>
               72%
             </Typography>
          </Box>
        </Box>
        
        <LinearProgress 
          variant="determinate" 
          value={72} 
          sx={{ 
            height: 6, 
            borderRadius: 3,
            bgcolor: (theme) => alpha(theme.palette.primary.main, 0.08),
            mb: 2,
            '& .MuiLinearProgress-bar': {
              borderRadius: 3,
            }
          }}
        />

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <TrendingUp sx={{ fontSize: 14, color: 'primary.main' }} />
              <Typography variant="caption" sx={{ color: "text.secondary", fontSize: "11px", fontWeight: 600 }}>
                Daily Target
              </Typography>
            </Box>
            <Typography variant="caption" sx={{ color: "text.primary", fontSize: "11px", fontWeight: 700 }}>
              12,400 L
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: 'success.main' }} />
              <Typography variant="caption" sx={{ color: "text.secondary", fontSize: "11px", fontWeight: 600 }}>
                Unit Status
              </Typography>
            </Box>
            <Typography variant="caption" sx={{ color: "success.main", fontSize: "10px", fontWeight: 800, textTransform: 'uppercase' }}>
              Operational
            </Typography>
          </Box>
        </Box>
      </Box>
    </Drawer>
  );
};

export default Sidebar;
