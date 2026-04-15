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
  async (payload: { reviewType: string, itemId: string, content: string, rating: number, images?: { publicId: string, url: string }[] }, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post(API_ENDPOINTS.REVIEWS.CREATE, payload);
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// Supported owner types — extend this enum as new sections need uploads
export type MediaOwnerType = "REVIEW" | "ITEM" | "USER" | "CATEGORY";

export const uploadMedia = createAsyncThunk(
  "product/uploadMedia",
  async (
    { files, ownerType, callbackfn }: { files: File[]; ownerType: MediaOwnerType, callbackfn?: (data: any) => void },
    { rejectWithValue }
  ) => {
    try {
      const formData = new FormData();
      files.forEach((file) => {
        formData.append("files", file);
      });
      formData.append("ownerType", ownerType);
      const res: any = await axiosInstance.post(API_ENDPOINTS.UPLOAD, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (callbackfn) {
        callbackfn(res.files);
      }
      return res.files;
    } catch (err: any) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const deleteProductReview = createAsyncThunk(
  "product/deleteProductReview",
  async (id: string, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.delete(API_ENDPOINTS.REVIEWS.DELETE(id));
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const updateProductReview = createAsyncThunk(
  "product/updateProductReview",
  async ({ id, payload }: { id: string, payload: { content?: string, rating?: number, imagesToDelete?: string[], imagesToAdd?: { publicId: string, url: string }[] } }, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.patch(API_ENDPOINTS.REVIEWS.UPDATE(id), payload);
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const deleteMediaFiles = createAsyncThunk(
  "product/deleteMediaFiles",
  async (publicIds: string[], { rejectWithValue }) => {
    try {
      const res = await axiosInstance.delete(API_ENDPOINTS.UPLOAD, {
        data: { publicIds }
      });
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);
