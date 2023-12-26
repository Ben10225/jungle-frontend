import { ReactElement, useState, useEffect, useReducer } from "react";
import { WorkTimeData } from "./CalenderNeeds";
import { work, CLickEvents } from "../Constant";
import { timeBlockReducer, timeBlockInit } from "./TimeBlockNeeds";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleRight } from "@fortawesome/free-solid-svg-icons";
import styles from "./TimeBlock.module.css";
import _ from "lodash";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { RootState } from "../state/store.ts";
import { setPart, setReserveTime } from "../state/reserve/reserveSlice";
import {
  setNowDateBooks,
  clearBooks,
  setBookNewState,
  setWait,
} from "../state/booking/bookingSlice.ts";
import axios from "axios";
import { ENDPOINT } from "../../App";

interface TimeBlockProps {
  clickEvents: CLickEvents;
  nowRoute: string;
  mode: string;
  page: number;
  getFetchResponse: boolean;
  fetchWorkTimeDatas: WorkTimeData[];
  updateBtnClick: boolean;
  allSelect: number;
  allCancel: number;
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
  allSelect,
  allCancel,
  onUpdateWorkTime,
}: TimeBlockProps): ReactElement => {
  const dispatch = useDispatch();
  const [selectIndex, setSelectIndex] = useState<number>(-1);
  const [bookingStateIndex, setBookingStateIndex] = useState<number>(-1);
  const [timeBlockState, timeBlockDispatch] = useReducer(
    timeBlockReducer,
    timeBlockInit
  );
  const reserveItemsWholeTime = useSelector(
    (state: RootState) => state.reserve.reserveItems
  ).reduce((acc, curr) => (acc += curr.time), 0);

  const bookingStore = useSelector((state: RootState) => state.booking);

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

  const getTitlesString = (arr: string[]) => {
    const str = arr.reduce((acc, curr) => acc + curr + " ", "");
    return str.slice(0, -1);
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

  const handleBookingState = (index: number) => {
    setBookingStateIndex(index);
  };

  const handleOption = (
    newValue: number,
    ori: number,
    yymm: string,
    date: string,
    hourIndex: number,
    bookingsIndex: number
  ) => {
    setBookingStateIndex(-1);
    if (ori === newValue) return;
    dispatch(
      setBookNewState({
        yymm: yymm,
        date: date,
        newBookingState: newValue,
        page: page,
        hourIndex: hourIndex,
      })
    );
    const updateBookingState = async () => {
      try {
        dispatch(
          setWait({
            b: true,
            i: bookingsIndex,
          })
        );
        const response = await axios.patch<{ result: string }>(
          `${ENDPOINT}/bookingState`,
          {
            yymm: yymm,
            date: date,
            hourIndex: hourIndex,
            newState: newValue,
          }
        );
        if (response.data.result === "ok") {
          setTimeout(() => {
            dispatch(
              setWait({
                b: false,
                i: bookingsIndex,
              })
            );
          }, 500);
        }
      } catch (error) {
        console.log(error);
      }
    };
    updateBookingState();
  };

  const getBookingState = (num: number) => {
    if (num === 1) return "已完成";
    if (num === -1) return "未出現";
    if (num === 0) return "無狀態";
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
      if (timeBlockState.mode.books) {
        const now = clickEvents.date.split(" ");
        dispatch(
          setNowDateBooks({
            yymm: now[0] + "-" + now[1],
            date: now[2],
            data: bookingStore.thisMonth,
          })
        );
      }
      if (timeBlockState.mode.shifts) {
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
    if (allSelect > 0 && timeBlockState.today.length > 0) {
      timeBlockDispatch({
        type: "UPDATE_DATA_ALL",
        payload: {
          add: true,
        },
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allSelect]);

  useEffect(() => {
    if (allCancel > 0 && timeBlockState.today.length > 0) {
      timeBlockDispatch({
        type: "UPDATE_DATA_ALL",
        payload: {
          add: false,
        },
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allCancel]);

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
      const yy = new Date().getFullYear().toString();
      const mm = (new Date().getMonth() + 1).toString();
      const dd = new Date().getDate().toString();

      const todayBookings = bookingStore.thisMonth.find(
        (item) => item.yymm === yy + "-" + mm && item.date === dd
      );
      if (todayBookings !== undefined) {
        // has today's bookings
        timeBlockDispatch({
          type: "SET_TODAY",
          payload: { today: [yy, mm, dd] },
        });
        dispatch(
          setNowDateBooks({
            yymm: yy + "-" + mm,
            date: dd,
            data: bookingStore.thisMonth,
          })
        );
      }

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
    if (nowRoute === "admin" && mode === "SHIFTS") {
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

    if (nowRoute === "admin" && mode === "BOOKS") {
      dispatch(clearBooks());
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
          {nowRoute === "admin" && mode === "BOOKS" && (
            <>
              <div className={styles.booksBlock}>
                {bookingStore.nowDateBooks.map((item, i) => {
                  return (
                    <div className={styles.book} key={i}>
                      <div className={styles.stateWrapper}>
                        <span
                          className={`${styles.state} ${
                            bookingStateIndex === i ? styles.click : ""
                          } ${item.detail.state === 1 ? styles.finish : ""} ${
                            item.detail.state === -1 ? styles.bird : ""
                          }`}
                          onClick={() => handleBookingState(i)}
                        >
                          {getBookingState(item.detail.state)}
                        </span>
                        {bookingStateIndex === i && (
                          <div className={styles.stateBlock}>
                            {BookingStateArr.map((s) => {
                              return (
                                <div
                                  key={s.id}
                                  className={styles.option}
                                  onClick={() =>
                                    handleOption(
                                      s.id,
                                      item.detail.state,
                                      item.yymm,
                                      item.date,
                                      item.hour.index,
                                      i
                                    )
                                  }
                                >
                                  {s.title}
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                      {item.wait && <div className={styles.wait}></div>}
                      <div>狀態：</div>
                      <div>
                        姓名：{item.user.name}
                        <span className={styles.smallTxt}>
                          ( {item.user.phone} )
                        </span>
                      </div>
                      <div>
                        時間：{item.hour.index + 10}:00 -{" "}
                        {item.hour.index + 10 + item.hour.whole}:00
                        <span className={styles.smallTxt}>
                          ( {item.detail.time} )
                        </span>
                      </div>
                      <div>項目：{getTitlesString(item.titles)}</div>
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

export const BookingStateArr = [
  {
    id: 1,
    title: "已完成",
  },
  {
    id: -1,
    title: "未出現",
  },
  {
    id: 0,
    title: "無狀態",
  },
];
