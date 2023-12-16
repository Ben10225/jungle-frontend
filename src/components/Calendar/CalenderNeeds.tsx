import { work } from "../Constant";

export interface dayElement {
  day: number;
  active: boolean;
  isToday: boolean;
  clicked: boolean;
}

export interface daysElementState {
  days: dayElement[];
}

export interface clickDay {
  today: number;
  thisMonth: number;
  nextMonth: number;
}

export interface dateObject {
  currYear: number;
  currMonth: number;
  currDate: number;
}

export interface WorkTimeData {
  yymm: string;
  date: string;
  workTime: number[];
}
[];

export interface UpdateDateAction {
  type: "UPDATE_DATE_CLICK";
  payload: { index: number; nowRoute: string };
}

export interface SetDataAcrion {
  type: "SET_DATE_DATA";
  payload: { days: dayElement[] };
}

export interface ClearClickAcrion {
  type: "CLEAR_CLICK";
}

export interface ReserveClickAcrion {
  type: "RESERVE_CLICK";
  payload: { data: WorkTimeData[] };
}

export type Action =
  | UpdateDateAction
  | SetDataAcrion
  | ClearClickAcrion
  | ReserveClickAcrion;

export const reducer = (state: daysElementState, action: Action) => {
  switch (action.type) {
    case "UPDATE_DATE_CLICK":
      return {
        ...state,
        days: state.days.map((item, i) => {
          if (!item.active && action.payload.nowRoute === "reserve")
            return item;
          if (action.payload.index === i) {
            item.clicked = true;
          } else {
            item.clicked = false;
          }
          return item;
        }),
      };
    case "SET_DATE_DATA": {
      return {
        ...state,
        days: action.payload.days,
      };
    }
    case "CLEAR_CLICK":
      return {
        ...state,
        days: state.days.map((item) => {
          item.clicked = false;
          return item;
        }),
      };
    case "RESERVE_CLICK": {
      const dt = action.payload.data;
      if (dt.length === 1 && dt[0].yymm === "" && dt[0].yymm === "") {
        return {
          ...state,
        };
      }
      const allFalseArr: number[] = [];
      action.payload.data.forEach((item) => {
        item.workTime.every((state) => state === work.off)
          ? allFalseArr.push(parseInt(item.date))
          : null;
      });

      const tmp = state.days.map((item) => {
        if (item.active) {
          for (let i = 0; i < action.payload.data.length; i++) {
            item.active = false;
            if (action.payload.data[i].date === item.day.toString()) {
              item.active = true;
              break;
            }
          }
        }
        return item;
      });

      // if today's work time all off cancel click ability
      let passDay1: boolean = false;
      tmp.forEach((item) => {
        if (item.day === 1) passDay1 = true;
        if (!passDay1) return;
        if (allFalseArr.includes(item.day)) {
          item.clicked = false;
          item.active = false;
        }
      });

      return {
        ...state,
        days: tmp,
      };
    }
    default:
      return state;
  }
};

export const months = [
  "Jan.",
  "Feb.",
  "Mar.",
  "Apr.",
  "May",
  "Jun.",
  "Jul.",
  "Aug.",
  "Sep.",
  "Oct.",
  "Nov.",
  "Dec.",
];
