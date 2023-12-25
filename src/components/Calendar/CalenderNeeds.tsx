import { work } from "../Constant";
import _, { cloneDeep } from "lodash";

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

export interface BookingData {
  yymm: string;
  date: string;
  cost: string;
  time: string;
  hourIndex: number;
  wholeHour: number;
  titles: string[];
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

interface ClearALLClickAcyion {
  type: "CLEAR_ALL_CLICK";
}

interface ReserveClickAction {
  type: "RESERVE_CLICK";
  payload: { data: WorkTimeData[]; bookingWholeHour: number };
}

interface BookingClickAction {
  type: "BOOKING_CLICK";
  payload: { data: BookingData[] };
}

interface AdminShowReservedAction {
  type: "ADMIN_SHOWRESERVED";
}

export type Action =
  | UpdateDateAction
  | SetDataAction
  | ClearClickAcyion
  | ClearALLClickAcyion
  | ReserveClickAction
  | BookingClickAction
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
    case "CLEAR_ALL_CLICK": {
      const tmp = cloneDeep(state.days);
      tmp.forEach((item) => {
        item.clicked = false;
      });
      return {
        ...state,
        days: tmp,
      };
    }
    case "RESERVE_CLICK": {
      // no data
      if (action.payload.data.length === 0) {
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
      let todayDate = -1;
      const tmp = state.days.map((item) => {
        if (item.day === 1) lastMonthDay = false;
        if (lastMonthDay) {
          item.active = false;
          return item;
        }
        if (item.isToday) todayDate = item.day;
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
      // && this month close days before yesterday
      let passDay1: boolean = false;
      tmp.forEach((item) => {
        if (item.day === 1) passDay1 = true;
        if (!passDay1) return;
        if (item.day < todayDate) {
          item.active = false;
        }
        if (allFalseArr.includes(item.day)) {
          item.clicked = false;
          item.active = false;
        }
      });

      // if appointment whole time > 1 hour, and no time then close day
      const hour = action.payload.bookingWholeHour;
      const cantProvideDay: string[] = [];
      if (hour !== 1) {
        const extra = hour - 1;
        const insideTmp = _.cloneDeep(action.payload.data);
        const endIndex = insideTmp[0].workTime.length - 1 - extra;

        insideTmp.forEach((item) => {
          let gap = 0;
          for (let i = 0; i < item.workTime.length; i++) {
            if (i > endIndex) {
              item.workTime[i] = -1;
              continue;
            }
            if (gap !== 0) {
              item.workTime[i] = -1;
              gap--;
            }
            if (item.workTime[i + extra] !== 1) {
              gap = extra;
              item.workTime[i] = -1;
              gap--;
            }
          }
          if (item.workTime.every((b) => b === work.off)) {
            cantProvideDay.push(item.date);
          }
        });

        tmp.forEach((item) => {
          if (!item.active) return;
          if (cantProvideDay.includes(item.day.toString())) {
            item.active = false;
          }
        });
      }

      return {
        ...state,
        days: tmp,
      };
    }
    case "BOOKING_CLICK": {
      const tmp = _.cloneDeep(state.days);
      let pass: boolean = false;
      tmp.forEach((item) => {
        if (item.day === 1) pass = true;
        if (!pass) return;
        item.active = false;
        for (let i = 0; i < action.payload.data.length; i++) {
          if (item.day.toString() === action.payload.data[i].date) {
            item.active = true;
            break;
          }
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
