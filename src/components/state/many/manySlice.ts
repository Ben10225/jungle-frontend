import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { WorkTimeData } from "../../Calendar/CalenderNeeds";
import { work, getMonthUrlQuery } from "../../Constant";
import _ from "lodash";

interface ManyState {
  manyOn: boolean;
  alertShow: boolean;
  workTime: number[];
  thisMonth: {
    selectDate: number[];
    originData: WorkTimeData[];
  };
  nextMonth: {
    selectDate: number[];
    originData: WorkTimeData[];
  };
  theMonthAfterNext: {
    selectDate: number[];
    originData: WorkTimeData[];
  };
  createData: WorkTimeData[];
  updateData: WorkTimeData[];
}

const initialState: ManyState = {
  manyOn: false,
  alertShow: false,
  workTime: [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
  thisMonth: {
    selectDate: [],
    originData: [],
  },
  nextMonth: {
    selectDate: [],
    originData: [],
  },
  theMonthAfterNext: {
    selectDate: [],
    originData: [],
  },
  createData: [],
  updateData: [],
};

const bookingSlice = createSlice({
  name: "many",
  initialState,
  reducers: {
    // many mode on or off
    setManyOn: (
      state,
      action: PayloadAction<{
        b: boolean;
      }>
    ) => {
      state.manyOn = action.payload.b;
    },
    // alert show or hide
    setAlertShow: (
      state,
      action: PayloadAction<{
        b: boolean;
      }>
    ) => {
      state.alertShow = action.payload.b;
    },
    // set selectDate arr
    setSelectDate: (
      state,
      action: PayloadAction<{
        page: number;
        date: number;
        selected: boolean;
      }>
    ) => {
      const addOrRemoveItem = (s: number[], d: number): number[] => {
        if (action.payload.selected) {
          const arr = s.filter((item) => item !== d);
          return arr;
        } else {
          s.push(d);
          return s;
        }
      };

      if (action.payload.page === 0) {
        state.thisMonth.selectDate = addOrRemoveItem(
          state.thisMonth.selectDate,
          action.payload.date
        );
      } else if (action.payload.page === 1) {
        state.nextMonth.selectDate = addOrRemoveItem(
          state.nextMonth.selectDate,
          action.payload.date
        );
      } else {
        state.theMonthAfterNext.selectDate = addOrRemoveItem(
          state.theMonthAfterNext.selectDate,
          action.payload.date
        );
      }
    },

    // reset selectDate
    resetSelectDate: (state) => {
      state.thisMonth.selectDate = [];
      state.nextMonth.selectDate = [];
      state.theMonthAfterNext.selectDate = [];
    },

    // add to origin
    setManyModeOriginData: (
      state,
      action: PayloadAction<{
        page: number;
        timeTable: WorkTimeData[];
      }>
    ) => {
      const AddToOrigin = (dt: WorkTimeData[]) => {
        if (dt.length === 0) {
          dt = dt.concat(action.payload.timeTable);
        }
        return dt;
      };

      if (action.payload.page === 0) {
        state.thisMonth.originData = AddToOrigin(state.thisMonth.originData);
      } else if (action.payload.page === 1) {
        state.nextMonth.originData = AddToOrigin(state.nextMonth.originData);
      } else {
        state.theMonthAfterNext.originData = AddToOrigin(
          state.theMonthAfterNext.originData
        );
      }
    },

    // set create / update
    setGetCreateAndUpdateData: (
      state,
      action: PayloadAction<{
        newWorkTime: number[];
      }>
    ) => {
      const insertData = (
        monthData: {
          selectDate: number[];
          originData: WorkTimeData[];
        },
        yymm: string
      ) => {
        if (monthData.selectDate.length > 0) {
          monthData.selectDate.forEach((item) => {
            const data = monthData.originData.find(
              (obj) => obj.date === item.toString()
            );
            const newValue: WorkTimeData = {
              yymm: yymm,
              date: item.toString(),
              workTime: _.cloneDeep(action.payload.newWorkTime),
            };
            if (data !== undefined) {
              data.workTime.forEach((w, i) => {
                if (w === work.reserved) {
                  newValue.workTime[i] = work.reserved;
                }
              });
              state.updateData.push(newValue);
            } else {
              state.createData.push(newValue);
              monthData.originData.push(newValue);
            }
          });
        } else {
          return;
        }
      };

      const yy = new Date().getFullYear().toString();
      const mm = (new Date().getMonth() + 1).toString();

      const thisMonthStr = yy + "-" + mm;
      const nextMonthStr = getMonthUrlQuery(parseInt(yy), parseInt(mm) + 1);
      const theMonthAfterNextStr = getMonthUrlQuery(
        parseInt(yy),
        parseInt(mm) + 2
      );

      insertData(state.thisMonth, thisMonthStr);
      insertData(state.nextMonth, nextMonthStr);
      insertData(state.theMonthAfterNext, theMonthAfterNextStr);
    },

    // set create / update / select
    submitReset: (state) => {
      state.thisMonth.selectDate = [];
      state.nextMonth.selectDate = [];
      state.theMonthAfterNext.selectDate = [];
      state.createData = [];
      state.updateData = [];
    },
  },
});

export const {
  setManyOn,
  setAlertShow,
  setSelectDate,
  resetSelectDate,
  setManyModeOriginData,
  setGetCreateAndUpdateData,
  submitReset,
} = bookingSlice.actions;

export default bookingSlice.reducer;
