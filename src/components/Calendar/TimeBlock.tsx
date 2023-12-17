import { ReactElement, useState, useEffect, useReducer } from "react";
import { arrangeReducer, arrangeDataInit } from "../Admin/AdminCalNeeds";
import { WorkTimeData } from "./CalenderNeeds";
import { work, CLickEvents } from "../Constant";
import { timeBlockReducer, timeBlockInit } from "./TimeBlockNeeds";

interface TimeBlockProps {
  clickEvents: CLickEvents;
  nowRoute: string;
  mode: string;
  fetchWorkTimeDatas: WorkTimeData[];
}

const TimeBlock: React.FC<TimeBlockProps> = ({
  clickEvents,
  fetchWorkTimeDatas,
  nowRoute,
  mode,
}: TimeBlockProps): ReactElement => {
  const [firstLoad, setFirstLoad] = useState<boolean>(true);
  const [selectIndex, setSelectIndex] = useState<number>(-1);

  const [timeBlockState, timeBlockDispatch] = useReducer(
    timeBlockReducer,
    timeBlockInit
  );
  const [arrangeDataState, arrangeDataDispatch] = useReducer(
    arrangeReducer,
    arrangeDataInit
  );

  const handleArrangePeriodClick = (newValue: number, index: number) => {
    timeBlockDispatch({
      type: "UPDATE_ITEM",
      payload: { index: index, newValue: newValue },
    });

    const arr: number[] = [...timeBlockState.workTime];
    arr[index] === work.on ? (arr[index] = work.off) : (arr[index] = work.on);

    // arrange
    updateArrangeData(clickEvents.date, arr);
  };

  const getTodayString = (data: string) => {
    const str: string[] = data.split(" ");
    timeBlockDispatch({
      type: "SET_TODAY",
      payload: { today: str },
    });
  };

  const LoadTimeData = (res: WorkTimeData[]) => {
    if (res === null) return;

    const t: string = `${new Date().getFullYear()}-${
      new Date().getMonth() + 1
    }${new Date().getDate()}`;

    res.find((item) => {
      const d: string = item.yymm + item.date;

      if (d === t && firstLoad) {
        setFirstLoad(false);
      }
    });
  };

  const handleReserveClickPeriod = (index: number) => {
    // console.log("date:", title, "time:", index + 10);
    setSelectIndex(index);
  };

  const handleArrangeTableRander = () => {
    timeBlockDispatch({
      type: "CLEAN_TABLE",
      payload: { str: "TODAY&WORKTABLE" },
    });
    mode === "ARRANGE"
      ? timeBlockDispatch({
          type: "Change_Mode",
          payload: { str: mode },
        })
      : timeBlockDispatch({
          type: "Change_Mode",
          payload: { str: mode },
        });

    timeBlockDispatch({
      type: "SET_DATA",
      payload: { data: fetchWorkTimeDatas, nowRoute: nowRoute },
    });
  };

  /* arrange reducer func  */

  const updateArrangeData = (str: string, update: number[]) => {
    arrangeDataDispatch({
      type: "UPDATE_DATA",
      payload: { str: str, update: update },
    });
  };

  /* --------------------  */

  useEffect(() => {
    if (clickEvents.detect) {
      // console.log("get it");
    }

    getTodayString(clickEvents.date);
    setSelectIndex(-1);

    if (nowRoute === "reserve") {
      timeBlockDispatch({
        type: "SET_DATA",
        payload: { data: fetchWorkTimeDatas, nowRoute: nowRoute },
      });
    }

    if (nowRoute === "admin") {
      timeBlockState.mode.showReserved
        ? timeBlockDispatch({
            type: "CLEAN_TABLE",
            payload: { str: "WORKTABLE" },
          })
        : timeBlockDispatch({
            type: "SET_DATA",
            payload: { data: fetchWorkTimeDatas, nowRoute: nowRoute },
          });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clickEvents]);

  useEffect(() => {
    // change page
    if (fetchWorkTimeDatas[0].date === "" || fetchWorkTimeDatas[0].yymm === "")
      return;
    LoadTimeData(fetchWorkTimeDatas);

    if (nowRoute === "reserve") {
      if (firstLoad) {
        timeBlockDispatch({
          type: "SET_DATA",
          payload: { data: fetchWorkTimeDatas, nowRoute: nowRoute },
        });
      } else {
        timeBlockDispatch({
          type: "CLEAN_TABLE",
          payload: { str: "TODAY&WORKTABLE" },
        });
      }
    }

    if (nowRoute === "admin") {
      if (firstLoad) {
        timeBlockDispatch({
          type: "SET_DATA",
          payload: { data: fetchWorkTimeDatas, nowRoute: nowRoute },
        });
      } else {
        timeBlockDispatch({
          type: "CLEAN_TABLE",
          payload: { str: "TODAY&WORKTABLE" },
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchWorkTimeDatas]);

  useEffect(() => {
    if (nowRoute === "admin") {
      handleArrangeTableRander();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode]);

  return (
    <div className="flex justify-center flex-col items-center">
      <div className="w-4/5">
        <hr className="w-full mb-4" />
        <div className="time-wrapper">
          <div className="today-block">
            <span>{timeBlockState.today[0]}</span>
            {timeBlockState.today.length > 0 && (
              <span style={{ margin: "0px 2px" }}>-</span>
            )}
            <span>{timeBlockState.today[1]}</span>
            {timeBlockState.today.length > 0 && (
              <span style={{ margin: "0px 2px" }}>-</span>
            )}
            <span>{timeBlockState.today[2]}</span>
          </div>
          {/* reserver */}
          {nowRoute === "reserve" && (
            <div className="select-block">
              {timeBlockState.workTime.map((state, i) => {
                return (
                  state === work.on && (
                    <div
                      onClick={() => handleReserveClickPeriod(i)}
                      key={i}
                      className={`time ${selectIndex === i ? "select" : ""}`}
                    >
                      {i + 10}:00
                    </div>
                  )
                );
              })}
            </div>
          )}
          {/* admin */}
          {nowRoute === "admin" && (
            <div className="select-block">
              {timeBlockState.workTime.map((state, i) => {
                return (
                  <div
                    onClick={() => handleArrangePeriodClick(state, i)}
                    key={i}
                    className={`time ${state === work.off ? "stop" : ""} `}
                  >
                    {i + 10}:00
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TimeBlock;
