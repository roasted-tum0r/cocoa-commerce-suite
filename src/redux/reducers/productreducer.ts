import { createSlice } from "@reduxjs/toolkit";
import { ProductState } from "../types";
import {
  fetchProductDetails,
  fetchProductReviews,
  fetchSimilarItems,
  fetchAlsoLikeItems,
  fetchAlsoBoughtItems
} from "../thunks/productthunk";

const initialState: ProductState = {
  productDetails: null,
  reviews: { items: [], pagination: { loading: false, page: 1, limit: 10, totalPages: 1, totalItems: 0 } },
  similarItems: { items: [], pagination: { loading: false, page: 1, limit: 6, totalPages: 1, totalItems: 0 } },
  alsoLikeItems: { items: [], pagination: { loading: false, page: 1, limit: 6, totalPages: 1, totalItems: 0 } },
  alsoBoughtItems: { items: [], pagination: { loading: false, page: 1, limit: 6, totalPages: 1, totalItems: 0 } },
  loading: false,
  error: null,
};

export const productslice = createSlice({
  name: "product",
  initialState,
  reducers: {
    clearProductState: (state) => {
      state.productDetails = null;
      state.reviews = initialState.reviews;
      state.similarItems = initialState.similarItems;
      state.alsoLikeItems = initialState.alsoLikeItems;
      state.alsoBoughtItems = initialState.alsoBoughtItems;
      state.loading = false;
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    // Details
    builder.addCase(fetchProductDetails.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchProductDetails.fulfilled, (state, action) => {
      state.productDetails = action.payload;
      state.loading = false;
    });
    builder.addCase(fetchProductDetails.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Reviews
    builder.addCase(fetchProductReviews.fulfilled, (state, action) => {
      state.reviews = action.payload;
    });

    // Similar Items
    builder.addCase(fetchSimilarItems.pending, (state) => {
      state.similarItems.pagination.loading = true;
    });
    builder.addCase(fetchSimilarItems.fulfilled, (state, action) => {
      state.similarItems.items = action.payload.items;
      state.similarItems.pagination = action.payload.pagination;
    });
    builder.addCase(fetchSimilarItems.rejected, (state, action) => {
      state.similarItems.pagination.loading = false;
    });

    // Also Like Items
    builder.addCase(fetchAlsoLikeItems.pending, (state) => {
      state.alsoLikeItems.pagination.loading = true;
    });
    builder.addCase(fetchAlsoLikeItems.fulfilled, (state, action) => {
      state.alsoLikeItems.items = action.payload.items;
      state.alsoLikeItems.pagination = action.payload.pagination;
    });
    builder.addCase(fetchAlsoLikeItems.rejected, (state, action) => {
      state.alsoLikeItems.pagination.loading = false;
    });

    // Also Bought Items
    builder.addCase(fetchAlsoBoughtItems.pending, (state) => {
      state.alsoBoughtItems.pagination.loading = true;
    });
    builder.addCase(fetchAlsoBoughtItems.fulfilled, (state, action) => {
      state.alsoBoughtItems.items = action.payload.items;
      state.alsoBoughtItems.pagination = action.payload.pagination;
    });
    builder.addCase(fetchAlsoBoughtItems.rejected, (state, action) => {
      state.alsoBoughtItems.pagination.loading = false;
    });
  }
});

export const { clearProductState } = productslice.actions;
export default productslice.reducer;
