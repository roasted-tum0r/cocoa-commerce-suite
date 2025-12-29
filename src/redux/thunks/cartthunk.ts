import axiosInstance from "@/interceptors/apiInterceptor";
import { API_ENDPOINTS } from "@/utility/endpoints";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { appDispatch } from "../store";
import { setUser } from "../reducers/authreducer";

export const addToCart = createAsyncThunk(
  "cart/addToCart",
  async (
    payload: { itemId: string; isGuestCart: boolean; userId?: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await axiosInstance.post(
        API_ENDPOINTS.CART.ADD_TO_CART,
        payload
      );
      appDispatch(
        fetchCartInfo({
          cartId: response.data.cartId,
          isGuestCart: payload.isGuestCart,
          userId: response.data.guestUserId,
        })
      );
      // if (response.data.guestUserId) {
      //   appDispatch(setUser(response.data.guestUserId));
      // }
      return response.data; // { cartId, guestUserId }
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// 🧺 Fetch Cart by ID
export const fetchCart = createAsyncThunk(
  "cart/fetchCart",
  async (
    payload: { userId: string; isGuestCart: boolean },
    { rejectWithValue }
  ) => {
    try {
      const response = await axiosInstance.get(
        API_ENDPOINTS.CART.GET_CART(payload)
      );
      return response.data; // full cart object
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// 🧾 Fetch Cart Info (count + summary)
export const fetchCartInfo = createAsyncThunk(
  "cart/fetchCartInfo",
  async (
    payload: { cartId: string; isGuestCart: boolean; userId: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await axiosInstance.get(
        API_ENDPOINTS.CART.CART_INFO(payload)
      );
      return response.data; // { cartCount, addedItems[] }
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);
