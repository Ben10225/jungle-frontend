import { PayloadAction, createSlice } from "@reduxjs/toolkit";

interface Service {
  title: string;
  time: number;
  cost: number;
}

interface Time {
  date: string[];
  // clock: number[];
  clock: number;
}

interface User {
  name: string;
  phone: string;
}

interface ReserveState {
  part: string;
  user: User;
  reserveTime: Time;
  reserveItems: Service[];
}

const initialState: ReserveState = {
  part: "part1",
  user: {
    name: "彭宏倫",
    phone: "0912345678",
  },
  reserveTime: {
    date: [],
    clock: -1,
  },
  reserveItems: [],

  // reserveTime: {
  //   date: ["2023", "12", "25"],
  //   clock: 0,
  // },
  // reserveItems: [
  //   {
  //     title: "修眉毛",
  //     time: 20,
  //     cost: 1000,
  //   },
  //   {
  //     title: "除鬍子",
  //     time: 30,
  //     cost: 1500,
  //   },
  // ],
};

const reserveSlice = createSlice({
  name: "reserve",
  initialState,
  reducers: {
    setPart: (state, action: PayloadAction<string>) => {
      state.part = action.payload;
    },
    setReserveItems: (state, action: PayloadAction<Service[]>) => {
      state.reserveItems = action.payload;
    },
    setReserveTime: (state, action: PayloadAction<Time>) => {
      state.reserveTime = action.payload;
    },
  },
});

export const { setPart, setReserveItems, setReserveTime } =
  reserveSlice.actions;

export default reserveSlice.reducer;
