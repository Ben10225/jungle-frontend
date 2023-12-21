import { PayloadAction, createSlice } from "@reduxjs/toolkit";

interface ReserveState {
  part: string;
}

const initialState: ReserveState = {
  part: "part1",
};

const reserveSlice = createSlice({
  name: "reserve",
  initialState,
  reducers: {
    setPart: (state, action: PayloadAction<string>) => {
      state.part = action.payload;
    },
  },
});

export const { setPart } = reserveSlice.actions;

export default reserveSlice.reducer;
