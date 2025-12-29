// src/api/axiosInstance.ts
import axios from "axios";
import { setupRequestInterceptor } from "./requestInterceptor";
import { setupResponseInterceptor } from "./responseInterceptor";

const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_NEST_API_URL,
    timeout: 60000,
    headers: {
        "Content-Type": "application/json",
    },
});

// attach interceptors
setupRequestInterceptor(axiosInstance);
setupResponseInterceptor(axiosInstance);

export default axiosInstance;
