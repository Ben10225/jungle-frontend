import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { BookingData } from "../../Calendar/CalenderNeeds";

interface NowDataType {
  yymm: string;
  date: string;
  detail: {
    cost: string;
    time: string;
    state: number;
  };
  hour: {
    index: number;
    whole: number;
  };
  titles: string[];
  user: {
    name: string;
    phone: string;
  };
  wait: boolean;
}

interface BookingState {
  thisMonth: BookingData[];
  nextMonth: BookingData[];
  theMonthAfterNext: BookingData[];
  beforeMonth: BookingData[];
  nowDateBooks: NowDataType[];
}

const initialState: BookingState = {
  thisMonth: [],
  nextMonth: [],
  theMonthAfterNext: [],
  beforeMonth: [],
  nowDateBooks: [],
};

const bookingSlice = createSlice({
  name: "booking",
  initialState,
  reducers: {
    // init fetch bookings data
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

    // show now date bookinks
    setNowDateBooks: (
      state,
      action: PayloadAction<{
        yymm: string;
        date: string;
        data: BookingData[];
      }>
    ) => {
      const tmp = action.payload.data.filter(
        (item) =>
          item.yymm === action.payload.yymm && item.date === action.payload.date
      );
      tmp.sort((a, b) => a.hour.index - b.hour.index);

      const tmpp = tmp.map((item) => ({
        ...item,
        wait: false,
      }));
      state.nowDateBooks = tmpp;
    },

    // clear books
    clearBooks: (state) => {
      const tmp: NowDataType[] = [];
      state.nowDateBooks = tmp;
    },

    // show or hide wait gif
    setWait: (
      state,
      action: PayloadAction<{
        b: boolean;
        i: number;
      }>
    ) => {
      state.nowDateBooks[action.payload.i].wait = action.payload.b;
    },

    // change booking state
    setBookNewState: (
      state,
      action: PayloadAction<{
        yymm: string;
        date: string;
        newBookingState: number;
        hourIndex: number;
        page: number;
      }>
    ) => {
      const setNewState = (stateData: BookingData[]) => {
        stateData.forEach((item) => {
          if (
            item.yymm === action.payload.yymm &&
            item.date === action.payload.date &&
            item.hour.index === action.payload.hourIndex
          ) {
            item.detail.state = action.payload.newBookingState;
          }
        });

        const tmp = stateData.filter(
          (item) =>
            item.yymm === action.payload.yymm &&
            item.date === action.payload.date
        );
        tmp.sort((a, b) => a.hour.index - b.hour.index);

        const tmpp = tmp.map((item) => ({
          ...item,
          wait: false,
        }));
        state.nowDateBooks = tmpp;
      };

      if (action.payload.page === 0) {
        setNewState(state.thisMonth);
      } else if (action.payload.page === 1) {
        setNewState(state.nextMonth);
      } else if (action.payload.page === 2) {
        setNewState(state.theMonthAfterNext);
      }
    },
  },
});

export const {
  setBookingData,
  setNowDateBooks,
  clearBooks,
  setBookNewState,
  setWait,
} = bookingSlice.actions;

export default bookingSlice.reducer;
