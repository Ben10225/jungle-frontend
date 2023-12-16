import { SureTimedata } from "../Calendar/CalenderNeeds";

interface ArrangeData {
  arrange: SureTimedata[];
}

interface UpdateDataAction {
  type: "UPDATE_DATA";
  payload: { str: string; update: boolean[] };
}

// export interface SetDataAcrion {
//   type: "SET_DATE_DATA";
//   payload: { days: dayElement[] };
// }

// export interface ClearClickAcrion {
//   type: "CLEAR_CLICK";
// }

// export interface ReserveClickAcrion {
//   type: "RESERVE_CLICK";
//   payload: { data: SureTimedata[] };
// }

export type Action = UpdateDataAction;
// | SetDataAcrion
// | ClearClickAcrion
// | ReserveClickAcrion;

export const arrangeReducer = (state: ArrangeData, action: Action) => {
  switch (action.type) {
    case "UPDATE_DATA": {
      const tmpStr: string[] = action.payload.str.split(" ");
      const dayData: SureTimedata = {
        date: tmpStr[2],
        yymm: tmpStr[0] + tmpStr[1],
        sureTimeArray: action.payload.update,
      };
      console.log(dayData);
      return {
        ...state,
        days: state.arrange.map((item, i) => {
          return item;
        }),
      };
    }
    // case "SET_DATE_DATA": {
    //   return {
    //     ...state,
    //     days: action.payload.days,
    //   };
    // }
    // case "CLEAR_CLICK":
    //   return {
    //     ...state,
    //     days: state.days.map((item) => {
    //       item.clicked = false;
    //       return item;
    //     }),
    //   };
    // case "RESERVE_CLICK": {
    //   const dt = action.payload.data;
    //   if (dt.length === 1 && dt[0].yymm === "" && dt[0].yymm === "") {
    //     return {
    //       ...state,
    //     };
    //   }
    //   const allFalseArr: number[] = [];
    //   action.payload.data.forEach((item) => {
    //     item.sureTimeArray.every((bool) => bool === false)
    //       ? allFalseArr.push(parseInt(item.date))
    //       : null;
    //   });

    //   const tmp = state.days.map((item) => {
    //     if (item.active) {
    //       for (let i = 0; i < action.payload.data.length; i++) {
    //         item.active = false;
    //         if (action.payload.data[i].date === item.day.toString()) {
    //           item.active = true;
    //           break;
    //         }
    //       }
    //     }
    //     return item;
    //   });

    //   // if today's sure time all false cancel click ability
    //   let passDay1: boolean = false;
    //   tmp.forEach((item) => {
    //     if (item.day === 1) passDay1 = true;
    //     if (!passDay1) return;
    //     if (allFalseArr.includes(item.day)) {
    //       item.clicked = false;
    //       item.active = false;
    //     }
    //   });

    //   return {
    //     ...state,
    //     days: tmp,
    //   };
    // }
    default:
      return state;
  }
};

export const arrangeDataInit: ArrangeData = {
  arrange: [{ yymm: "", date: "", sureTimeArray: [] }],
};
