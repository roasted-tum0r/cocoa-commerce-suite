import axiosInstance from "@/interceptors/apiInterceptor";
import { API_ENDPOINTS } from "@/utility/endpoints";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { FetchLatestProductsParams, paginationType } from "../types";

// Fetch categories
export const fetchCategories = createAsyncThunk(
  "home/fetchCategories",
  async (
    {
      page = 1,
      limit = 10,
      sortBy = "createdAt",
      isAsc = true,
    }: paginationType,
    { rejectWithValue }
  ) => {
    try {
      const res = await axiosInstance.post(API_ENDPOINTS.CATEGORIES.FIND_ALL, {
        page: page,
        limit: limit,
        sortBy: sortBy,
        isAsc: isAsc,
      });
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// Fetch latest products
export const fetchLatestProducts = createAsyncThunk(
  "home/fetchLatestProducts",
  async (params: FetchLatestProductsParams, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get(
        API_ENDPOINTS.PRODUCTS.LIST({
          page: params.page ?? 1,
          limit: params.limit ?? 10,
          sortBy: params.sortBy ?? "createdAt",
          isAsc: params.isAsc ?? true,
          isAvailable: params.isAvailable ?? true,
          categoryIds: params.categoryIds ?? [],
          search: params.search ?? "",
          minPrice: params.minPrice,
          maxPrice: params.maxPrice,
        })
      );

      const { data } = res;

      return {
        items: data.results,
        pagination: {
          page: data.meta.currentPage,
          totalPages: data.meta.totalPages,
          totalItems: data.meta.total,
          limit: params.limit ?? 10,
          sortBy: params.sortBy ?? "createdAt",
          isAsc: params.isAsc ?? true,
          loading: false,
        },
      };
    } catch (err: any) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// Fetch dashboard stats (totals)
export const fetchDashboardStats = createAsyncThunk(
  "home/fetchDashboardStats",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get("/api/dashboard/stats");
      return res.data; // { totalProducts, totalCustomers, totalRatings, totalSatisfiedCustomers }
    } catch (err: any) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// Fetch cart items
export const fetchCartItems = createAsyncThunk(
  "home/fetchCartItems",
  async (userId: string, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get(`/api/cart/${userId}`);
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// Fetch wishlist items
export const fetchWishlistItems = createAsyncThunk(
  "home/fetchWishlistItems",
  async (userId: string, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get(`/api/wishlist/${userId}`);
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// Fetch notifications
export const fetchNotifications = createAsyncThunk(
  "home/fetchNotifications",
  async (userId: string, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get(`/api/notifications/${userId}`);
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);
