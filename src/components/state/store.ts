import { configureStore } from "@reduxjs/toolkit";
import reserveSlice from "./reserve/reserveSlice";

export const store = configureStore({
  reducer: {
    reserve: reserveSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AddDispatch = typeof store.dispatch;
