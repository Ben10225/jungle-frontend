import axios from "axios";
import Calendar from "../Calendar/Calendar";
import TimeBlock from "../Calendar/TimeBlock";
import { useState, useEffect } from "react";
import { ENDPOINT } from "../../App";
import { WorkTimeData } from "../Calendar/CalenderNeeds";

// interface Data {
//   yymm: string;
//   date: string;
//   workTimeData: number[];
// }

interface ResData {
  result: {
    thisMonth: WorkTimeData[];
    nextMonth: WorkTimeData[];
  };
}

const ArrangePage = () => {
  const nowRoute = "arrange";
  const [dataFromCalendar, setDataFromCalendar] = useState<string>("");
  const [isChecked, setChecked] = useState(false);
  const [forChildSureData, setForChildSureData] = useState<WorkTimeData[]>([
    { yymm: "", date: "", workTime: [] },
  ]);
  const [sureTimeData, setSureTimeData] = useState<ResData>({
    result: {
      thisMonth: [
        {
          yymm: "",
          date: "",
          workTime: [],
        },
      ],
      nextMonth: [
        {
          yymm: "",
          date: "",
          workTime: [],
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

  const handleCheckboxChange = () => {
    setChecked(!isChecked);
  };

  const handleUpdateArrangeData = () => {
    if (!isChecked) return;
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
              fetchWorkTimeDatas={forChildSureData}
              nowRoute={nowRoute}
            />
            <TimeBlock
              title={dataFromCalendar}
              fetchWorkTimeDatas={forChildSureData}
              nowRoute={nowRoute}
              arrangeState={isChecked}
            />
            <input
              type="checkbox"
              checked={isChecked}
              onChange={handleCheckboxChange}
              className="w-6 h-6 left-5 top-5 relative"
            />
            <button
              type="button"
              className="relative top-5 left-10 text-white bg-blue-700 outline-none font-medium rounded-full text-sm px-5 py-2.5 text-center me-2 mb-2 dark:bg-blue-600"
              onClick={() => handleUpdateArrangeData()}
            >
              update data
            </button>
          </div>
        </div>
      </main>
    </>
  );
};

export default ArrangePage;
