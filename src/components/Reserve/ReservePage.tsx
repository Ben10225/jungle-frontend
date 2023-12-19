import axios from "axios";
import Calendar from "../Calendar/Calendar";
import TimeBlock from "../Calendar/TimeBlock";
import { useState, useEffect } from "react";
import { ENDPOINT } from "../../App";
import { WorkTimeData } from "../Calendar/CalenderNeeds";
import { CLickEvents, getMonthUrlQuery } from "../Constant";

interface ResData {
  result: {
    thisMonth: WorkTimeData[];
    nextMonth: WorkTimeData[];
  };
}

const ReservePage: React.FC = () => {
  const nowRoute = "reserve";
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
    setDataFromCalendar({ detect: false, date: "" });
  };

  useEffect(() => {
    if (
      sureTimeData.result.thisMonth[0].yymm !== "" ||
      dataFromCalendar.date === ""
    )
      return;

    const yy = dataFromCalendar.date.split(" ")[0];
    const mm = dataFromCalendar.date.split(" ")[1];
    const thisMonth = yy + "-" + mm;
    const nextMonth = getMonthUrlQuery(parseInt(yy), parseInt(mm) + 1);

    const fetchData = async () => {
      try {
        const response = await axios.get<ResData>(
          `${ENDPOINT}/available?r=${nowRoute}&thisMonth=${thisMonth}&nextMonth=${nextMonth}`
        );

        setSureTimeData({
          result: {
            thisMonth: response.data.result.thisMonth,
            nextMonth: response.data.result.nextMonth,
          },
        });
        setForChildSureData(response.data.result.thisMonth);
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
              mode={""}
            />
            <TimeBlock
              onUpdateWorkTime={() => {}}
              updateBtnClick={false}
              clickEvents={dataFromCalendar}
              fetchWorkTimeDatas={forChildSureData}
              nowRoute={nowRoute}
              mode={""}
            />
          </div>
        </div>
      </main>
    </>
  );
};

export default ReservePage;
