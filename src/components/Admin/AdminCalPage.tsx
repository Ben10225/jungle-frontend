import axios from "axios";
import Calendar from "../Calendar/Calendar";
import TimeBlock from "../Calendar/TimeBlock";
import { useState, useEffect } from "react";
import { ENDPOINT } from "../../App";
import { WorkTimeData } from "../Calendar/CalenderNeeds";
import { CLickEvents } from "../Constant";

interface ResData {
  result: {
    thisMonth: WorkTimeData[];
    nextMonth: WorkTimeData[];
  };
}

const AdminCalPage: React.FC = () => {
  const nowRoute = "admin";
  const [isChecked, setChecked] = useState(false);
  const [mode, setMode] = useState<string>("SHOWRESERVED");
  const [dataFromCalendar, setDataFromCalendar] = useState<CLickEvents>({
    detect: false,
    date: "",
  });
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

  const handleTodayDataChange = (data: CLickEvents) => {
    setDataFromCalendar(data);
  };

  const handlePageChange = (page: number) => {
    page === 1
      ? setForChildSureData(sureTimeData.result.nextMonth)
      : setForChildSureData(sureTimeData.result.thisMonth);
  };

  const getNextMonth = () => {
    let yy = dataFromCalendar.date.split(" ")[1];
    let mm = dataFromCalendar.date.split(" ")[2];
    if (dataFromCalendar.date.split(" ")[1] === "12") {
      yy = (parseInt(dataFromCalendar.date.split(" ")[0]) + 1).toString();
      mm = "1";
    }

    return yy + "-" + mm;
  };

  const handleCheckboxChange = () => {
    setChecked(!isChecked);
    if (!isChecked) {
      setMode("ARRANGE");
    } else {
      setMode("SHOWRESERVED");
    }
  };

  const handleUpdateArrangeData = () => {
    if (!isChecked) return;
  };

  useEffect(() => {
    if (
      sureTimeData.result.thisMonth[0].yymm !== "" ||
      dataFromCalendar.date === ""
    )
      return;

    const thisMonth =
      dataFromCalendar.date.split(" ")[0] +
      "-" +
      dataFromCalendar.date.split(" ")[1];
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
              mode={mode}
            />
            <TimeBlock
              clickEvents={dataFromCalendar}
              fetchWorkTimeDatas={forChildSureData}
              nowRoute={nowRoute}
              mode={mode}
            />
            <input
              type="checkbox"
              checked={isChecked}
              onChange={handleCheckboxChange}
              className="w-6 h-6 left-12 top-12 relative"
            />
            <button
              type="button"
              className="relative top-10 left-20 text-white bg-blue-700 outline-none font-medium rounded-full text-sm px-5 py-2.5 text-center me-2 mb-2 dark:bg-blue-600"
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

export default AdminCalPage;
