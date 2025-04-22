import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    email: localStorage.getItem("email") || null,
    token: localStorage.getItem("token") || null,
    userId: localStorage.getItem("userId") || null,
    role: localStorage.getItem("role") || null,
  },
  reducers: {
    login: (state, action) => {
      state.email = action.payload.email;
      state.token = action.payload.token;
      state.userId = action.payload.userId;
      state.role = action.payload.role;
      localStorage.setItem("email", action.payload.email);
      localStorage.setItem("token", action.payload.token);
      localStorage.setItem("userId", action.payload.userId);
      localStorage.setItem("role", action.payload.role);
    },
    logout: (state) => {
      state.token = null;
      state.email = null;
      state.userId = null;
      state.role = null;
      localStorage.removeItem("token");
      localStorage.removeItem("email");
      localStorage.removeItem("userId");
      localStorage.removeItem("role");
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
