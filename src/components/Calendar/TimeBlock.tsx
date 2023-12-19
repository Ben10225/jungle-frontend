import { ReactElement, useState, useEffect, useReducer } from "react";
import { WorkTimeData } from "./CalenderNeeds";
import { work, CLickEvents } from "../Constant";
import { timeBlockReducer, timeBlockInit } from "./TimeBlockNeeds";

import _ from "lodash";

interface TimeBlockProps {
  clickEvents: CLickEvents;
  nowRoute: string;
  mode: string;
  page: number;
  fetchWorkTimeDatas: WorkTimeData[];
  updateBtnClick: boolean;
  onUpdateWorkTime: (oldData: WorkTimeData[], newData: WorkTimeData[]) => void;
}

const TimeBlock: React.FC<TimeBlockProps> = ({
  clickEvents,
  fetchWorkTimeDatas,
  nowRoute,
  mode,
  page,
  updateBtnClick,
  onUpdateWorkTime,
}: TimeBlockProps): ReactElement => {
  const [firstLoad, setFirstLoad] = useState<boolean>(true);
  const [selectIndex, setSelectIndex] = useState<number>(-1);

  const [timeBlockState, timeBlockDispatch] = useReducer(
    timeBlockReducer,
    timeBlockInit
  );

  const handleArrangePeriodClick = (newValue: number, index: number) => {
    timeBlockDispatch({
      type: "UPDATE_ITEM",
      payload: { index: index, newValue: newValue },
    });

    const arr: number[] = [...timeBlockState.workTime];
    arr[index] === work.on ? (arr[index] = work.off) : (arr[index] = work.on);
  };

  const getTodayString = (data: string) => {
    if (
      nowRoute === "reserve" &&
      (fetchWorkTimeDatas.length === 0 || fetchWorkTimeDatas[0].date === "")
    )
      return;
    const str: string[] = data.split(" ");

    // console.log(str);
    timeBlockDispatch({
      type: "SET_TODAY",
      payload: { today: str },
    });
  };

  const handleReserveClickPeriod = (index: number) => {
    setSelectIndex(index);
  };

  const handleArrangeTableRander = () => {
    timeBlockDispatch({
      type: "CLEAN_TABLE",
      payload: { str: "TODAY&WORKTABLE" },
    });
    // mode === "ARRANGE";
    timeBlockDispatch({
      type: "CHANGE_MODE",
      payload: { str: mode },
    });

    timeBlockDispatch({
      type: "SET_DATA",
      payload: { data: fetchWorkTimeDatas, nowRoute: nowRoute },
    });
  };

  useEffect(() => {
    getTodayString(clickEvents.date);
    setSelectIndex(-1);

    if (nowRoute === "reserve") {
      timeBlockDispatch({
        type: "SET_DATA",
        payload: {
          data: fetchWorkTimeDatas,
          nowRoute: nowRoute,
        },
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
            payload: {
              data: fetchWorkTimeDatas,
              nowRoute: nowRoute,
            },
          });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clickEvents]);

  useEffect(() => {
    // change page
    if (nowRoute === "reserve") {
      // no data
      if (fetchWorkTimeDatas.length === 0) return;

      if (
        fetchWorkTimeDatas[0].date === "" &&
        fetchWorkTimeDatas[0].yymm === ""
      )
        return;

      // if (firstLoad) {
      // console.log("first");
      // if (firstLoad) setFirstLoad(false);

      getTodayString(clickEvents.date);
      timeBlockDispatch({
        type: "SET_DATA",
        payload: {
          data: fetchWorkTimeDatas,
          nowRoute: nowRoute,
        },
      });
      // } else {
      // timeBlockDispatch({
      //   type: "CLEAN_TABLE",
      //   payload: { str: "TODAY&WORKTABLE" },
      // });
      // }
    }

    if (nowRoute === "admin") {
      if (firstLoad) {
        // timeBlockDispatch({
        //   type: "SET_DATA",
        //   payload: {
        //     data: fetchWorkTimeDatas.fetchData,
        //     nowRoute: nowRoute,
        //   },
        // });
        timeBlockDispatch({
          type: "SAVE_DATA",
          payload: { data: fetchWorkTimeDatas, nowRoute: nowRoute },
        });
      } else {
        // timeBlockDispatch({
        //   type: "CLEAN_TABLE",
        //   payload: { str: "TODAY&WORKTABLE" },
        // });
        // timeBlockDispatch({
        //   type: "SET_DATA",
        //   payload: {
        //     data: fetchWorkTimeDatas.fetchData,
        //     nowRoute: nowRoute,
        //   },
        // });
        timeBlockDispatch({
          type: "SAVE_DATA",
          payload: { data: fetchWorkTimeDatas, nowRoute: nowRoute },
        });
      }
    }

    // if (firstLoad) setFirstLoad(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchWorkTimeDatas]);

  useEffect(() => {
    timeBlockDispatch({
      type: "CLEAN_TABLE",
      payload: { str: "TODAY&WORKTABLE" },
    });
  }, [page]);

  // useEffect(() => {
  //   console.log(fetchWorkTimeDatas);
  //   if (nowRoute === "admin") {
  //     // console.log(fetchWorkTimeDatas.fetchData);
  //     timeBlockDispatch({
  //       type: "SAVE_DATA",
  //       payload: { data: fetchWorkTimeDatas.fetchData, nowRoute: nowRoute },
  //     });

  //     if (fetchWorkTimeDatas.fetchData.length === 0) {
  //       timeBlockDispatch({
  //         type: "CLEAN_TABLE",
  //         payload: { str: "TODAY&WORKTABLE" },
  //       });
  //       timeBlockDispatch({
  //         type: "SET_NODATA_STORAGE",
  //         payload: {
  //           data: fetchWorkTimeDatas.fetchData,
  //           nowRoute: nowRoute,
  //         },
  //       });
  //     }
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [fetchWorkTimeDatas.page]);

  useEffect(() => {
    if (nowRoute === "admin") {
      handleArrangeTableRander();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode]);

  useEffect(() => {
    if (updateBtnClick) {
      if (!_.isEqual(timeBlockState.origin, timeBlockState.storage)) {
        onUpdateWorkTime(timeBlockState.origin, timeBlockState.storage);
        timeBlockDispatch({
          type: "UPLOAD_RESET_DATA",
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [updateBtnClick]);

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
          {nowRoute === "admin" && mode === "ARRANGE" && (
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
