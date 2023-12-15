import axios from "axios";
import Calendar from "../Calendar/Calendar";
import TimeBlock from "../Calendar/TimeBlock";
import { useState, useEffect } from "react";
import { ENDPOINT } from "../../App";

interface Data {
  yymm: string;
  date: string;
  sureTimeArray: boolean[];
}

interface ResData {
  result: {
    thisMonth: Data[];
    nextMonth: Data[];
  };
}

const ArrangePage = () => {
  const nowRoute = "arrange";
  const [dataFromCalendar, setDataFromCalendar] = useState<string>("");
  const [forChildSureData, setForChildSureData] = useState<Data[]>([
    { yymm: "", date: "", sureTimeArray: [] },
  ]);
  const [sureTimeData, setSureTimeData] = useState<ResData>({
    result: {
      thisMonth: [
        {
          yymm: "",
          date: "",
          sureTimeArray: [],
        },
      ],
      nextMonth: [
        {
          yymm: "",
          date: "",
          sureTimeArray: [],
        },
      ],
    },
  });

  const handleTodayDataChange = (data: string) => {
    setDataFromCalendar(data);
  };

  const handlePageChange = (page: number) => {
    page === 1
      ? setForChildSureData(sureTimeData.result.nextMonth)
      : setForChildSureData(sureTimeData.result.thisMonth);
  };

  const getNextMonth = () => {
    let yy = dataFromCalendar.split(" ")[1];
    let mm = dataFromCalendar.split(" ")[2];
    if (dataFromCalendar.split(" ")[1] === "12") {
      yy = (parseInt(dataFromCalendar.split(" ")[0]) + 1).toString();
      mm = "1";
    }

    return yy + "-" + mm;
  };

  useEffect(() => {
    if (sureTimeData.result.thisMonth[0].yymm !== "" || dataFromCalendar === "")
      return;

    const thisMonth =
      dataFromCalendar.split(" ")[0] + "-" + dataFromCalendar.split(" ")[1];
    const nextMonth = getNextMonth();
    const fetchData = async () => {
      try {
        const response = await axios.post<ResData>(`${ENDPOINT}/available`, {
          thisMonth: thisMonth,
          nextMonth: nextMonth,
        });

        // console.log(response.data.result);
        setSureTimeData({
          result: {
            thisMonth: response.data.result.thisMonth,
            nextMonth: response.data.result.nextMonth,
          },
        });
        setForChildSureData(response.data.result.thisMonth);
        // setSureTimeData(response.data.result.thisMonth);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataFromCalendar]);

  return (
    <>
      <main>
        <div className="calendar-wrapper">
          <div className="calendar-outter">
            <Calendar
              onTodayDataChange={handleTodayDataChange}
              onPageChange={handlePageChange}
              sureTimedata={forChildSureData}
              nowRoute={nowRoute}
            />
            <TimeBlock
              title={dataFromCalendar}
              sureTimedata={forChildSureData}
              nowRoute={nowRoute}
            />
          </div>
        </div>
      </main>
    </>
  );
};

export default ArrangePage;
