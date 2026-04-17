import { createSlice } from "@reduxjs/toolkit";
import { AuthInitialState } from "../initialstate.ts/authinitstate";
import { loginUser, registerUser, verifyOtp, fetchUserDetails, updateAuthUser } from "../thunks/auththunk";

export const authslice = createSlice({
  name: "auth",
  initialState: AuthInitialState,
  reducers: {
    setUser(state, action) {
      state.user = { ...state.user, id: action.payload };
    },
    clearError(state) {
      state.error = null;
    },
    logout(state) {
      state.user = null;
      state.token = null;
      state.hashKey = null;
      state.identifier = null;
    }
  },
  extraReducers: (builder) => {
    // Register
    builder.addCase(registerUser.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(registerUser.fulfilled, (state, action) => {
      state.loading = false;
      // Assuming response contains hashKey and identifier (email/phone)
      // Adjust based on actual API response structure if needed
      state.hashKey = action.payload.hashKey || null;
      state.identifier = action.payload.identifier || action.meta.arg.email || action.meta.arg.phone;
    });
    builder.addCase(registerUser.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Login
    builder.addCase(loginUser.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(loginUser.fulfilled, (state, action) => {
      state.loading = false;
      state.hashKey = action.payload.hash_key || null;
      state.identifier = action.payload.identifier ?? action.meta.arg.identifier;
    });
    builder.addCase(loginUser.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });
    // Verify OTP
    builder.addCase(verifyOtp.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(verifyOtp.fulfilled, (state, action) => {
      state.loading = false;
      state.token = action.payload.accesstoken;
      state.user = {
        id: action.payload.id,
        name: `${action.payload.firstname} ${action.payload.lastname}`,
        email: action.payload.email,
        role: action.payload.role,
        phone: action.payload.phone,
        firstname: action.payload.firstname,
        lastname: action.payload.lastname,
        createdAt: action.payload.createdAt,
      };
      // Clear temp auth data
      state.hashKey = null;
      state.identifier = null;
    });
    builder.addCase(verifyOtp.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Fetch User Details
    builder.addCase(fetchUserDetails.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchUserDetails.fulfilled, (state, action) => {
      state.loading = false;
      state.userDetails = action.payload;
    });
    builder.addCase(fetchUserDetails.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Update Auth User
    builder.addCase(updateAuthUser.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(updateAuthUser.fulfilled, (state, action) => {
      state.loading = false;
      // Sync local userDetails with updated data
      state.userDetails = action.payload.data;
      
      // Keep basic user info synced too
      if (state.user) {
        state.user.firstname = action.payload.data?.firstname || state.user.firstname;
        state.user.lastname = action.payload.data?.lastname || state.user.lastname;
        state.user.name = `${action.payload.data?.firstname || ''} ${action.payload.data?.lastname || ''}`.trim() || state.user.name;
        state.user.email = action.payload.data?.email || state.user.email;
        state.user.phone = action.payload.data?.phone || state.user.phone;
      }
    });
    builder.addCase(updateAuthUser.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });
  },
});

export const { setUser, clearError, logout } = authslice.actions;