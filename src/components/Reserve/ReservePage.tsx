import Calendar from "./Calendar";
import TimeBlock from "./TimeBlock";
import { useState } from "react";

const ReservePage = () => {
  const [dataFromCalendar, setDataFromCalendar] = useState<string>("");

  const handleTodayDataChange = (data: string) => {
    setDataFromCalendar(data);
  };

  return (
    <>
      <main>
        <div className="calendar-wrapper">
          <div className="calendar-outter">
            <Calendar onTodayDataChange={handleTodayDataChange} />
            <TimeBlock title={dataFromCalendar} />
          </div>
        </div>
      </main>
    </>
  );
};

export default ReservePage;
