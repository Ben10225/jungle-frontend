interface TimeBlockProps {
  title: string;
  sureTimedata: { yymm: string; date: string; sureTimeArray: boolean[] }[];
}

import { ReactElement, useState, useEffect } from "react";

const TimeBlock = ({ title, sureTimedata }: TimeBlockProps): ReactElement => {
  interface Data {
    yymm: string;
    date: string;
    sureTimeArray: boolean[];
  }

  const [dateData, setDateData] = useState<Data[]>([
    {
      yymm: "",
      date: "",
      sureTimeArray: [],
    },
  ]);

  // const [error, setError] = useState<string | null>(null);
  const [firstLoad, setFirstLoad] = useState<boolean>(true);
  const [selectIndex, setSelectIndex] = useState<number>(-1);
  const [today, setToday] = useState<string[]>([]);
  const [nowDaySureTimeArray, setNowDaySureTimeArray] = useState<boolean[]>([]);

  const getTodayString = (data: string) => {
    const str: string[] = data.split(" ");
    setToday(str);
  };

  const LoadTimeData = (res: Data[]) => {
    if (res === null) return;

    const t: string = `${new Date().getFullYear()}-${
      new Date().getMonth() + 1
    }${new Date().getDate()}`;

    setDateData(res);
    res.find((item) => {
      const d: string = item.yymm + item.date;

      if (d === t && firstLoad) {
        setNowDaySureTimeArray(item.sureTimeArray);
        setFirstLoad(false);
      }
    });

    // clean time block
    if (!firstLoad) {
      setNowDaySureTimeArray([]);
      setToday([]);
    }
  };

  const handleClick = () => {
    const t: string = today[0] + "-" + today[1] + today[2];

    dateData.forEach((item) => {
      if (item.yymm + item.date === t) {
        setNowDaySureTimeArray(item.sureTimeArray);
      }
    });
  };

  const handleReserve = (index: number) => {
    console.log("date:", title, "time:", index + 10);
    setSelectIndex(index);
  };

  useEffect(() => {
    getTodayString(title);
    setSelectIndex(-1);
  }, [title]);

  useEffect(() => {
    LoadTimeData(sureTimedata);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sureTimedata]);

  useEffect(() => {
    handleClick();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [today]);

  return (
    <div className="flex justify-center flex-col items-center">
      <div className="w-4/5">
        <hr className="w-full mb-4" />
        <div className="time-wrapper">
          <div className="today-block">
            <span>{today[0]}</span>
            {today.length > 0 && <span style={{ margin: "0px 2px" }}>-</span>}
            <span>{today[1]}</span>
            {today.length > 0 && <span style={{ margin: "0px 2px" }}>-</span>}
            <span>{today[2]}</span>
          </div>
          <div className="select-block">
            {nowDaySureTimeArray.map((bool, i) => {
              return (
                bool && (
                  <div
                    onClick={() => handleReserve(i)}
                    key={i}
                    className={`time ${selectIndex === i ? "select" : ""}`}
                  >
                    {i + 10}:00
                  </div>
                )
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TimeBlock;
