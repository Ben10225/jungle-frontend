import { work } from "../Constant";
import { WorkTimeData } from "./CalenderNeeds";

interface timeBlockData {
  yymm: string;
  date: string;
  workTime: number[];
  today: string[];
  mode: {
    showReserved: boolean;
    arrange: boolean;
  };
}

interface UpdateDateAction {
  type: "UPDATE_ITEM";
  payload: { index: number; newValue: number };
}

interface SetDataAcrion {
  type: "SET_DATA";
  payload: { data: WorkTimeData[]; nowRoute: string };
}

interface CleanTableAction {
  type: "CLEAN_TABLE";
  payload: { str: string };
}

interface SetToday {
  type: "SET_TODAY";
  payload: { today: string[] };
}

interface ChangeMode {
  type: "Change_Mode";
  payload: { str: string };
}

type Action =
  | UpdateDateAction
  | SetDataAcrion
  | CleanTableAction
  | SetToday
  | ChangeMode;

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
      if (action.payload.nowRoute === "reserve" && state.today[0] === "") {
        return {
          ...state,
          workTime: [],
        };
      }
      if (
        action.payload.nowRoute === "admin" &&
        (state.mode.showReserved || state.today.length === 0)
      ) {
        return {
          ...state,
          workTime: [],
        };
      }
      const todayString =
        state.today[0] + "-" + state.today[1] + state.today[2];
      const matchingItem = action.payload.data.find(
        (item) => todayString === item.yymm + item.date
      );

      if (action.payload.nowRoute === "admin") {
      }
      return {
        ...state,
        workTime: matchingItem
          ? matchingItem.workTime
          : [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
      };
    }
    case "CLEAN_TABLE":
      if (action.payload.str === "TODAY&WORKTABLE") {
        return {
          ...state,
          workTime: [],
          today: [],
        };
      } else {
        return {
          ...state,
          workTime: [],
        };
      }

    case "SET_TODAY": {
      return {
        ...state,
        today: action.payload.today,
      };
    }
    case "Change_Mode": {
      const m =
        action.payload.str === "SHOWRESERVED"
          ? {
              showReserved: true,
              arrange: false,
            }
          : { showReserved: false, arrange: true };

      return {
        ...state,
        mode: m,
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
  mode: {
    showReserved: true,
    arrange: false,
  },
};
