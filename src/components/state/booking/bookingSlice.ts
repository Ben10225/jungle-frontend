import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { BookingData } from "../../Calendar/CalenderNeeds";

interface BookingState {
  thisMonth: BookingData[];
  nextMonth: BookingData[];
  theMonthAfterNext: BookingData[];
  beforeMonth: BookingData[];
}

const initialState: BookingState = {
  thisMonth: [],
  nextMonth: [],
  theMonthAfterNext: [],
  beforeMonth: [],
};

const bookingSlice = createSlice({
  name: "booking",
  initialState,
  reducers: {
    setBookingData: (
      state,
      action: PayloadAction<{
        thisMonth: BookingData[];
        nextMonth: BookingData[];
        theMonthAfterNext: BookingData[];
      }>
    ) => {
      state.thisMonth = action.payload.thisMonth;
      state.nextMonth = action.payload.nextMonth;
      state.theMonthAfterNext = action.payload.theMonthAfterNext;
    },
  },
});

export const { setBookingData } = bookingSlice.actions;

export default bookingSlice.reducer;
