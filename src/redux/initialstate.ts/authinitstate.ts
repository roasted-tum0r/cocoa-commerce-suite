import { AuthState } from "../types";

export const AuthInitialState: AuthState = {
  token: null,
  user: null,
  loading: false,
  error: null,
  hashKey: null,
  identifier: null,
};
