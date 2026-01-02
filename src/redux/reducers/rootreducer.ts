// src/app/rootReducer.ts
import { combineReducers } from '@reduxjs/toolkit';
import { homereducer } from './homereducer';
import { cartSlice } from './cartreducer';
import { authslice } from './authreducer';
import { newsletterslice } from './newsletterreducer';


const rootReducer = combineReducers({
  auth: authslice.reducer,
  // product: productReducer,
  home: homereducer.reducer,
  cart: cartSlice.reducer,
  newsletter: newsletterslice.reducer,
});

export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;