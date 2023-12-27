import { configureStore } from "@reduxjs/toolkit";
import reserveSlice from "./reserve/reserveSlice";
import bookingSlice from "./booking/bookingSlice";
import manySlice from "./many/manySlice";

export const store = configureStore({
  reducer: {
    reserve: reserveSlice,
    booking: bookingSlice,
    many: manySlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AddDispatch = typeof store.dispatch;
