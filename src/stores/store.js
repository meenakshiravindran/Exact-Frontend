import { configureStore, createSlice } from "@reduxjs/toolkit";

// Auth slice to manage isAuth state
const authSlice = createSlice({
  name: "auth",
  initialState: {
    isAuth: false, // Initial state
  },
  reducers: {
    login(state) {
      state.isAuth = true; // Set isAuth to true
    },
    logout(state) {
      state.isAuth = false; // Set isAuth to false
    },
  },
});

// Export actions for dispatch
export const { login, logout } = authSlice.actions;

// Create and export the store
const store = configureStore({
  reducer: {
    auth: authSlice.reducer,
  },
});

export default store;
