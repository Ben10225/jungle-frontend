import { work } from "../Constant";
import { WorkTimeData } from "./CalenderNeeds";
import _ from "lodash";

interface timeBlockData {
  workTime: number[];
  today: string[];
  mode: {
    showReserved: boolean;
    arrange: boolean;
  };
  origin: WorkTimeData[];
  storage: WorkTimeData[];
  noDataStorage: WorkTimeData[];
}

interface UpdateDateAction {
  type: "UPDATE_ITEM";
  payload: { index: number; newValue: number };
}

interface SetDataAcrion {
  type: "SET_DATA";
  payload: {
    data: WorkTimeData[];
    nowRoute: string;
  };
}

interface CleanTableAction {
  type: "CLEAN_TABLE";
  payload: { str: string };
}

interface SetTodayAction {
  type: "SET_TODAY";
  payload: { today: string[] };
}

interface SaveDataAction {
  type: "SAVE_DATA";
  payload: { data: WorkTimeData[]; nowRoute: string };
}

interface ChangeModeAction {
  type: "CHANGE_MODE";
  payload: { str: string };
}

interface UploadResetDataAction {
  type: "UPLOAD_RESET_DATA";
}

interface SetNoDateStorageAction {
  type: "SET_NODATA_STORAGE";
  payload: { data: WorkTimeData[]; nowRoute: string };
}

type Action =
  | UpdateDateAction
  | SetDataAcrion
  | CleanTableAction
  | SetTodayAction
  | SaveDataAction
  | ChangeModeAction
  | UploadResetDataAction
  | SetNoDateStorageAction;

export const timeBlockReducer = (state: timeBlockData, action: Action) => {
  switch (action.type) {
    case "UPDATE_ITEM": {
      // update storage

      const tmpData: WorkTimeData = {
        date: state.today[2],
        yymm: state.today[0] + "-" + state.today[1],
        workTime: [...state.workTime],
      };
      tmpData.workTime.forEach((n, i) => {
        if (i === action.payload.index) {
          tmpData.workTime[i] = n === 1 ? -1 : 1;
        }
      });
      let pushData = false;

      const tmpStorage = state.storage.map((data) => {
        if (data.yymm === tmpData.yymm && data.date === tmpData.date) {
          data.workTime = tmpData.workTime;
          pushData = true;
        }
        return data;
      });

      if (!pushData) {
        tmpStorage.push(tmpData);
      }

      return {
        ...state,
        workTime: state.workTime.map((st, i) => {
          if (action.payload.index === i) {
            return st === work.on ? work.off : work.on;
          } else {
            return st;
          }
        }),
        storage: [...tmpStorage],
      };
    }
    case "SET_DATA": {
      // reserve
      if (action.payload.nowRoute === "reserve") {
        // if (action.payload.data[0].date === "") {
        //   return {
        //     ...state,
        //     workTime: [],
        //   };
        // }
        // if (state.today[0] === "" || action.payload.data[0].date === "") {
        //   {
        //     return {
        //       ...state,
        //       workTime: [],
        //     };
        //   }
        // }
        const todayString =
          state.today[0] + "-" + state.today[1] + state.today[2];
        const matchingItem = action.payload.data.find(
          (item) => todayString === item.yymm + item.date
        );

        if (
          matchingItem === undefined ||
          matchingItem.workTime.every((i) => i === -1)
        ) {
          return {
            ...state,
            today: [],
          };
        }

        return {
          ...state,
          workTime: matchingItem
            ? matchingItem.workTime
            : [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
        };
      }

      // admin

      if (state.mode.showReserved) {
        return {
          ...state,
          workTime: [],
        };
      }
      // console.log(action.payload.data);
      // console.log(state.storage);

      // console.log(state.today);
      // console.log(state.today);

      if (action.payload.data.length === 0) {
        // if (action.payload.data === null) {
        //   console.log("here", action.payload.data);
        //   if (state.noDataStorage.length === 0 && state.storage.length === 0) {
        //     // console.log("b");
        //     return {
        //       ...state,
        //       workTime: [],
        //       origin: [],
        //       storage: [],
        //     };
        //   }
        // }

        if (state.storage.length > 0) {
          if (!_.isEqual(action.payload.data, state.storage)) {
            const tmp: WorkTimeData[] = _.cloneDeep(state.storage);
            const existIndex: number[] = [];

            state.storage.forEach((item, index) => {
              for (let i = 0; i < action.payload.data.length; i++) {
                if (
                  item.yymm === action.payload.data[i].yymm &&
                  item.date === action.payload.data[i].date
                ) {
                  tmp[index] = item;
                  existIndex.push(i);
                  break;
                }
              }
            });
            action.payload.data.forEach((item, i) => {
              if (!existIndex.includes(i)) {
                tmp.push(item);
              }
            });

            return {
              ...state,
              storage: _.cloneDeep(tmp),
            };
          }
        }
        return {
          ...state,
          workTime: [],
        };
      }

      // admin fetch data
      // console.log(state.storage);
      if (state.storage.length === 0) {
        return {
          ...state,
          workTime: [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
        };
      }

      const todayString =
        state.today[0] + "-" + state.today[1] + state.today[2];

      const matchingItem = state.storage.find(
        (item) => todayString === item.yymm + item.date
      );

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
          // today: [],
          // storage: [...state.storage]
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
    case "SAVE_DATA": {
      // console.log(action.payload.data);
      return {
        ...state,
        origin: _.cloneDeep(action.payload.data),
        storage: _.cloneDeep(action.payload.data),
      };
    }
    case "CHANGE_MODE": {
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
    case "UPLOAD_RESET_DATA": {
      return {
        ...state,
        origin: _.cloneDeep(state.storage),
      };
    }
    case "SET_NODATA_STORAGE": {
      return {
        ...state,
        noDataStorage: _.cloneDeep(state.storage),
      };
    }
    default:
      return state;
  }
};

export const timeBlockInit: timeBlockData = {
  workTime: [],
  today: [],
  mode: {
    showReserved: true,
    arrange: false,
  },
  origin: [],
  storage: [],
  noDataStorage: [],
};
