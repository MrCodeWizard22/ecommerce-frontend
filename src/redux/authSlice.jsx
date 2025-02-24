import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    email: localStorage.getItem("email") || null,
    token: localStorage.getItem("token") || null,
  },
  reducers: {
    login: (state, action) => {
      state.email = action.payload.email;
      state.token = action.payload.token;

      localStorage.setItem("email", action.payload.email);
      localStorage.setItem("token", action.payload.token);
    },
    logout: (state) => {
      state.token = null;
      state.email = null;
      localStorage.removeItem("token");
      localStorage.removeItem("email");
    },
  },
});
export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
