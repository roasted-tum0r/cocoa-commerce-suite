import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  fetchCategories,
  fetchLatestProducts,
  fetchDashboardStats,
  fetchCartItems,
  fetchWishlistItems,
  fetchNotifications,
} from "../thunks/homethunk";
import { HomeState } from "../types";
import { HomeInitialState } from "../initialstate.ts/homeinitstate";



export const homereducer = createSlice({
  name: "home",
  initialState: HomeInitialState,
  reducers: {
    setLastPath:(state,action:PayloadAction<string>)=>{
      state.lastPath=action.payload
    }
  },
  extraReducers: (builder) => {
    builder
      // Categories
      .addCase(fetchCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.categories.pagination.loading = true;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.categories.pagination.loading = false;
        const { total, currentPage, totalPages, results } = action.payload;
        state.categories = {
          items: results,
          pagination: {
            totalItems: total,
            totalPages,
            page: currentPage,
            limit: 10,
            loading: false,
            sortBy: "createdAt",
            isAsc: true,
          },
        };
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Latest Products
      .addCase(fetchLatestProducts.pending, (state) => {
        state.loading = true;
        state.latestProducts.pagination.loading = true;
      })
      .addCase(fetchLatestProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.latestProducts.items = action.payload.items;
        state.latestProducts.pagination = action.payload.pagination;
      })
      .addCase(fetchLatestProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Dashboard Stats
      .addCase(fetchDashboardStats.fulfilled, (state, action) => {
        const {
          totalProducts,
          totalCustomers,
          totalRatings,
          totalSatisfiedCustomers,
        } = action.payload;
        state.totalProducts = totalProducts;
        state.totalCustomers = totalCustomers;
        state.totalRatings = totalRatings;
        state.totalSatisfiedCustomers = totalSatisfiedCustomers;
      })

      // Cart
      .addCase(fetchCartItems.fulfilled, (state, action) => {
        state.cartItems = action.payload;
      })

      // Wishlist
      .addCase(fetchWishlistItems.fulfilled, (state, action) => {
        state.wishListItems = action.payload;
      })

      // Notifications
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.notifications = action.payload;
      });
  },
});

export const { setLastPath } = homereducer.actions;
export default homereducer.reducer;
