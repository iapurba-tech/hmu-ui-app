import { Navigate, Outlet } from "react-router-dom";
import LoginPage from "../../features/auth/pages/LoginPage/LoginPage";
import { ForbiddenPage, NotFoundPage } from "../../features/error/pages";
import { UnitsPage } from "../../features/admin/units";
import { UsersPage } from "../../features/admin/users";
import { BanksPage } from "../../features/admin/banks";
import { ProductsPage } from "../../features/admin/products";
import ProtectedRoute from "./ProtectedRoute";
import MainLayout from "../../layouts/MainLayout/MainLayout";
import {
  SYSTEM_ADMINISTRATOR_ROLES,
  UNIT_OPERATIONS_ROLES,
} from "../../features/auth/constants/roles";
import {
  HeadLoadCategoriesPage,
  HeadLoadPricingPage,
} from "../../features/pricing/head-loads";
import {
  PricingRuleDetailsPage,
  PricingSummary,
} from "../../features/pricing/rules";
import { UnitDashboard } from "../../features/dashboard";
import { MpcsPage } from "../../features/unit-operations/mpcs";
import { MilkCollectionsPage } from "../../features/unit-operations/collections";
import { ProductSalesPage } from "../../features/unit-operations/sales";
import {
  BillingPage,
  BillingDetailPage,
  BankAdvicePage,
} from "../../features/unit-operations/billing";
import DashboardRedirect from "./DashboardRedirect";

export interface RouteConfig {
  path?: string;
  element?: React.ReactNode;
  children?: RouteConfig[];
  index?: boolean;
  meta?: {
    title?: string;
    requiresAuth?: boolean;
    hideInSidebar?: boolean;
    roles?: string[];
  };
}

export const routes: RouteConfig[] = [
  // Public Routes
  {
    path: "/login",
    element: <LoginPage />,
    meta: { requiresAuth: false, hideInSidebar: true, title: "Login" },
  },

  // Authenticated Routes (Wrapped in RootLayout)
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <MainLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <Navigate to="/dashboard" replace />,
        meta: { hideInSidebar: true },
      },

      // Common Authenticated Routes
      {
        path: "dashboard",
        element: <DashboardRedirect />,
        meta: { title: "Dashboard", requiresAuth: true },
      },
      {
        path: "settings",
        element: <div>User Settings</div>,
        meta: { title: "Settings", requiresAuth: true, hideInSidebar: true },
      },
      {
        path: "forbidden",
        element: <ForbiddenPage />,
        meta: {
          title: "Access Denied",
          requiresAuth: true,
          hideInSidebar: true,
        },
      },

      // System Admin Only Routes
      {
        path: "admin",
        element: <Outlet />,
        meta: {
          title: "Administration",
          requiresAuth: true,
          roles: SYSTEM_ADMINISTRATOR_ROLES,
        },
        children: [
          {
            path: "users",
            element: <UsersPage />,
            meta: { title: "Users" },
          },
          {
            path: "units",
            element: <Outlet />,
            meta: { title: "Units" },
            children: [
              { index: true, element: <UnitsPage /> },
              {
                path: ":unitId",
                element: <div>Unit Detail View</div>,
                meta: { hideInSidebar: true },
              },
            ],
          },
          {
            path: "head-load-categories",
            element: <Outlet />,
            meta: { title: "Head Load" },
            children: [
              { index: true, element: <HeadLoadCategoriesPage /> },
              {
                path: ":categoryId/pricing",
                element: <HeadLoadPricingPage />,
                meta: { hideInSidebar: true },
              },
            ],
          },
          {
            path: "bank-accounts",
            element: <BanksPage />,
            meta: { title: "Bank Accounts" },
          },
          {
            path: "products",
            element: <ProductsPage />,
            meta: { title: "Products" },
          },
          {
            path: "pricing",
            element: <Outlet />,
            meta: { title: "Pricing" },
            children: [
              { index: true, element: <PricingSummary /> },
              {
                path: ":type",
                element: <PricingRuleDetailsPage />,
                meta: { hideInSidebar: true },
              },
            ],
          },
        ],
      },

      // Operations (Unit Admin & Manager) Routes
      {
        path: "unit",
        element: <Outlet />,
        meta: {
          requiresAuth: true,
          roles: UNIT_OPERATIONS_ROLES,
          title: "Unit Operations",
        },
        children: [
          {
            path: "dashboard",
            element: <UnitDashboard />,
            meta: { title: "Unit Dashboard" },
          },
          {
            path: "mpcs",
            element: <MpcsPage />,
            meta: { title: "MPCS" },
          },
          {
            path: "procurement",
            element: <Outlet />,
            meta: { title: "Procurement" },
            children: [
              {
                path: "milk-collections",
                element: <MilkCollectionsPage />,
                meta: { title: "Milk Collections" },
              },
            ],
          },
          {
            path: "sales",
            element: <Outlet />,
            meta: { title: "Sales & Distribution" },
            children: [
              {
                path: "transactions",
                element: <ProductSalesPage />,
                meta: { title: "Sales" },
              },
            ],
          },
          {
            path: "dispatch",
            element: <Outlet />,
            meta: { title: "Dispatch Operations" },
            children: [
              {
                path: "tankers",
                element: <div>Tanker & Vehicle Management</div>,
                meta: { title: "Dispatch" },
              },
              {
                path: "road-challans",
                element: <div>Road Challan Generation</div>,
                meta: { title: "Road Challans" },
              },
            ],
          },
          {
            path: "billing",
            element: <Outlet />,
            meta: { title: "Billing & Finance" },
            children: [
              {
                path: "runs",
                element: <Outlet />,
                meta: { title: "Billing" },
                children: [
                  { index: true, element: <BillingPage /> },
                  {
                    path: ":runId",
                    element: <BillingDetailPage />,
                    meta: { title: "Invoice Details", hideInSidebar: true },
                  },
                ],
              },
              {
                path: "bank-advice",
                element: <BankAdvicePage />,
                meta: { title: "Bank Advice" },
              },
            ],
          },
        ],
      },

      // Catch-all within authenticated layout
      {
        path: "*",
        element: <NotFoundPage />,
        meta: { hideInSidebar: true },
      },
    ],
  },

  // Global catch-all
  {
    path: "*",
    element: <Navigate to="/dashboard" replace />,
    meta: { hideInSidebar: true },
  },
];
