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
  LocalShippingRounded as LocalShipping,
  ClassRounded as Class,
} from '@mui/icons-material';

interface MenuItem {
  text: string;
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

export const managementMenu: MenuSection[] = [
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