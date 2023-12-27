import { useState, useEffect, useReducer } from "react";
import { reducer, WorkTimeData, months } from "./CalenderNeeds";
import { CLickEvents, work } from "../Constant";
import PrevNextBtn from "./PrevNextBtn";
import styles from "./Calendar.module.css";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../state/store.ts";
import {
  dayElement,
  daysElementState,
  clickDay,
  dateObject,
} from "./CalenderNeeds";
import { setSelectDate } from "../state/many/manySlice.ts";

interface CalendarProps {
  onTodayDataChange: (data: CLickEvents) => void;
  onPageChange: (data: number) => void;
  fetchWorkTimeDatas: WorkTimeData[];
  getFetchResponse: boolean;
  nowRoute: string;
  mode: string;
}

const Calender: React.FC<CalendarProps> = ({
  onTodayDataChange,
  onPageChange,
  fetchWorkTimeDatas,
  nowRoute,
  mode,
  getFetchResponse,
}) => {
  let clickDetect: boolean = false;
  const dispatch = useDispatch();
  const [firstLoad, setFirstLoad] = useState<boolean>(true);
  const [clientPage, setClientPage] = useState<number>(0);
  const [nowDate, setNowDate] = useState<Date>(new Date());
  const [clickTmp, setClickTmp] = useState<string>("");
  const [clickDay, setClickDay] = useState<clickDay>({
    today: -1,
    thisMonth: -1,
    nextMonth: -1,
  });

  const reserveItemsWholeTime = useSelector(
    (state: RootState) => state.reserve.reserveItems
  ).reduce((acc, curr) => (acc += curr.time), 0);

  const bookingStore = useSelector((state: RootState) => state.booking);
  const manyStore = useSelector((state: RootState) => state.many);

  const initialState: daysElementState = {
    days: [
      {
        day: 0,
        active: false,
        isToday: false,
        clicked: true,
        selected: false,
      },
    ],
  };

  const [calState, calDispatch] = useReducer(reducer, initialState);

  const [daysElement, setDaysElement] = useState<daysElementState>({
    days: [],
  });

  const [date, setDate] = useState<dateObject>({
    currYear: nowDate.getFullYear(),
    currMonth: nowDate.getMonth(),
    currDate: nowDate.getDate(),
  });

  const renderCalendar = () => {
    daysElement.days = [];

    const firstDateOfMonth = new Date(
      date.currYear,
      date.currMonth,
      1
    ).getDay();

    const lastDateOfMonth = new Date(
      date.currYear,
      date.currMonth + 1,
      0
    ).getDate();

    const lastDateOfLastMonth = new Date(
      date.currYear,
      date.currMonth,
      0
    ).getDate();

    const tmp: dayElement[] = [];
    for (let i = firstDateOfMonth; i > 0; i--) {
      tmp.push({
        day: lastDateOfLastMonth - i + 1,
        active: false,
        isToday: false,
        clicked: false,
        selected: false,
      });
    }

    for (let i = 1; i <= lastDateOfMonth; i++) {
      const isToday: dayElement =
        (i === new Date().getDate() &&
          date.currMonth === new Date().getMonth() &&
          nowDate.getFullYear() === new Date().getFullYear()) ||
        (i === new Date().getDate() &&
          date.currMonth === -1 &&
          nowDate.getFullYear() === new Date().getFullYear())
          ? {
              day: i,
              active: true,
              isToday: true,
              clicked: true,
              selected: false,
            }
          : nowDate.getFullYear() < new Date().getFullYear() ||
            (nowDate.getFullYear() === new Date().getFullYear() &&
              date.currMonth < new Date().getMonth() &&
              date.currMonth !== -1) ||
            (nowDate.getFullYear() === new Date().getFullYear() &&
              date.currMonth > new Date().getMonth() &&
              date.currMonth === 12) ||
            (nowDate.getFullYear() === new Date().getFullYear() &&
              (date.currMonth === new Date().getMonth() ||
                date.currMonth === -1) &&
              i < new Date().getDate())
          ? {
              day: i,
              active: false,
              isToday: false,
              clicked: false,
              selected: false,
            }
          : {
              day: i,
              active: true,
              isToday: false,
              clicked: false,
              selected: false,
            };
      tmp.push(isToday);
    }

    if (clickDay.today === -1) {
      tmp.forEach((item, i) => {
        if (item.isToday) {
          setClickDay((prev) => ({
            ...prev,
            today: i,
          }));
        }
      });
    }

    if (clickDay.thisMonth !== -1 && clientPage === 0) {
      tmp[clickDay.thisMonth].clicked = !tmp[clickDay.thisMonth].clicked;
    }
    if (clickDay.nextMonth !== -1 && clientPage === 1) {
      tmp[clickDay.nextMonth].clicked = !tmp[clickDay.nextMonth].clicked;
    }
    if (
      (clickDay.thisMonth !== -1 || clickDay.nextMonth !== -1) &&
      clientPage === 0
    ) {
      tmp[clickDay.today].clicked = !tmp[clickDay.today].clicked;
    }

    setDaysElement({ days: tmp });

    calDispatch({
      type: "SET_DATE_DATA",
      payload: { days: tmp },
    });

    if (!firstLoad) calDispatch({ type: "CLEAR_CLICK" });
  };

  const handleClick = (index: number, item: dayElement) => {
    if (!item.active) return;

    // many mode click
    if (manyStore.manyOn) {
      const arr =
        clientPage === 0
          ? manyStore.thisMonth.selectDate
          : clientPage === 1
          ? manyStore.nextMonth.selectDate
          : manyStore.theMonthAfterNext.selectDate;

      const selected = checkExistManySelect(arr, item.day);
      dispatch(
        setSelectDate({
          page: clientPage,
          date: item.day,
          selected: selected,
        })
      );
      calDispatch({
        type: "UPDATE_DATE_MANY_MODE_CLICK",
        payload: { index: index, selected: selected },
      });
      return;
    }
    const str: string = `${date.currYear} ${date.currMonth + 1} ${item.day}`;

    // prevent repeat click same day
    if (str === clickTmp && nowRoute === "reserve") return;

    calDispatch({
      type: "UPDATE_DATE_CLICK",
      payload: { index: index, nowRoute: nowRoute },
    });

    clickDetect = true;
    onTodayDataChange({ detect: clickDetect, date: str });
    setClickTmp(str);
    clickDetect = false;
  };

  const handlePrevNextBtnClick = (data: number) => {
    setClientPage(data);
  };

  const handleNewDate = () => {
    if (date.currMonth === 11) {
      setNowDate(new Date(date.currYear + 1, 0, date.currDate));
    } else {
      setNowDate(new Date(date.currYear - 1, 11, date.currDate));
    }
  };

  const handleAddCurrentMonth = () => {
    setDate((prev) => ({
      ...prev,
      currMonth: date.currMonth + 1,
    }));
  };

  const handleMinusCurrentMonth = () => {
    setDate((prev) => ({
      ...prev,
      currMonth: date.currMonth - 1,
    }));
  };

  const handlePageChange = (page: number) => {
    onPageChange(page);
  };

  const adminCalendarRender = () => {
    // calendar showreserved & arrange mode change
    // clear click first
    if (mode === "BOOKS") {
      renderCalendar();
      const data =
        clientPage === 0
          ? bookingStore.thisMonth
          : clientPage === 1
          ? bookingStore.nextMonth
          : bookingStore.theMonthAfterNext;
      calDispatch({
        type: "BOOKING_CLICK",
        payload: {
          data: data,
          firstLoad: firstLoad,
        },
      });
    }
    if (mode === "SHIFTS") {
      renderCalendar();
      if (!manyStore.manyOn) {
        calDispatch({ type: "CLEAR_ALL_CLICK" });
      } else {
        const arr =
          clientPage === 0
            ? manyStore.thisMonth.selectDate
            : clientPage === 1
            ? manyStore.nextMonth.selectDate
            : manyStore.theMonthAfterNext.selectDate;
        calDispatch({
          type: "SHOW_MANY_MODE_SELECT",
          payload: {
            selectedArray: arr,
          },
        });
      }
    }
  };

  useEffect(() => {
    if (manyStore.manyOn && mode === "SHIFTS") {
      calDispatch({
        type: "MANY_MODE_SELECT_RESET_CAL",
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [manyStore.manyOn]);

  useEffect(() => {
    if (
      manyStore.createData.length === 0 &&
      manyStore.updateData.length === 0 &&
      mode === "SHIFTS"
    ) {
      calDispatch({
        type: "MANY_MODE_SELECT_RESET_CAL",
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [manyStore.createData, manyStore.updateData]);

  useEffect(() => {
    setDate({
      currYear: nowDate.getFullYear(),
      currMonth: nowDate.getMonth(),
      currDate: nowDate.getDate(),
    });
  }, [nowDate]);

  useEffect(() => {
    if (nowRoute === "reserve") {
      renderCalendar();
      setClickTmp("");
      calDispatch({
        type: "RESERVE_CLICK",
        payload: {
          data: fetchWorkTimeDatas,
          bookingWholeHour: Math.ceil(reserveItemsWholeTime / 60),
        },
      });
    }
    if (nowRoute === "admin") {
      adminCalendarRender();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clientPage]);

  useEffect(() => {
    if (getFetchResponse) {
      firstLoad && setFirstLoad(false);
      if (nowRoute === "reserve") {
        onTodayDataChange({
          detect: false,
          date: `${date.currYear} ${date.currMonth + 1} ${date.currDate}`,
        });
        calDispatch({
          type: "RESERVE_CLICK",
          payload: {
            data: fetchWorkTimeDatas,
            bookingWholeHour: Math.ceil(reserveItemsWholeTime / 60),
          },
        });

        const todayData = fetchWorkTimeDatas.find(
          (item) =>
            item.yymm === `${date.currYear}-${date.currMonth + 1}` &&
            item.date === `${date.currDate}`
        );

        if (
          todayData !== undefined &&
          !todayData.workTime.every((b) => b === work.off) &&
          firstLoad
        ) {
          setClickTmp(
            `${date.currYear} ${date.currMonth + 1} ${date.currDate}`
          );
        }
      }
      if (nowRoute === "admin") {
        calDispatch({
          type: "BOOKING_CLICK",
          payload: {
            data: bookingStore.thisMonth,
            firstLoad: firstLoad,
          },
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getFetchResponse]);

  useEffect(() => {
    // click mode button
    if (nowRoute === "admin") {
      adminCalendarRender();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode]);

  return (
    <div className={styles.calendar}>
      <header className="flex items-center justify-between p-5">
        <div>
          <span className={styles.titleyear}>{date.currYear}</span>
          <span className={styles.titlemonth}>{months[date.currMonth]}</span>
        </div>
        <PrevNextBtn
          clientPage={clientPage}
          date={date}
          nowRoute={nowRoute}
          onPrevNextBtnClick={handlePrevNextBtnClick}
          onNewDate={handleNewDate}
          onAddCurrentMonth={handleAddCurrentMonth}
          onMinusCurrentMonth={handleMinusCurrentMonth}
          onPageChange={handlePageChange}
        />
      </header>
      <ul className="weeks mb-2">
        <li>Sun</li>
        <li>Mon</li>
        <li>Tue</li>
        <li>Wed</li>
        <li>Thu</li>
        <li>Fri</li>
        <li>Sat</li>
      </ul>
      {/* reserve */}
      {nowRoute === "reserve" && (
        <ul className={styles.days}>
          {calState.days.map((item, index) => {
            return (
              <li
                className={`${styles.day} ${
                  item.active ? "" : `${styles.inactive}`
                } ${item.isToday ? `${styles.isToday}` : ""} ${
                  item.clicked ? `${styles.clicked}` : ""
                }`}
                key={index}
                onClick={() => handleClick(index, item)}
              >
                {item.day}
              </li>
            );
          })}
        </ul>
      )}
      {/* admin */}
      {nowRoute === "admin" && (
        <ul className={styles.days}>
          {calState.days.map((item, index) => {
            return (
              <li
                className={`${styles.day} ${
                  item.active ? "" : `${styles.inactive}`
                } ${item.isToday ? `${styles.isToday}` : ""} ${
                  item.clicked ? `${styles.clicked}` : ""
                }`}
                key={index}
                onClick={() => handleClick(index, item)}
              >
                {item.day}
                {/* <div className={styles.hasBooking}></div> */}
                {item.selected && mode === "SHIFTS" && manyStore.manyOn && (
                  <div className={styles.manySelect}></div>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default Calender;

const checkExistManySelect = (arr: number[], value: number): boolean => {
  return arr.includes(value);
};
