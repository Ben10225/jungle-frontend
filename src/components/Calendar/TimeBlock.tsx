import { ReactElement, useState, useEffect, useReducer } from "react";

interface TimeBlockProps {
  title: string;
  nowRoute: string;
  sureTimedata: { yymm: string; date: string; sureTimeArray: boolean[] }[];
}

// interface ArrangeItem {
//   value: boolean;
// }

interface State {
  array: boolean[];
}

type Action = {
  type: "UPDATE_ITEM";
  payload: { index: number; newValue: boolean };
};

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

  const reducer = (state: State, action: Action) => {
    switch (action.type) {
      case "UPDATE_ITEM":
        return {
          ...state,
          array: state.array.map((item, i) => {
            if (action.payload.index === i) {
              console.log("date:", title, "time:", i + 10);
              return !item;
            } else {
              return item;
            }
          }),
        };
      default:
        return state;
    }
  };

  const initialState = {
    array: [
      true,
      true,
      false,
      true,
      true,
      false,
      true,
      true,
      false,
      true,
      true,
      false,
    ],
  };

  const [state, dispatch] = useReducer(reducer, initialState);

  const updateItem = (index: number, newValue: boolean) => {
    dispatch({
      type: "UPDATE_ITEM",
      payload: { index: index, newValue: newValue },
    });
  };

  // const [arrangeSureDateArray, setArrangeSureDateArray] = useState<boolean[]>([
  //   true,
  //   true,
  //   true,
  //   true,
  //   true,
  //   true,
  //   true,
  //   false,
  //   false,
  //   true,
  //   true,
  //   true,
  // ]);

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

  // const handleArrange = (index: number) => {
  // // console.log("date:", title, "time:", index + 10);
  // const arr = arrangeSureDateArray;
  // arr[index] = !arr[index];
  // setArrangeSureDateArray([...arr]);
  // };

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

  // useEffect(() => {}, [arrangeSureDateArray]);

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
              {state.array.map((bool, i) => {
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
