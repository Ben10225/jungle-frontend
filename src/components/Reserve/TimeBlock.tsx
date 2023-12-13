type TimeBlockProps = { title: string };

import { ReactElement, useState, useEffect } from "react";

const TimeBlock = ({ title }: TimeBlockProps): ReactElement => {
  const [today, setToday] = useState<string>("");

  const getTodayString = (data: string) => {
    const str: string[] = data.split(" ");
    setToday(`${str[0]}-${str[1]}-${str[2]}`);
  };

  useEffect(() => {
    getTodayString(title);
  }, [title]);

  return (
    <div className="flex justify-center flex-col items-center">
      <div className="w-4/5">
        <hr className="w-full mb-4" />
        <div className="time-block">
          <div className="today-block">
            <span>{today}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TimeBlock;
