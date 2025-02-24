import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
const store = configureStore({
  reducer: {
    auth: authReducer,
    // posts: postsReducer,
  },
});
export default store;
