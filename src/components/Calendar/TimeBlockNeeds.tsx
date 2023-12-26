import { work } from "../Constant";
import { WorkTimeData } from "./CalenderNeeds";
import _ from "lodash";

interface timeBlockData {
  workTime: number[];
  today: string[];
  mode: {
    books: boolean;
    shifts: boolean;
  };
  origin: WorkTimeData[];
  storage: WorkTimeData[];

  createData: WorkTimeData[];
  updateData: WorkTimeData[];
}

interface UpdateDateAction {
  type: "UPDATE_ITEM";
  payload: { index: number; newValue: number };
}

interface SetDataAction {
  type: "SET_DATA";
  payload: {
    data: WorkTimeData[];
    nowRoute: string;
    bookingWholeHour: number;
  };
}

interface UpdateDataAllAction {
  type: "UPDATE_DATA_ALL";
  payload: {
    add: boolean;
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

interface SaveOriginAction {
  type: "SAVE_ORIGIN";
  payload: { data: WorkTimeData[] };
}

interface ChangeModeAction {
  type: "CHANGE_MODE";
  payload: { str: string };
}

interface UploadResetDataAction {
  type: "UPLOAD_RESET_DATA";
}

type Action =
  | UpdateDateAction
  | UpdateDataAllAction
  | SetDataAction
  | CleanTableAction
  | SetTodayAction
  | SaveOriginAction
  | ChangeModeAction
  | UploadResetDataAction;

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

      const tmpWorkTime = state.workTime.map((st, i) => {
        if (action.payload.index === i) {
          return st === work.on ? work.off : work.on;
        } else {
          return st;
        }
      });

      const nowClickWorkTimeValue: WorkTimeData = {
        yymm: state.today[0] + "-" + state.today[1],
        date: state.today[2],
        workTime: tmpWorkTime,
      };

      const existsOriginData = checkDataExist(
        [nowClickWorkTimeValue],
        state.origin
      );

      /* add data to updateData */
      if (existsOriginData) {
        const tmpUpdate: WorkTimeData[] = _.cloneDeep(state.updateData);
        const existsUpdateData = checkDataExist(
          [nowClickWorkTimeValue],
          state.updateData
        );

        // update date repeat
        if (existsUpdateData) {
          const r = changeRepeatValue(nowClickWorkTimeValue, state.updateData);
          return {
            ...state,
            workTime: tmpWorkTime,
            storage: [...tmpStorage],
            updateData: r,
          };
        }

        // update date no repeat
        tmpUpdate.push(nowClickWorkTimeValue);
        return {
          ...state,
          workTime: tmpWorkTime,
          storage: [...tmpStorage],
          updateData: tmpUpdate,
        };
      }

      /* add data to createData */
      const tmpCreate: WorkTimeData[] = _.cloneDeep(state.createData);
      const existsCreateData = checkDataExist(
        [nowClickWorkTimeValue],
        state.createData
      );

      // create date repeat
      if (existsCreateData) {
        const r = changeRepeatValue(nowClickWorkTimeValue, state.createData);
        return {
          ...state,
          workTime: tmpWorkTime,
          storage: [...tmpStorage],
          createData: r,
        };
      }

      tmpCreate.push(nowClickWorkTimeValue);
      return {
        ...state,
        workTime: tmpWorkTime,
        storage: [...tmpStorage],
        createData: tmpCreate,
      };
    }
    case "UPDATE_DATA_ALL":
      if (state.mode.shifts) {
        const tmp = _.cloneDeep(state.storage);
        const newTimeTable: number[] = [];
        tmp.forEach((item) => {
          if (
            item.yymm === state.today[0] + "-" + state.today[1] &&
            item.date === state.today[2]
          ) {
            for (let i = 0; i < item.workTime.length; i++) {
              if (action.payload.add && item.workTime[i] === work.off) {
                item.workTime[i] = work.on;
              }
              if (!action.payload.add && item.workTime[i] === work.on) {
                item.workTime[i] = work.off;
              }
              newTimeTable.push(item.workTime[i]);
            }
          }
        });

        // add to UpdateData
        if (newTimeTable.length > 0) {
          const tmpUpdate: WorkTimeData[] = _.cloneDeep(state.updateData);
          const newData: WorkTimeData = {
            yymm: state.today[0] + "-" + state.today[1],
            date: state.today[2],
            workTime: newTimeTable,
          };
          const existsUpdateData = checkDataExist([newData], state.updateData);

          // update date repeat
          if (existsUpdateData) {
            const r = changeRepeatValue(newData, state.updateData);
            return {
              ...state,
              workTime: newTimeTable,
              storage: [...tmp],
              updateData: r,
            };
          }

          // update date no repeat
          tmpUpdate.push(newData);
          return {
            ...state,
            workTime: newTimeTable,
            storage: [...tmp],
            updateData: tmpUpdate,
          };
        }
        // data not exists before
        const newData: WorkTimeData = {
          yymm: state.today[0] + "-" + state.today[1],
          date: state.today[2],
          workTime: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        };
        tmp.push(newData);

        // add to CreateData
        const tmpCreate: WorkTimeData[] = _.cloneDeep(state.createData);
        const existsCreateData = checkDataExist([newData], state.createData);

        // create date repeat
        if (existsCreateData) {
          const r = changeRepeatValue(newData, state.createData);
          return {
            ...state,
            workTime: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            storage: [...tmp],
            createData: r,
          };
        }

        tmpCreate.push(newData);
        return {
          ...state,
          workTime: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
          storage: [...tmp],
          createData: tmpCreate,
        };
      }
      return {
        ...state,
      };
    case "SET_DATA": {
      // reserve
      if (action.payload.nowRoute === "reserve") {
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

        // if appointment whole time > 1 hour, close the between time
        const hour = action.payload.bookingWholeHour;
        if (hour !== 1 && matchingItem) {
          const extra = hour - 1;
          const endIndex = matchingItem.workTime.length - 1 - extra;
          const tmp = _.cloneDeep(matchingItem.workTime);
          let gap = 0;
          for (let i = 0; i < tmp.length; i++) {
            if (i > endIndex) {
              tmp[i] = -1;
              continue;
            }
            if (gap !== 0) {
              tmp[i] = -1;
              gap--;
            }
            if (tmp[i + extra] !== 1) {
              gap = extra;
              tmp[i] = -1;
              gap--;
            }
          }
          return {
            ...state,
            workTime: tmp,
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
      const storageHasAddBefore = checkDataExist(
        action.payload.data,
        state.storage
      );

      const todayString =
        state.today[0] + "-" + state.today[1] + state.today[2];

      if (!storageHasAddBefore) {
        const matchingItem = state.storage.find(
          (item) => todayString === item.yymm + item.date
        );

        const tmp = _.cloneDeep(state.storage);
        action.payload.data.forEach((item) => {
          tmp.push(item);
        });

        // make sure storage data set at first books state
        if (state.mode.books) {
          return {
            ...state,
            workTime: [],
            storage: _.cloneDeep(tmp),
          };
        }

        // mode == shifts
        return {
          ...state,
          workTime: matchingItem
            ? matchingItem.workTime
            : [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
          storage: _.cloneDeep(tmp),
        };
      }

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
          today: [],
        };
      } else if (action.payload.str === "WORKTABLE") {
        return {
          ...state,
          workTime: [],
        };
      } else {
        return {
          ...state,
          today: [],
        };
      }

    case "SET_TODAY": {
      return {
        ...state,
        today: action.payload.today,
      };
    }
    case "SAVE_ORIGIN": {
      const originHasAddBefore = checkDataExist(
        action.payload.data,
        state.origin
      );
      if (originHasAddBefore) {
        return {
          ...state,
        };
      }

      const tmpOri = _.cloneDeep(state.origin);
      action.payload.data.forEach((v) => {
        tmpOri.push(v);
      });

      return {
        ...state,
        origin: tmpOri,
      };
    }
    case "CHANGE_MODE": {
      const m =
        action.payload.str === "BOOKS"
          ? {
              books: true,
              shifts: false,
            }
          : { books: false, shifts: true };
      return {
        ...state,
        mode: m,
      };
    }
    case "UPLOAD_RESET_DATA": {
      return {
        ...state,
        origin: _.cloneDeep(state.storage),
        createData: [],
        updateData: [],
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
    books: true,
    shifts: false,
  },
  origin: [],
  storage: [],
  createData: [],
  updateData: [],
};

const checkDataExist = (action: WorkTimeData[], state: WorkTimeData[]) => {
  let originHasAddBefore = false;
  action.forEach((dt) => {
    for (let i = 0; i < state.length; i++) {
      if (dt.yymm === state[i].yymm && dt.date === state[i].date) {
        originHasAddBefore = true;
        break;
      }
    }
  });
  return originHasAddBefore;
};

const changeRepeatValue = (v: WorkTimeData, state: WorkTimeData[]) => {
  const tmpUpdate = _.cloneDeep(state);
  tmpUpdate.forEach((i) => {
    if (i.yymm === v.yymm && i.date === v.date) {
      i.workTime = v.workTime;
    }
  });
  return tmpUpdate;
};
