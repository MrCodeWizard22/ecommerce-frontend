import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    email: localStorage.getItem("email") || null,
    token: localStorage.getItem("token") || null,
    userId: localStorage.getItem("userId") || null,
  },
  reducers: {
    login: (state, action) => {
      state.email = action.payload.email;
      state.token = action.payload.token;
      state.userId = action.payload.userId;

      localStorage.setItem("email", action.payload.email);
      localStorage.setItem("token", action.payload.token);
      localStorage.setItem("userId", action.payload.userId);
    },
    logout: (state) => {
      state.token = null;
      state.email = null;
      state.userId = null;
      localStorage.removeItem("token");
      localStorage.removeItem("email");
      localStorage.removeItem("userId");
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
