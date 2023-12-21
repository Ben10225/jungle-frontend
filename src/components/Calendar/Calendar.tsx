import { useState, useEffect, useReducer } from "react";
import { reducer, WorkTimeData, months } from "./CalenderNeeds";
import { CLickEvents } from "../Constant";
import PrevNextBtn from "./PrevNextBtn";
import styles from "./Calendar.module.css";
import {
  dayElement,
  daysElementState,
  clickDay,
  dateObject,
} from "./CalenderNeeds";

interface CalendarProps {
  onTodayDataChange: (data: CLickEvents) => void;
  onPageChange: (data: number) => void;
  fetchWorkTimeDatas: WorkTimeData[];
  nowRoute: string;
  mode: string;
}

const Calender: React.FC<CalendarProps> = ({
  onTodayDataChange,
  onPageChange,
  fetchWorkTimeDatas,
  nowRoute,
  mode,
}) => {
  let clickDetect: boolean = false;

  const [firstLoad, setFirstLoad] = useState<boolean>(true);
  const [clientPage, setClientPage] = useState<number>(0);
  const [nowDate, setNowDate] = useState<Date>(new Date());
  const [clickDay, setClickDay] = useState<clickDay>({
    today: -1,
    thisMonth: -1,
    nextMonth: -1,
  });

  const initialState: daysElementState = {
    days: [
      {
        day: 0,
        active: false,
        isToday: false,
        clicked: true,
      },
    ],
  };

  const [state, dispatch] = useReducer(reducer, initialState);

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

    const tmp = [];
    for (let i = firstDateOfMonth; i > 0; i--) {
      tmp.push({
        day: lastDateOfLastMonth - i + 1,
        active: false,
        isToday: false,
        clicked: false,
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
          ? { day: i, active: true, isToday: true, clicked: true }
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
          ? { day: i, active: false, isToday: false, clicked: false }
          : { day: i, active: true, isToday: false, clicked: false };
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

    dispatch({
      type: "SET_DATE_DATA",
      payload: { days: tmp },
    });

    if (!firstLoad) dispatch({ type: "CLEAR_CLICK" });
  };

  const handleClick = (index: number, item: dayElement) => {
    if (!item.active) return;

    dispatch({
      type: "UPDATE_DATE_CLICK",
      payload: { index: index, nowRoute: nowRoute },
    });

    clickDetect = true;
    const str: string = `${date.currYear} ${date.currMonth + 1} ${item.day}`;
    onTodayDataChange({ detect: clickDetect, date: str });
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
    if (mode === "SHOWRESERVED") {
      renderCalendar();
      dispatch({
        type: "ADMIN_SHOWRESERVED",
      });
    }
    if (mode === "ARRANGE") {
      renderCalendar();
    }
  };

  useEffect(() => {
    // renderCalendar();
    if (firstLoad) {
      onTodayDataChange({
        detect: false,
        date: `${date.currYear} ${date.currMonth + 1} ${date.currDate}`,
      });
      if (nowRoute === "reserve") {
        dispatch({
          type: "RESERVE_CLICK",
          payload: { data: fetchWorkTimeDatas },
        });
      }
      setFirstLoad(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
      dispatch({
        type: "RESERVE_CLICK",
        payload: { data: fetchWorkTimeDatas },
      });
    }
    if (nowRoute === "admin") {
      adminCalendarRender();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clientPage]);

  useEffect(() => {
    if (nowRoute === "reserve")
      dispatch({
        type: "RESERVE_CLICK",
        payload: { data: fetchWorkTimeDatas },
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchWorkTimeDatas]);

  useEffect(() => {
    // click mode button
    if (nowRoute === "admin") {
      adminCalendarRender();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode]);

  return (
    <div className={styles.calendar}>
      <header className="flex items-center justify-between p-5 mb-2">
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
          {state.days.map((item, index) => {
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
          {state.days.map((item, index) => {
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
    </div>
  );
};

export default Calender;
