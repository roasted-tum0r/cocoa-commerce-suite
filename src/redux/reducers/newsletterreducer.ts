import { createSlice } from "@reduxjs/toolkit";
import { NewsletterInitialState } from "../initialstate.ts/newsletterinitstate";
import { subscribeNewsletter, unsubscribeNewsletter } from "../thunks/newsletterthunk";

export const newsletterslice = createSlice({
    name: "newsletter",
    initialState: NewsletterInitialState,
    reducers: {
        clearNewsletterMessage(state) {
            state.message = null;
            state.error = null;
        },
        resetNewsletterState(state) {
            state.loading = false;
            state.error = null;
            state.subscribed = false;
            state.message = null;
        }
    },
    extraReducers: (builder) => {
        // Subscribe
        builder.addCase(subscribeNewsletter.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(subscribeNewsletter.fulfilled, (state, action) => {
            state.loading = false;
            state.subscribed = true;
            state.message = "Successfully subscribed!";
        });
        builder.addCase(subscribeNewsletter.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
        });

        // Unsubscribe
        builder.addCase(unsubscribeNewsletter.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(unsubscribeNewsletter.fulfilled, (state, action) => {
            state.loading = false;
            state.subscribed = false;
            state.message = "Successfully unsubscribed.";
        });
        builder.addCase(unsubscribeNewsletter.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
        });
    },
});

export const { clearNewsletterMessage, resetNewsletterState } = newsletterslice.actions;
