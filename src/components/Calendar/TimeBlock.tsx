import { ReactElement, useState, useEffect, useReducer } from "react";

interface TimeBlockProps {
  title: string;
  nowRoute: string;
  sureTimedata: { yymm: string; date: string; sureTimeArray: boolean[] }[];
}

interface SureTimedata {
  yymm: string;
  date: string;
  sureTimeArray: boolean[];
}

interface UpdateDateAction {
  type: "UPDATE_ITEM";
  payload: { index: number; newValue: boolean };
}

interface SetDataAcrion {
  type: "SET_DATA";
  payload: { data: SureTimedata[] };
}

interface CleanTableAction {
  type: "CLEAN_TABLE";
}

type Action = UpdateDateAction | SetDataAcrion | CleanTableAction;

const TimeBlock = ({
  title,
  sureTimedata,
  nowRoute,
}: TimeBlockProps): ReactElement => {
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

  const [firstLoad, setFirstLoad] = useState<boolean>(true);
  const [selectIndex, setSelectIndex] = useState<number>(-1);
  const [today, setToday] = useState<string[]>([]);
  const [nowDaySureTimeArray, setNowDaySureTimeArray] = useState<boolean[]>([]);

  const reducer = (state: SureTimedata, action: Action) => {
    switch (action.type) {
      case "UPDATE_ITEM":
        return {
          ...state,
          sureTimeArray: state.sureTimeArray.map((item, i) => {
            if (action.payload.index === i) {
              console.log("date:", title, "time:", i + 10);
              return !item;
            } else {
              return item;
            }
          }),
        };
      case "SET_DATA": {
        const todayString = today[0] + "-" + today[1] + today[2];
        const matchingItem = action.payload.data.find(
          (item) => todayString === item.yymm + item.date
        );
        return {
          ...state,
          sureTimeArray: matchingItem
            ? matchingItem.sureTimeArray
            : [
                false,
                false,
                false,
                false,
                false,
                false,
                false,
                false,
                false,
                false,
                false,
                false,
              ],
        };
      }
      case "CLEAN_TABLE":
        return {
          ...state,
          sureTimeArray: [],
        };
      default:
        return state;
    }
  };

  const initialState: SureTimedata = {
    yymm: "",
    date: "",
    sureTimeArray: [],
  };

  const [state, dispatch] = useReducer(reducer, initialState);

  const updateItem = (index: number, newValue: boolean) => {
    dispatch({
      type: "UPDATE_ITEM",
      payload: { index: index, newValue: newValue },
    });
  };

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
    dispatch({
      type: "SET_DATA",
      payload: { data: sureTimedata },
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [title]);

  useEffect(() => {
    LoadTimeData(sureTimedata);

    if (firstLoad) {
      dispatch({
        type: "SET_DATA",
        payload: { data: sureTimedata },
      });
    } else {
      dispatch({
        type: "CLEAN_TABLE",
      });
    }

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
          {/* reserver */}
          {nowRoute === "reserve" && (
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
          )}
          {/* arrange */}
          {nowRoute === "arrange" && (
            <div className="select-block">
              {state.sureTimeArray.map((bool, i) => {
                return (
                  <div
                    onClick={() => updateItem(i, bool)}
                    key={i}
                    className={`time ${!bool ? "stop" : ""} `}
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
