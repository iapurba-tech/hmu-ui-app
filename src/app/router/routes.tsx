import { Navigate, Outlet } from "react-router-dom";
import LoginPage from "../../features/auth/pages/LoginPage/LoginPage";
import DashboardPage from "../../features/dashboard/pages/DashboardPage/DashboardPage";
import SettingsPage from "../../features/settings/pages/SettingsPage/SettingsPage";
import ForbiddenPage from "../../features/error/pages/ForbiddenPage/ForbiddenPage";
import NotFoundPage from "../../features/error/pages/NotFoundPage/NotFoundPage";
import ProtectedRoute from "../../shared/navigation/ProtectedRoute";
import MainLayout from "../../layouts/MainLayout/MainLayout";

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
    meta: { requiresAuth: false, hideInSidebar: true },
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
        element: <DashboardPage />,
        meta: { title: "Dashboard", requiresAuth: true },
      },
      {
        path: "settings",
        element: <SettingsPage />,
        meta: { title: "Settings", requiresAuth: true, hideInSidebar: true },
      },
      {
        path: "forbidden",
        element: <ForbiddenPage />,
        meta: { title: "Access Denied", requiresAuth: true, hideInSidebar: true },
      },

      // System Admin Only Routes
      {
        path: "admin",
        element: <Outlet />,
        meta: {
          title: "Administration",
          requiresAuth: true,
          roles: ["ROLE_SYSTEM_ADMIN"],
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
            meta: { title: "Units Master" },
            children: [
              { index: true, element: <div>Units List View</div> },
              {
                path: ":unitId",
                element: <div>Unit Detail View</div>,
                meta: { hideInSidebar: true },
              },
            ],
          },
          {
            path: "hlc",
            element: <div>Head Load Categories (HLC)</div>,
            meta: { title: "HLC Categories" },
          },
          {
            path: "bank-accounts",
            element: <div>Org Bank Accounts</div>,
            meta: { title: "Bank Accounts" },
          },
          {
            path: "products",
            element: <div>Global Product Catalog</div>,
            meta: { title: "Products Master" },
          },
          {
            path: "pricing",
            element: <div>Pricing Models</div>,
            meta: { title: "Pricing Rules" },
          },
        ],
      },

      // Operations (Unit Admin & Manager) Routes
      {
        path: "unit",
        element: <Outlet />,
        meta: {
          requiresAuth: true,
          roles: ["ROLE_SYSTEM_ADMIN", "ROLE_UNIT_ADMIN", "ROLE_UNIT_MANAGER"],
        },
        children: [
          {
            path: "mpcs",
            element: <div>MPCS Master</div>,
            meta: { title: "MPCS Management" },
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
                meta: { title: "Sales Entry" },
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
                meta: { title: "Tankers" },
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
