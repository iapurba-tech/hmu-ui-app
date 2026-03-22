import React from 'react';
import { useRoutes, type RouteObject } from 'react-router-dom';
import { routes, type RouteConfig } from './routes';

const transformRoutes = (routes: RouteConfig[]): RouteObject[] => {
  return routes.map((route) => ({
    path: route.path,
    element: route.element,
    children: route.children ? transformRoutes(route.children) : undefined,
  }));
};

const AppRouter: React.FC = () => {
  const element = useRoutes(transformRoutes(routes));
  return element;
};

export default AppRouter;
