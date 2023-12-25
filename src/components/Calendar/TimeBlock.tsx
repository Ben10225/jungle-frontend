import { ReactElement, useState, useEffect, useReducer } from "react";
import { WorkTimeData } from "./CalenderNeeds";
import { work, CLickEvents } from "../Constant";
import { timeBlockReducer, timeBlockInit } from "./TimeBlockNeeds";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleRight } from "@fortawesome/free-solid-svg-icons";
import styles from "./TimeBlock.module.css";
import _ from "lodash";
import { useDispatch } from "react-redux";
import { setPart, setReserveTime } from "../state/reserve/reserveSlice";
import { useSelector } from "react-redux";
import { RootState } from "../state/store.ts";

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
  const dispatch = useDispatch();
  const [selectIndex, setSelectIndex] = useState<number>(-1);
  const [timeBlockState, timeBlockDispatch] = useReducer(
    timeBlockReducer,
    timeBlockInit
  );
  const reserveItemsWholeTime = useSelector(
    (state: RootState) => state.reserve.reserveItems
  ).reduce((acc, curr) => (acc += curr.time), 0);

  const handleArrangePeriodClick = (newValue: number, index: number) => {
    if (newValue === 0) return;

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
    if (mode === "SHIFTS") {
      timeBlockDispatch({
        type: "CLEAN_TABLE",
        payload: { str: "TODAY" },
      });
    } else if (mode === "BOOKS") {
      timeBlockDispatch({
        type: "CLEAN_TABLE",
        payload: { str: "TODAY&WORKTABLE" },
      });
    }
  };

  const handleToReserve = () => {
    const reserveData = {
      date: timeBlockState.today,
      clock: selectIndex,
    };

    dispatch(setReserveTime(reserveData));
    dispatch(setPart("part3"));
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
          bookingWholeHour: Math.ceil(reserveItemsWholeTime / 60),
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
            bookingWholeHour: Math.ceil(reserveItemsWholeTime / 60),
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
      timeBlockDispatch({
        type: "SET_DATA",
        payload: {
          data: fetchWorkTimeDatas,
          nowRoute: nowRoute,
          bookingWholeHour: Math.ceil(reserveItemsWholeTime / 60),
        },
      });
    }

    if (nowRoute === "admin") {
      timeBlockDispatch({
        type: "SET_DATA",
        payload: {
          data: fetchWorkTimeDatas,
          nowRoute: nowRoute,
          bookingWholeHour: Math.ceil(reserveItemsWholeTime / 60),
        },
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
          bookingWholeHour: Math.ceil(reserveItemsWholeTime / 60),
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
          <div className={styles.todayBlock}>
            {nowRoute === "reserve" && timeBlockState.today.length > 0 && (
              <div
                className={`${styles.submitBlock}  ${
                  selectIndex > -1 ? `${styles.click}` : ""
                }`}
                onClick={() => handleToReserve()}
              >
                <div className={`${styles.submit}`}>點擊預約</div>
                <FontAwesomeIcon className={styles.icon} icon={faCircleRight} />
              </div>
            )}
            <span>{timeBlockState.today[0]}</span>
            {timeBlockState.today.length > 0 && (
              <span style={{ margin: "0px 2px" }}>-</span>
            )}
            <span>{timeBlockState.today[1]}</span>
            {timeBlockState.today.length > 0 && (
              <span style={{ margin: "0px 2px" }}>-</span>
            )}
            <span>{timeBlockState.today[2]}</span>
            {nowRoute === "reserve" && selectIndex > -1 && (
              <span className={styles.reserveTime}>{` ${
                selectIndex + 10
              }:00`}</span>
            )}
          </div>
          {/* reserver */}
          {nowRoute === "reserve" && (
            <>
              <div className={`${styles.selectBlock} mt-3`}>
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
              <div className={styles.nullBlock}></div>
            </>
          )}
          {/* admin */}
          {nowRoute === "admin" && mode === "SHIFTS" && (
            <>
              <div className={styles.selectBlock}>
                {timeBlockState.workTime.map((state, i) => {
                  return (
                    <div
                      onClick={() => handleArrangePeriodClick(state, i)}
                      key={i}
                      className={`${styles.adminTime} ${
                        state === work.off
                          ? `${styles.stop}`
                          : state === work.reserved
                          ? `${styles.lock}`
                          : ""
                      }`}
                    >
                      {i + 10}:00
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default TimeBlock;
