import React from "react";
import { useRoutes, type RouteObject } from "react-router-dom";
import { routes, type RouteConfig } from "./routes";
import { RoleGuard } from "./RoleGuard";

const transformRoutes = (routes: RouteConfig[]): RouteObject[] => {
  return routes.map((route) => {
    let currentElement = route.element;

    // Wrap with RoleGuard if roles are specified in meta
    if (route.meta?.roles && route.meta.roles.length > 0) {
      currentElement = (
        <RoleGuard allowedRoles={route.meta.roles}>
          {currentElement}
        </RoleGuard>
      );
    }

    if (route.index) {
      return {
        index: true,
        element: currentElement,
      };
    }

    return {
      path: route.path,
      index: route.index,
      element: currentElement,
      children: route.children ? transformRoutes(route.children) : undefined,
    };
  });
};

const AppRouter: React.FC = () => {
  const element = useRoutes(transformRoutes(routes));
  return element;
};

export default AppRouter;
