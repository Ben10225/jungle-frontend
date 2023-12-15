export interface dayElement {
  day: number;
  active: boolean;
  isToday: boolean;
  clicked: boolean;
}

export interface daysElementState {
  days: dayElement[];
}

export interface clickDay {
  today: number;
  thisMonth: number;
  nextMonth: number;
}

export interface dateObject {
  currYear: number;
  currMonth: number;
  currDate: number;
}

interface Data {
  yymm: string;
  date: string;
  sureTimeArray: boolean[];
}

type SetDaysElementFunction = React.Dispatch<
  React.SetStateAction<daysElementState>
>;

type SetClickDayFunction = React.Dispatch<React.SetStateAction<clickDay>>;
type SetTodayDataFunction = React.Dispatch<React.SetStateAction<string>>;

export const handleReserveDayClick = (
  e: React.MouseEvent<HTMLSpanElement>,
  i: number,
  clientPage: number,
  date: dateObject,
  item: dayElement,
  clickDay: clickDay,
  daysElement: daysElementState,
  setDaysElementFunction: SetDaysElementFunction,
  setClickDayFunction: SetClickDayFunction,
  setTodayDataFunction: SetTodayDataFunction
) => {
  const targetButton = e.target as HTMLButtonElement;
  if (item.active) {
    const today = clickDay.today;
    if (clickDay.thisMonth === -1 && clickDay.nextMonth === -1 && i === today)
      return;
    updateState(setDaysElementFunction, i);
    if (clientPage === 0 && i !== today) {
      setClickDayFunction({
        today: today,
        thisMonth: i,
        nextMonth: -1,
      });
      if (clickDay.thisMonth !== -1) {
        updateState(setDaysElementFunction, clickDay.thisMonth);
      }
    }
    if (clientPage === 1) {
      setClickDayFunction({
        today: today,
        thisMonth: -1,
        nextMonth: i,
      });
      if (clickDay.nextMonth !== -1) {
        updateState(setDaysElementFunction, clickDay.nextMonth);
      }
    }

    if (i !== today && daysElement.days[today].clicked) {
      updateState(setDaysElementFunction, today);
    } else if (i === today && clientPage === 0) {
      setClickDayFunction({
        today: today,
        thisMonth: -1,
        nextMonth: -1,
      });
      updateState(setDaysElementFunction, clickDay.thisMonth);
    }

    const dataFromChild = `${date.currYear} ${date.currMonth + 1} ${
      targetButton.textContent
    }`;

    setTodayDataFunction(dataFromChild);
  }
};

export const showClickDate = (
  res: Data[],
  daysElement: daysElementState,
  setDaysElementFunction: SetDaysElementFunction
) => {
  if (res === null) return;
  if (daysElement.days.length === 0) return;
  if (res.length === 1 && res[0].yymm === "" && res[0].yymm === "") return;

  const newDays = daysElement.days.map((item) => {
    if (item.active) {
      for (let i = 0; i < res.length; i++) {
        item.active = false;
        if (res[i].date === item.day.toString()) {
          item.active = true;
          break;
        }
      }
      return item;
    } else {
      return item;
    }
  });

  setDaysElementFunction({ days: newDays });
};

const updateState = (setCountFunction: SetDaysElementFunction, i: number) => {
  setCountFunction((prevList) => {
    const newArr = [...prevList.days];
    const updatedItem = { ...newArr[i] };
    updatedItem.clicked = !updatedItem.clicked;
    newArr[i] = updatedItem;
    return { days: newArr };
  });
};
