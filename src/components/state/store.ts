import { configureStore } from "@reduxjs/toolkit";
import reserveSlice from "./reserve/reserveSlice";
import bookingSlice from "./booking/bookingSlice";

export const store = configureStore({
  reducer: {
    reserve: reserveSlice,
    booking: bookingSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AddDispatch = typeof store.dispatch;
