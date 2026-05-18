import { Navigate, Outlet } from "react-router-dom";
import LoginPage from "../../features/auth/pages/LoginPage/LoginPage";
import { ForbiddenPage, NotFoundPage } from "../../features/error/pages";
import { UnitsPage } from "../../features/admin/units";
import ProtectedRoute from "./ProtectedRoute";
import MainLayout from "../../layouts/MainLayout/MainLayout";
import {
  SYSTEM_ADMINISTRATOR_ROLES,
  UNIT_OPERATIONS_ROLES,
} from "../../features/auth/constants/roles";

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
        element: <div>Dashboard</div>,
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
            element: <div>User Management (IAM)</div>,
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
            element: <div>Head Load Categories (HLC)</div>,
            meta: { title: "Head Load" },
          },
          {
            path: "bank-accounts",
            element: <div>Org Bank Accounts</div>,
            meta: { title: "Bank Accounts" },
          },
          {
            path: "products",
            element: <div>Global Product Catalog</div>,
            meta: { title: "Products" },
          },
          {
            path: "pricing",
            element: <div>Pricing Models</div>,
            meta: { title: "Pricing" },
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
            path: "mpcs",
            element: <div>MPCS Master</div>,
            meta: { title: "MPCS" },
          },
          {
            path: "procurement",
            element: <Outlet />,
            meta: { title: "Procurement" },
            children: [
              {
                path: "milk-collections",
                element: <div>Milk Collections Entry</div>,
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
                element: <div>Feed & Product Sales</div>,
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
                path: "generate",
                element: <div>Bill Generation Process</div>,
                meta: { title: "Generate Bills" },
              },
              {
                path: "invoices",
                element: <div>Invoice Management</div>,
                meta: { title: "Invoices" },
              },
              {
                path: "bank-advice",
                element: <div>Bank Advice Processing</div>,
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
