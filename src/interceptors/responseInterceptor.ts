// src/api/interceptors/responseInterceptor.ts
import type { AxiosInstance, AxiosError, AxiosResponse } from "axios";

export const setupResponseInterceptor = (axiosInstance: AxiosInstance) => {
  axiosInstance.interceptors.response.use(
    (response: AxiosResponse) => {
      return response.data;
    },
    async (error: AxiosError) => {
      if (error.response?.status === 401) {
        console.warn("Unauthorized, redirecting to login...");
        // Optionally clear tokens and redirect
        localStorage.removeItem("access_token");
        window.location.href = "/login";
      }

      return Promise.reject(error);
    }
  );
};
