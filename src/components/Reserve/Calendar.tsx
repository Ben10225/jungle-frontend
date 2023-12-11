import { useState, useRef, useEffect } from "react";

const Calender = () => {
  interface dateObject {
    currYear: number;
    currMonth: number;
    currDate: number;
  }

  interface dayElement {
    day: number;
    active: boolean;
    isToday: boolean;
  }

  interface DaysElementState {
    days: dayElement[];
  }

  const prevIcon = useRef<HTMLSpanElement>(null);
  const nextIcon = useRef<HTMLSpanElement>(null);

  const [clientPage, setClientPage] = useState(0);
  const [nowDate, setNowDate] = useState<Date>(new Date());

  // let nowDate = new Date();
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

  const [daysElement, setDaysElement] = useState<DaysElementState>({
    days: [],
  });

  const [date, setDate] = useState<dateObject>({
    currYear: nowDate.getFullYear(),
    currMonth: nowDate.getMonth(),
    currDate: nowDate.getDate(),
  });

  const renderCalender = () => {
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

    // const lastDayOfMonth = new Date(
    //   date.currYear,
    //   date.currMonth,
    //   lastDateOfMonth
    // ).getDay();

    const lastDateOfLastMonth = new Date(
      date.currYear,
      date.currMonth,
      0
    ).getDate();

    for (let i = firstDateOfMonth; i > 0; i--) {
      daysElement.days.push({
        day: lastDateOfLastMonth - i + 1,
        active: false,
        isToday: false,
      });
    }

    for (let i = 1; i <= lastDateOfMonth; i++) {
      const isToday: dayElement =
        i === nowDate.getDate() &&
        date.currMonth === new Date().getMonth() &&
        date.currYear === new Date().getFullYear()
          ? { day: i, active: true, isToday: true }
          : i < nowDate.getDate() &&
            date.currMonth === new Date().getMonth() &&
            date.currYear === new Date().getFullYear()
          ? { day: i, active: false, isToday: false }
          : (date.currMonth < new Date().getMonth() &&
              date.currYear <= new Date().getFullYear()) ||
            (date.currMonth === new Date().getMonth() &&
              date.currYear < new Date().getFullYear())
          ? { day: i, active: false, isToday: false }
          : { day: i, active: true, isToday: false };
      daysElement.days.push(isToday);
    }

    // for (let i = lastDayOfMonth; i < 6; i++) {
    //   daysElement.days.push({
    //     day: i - lastDayOfMonth + 1,
    //     active: false,
    //     isToday: false,
    //   });
    // }
  };

  const handlePrevNextIcon = (e: React.MouseEvent<HTMLSpanElement>) => {
    const targetButton = e.target as HTMLButtonElement;
    if (
      (clientPage === 0 && targetButton.id === "prev") ||
      (clientPage === 1 && targetButton.id === "next")
    )
      return;
    setDaysElement({ days: [] });

    if (targetButton.id === "prev") {
      date.currMonth = date.currMonth - 1;
      setClientPage(clientPage - 1);
    } else {
      date.currMonth = date.currMonth + 1;
      setClientPage(clientPage + 1);
    }
    // date.currMonth =
    //   targetButton.id === "prev" ? date.currMonth - 1 : date.currMonth + 1;

    if (date.currMonth < 0 || date.currMonth > 11) {
      setNowDate(new Date(date.currYear, date.currMonth, date.currDate));
    }
  };

  const handleDayClick = (
    e: React.MouseEvent<HTMLSpanElement>,
    active: boolean
  ) => {
    const targetButton = e.target as HTMLButtonElement;
    if (active) {
      console.log(
        `${date.currYear} ${date.currMonth + 1} ${targetButton.textContent}`
      );
    }
  };

  useEffect(() => {
    setDate({
      currYear: nowDate.getFullYear(),
      currMonth: nowDate.getMonth(),
      currDate: nowDate.getDate(),
    });
  }, [nowDate]);

  renderCalender();

  return (
    <div className="calendar">
      <header className="flex items-center justify-between p-4 mb-2">
        <div>
          <span className="title-year">{date.currYear}</span>
          <span className="title-month">{months[date.currMonth]}</span>
        </div>
        <div className="icons">
          <span
            ref={prevIcon}
            id="prev"
            className={`material-symbols-rounded ${
              clientPage === 0 ? "inactive" : ""
            }`}
            onClick={(e) => handlePrevNextIcon(e)}
          >
            chevron_left
          </span>
          <span
            ref={nextIcon}
            id="next"
            className={`material-symbols-rounded ${
              clientPage === 1 ? "inactive" : ""
            }`}
            onClick={(e) => handlePrevNextIcon(e)}
          >
            chevron_right
          </span>
        </div>
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
      <ul className="days">
        {daysElement.days.map((item, index) => {
          return (
            <li
              className={`day ${item.active ? "" : "inactive"} ${
                item.isToday ? "isToday" : ""
              }`}
              key={index}
              onClick={(e) => handleDayClick(e, item.active)}
            >
              {item.day}
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default Calender;
