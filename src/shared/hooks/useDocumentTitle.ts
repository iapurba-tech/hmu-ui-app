import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { getRouteTitle } from "../../app/router/routeUtils"; // Adjust path if needed

export const useDocumentTitle = () => {
  const location = useLocation();

  useEffect(() => {
    const routeTitle = getRouteTitle(location.pathname);
    const displayTitle = routeTitle !== "Unknown Route" ? routeTitle : "Portal";
    document.title = `${displayTitle} | Howrah Milk Union`;
  }, [location.pathname]);
};
