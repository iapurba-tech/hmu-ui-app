import { routes, type RouteConfig } from "./routes";

export const getRouteTitle = (
  targetPath: string,
  routeList: RouteConfig[] = routes,
  basePath: string = "",
): string => {
  for (const route of routeList) {
    const currentPath = route.path?.startsWith("/")
      ? route.path
      : `${basePath}/${route.path}`.replace(/\/+/g, "/");

    if (currentPath == targetPath && route?.meta?.title) {
      return route.meta.title;
    }

    if (route.children) {
      const childTitle = getRouteTitle(targetPath, route.children, currentPath);
      if (childTitle !== "Unknown Route") {
        return childTitle;
      }
    }
  }

  return "Unknown Route";
};
