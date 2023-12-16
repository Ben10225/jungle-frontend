import { work } from "../Constant";
import { WorkTimeData } from "./CalenderNeeds";

interface timeBlockData {
  yymm: string;
  date: string;
  workTime: number[];
  today: string[];
}

interface UpdateDateAction {
  type: "UPDATE_ITEM";
  payload: { index: number; newValue: number };
}

interface SetDataAcrion {
  type: "SET_DATA";
  payload: { data: WorkTimeData[] };
}

interface CleanTableAction {
  type: "CLEAN_TABLE";
}

interface SetToday {
  type: "SET_TODAY";
  payload: { today: string[] };
}

type Action = UpdateDateAction | SetDataAcrion | CleanTableAction | SetToday;

export const timeBlockReducer = (state: timeBlockData, action: Action) => {
  switch (action.type) {
    case "UPDATE_ITEM":
      return {
        ...state,
        workTime: state.workTime.map((st, i) => {
          if (action.payload.index === i) {
            return st === work.on ? work.off : work.on;
          } else {
            return st;
          }
        }),
      };
    case "SET_DATA": {
      const todayString =
        state.today[0] + "-" + state.today[1] + state.today[2];
      const matchingItem = action.payload.data.find((item) => {
        if (todayString === item.yymm + item.date) {
          // console.log(todayString);
        }
        return todayString === item.yymm + item.date;
      });
      return {
        ...state,
        workTime: matchingItem
          ? matchingItem.workTime
          : [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
      };
    }
    case "CLEAN_TABLE":
      return {
        ...state,
        workTime: [],
        today: [],
      };
    case "SET_TODAY": {
      return {
        ...state,
        today: action.payload.today,
      };
    }
    default:
      return state;
  }
};

export const timeBlockInit: timeBlockData = {
  yymm: "",
  date: "",
  workTime: [],
  today: [],
};
