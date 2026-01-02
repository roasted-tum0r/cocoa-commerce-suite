import axiosInstance from "@/interceptors/apiInterceptor";
import { API_ENDPOINTS } from "@/utility/endpoints";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const subscribeNewsletter = createAsyncThunk(
    "newsletter/subscribe",
    async (payload: any, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post(
                API_ENDPOINTS.NEWSLETTER.SUBSCRIBE,
                payload
            );
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const unsubscribeNewsletter = createAsyncThunk(
    "newsletter/unsubscribe",
    async (email: string, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get(
                API_ENDPOINTS.NEWSLETTER.UNSUBSCRIBE(email)
            );
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);
