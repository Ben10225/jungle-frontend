import { work } from "../Constant";
import _ from "lodash";

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

interface UpdateDateAction {
  type: "UPDATE_DATE_CLICK";
  payload: { index: number; nowRoute: string };
}

interface SetDataAction {
  type: "SET_DATE_DATA";
  payload: { days: dayElement[] };
}

interface ClearClickAcyion {
  type: "CLEAR_CLICK";
}

interface ReserveClickAction {
  type: "RESERVE_CLICK";
  payload: { data: WorkTimeData[] };
}

interface AdminShowReservedAction {
  type: "ADMIN_SHOWRESERVED";
}

export type Action =
  | UpdateDateAction
  | SetDataAction
  | ClearClickAcyion
  | ReserveClickAction
  | AdminShowReservedAction;

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
      // no data
      if (
        action.payload.data.length === 0 ||
        (action.payload.data.length === 1 &&
          action.payload.data[0].yymm === "" &&
          action.payload.data[0].yymm === "")
      ) {
        const tmp: dayElement[] = _.cloneDeep(state.days);
        tmp.forEach((item) => {
          item.active = false;
          item.clicked = false;
        });

        return {
          ...state,
          days: tmp,
        };
      }

      // get all -1 workTime
      const allFalseArr: number[] = [];
      action.payload.data.forEach((item) => {
        item.workTime.every((state) => state === work.off)
          ? allFalseArr.push(parseInt(item.date))
          : null;
      });

      // today data exist
      const td = state.days.find((i) => i.isToday);
      const todayAllOff = allFalseArr.some((d) => d === td?.day);
      const todayDataExists = action.payload.data.some(
        (d) => parseInt(d.date) === td?.day
      );

      let lastMonthDay = true;
      const tmp = state.days.map((item) => {
        if (item.day === 1) lastMonthDay = false;
        if (lastMonthDay) {
          item.active = false;
          return item;
        }
        if (item.active) {
          if ((todayAllOff || !todayDataExists) && item.isToday) {
            item.clicked = false;
          }
          for (let i = 0; i < action.payload.data.length; i++) {
            item.active = false;
            if (action.payload.data[i].date === item.day.toString()) {
              item.active = true;
              break;
            }
          }
        } else {
          for (let i = 0; i < action.payload.data.length; i++) {
            if (item.day.toString() === action.payload.data[i].date) {
              if (item.isToday) {
                item.clicked = true;
              }
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
    case "ADMIN_SHOWRESERVED": {
      let pass: boolean = true;
      return {
        ...state,
        days: state.days.map((item) => {
          if (item.day === 1) pass = false;
          if (pass) {
            return item;
          }
          item.active = true;
          return item;
        }),
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
