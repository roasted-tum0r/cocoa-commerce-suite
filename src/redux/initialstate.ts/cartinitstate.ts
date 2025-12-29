import { CartState } from "../types";


export const CartInitialState: CartState = {
  cartId: null,
  guestUserId: null,
  items: [],
  cartInfo: null,
  loading: false,
  error: null,
  cartCount: 0,
};