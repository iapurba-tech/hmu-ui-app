import {
  BankIcon,
  CategoryIcon,
  DashboardIcon,
  DocumentsIcon,
  InvoiceIcon,
  MilkCanIcon,
  MpcsIcon,
  OrganizationIcon,
  PricingIcon,
  ProductIcon,
  SalesIcon,
  TruckIcon,
  UsersIcon,
} from "../../../shared/icons";

interface MenuItem {
  label: string;
  icon: React.ReactNode;
  path: string;
}

interface MenuSection {
  title: string;
  items: MenuItem[];
}

export const adminMenu: MenuSection[] = [
  {
    title: "Main Menu",
    items: [
      { label: "Dashboard", icon: <DashboardIcon />, path: "/dashboard" },
    ],
  },
  {
    title: "Organization & Finance",
    items: [
      { label: "Units", icon: <OrganizationIcon />, path: "/admin/units" },
      { label: "Users", icon: <UsersIcon />, path: "/admin/users" },
      {
        label: "Bank Accounts",
        icon: <BankIcon />,
        path: "/admin/bank-accounts",
      },
    ],
  },
  {
    title: "Catalog & Pricing",
    items: [
      { label: "Pricing", icon: <PricingIcon />, path: "/admin/pricing" },
      {
        label: "Head Load",
        icon: <CategoryIcon />,
        path: "/admin/head-load-categories",
      },
      { label: "Products", icon: <ProductIcon />, path: "/admin/products" },
    ],
  },
];

export const managementMenu: MenuSection[] = [
  {
    title: "Main Menu",
    items: [
      { label: "Dashboard", icon: <DashboardIcon />, path: "/unit/dashboard" },
      { label: "MPCS", icon: <MpcsIcon />, path: "/unit/mpcs" },
    ],
  },
  {
    title: "Daily Operations",
    items: [
      {
        label: "Milk Collections",
        icon: <MilkCanIcon />,
        path: "/unit/procurement/milk-collections",
      },
      {
        label: "Sales",
        icon: <SalesIcon />,
        path: "/unit/sales/transactions",
      },
      {
        label: "Dispatch",
        icon: <TruckIcon />,
        path: "/unit/dispatch/tankers",
      },
    ],
  },
  {
    title: "Finance",
    items: [
      {
        label: "Billing",
        icon: <InvoiceIcon />,
        path: "/unit/billing/runs",
      },
      {
        label: "Bank Advice",
        icon: <DocumentsIcon />,
        path: "/unit/billing/bank-advice",
      },
    ],
  },
];
