import axios from "axios";
import { useAuthStore } from "../store/useAuthStore";

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000, // Fail fast after 10 seconds
});

apiClient.interceptors.request.use(
  (config) => {
    const { token, activeUnit } = useAuthStore.getState();

    // Attach the JWT
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    // Attach Unit ID for multi-tenant backend queries
    if (activeUnit?.id) {
      config.headers["X-Unit-Context"] = activeUnit.id;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

apiClient.interceptors.request.use(
  (response) => response,
  (error) => {
    if (error.response?.status == 401) {
      console.warn("Session expired or unauthorized. Logging out.");
    }

    useAuthStore.getState().logout();

    //Hard redirect to the login page
    if (window.location.pathname !== "/login") {
      window.location.href = "/login";
    }

    return Promise.reject(error);
  },
);
