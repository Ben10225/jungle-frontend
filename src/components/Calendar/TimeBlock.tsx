import { ReactElement, useState, useEffect, useReducer } from "react";
import { WorkTimeData } from "./CalenderNeeds";
import { work, CLickEvents } from "../Constant";
import { timeBlockReducer, timeBlockInit } from "./TimeBlockNeeds";
import styles from "./TimeBlock.module.css";
import _ from "lodash";

interface TimeBlockProps {
  clickEvents: CLickEvents;
  nowRoute: string;
  mode: string;
  page: number;
  getFetchResponse: boolean;
  fetchWorkTimeDatas: WorkTimeData[];
  updateBtnClick: boolean;
  onUpdateWorkTime: (oldData: WorkTimeData[], newData: WorkTimeData[]) => void;
}

const TimeBlock: React.FC<TimeBlockProps> = ({
  clickEvents,
  getFetchResponse,
  fetchWorkTimeDatas,
  nowRoute,
  mode,
  page,
  updateBtnClick,
  onUpdateWorkTime,
}: TimeBlockProps): ReactElement => {
  const [selectIndex, setSelectIndex] = useState<number>(-1);
  const [showReserveNullBlock, setShowReserveNullBlock] =
    useState<boolean>(false);
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

    timeBlockDispatch({
      type: "SET_TODAY",
      payload: { today: str },
    });
  };

  const handleReserveClickPeriod = (index: number) => {
    setSelectIndex(index);
  };

  const handleArrangeTableRander = () => {
    if (mode === "ARRANGE") {
      timeBlockDispatch({
        type: "CLEAN_TABLE",
        payload: { str: "TODAY" },
      });
    } else if (mode === "SHOWRESERVED") {
      timeBlockDispatch({
        type: "CLEAN_TABLE",
        payload: { str: "TODAY&WORKTABLE" },
      });
    }
  };

  useEffect(() => {
    getTodayString(clickEvents.date);
    setSelectIndex(-1);

    if (nowRoute === "reserve") {
      clickEvents.detect
        ? setShowReserveNullBlock(true)
        : setShowReserveNullBlock(false);
      timeBlockDispatch({
        type: "SET_DATA",
        payload: {
          data: fetchWorkTimeDatas,
          nowRoute: nowRoute,
        },
      });
    }

    if (nowRoute === "admin") {
      if (timeBlockState.mode.arrange) {
        timeBlockDispatch({
          type: "SET_DATA",
          payload: {
            data: fetchWorkTimeDatas,
            nowRoute: nowRoute,
          },
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clickEvents]);

  useEffect(() => {
    if (!getFetchResponse) return;
    if (nowRoute === "reserve") {
      if (fetchWorkTimeDatas.length === 0) return;
      getTodayString(clickEvents.date);
      timeBlockDispatch({
        type: "SET_DATA",
        payload: {
          data: fetchWorkTimeDatas,
          nowRoute: nowRoute,
        },
      });

      const tmpToday = clickEvents.date.split(" ");
      fetchWorkTimeDatas.forEach((item) => {
        if (
          item.yymm === tmpToday[0] + "-" + tmpToday[1] &&
          item.date === tmpToday[2]
        ) {
          setShowReserveNullBlock(true);
        }
      });
    }

    if (nowRoute === "admin") {
      timeBlockDispatch({
        type: "SET_DATA",
        payload: { data: fetchWorkTimeDatas, nowRoute: nowRoute },
      });

      timeBlockDispatch({
        type: "SAVE_ORIGIN",
        payload: {
          data: fetchWorkTimeDatas,
        },
      });
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getFetchResponse]);

  useEffect(() => {
    if (nowRoute === "admin") {
      timeBlockDispatch({
        type: "SET_DATA",
        payload: {
          data: fetchWorkTimeDatas,
          nowRoute: nowRoute,
        },
      });

      timeBlockDispatch({
        type: "SAVE_ORIGIN",
        payload: {
          data: fetchWorkTimeDatas,
        },
      });
    }

    timeBlockDispatch({
      type: "CLEAN_TABLE",
      payload: { str: "TODAY&WORKTABLE" },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  useEffect(() => {
    // click mode button
    if (nowRoute === "admin") {
      handleArrangeTableRander();
    }
    timeBlockDispatch({
      type: "CHANGE_MODE",
      payload: { str: mode },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode]);

  useEffect(() => {
    if (updateBtnClick) {
      // compare origin and storage
      if (!_.isEqual(timeBlockState.origin, timeBlockState.storage)) {
        onUpdateWorkTime(timeBlockState.createData, timeBlockState.updateData);
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
        <div className={styles.timeWrapper}>
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
            <>
              <div className={styles.selectBlock}>
                {timeBlockState.workTime.map((state, i) => {
                  return (
                    state === work.on && (
                      <div
                        onClick={() => handleReserveClickPeriod(i)}
                        key={i}
                        className={`${styles.time} ${
                          selectIndex === i ? `${styles.select}` : ""
                        }`}
                      >
                        {i + 10}:00
                      </div>
                    )
                  );
                })}
              </div>
              {showReserveNullBlock && <div className={styles.nullBlock}></div>}
            </>
          )}
          {/* admin */}
          {nowRoute === "admin" && mode === "ARRANGE" && (
            <div className={styles.selectblock}>
              {timeBlockState.workTime.map((state, i) => {
                return (
                  <div
                    onClick={() => handleArrangePeriodClick(state, i)}
                    key={i}
                    className={`${styles.time} ${
                      state === work.off ? `${styles.stop}` : ""
                    } `}
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
