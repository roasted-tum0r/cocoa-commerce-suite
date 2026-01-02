export const API_ENDPOINTS = {
  CATEGORIES: {
    FIND_ALL: "item-categories/findall",
  },

  PRODUCTS: {
    LIST: (params?: {
      page?: number;
      limit?: number;
      sortBy?: string;
      isAsc?: boolean;
      isAvailable?: boolean;
      categoryIds?: string[];
      search?: string;
      minPrice?: number;
      maxPrice?: number;
    }) => {
      const query = new URLSearchParams();

      if (params) {
        if (params.page) query.append("page", params.page.toString());
        if (params.limit) query.append("limit", params.limit.toString());
        if (params.sortBy) query.append("sortBy", params.sortBy);
        if (params.isAsc !== undefined)
          query.append("isAsc", String(params.isAsc));
        if (params.isAvailable !== undefined)
          query.append("isAvailable", String(params.isAvailable));
        if (params.categoryIds)
          params.categoryIds.forEach((id) => query.append("categoryIds", id));
        if (params.search) query.append("search", params.search);
        if (params.minPrice)
          query.append("minPrice", params.minPrice.toFixed(2));
        if (params.maxPrice)
          query.append("maxPrice", params.maxPrice.toFixed(2));
      }

      return `items/list${query.toString() ? `?${query.toString()}` : ""}`;
    },
  },
  CART: {
    ADD_TO_CART: "cart/add-to-cart",
    // GET_CART: (userId: string) => `cart?userId=${userId}`,
    GET_CART: (params?: {
      userId: string;
      isGuestCart?: boolean;
    }) => {
      const query = new URLSearchParams();

      if (params) {
        if (params.userId) query.append("userId", params.userId);
        if (params.isGuestCart !== undefined)
          query.append("isGuestCart", String(params.isGuestCart));
      }

      return `cart${query.toString() ? `?${query.toString()}` : ""}`;
    },
    CART_INFO: (params?: {
      cartId?: string;
      userId?: string;
      isGuestCart?: boolean;
    }) => {
      const query = new URLSearchParams();

      if (params) {
        if (params.cartId) query.append("cartId", params.cartId);
        if (params.userId) query.append("userId", params.userId);
        if (params.isGuestCart !== undefined)
          query.append("isGuestCart", String(params.isGuestCart));
      }

      return `cart/cart-info${query.toString() ? `?${query.toString()}` : ""}`;
    },
  },
  AUTH: {
    REGISTER: "auth/register-new-user",
    LOGIN: "auth/login-with-password",
    VERIFY_OTP: "auth/verify-otp",
  },
  NEWSLETTER: {
    SUBSCRIBE: "newsletter-subs",
    UNSUBSCRIBE: (email: string) => `newsletter-subs/unsubscribe?email=${encodeURIComponent(email)}`,
  },
};
