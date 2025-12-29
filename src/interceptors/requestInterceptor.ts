// src/api/interceptors/requestInterceptor.ts
import { getAccessToken } from "@/utility/token";
import type { AxiosInstance, InternalAxiosRequestConfig } from "axios";

export const setupRequestInterceptor = (axiosInstance: AxiosInstance) => {
  axiosInstance.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      const token = getAccessToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );
};
