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

const ReserveSectionCalendar: React.FC = () => {
  const nowRoute = "reserve";
  const [page, setPage] = useState(0);
  const [getFetchResponse, setGetFetchResponse] = useState(false);
  const [dataFromCalendar, setDataFromCalendar] = useState<CLickEvents>({
    detect: false,
    date: "",
  });
  const [forChildSureData, setForChildSureData] = useState<WorkTimeData[]>([]);
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

  const handlePageChange = (pg: number) => {
    pg === 1
      ? setForChildSureData(sureTimeData.result.nextMonth)
      : setForChildSureData(sureTimeData.result.thisMonth);
    setDataFromCalendar({ detect: false, date: "" });
    setPage(pg);
  };

  useEffect(() => {
    const yy = new Date().getFullYear().toString();
    const mm = (new Date().getMonth() + 1).toString();
    const thisMonth = yy + "-" + mm;
    const nextMonth = getMonthUrlQuery(parseInt(yy), parseInt(mm) + 1);

    const fetchData = async () => {
      try {
        const response = await axios.get<ResData>(
          `${ENDPOINT}/available?thisMonth=${thisMonth}&nextMonth=${nextMonth}`
        );

        const thisM =
          response.data.result.thisMonth === null
            ? []
            : response.data.result.thisMonth;
        const nextM =
          response.data.result.nextMonth === null
            ? []
            : response.data.result.nextMonth;

        setSureTimeData({
          result: {
            thisMonth: thisM,
            nextMonth: nextM,
          },
        });
        setForChildSureData(thisM);
      } catch (error) {
        console.log(error);
      } finally {
        setGetFetchResponse(true);
      }
    };
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <div className="calendar-wrapper">
        <div className="calendar-outter">
          <Calendar
            onTodayDataChange={handleTodayDataChange}
            onPageChange={handlePageChange}
            getFetchResponse={getFetchResponse}
            fetchWorkTimeDatas={forChildSureData}
            nowRoute={nowRoute}
            mode={""}
          />
          <TimeBlock
            onUpdateWorkTime={() => {}}
            updateBtnClick={false}
            clickEvents={dataFromCalendar}
            getFetchResponse={getFetchResponse}
            fetchWorkTimeDatas={forChildSureData}
            nowRoute={nowRoute}
            page={page}
            mode={""}
            allSelect={0}
            allCancel={0}
          />
        </div>
      </div>
    </>
  );
};

export default ReserveSectionCalendar;
