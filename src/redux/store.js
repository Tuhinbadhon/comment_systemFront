import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import commentReducer from "./slices/commentSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    comments: commentReducer,
  },
});

export default store;
