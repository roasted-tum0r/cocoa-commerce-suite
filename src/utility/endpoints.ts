type EndpointFunction = (...args: any[]) => string;

function createGroup<T extends Record<string, string | EndpointFunction>>(prefix: string, endpoints: T): T {
  const result = {} as any;
  for (const key in endpoints) {
    const value = endpoints[key];
    if (typeof value === "function") {
      result[key] = (...args: any[]) => {
        const path = value(...args);
        if (path.startsWith("/")) return path.slice(1);
        return path.startsWith("?") ? `${prefix}${path}` : path ? `${prefix}/${path}` : prefix;
      };
    } else if (typeof value === "string") {
      if (value.startsWith("/")) {
        result[key] = value.slice(1);
      } else {
        result[key] = value.startsWith("?") ? `${prefix}${value}` : value ? `${prefix}/${value}` : prefix;
      }
    }
  }
  return result;
}

export const API_ENDPOINTS = {
  CATEGORIES: createGroup("item-categories", {
    FIND_ALL: "findall",
  }),

  PRODUCTS: createGroup("items", {
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

      return `list${query.toString() ? `?${query.toString()}` : ""}`;
    },
    DETAILS: (id: string) => `details/${id}`,
    SIMILAR: (id: string, params?: { limit?: number; page?: number; sortBy?: string; isAsc?: boolean }) => {
      const query = new URLSearchParams();
      if (params?.limit) query.append("limit", params.limit.toString());
      if (params?.page) query.append("page", params.page.toString());
      if (params?.sortBy) query.append("sortBy", params.sortBy);
      if (params?.isAsc !== undefined) query.append("isAsc", params.isAsc.toString());
      return `details/${id}/similar${query.toString() ? `?${query.toString()}` : ""}`;
    },
    ALSO_LIKE: (id: string, params?: { limit?: number; page?: number; sortBy?: string; isAsc?: boolean }) => {
      const query = new URLSearchParams();
      if (params?.limit) query.append("limit", params.limit.toString());
      if (params?.page) query.append("page", params.page.toString());
      if (params?.sortBy) query.append("sortBy", params.sortBy);
      if (params?.isAsc !== undefined) query.append("isAsc", params.isAsc.toString());
      return `details/${id}/also-like${query.toString() ? `?${query.toString()}` : ""}`;
    },
    ALSO_BOUGHT: (id: string, params?: { limit?: number; page?: number; sortBy?: string; isAsc?: boolean }) => {
      const query = new URLSearchParams();
      if (params?.limit) query.append("limit", params.limit.toString());
      if (params?.page) query.append("page", params.page.toString());
      if (params?.sortBy) query.append("sortBy", params.sortBy);
      if (params?.isAsc !== undefined) query.append("isAsc", params.isAsc.toString());
      return `details/${id}/also-bought${query.toString() ? `?${query.toString()}` : ""}`;
    },
  }),

  REVIEWS: createGroup("reviews", {
    CREATE: "",
    DELETE: (id: string) => `${id}`,
    UPDATE: (id: string) => `${id}`,
    ITEM_REVIEWS: (id: string, params?: { page?: number; limit?: number; sortBy?: string; isAsc?: boolean }) => {
      const query = new URLSearchParams();

      if (params) {
        if (params.page !== undefined) query.append("page", params.page.toString());
        if (params.limit !== undefined) query.append("limit", params.limit.toString());
        if (params.sortBy !== undefined) query.append("sortBy", params.sortBy);
        if (params.isAsc !== undefined) query.append("isAsc", String(params.isAsc));
      }

      return `item/${id}${query.toString() ? `?${query.toString()}` : ""}`;
    },
  }),

  CART: createGroup("cart", {
    ADD_TO_CART: "add-to-cart",
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

      return query.toString() ? `?${query.toString()}` : "";
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

      return `cart-info${query.toString() ? `?${query.toString()}` : ""}`;
    },
    DELETE_ITEMS: (cartId: string) => `delete-all?cartId=${cartId}`,
    UPDATE_ITEM_QUANTITY: (params: { itemId: string; userId: string; isGuestCart: boolean }) => 
      `/cart-items/update?itemId=${params.itemId}&userId=${params.userId}&isGuestCart=${params.isGuestCart}`,
  }),

  AUTH: createGroup("auth", {
    REGISTER: "register-new-user",
    LOGIN: "login-with-password",
    VERIFY_OTP: "verify-otp",
    USER_DETAILS: "user-details",
    UPDATE_USER: (id: string) => `update-user/${id}`,
    REQUEST_PASSWORD_OTP: "request-password-otp",
    UPDATE_PASSWORD: "update-password",
  }),

  NEWSLETTER: createGroup("newsletter-subs", {
    SUBSCRIBE: "",
    UNSUBSCRIBE: (email: string) => `unsubscribe?email=${encodeURIComponent(email)}`,
  }),

  UPLOAD: "upload",
};
