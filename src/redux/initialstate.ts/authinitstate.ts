import { AuthState } from "../types";

export const AuthInitialState: AuthState = {
  token: null,
  user: null,
  userDetails: null,
  loading: false,
  error: null,
  hashKey: null,
  identifier: null,
};
