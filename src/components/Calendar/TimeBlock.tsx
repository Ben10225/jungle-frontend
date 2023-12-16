import { ReactElement, useState, useEffect, useReducer } from "react";
import { arrangeReducer, arrangeDataInit } from "../Arrange/ArrangeNeeds";
import { WorkTimeData } from "./CalenderNeeds";
import { work } from "../Constant";
import { timeBlockReducer, timeBlockInit } from "./TimeBlockNeeds";

interface TimeBlockProps {
  title: string;
  nowRoute: string;
  arrangeState: boolean;
  fetchWorkTimeDatas: WorkTimeData[];
}

const TimeBlock = ({
  title,
  fetchWorkTimeDatas,
  nowRoute,
  arrangeState,
}: TimeBlockProps): ReactElement => {
  const [firstLoad, setFirstLoad] = useState<boolean>(true);
  const [selectIndex, setSelectIndex] = useState<number>(-1);

  const [timeBlockState, timeBlockDispatch] = useReducer(
    timeBlockReducer,
    timeBlockInit
  );
  const [arrangeDataState, arrangeDataDispatch] = useReducer(
    arrangeReducer,
    arrangeDataInit
  );

  const handleArrangePeriodClick = (newValue: number, index: number) => {
    timeBlockDispatch({
      type: "UPDATE_ITEM",
      payload: { index: index, newValue: newValue },
    });

    const arr: number[] = [...timeBlockState.workTime];
    arr[index] === work.on ? (arr[index] = work.off) : (arr[index] = work.on);

    // arrange
    updateArrangeData(title, arr);
  };

  const getTodayString = (data: string) => {
    const str: string[] = data.split(" ");
    timeBlockDispatch({
      type: "SET_TODAY",
      payload: { today: str },
    });
  };

  const LoadTimeData = (res: WorkTimeData[]) => {
    if (res === null) return;

    const t: string = `${new Date().getFullYear()}-${
      new Date().getMonth() + 1
    }${new Date().getDate()}`;

    res.find((item) => {
      const d: string = item.yymm + item.date;

      if (d === t && firstLoad) {
        setFirstLoad(false);
      }
    });
  };

  const handleReserveClickPeriod = (index: number) => {
    // console.log("date:", title, "time:", index + 10);
    setSelectIndex(index);
  };

  // const firstLoadDayInactive = (fetchWorkTimeDatas: WorkTimeData[]) => {
  //   fetchWorkTimeDatas.forEach((item) => {
  //     if (item.date === timeBlockState.today[2]) {
  //       item.workTime.every((s) => s === work.off) ? setToday([]) : null;
  //     }
  //   });
  // };

  const handleSaveArrangeDate = () => {
    if (arrangeState) {
      console.log("save");
    }
  };

  /* arrange reducer func  */

  const updateArrangeData = (str: string, update: number[]) => {
    arrangeDataDispatch({
      type: "UPDATE_DATA",
      payload: { str: str, update: update },
    });
  };

  /* --------------------  */

  useEffect(() => {
    getTodayString(title);
    setSelectIndex(-1);
    timeBlockDispatch({
      type: "SET_DATA",
      payload: { data: fetchWorkTimeDatas },
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [title]);

  useEffect(() => {
    if (fetchWorkTimeDatas[0].date === "" || fetchWorkTimeDatas[0].yymm === "")
      return;
    LoadTimeData(fetchWorkTimeDatas);

    if (firstLoad) {
      timeBlockDispatch({
        type: "SET_DATA",
        payload: { data: fetchWorkTimeDatas },
      });
    } else {
      timeBlockDispatch({
        type: "CLEAN_TABLE",
      });
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchWorkTimeDatas]);

  useEffect(() => {
    if (nowRoute !== "arrange") return;
    handleSaveArrangeDate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [arrangeState]);

  return (
    <div className="flex justify-center flex-col items-center">
      <div className="w-4/5">
        <hr className="w-full mb-4" />
        <div className="time-wrapper">
          <div className="today-block">
            <span>{timeBlockState.today[0]}</span>
            {timeBlockState.today.length > 0 && (
              <span style={{ margin: "0px 2px" }}>-</span>
            )}
            <span>{timeBlockState.today[1]}</span>
            {timeBlockState.today.length > 0 && (
              <span style={{ margin: "0px 2px" }}>-</span>
            )}
            <span>{timeBlockState.today[2]}</span>
          </div>
          {/* reserver */}
          {nowRoute === "reserve" && (
            <div className="select-block">
              {timeBlockState.workTime.map((state, i) => {
                return (
                  state === work.on && (
                    <div
                      onClick={() => handleReserveClickPeriod(i)}
                      key={i}
                      className={`time ${selectIndex === i ? "select" : ""}`}
                    >
                      {i + 10}:00
                    </div>
                  )
                );
              })}
            </div>
          )}
          {/* arrange */}
          {nowRoute === "arrange" && (
            <div className="select-block">
              {timeBlockState.workTime.map((state, i) => {
                return (
                  <div
                    onClick={() => handleArrangePeriodClick(state, i)}
                    key={i}
                    className={`time ${state === work.off ? "stop" : ""} `}
                  >
                    {i + 10}:00
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TimeBlock;
