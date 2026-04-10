import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "@/interceptors/apiInterceptor";
import { API_ENDPOINTS } from "@/utility/endpoints";
import { paginationType } from "../types";

export const fetchProductDetails = createAsyncThunk(
  "product/fetchProductDetails",
  async (id: string, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get(API_ENDPOINTS.PRODUCTS.DETAILS(id));
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const fetchProductReviews = createAsyncThunk(
  "product/fetchProductReviews",
  async ({ id, pagination }: { id: string, pagination: paginationType }, { rejectWithValue }) => {
    try {
      const { page = 1, limit = 10, sortBy = "createdAt", isAsc = false } = pagination;
      const res = await axiosInstance.get(API_ENDPOINTS.REVIEWS.ITEM_REVIEWS(id, { page, limit, sortBy, isAsc }));
      return {
        items: res.data.results || [],
        pagination: {
          page: res.data.meta?.currentPage || page,
          totalPages: res.data.meta?.totalPages || 1,
          totalItems: res.data.meta?.total || 0,
          limit,
          sortBy,
          isAsc,
          loading: false,
        }
      };
    } catch (err: any) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const fetchSimilarItems = createAsyncThunk(
  "product/fetchSimilarItems",
  async ({ id, pagination }: { id: string, pagination: paginationType }, { rejectWithValue }) => {
    try {
      const { page = 1, limit = 6, sortBy = 'name', isAsc = true } = pagination;
      const res = await axiosInstance.get(API_ENDPOINTS.PRODUCTS.SIMILAR(id, { page, limit, sortBy, isAsc }));
      
      return {
        items: res.data.results || [],
        pagination: {
          page: res.data.meta?.currentPage || page,
          totalPages: res.data.meta?.totalPages || 1,
          totalItems: res.data.meta?.total || 0,
          limit,
          sortBy,
          isAsc,
          loading: false,
        }
      }
    } catch (err: any) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const fetchAlsoLikeItems = createAsyncThunk(
  "product/fetchAlsoLikeItems",
  async ({ id, pagination }: { id: string, pagination: paginationType }, { rejectWithValue }) => {
    try {
      const { page = 1, limit = 6, sortBy = 'name', isAsc = true } = pagination;
      const res = await axiosInstance.get(API_ENDPOINTS.PRODUCTS.ALSO_LIKE(id, { page, limit, sortBy, isAsc }));
      return {
        items: res.data.results || [],
        pagination: {
          page: res.data.meta?.currentPage || page,
          totalPages: res.data.meta?.totalPages || 1,
          totalItems: res.data.meta?.total || 0,
          limit,
          sortBy,
          isAsc,
          loading: false,
        }
      }
    } catch (err: any) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const fetchAlsoBoughtItems = createAsyncThunk(
  "product/fetchAlsoBoughtItems",
  async ({ id, pagination }: { id: string, pagination: paginationType }, { rejectWithValue }) => {
    try {
      const { page = 1, limit = 6, sortBy = 'name', isAsc = true } = pagination;
      const res = await axiosInstance.get(API_ENDPOINTS.PRODUCTS.ALSO_BOUGHT(id, { page, limit, sortBy, isAsc }));
      return {
        items: res.data.results || [],
        pagination: {
          page: res.data.meta?.currentPage || page,
          totalPages: res.data.meta?.totalPages || 1,
          totalItems: res.data.meta?.total || 0,
          limit,
          sortBy,
          isAsc,
          loading: false,
        }
      }
    } catch (err: any) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const submitProductReview = createAsyncThunk(
  "product/submitProductReview",
  async (payload: { reviewType: string, itemId: string, content: string, rating: number }, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post(API_ENDPOINTS.REVIEWS.CREATE, payload);
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);
