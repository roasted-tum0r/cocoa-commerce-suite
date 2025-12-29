import { HomeState } from "../types";

export const HomeInitialState: HomeState = {
  categories: {
    items: [],
    pagination: {
      loading: false,
      page: 1,
      limit: 10,
      totalPages: 1,
      totalItems: 0,
      sortBy: "createdAt",
      isAsc: true,
    },
  },
  latestProducts: {
    items: [],
    pagination: {
      loading: false,
      page: 1,
      limit: 10,
      totalPages: 1,
      totalItems: 0,
      sortBy: "createdAt",
      isAsc: true,
    },
  },
  totalProducts: 0,
  totalCustomers: 0,
  totalRatings: 0,
  totalSatisfiedCustomers: 0,
  cartItems: {
    items: [],
    pagination: {
      loading: false,
      page: 1,
      limit: 10,
      totalPages: 1,
      totalItems: 0,
      sortBy: "createdAt",
      isAsc: true,
    },
  },
  notifications: {
    items: [],
    pagination: {
      loading: false,
      page: 1,
      limit: 10,
      totalPages: 1,
      totalItems: 0,
      sortBy: "createdAt",
      isAsc: true,
    },
  },
  wishListItems: {
    items: [],
    pagination: {
      loading: false,
      page: 1,
      limit: 10,
      totalPages: 1,
      totalItems: 0,
      sortBy: "createdAt",
      isAsc: true,
    },
  },
  loading: false,
  error: null,
  lastPath: "",
};