import { useState, useRef, useEffect } from "react";

type CalendarProps = {
  onTodayDataChange: (data: string) => void;
  // children: ReactNode;
};

const Calender: React.FC<CalendarProps> = ({ onTodayDataChange }) => {
  interface dateObject {
    currYear: number;
    currMonth: number;
    currDate: number;
  }

  interface dayElement {
    day: number;
    active: boolean;
    isToday: boolean;
    clicked: boolean;
  }

  interface DaysElementState {
    days: dayElement[];
  }

  const prevIcon = useRef<HTMLSpanElement>(null);
  const nextIcon = useRef<HTMLSpanElement>(null);

  const [clientPage, setClientPage] = useState<number>(0);
  const [clickDay, setClickDay] = useState({
    today: -1,
    thisMonth: -1,
    nextMonth: -1,
  });
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
      // daysElement.days.push({
      //   day: lastDateOfLastMonth - i + 1,
      //   active: false,
      //   isToday: false,
      //   clicked: false,
      // });
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

  const handlePrevNextIcon = (e: React.MouseEvent<HTMLSpanElement>) => {
    const targetButton = e.target as HTMLButtonElement;
    // if (
    //   (clientPage === 0 && targetButton.id === "prev") ||
    //   (clientPage === 1 && targetButton.id === "next")
    // )
    //   return;
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

  const updateState = (i: number) => {
    setDaysElement((prevList) => {
      const newArr = [...prevList.days];
      const updatedItem = { ...newArr[i] };
      updatedItem.clicked = !updatedItem.clicked;
      newArr[i] = updatedItem;
      return { days: newArr };
    });
  };

  const handleDayClick = (
    e: React.MouseEvent<HTMLSpanElement>,
    i: number,
    item: dayElement
  ) => {
    const targetButton = e.target as HTMLButtonElement;
    if (item.active) {
      const today = clickDay.today;
      if (clickDay.thisMonth === -1 && clickDay.nextMonth === -1 && i === today)
        return;
      updateState(i);
      if (clientPage === 0 && i !== today) {
        setClickDay({
          today: today,
          thisMonth: i,
          nextMonth: -1,
        });
        if (clickDay.thisMonth !== -1) {
          updateState(clickDay.thisMonth);
        }
      }
      if (clientPage === 1) {
        setClickDay({
          today: today,
          thisMonth: -1,
          nextMonth: i,
        });
        if (clickDay.nextMonth !== -1) {
          updateState(clickDay.nextMonth);
        }
      }

      if (i !== today && daysElement.days[today].clicked) {
        updateState(today);
      } else if (i === today && clientPage === 0) {
        setClickDay({
          today: today,
          thisMonth: -1,
          nextMonth: -1,
        });
        updateState(clickDay.thisMonth);
      }

      const dataFromChild = `${date.currYear} ${date.currMonth + 1} ${
        targetButton.textContent
      }`;
      onTodayDataChange(dataFromChild);
      // console.log(
      //   `${date.currYear} ${date.currMonth + 1} ${targetButton.textContent}`
      // );
    }
  };

  useEffect(() => {
    renderCalendar();

    onTodayDataChange(`${date.currYear} ${date.currMonth} ${date.currDate}`);
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
              } ${item.clicked ? "clicked" : ""}`}
              key={index}
              onClick={(e) => handleDayClick(e, index, item)}
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
/*

import React, { useState } from "react";

const YourComponent = () => {
  interface itemObg {
    text: string;
    clicked: boolean;
  }

  interface data {
    arr: itemObg[];
  }

  // 初始状态
  const [myList, setMyList] = useState<data>({
    arr: [
      { text: "item1", clicked: false },
      { text: "item2", clicked: false },
      { text: "item3", clicked: false },
    ],
  });

  // const [myList, setMyList] = useState([
  //   { text: "item1", clicked: false },
  //   { text: "item2", clicked: false },
  //   { text: "item3", clicked: false },
  // ]);

  // 更新数组中的某个值
  // const updateListItem = (indexToUpdate: number) => {
  //   setMyList(({prevList}) => {
  //     const newList = [...prevList.arr];
  //     const origin = newList[indexToUpdate].clicked;
  //     newList[indexToUpdate] = { text: "update", clicked: !origin };
  //     return newList;
  //   });
  // };

  const updateListItem = (indexToUpdate: number) => {
    setMyList((prevList) => {
      // 创建原数组的副本
      const newArr = [...prevList.arr];

      // 创建原元素的副本
      const updatedItem = { ...newArr[indexToUpdate] };

      // 更新副本的 clicked 属性
      updatedItem.clicked = !updatedItem.clicked;

      // 将更新后的元素放回副本中的对应位置
      newArr[indexToUpdate] = updatedItem;

      console.log("new", myList.arr);

      // 返回包含更新后数组的新状态
      return { arr: newArr };
    });
  };

  const handle = (indexToUpdate: number) => {
    updateListItem(indexToUpdate);
    console.log(myList.arr);
  };

  return (
    <div>
      <ul>
        {myList.arr.map((item, index) => (
          <li key={index}>
            <p
              className={`${item.clicked ? "test" : ""} ${
                item.clicked ? "test2" : ""
              }`}
              onClick={() => updateListItem(index)}
            >
              {item.text}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default YourComponent;
*/
