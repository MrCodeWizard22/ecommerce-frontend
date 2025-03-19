import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import cartReducer from "./cartSlice";
const store = configureStore({
  reducer: {
    auth: authReducer,
    // posts: postsReducer,
    cart: cartReducer,
  },
});
export default store;
