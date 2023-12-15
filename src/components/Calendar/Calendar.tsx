import { useState, useEffect } from "react";
import PrevNextBtn from "./PrevNextBtn";
import { handleReserveDayClick, showClickDate } from "../Reserve/ReserveRule";
import {
  dayElement,
  daysElementState,
  clickDay,
  dateObject,
} from "../Reserve/ReserveRule";

interface CalendarProps {
  onTodayDataChange: (data: string) => void;
  onPageChange: (data: number) => void;
  sureTimedata: { yymm: string; date: string; sureTimeArray: boolean[] }[];
  nowRoute: string;
}

const Calender: React.FC<CalendarProps> = ({
  onTodayDataChange,
  onPageChange,
  sureTimedata,
  nowRoute,
}) => {
  const [firstLoad, setFirstLoad] = useState<boolean>(true);
  const [todayDataChange, setTodayDataChange] = useState<string>("");
  const [preventDateClick, setPreventDateClick] = useState<boolean>(false);
  const [clientPage, setClientPage] = useState<number>(0);
  const [nowDate, setNowDate] = useState<Date>(new Date());
  const [clickDay, setClickDay] = useState<clickDay>({
    today: -1,
    thisMonth: -1,
    nextMonth: -1,
  });

  const months = [
    "Jan.",
    "Feb.",
    "Mar.",
    "Apr.",
    "May",
    "Jun.",
    "Jul.",
    "Aug.",
    "Sep.",
    "Oct.",
    "Nov.",
    "Dec.",
  ];

  const [daysElement, setDaysElement] = useState<daysElementState>({
    days: [],
  });

  const [date, setDate] = useState<dateObject>({
    currYear: nowDate.getFullYear(),
    currMonth: nowDate.getMonth(),
    currDate: nowDate.getDate(),
  });

  const renderCalendar = () => {
    setPreventDateClick(false);
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

  useEffect(() => {
    renderCalendar();
    if (firstLoad) {
      onTodayDataChange(
        `${date.currYear} ${date.currMonth + 1} ${date.currDate}`
      );
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
    renderCalendar();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clientPage]);

  useEffect(() => {
    if (nowRoute === "reserve")
      showClickDate(sureTimedata, daysElement, setDaysElement);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sureTimedata]);

  useEffect(() => {
    if (!preventDateClick && nowRoute === "reserve")
      showClickDate(sureTimedata, daysElement, setDaysElement);
    setPreventDateClick(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [daysElement]);

  useEffect(() => {
    if (!firstLoad) onTodayDataChange(todayDataChange);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [todayDataChange]);

  return (
    <div className="calendar">
      <header className="flex items-center justify-between p-4 mb-2">
        <div>
          <span className="title-year">{date.currYear}</span>
          <span className="title-month">{months[date.currMonth]}</span>
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
      <ul className="weeks">
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
        <ul className="days">
          {daysElement.days.map((item, index) => {
            return (
              <li
                className={`day ${item.active ? "" : "inactive"} ${
                  item.isToday ? "isToday" : ""
                } ${item.clicked ? "clicked" : ""}`}
                key={index}
                onClick={(e) =>
                  handleReserveDayClick(
                    e,
                    index,
                    clientPage,
                    date,
                    item,
                    clickDay,
                    daysElement,
                    setDaysElement,
                    setClickDay,
                    setTodayDataChange
                  )
                }
              >
                {item.day}
              </li>
            );
          })}
        </ul>
      )}
      {/* arrange */}
      {nowRoute === "arrange" && (
        <ul className="days">
          {daysElement.days.map((item, index) => {
            return (
              nowRoute === "arrange" && (
                <li
                  className={`day ${item.active ? "" : "inactive"} ${
                    item.isToday ? "isToday" : ""
                  } ${item.clicked ? "clicked" : ""}`}
                  key={index}
                  onClick={(e) =>
                    handleReserveDayClick(
                      e,
                      index,
                      clientPage,
                      date,
                      item,
                      clickDay,
                      daysElement,
                      setDaysElement,
                      setClickDay,
                      setTodayDataChange
                    )
                  }
                >
                  {item.day}
                </li>
              )
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default Calender;
