// src/store/cart/cartSlice.ts
import { createSlice } from "@reduxjs/toolkit";
import { addToCart, fetchCart, fetchCartInfo } from "../thunks/cartthunk";
import { CartInitialState } from "../initialstate.ts/cartinitstate";



export const cartSlice = createSlice({
  name: "cart",
  initialState: CartInitialState,
  reducers: {
    clearCart(state) {
      state.cartId = null;
      state.items = [];
      state.cartInfo = null;
      state.guestUserId = null;
      state.error = null;
      state.cartCount = 0;
    },
  },
  extraReducers: (builder) => {
    // 🛒 addToCart
    builder
      .addCase(addToCart.pending, (state) => {
        state.loading = true;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.loading = false;
        state.cartId = action.payload.cartId;
        state.guestUserId = action.payload.guestUserId;
        state.error = null;
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // 🧺 fetchCart
    builder
      .addCase(fetchCart.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload?.items || [];
        state.cartId = action.payload?.id;
        state.error = null;
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // 🧾 fetchCartInfo
    builder
      .addCase(fetchCartInfo.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCartInfo.fulfilled, (state, action) => {
        state.loading = false;
        state.cartInfo = action.payload?.addedItems;
        state.cartCount = action.payload?.cartCount;
        state.error = null;
      })
      .addCase(fetchCartInfo.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearCart } = cartSlice.actions;

