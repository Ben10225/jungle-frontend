import axios from "axios";
import Calendar from "../Calendar/Calendar";
import TimeBlock from "../Calendar/TimeBlock";
import { useState, useEffect } from "react";
import { ENDPOINT } from "../../App";
import { WorkTimeData } from "../Calendar/CalenderNeeds";
import { CLickEvents, getMonthUrlQuery } from "../Constant";
import _ from "lodash";

interface ResData {
  result: {
    thisMonth: WorkTimeData[];
    nextMonth: WorkTimeData[];
    theMonthAfterNext: WorkTimeData[];
  };
}

interface PostData {
  create: WorkTimeData[];
  update: WorkTimeData[];
}

interface ResPostData {
  ok: string;
}

const AdminCalPage: React.FC = () => {
  const nowRoute = "admin";
  const [page, setPage] = useState(0);
  const [isChecked, setChecked] = useState(false);
  const [updateBtnClick, setUpdateBtnClick] = useState(false);
  const [mode, setMode] = useState<string>("SHOWRESERVED");
  const [dataFromCalendar, setDataFromCalendar] = useState<CLickEvents>({
    detect: false,
    date: "",
  });
  const [forChildSureData, setForChildSureData] = useState<WorkTimeData[]>([
    { yymm: "", date: "", workTime: [] },
  ]);
  const [updateWorkTime, setUpdateWorkTime] = useState<PostData>({
    create: [],
    update: [],
  });

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
      theMonthAfterNext: [
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
    pg === 0
      ? setForChildSureData(sureTimeData.result.thisMonth)
      : pg === 1
      ? setForChildSureData(sureTimeData.result.nextMonth)
      : setForChildSureData(sureTimeData.result.theMonthAfterNext);

    setPage(page);
  };

  const handleUpdateWorkTime = (
    oldData: WorkTimeData[],
    newData: WorkTimeData[]
  ) => {
    const createData: WorkTimeData[] = [];
    const updateData: WorkTimeData[] = [];

    newData.forEach((newDt) => {
      let dataNotInNewData = true;
      for (let i = 0; i < oldData.length; i++) {
        if (newDt.yymm === oldData[i].yymm && newDt.date === oldData[i].date) {
          console.log(_.isEqual(newDt.workTime, oldData[i].workTime));
          !_.isEqual(newDt.workTime, oldData[i].workTime)
            ? updateData.push(newDt)
            : null;
          dataNotInNewData = false;
        }
      }

      if (dataNotInNewData) {
        createData.push(newDt);
      }
    });

    console.log(createData, updateData);

    setUpdateWorkTime({
      create: createData,
      update: updateData,
    });
  };

  const getMonth = () => {
    const yy = new Date().getFullYear().toString();
    const mm = (new Date().getMonth() + 1).toString();
    const thisMonth = yy + "-" + mm;

    const nextMonth = getMonthUrlQuery(parseInt(yy), parseInt(mm) + 1);
    const theMonthAfterNext = getMonthUrlQuery(parseInt(yy), parseInt(mm) + 2);

    return [thisMonth, nextMonth, theMonthAfterNext];
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
    setUpdateBtnClick(true);
    setTimeout(() => setUpdateBtnClick(false));
  };

  useEffect(() => {
    if (sureTimeData.result.thisMonth.length === 0) return;

    const thisMonth = getMonth()[0];
    const nextMonth = getMonth()[1];
    const theMonthAfterNext = getMonth()[2];
    const fetchData = async () => {
      try {
        const response = await axios.get<ResData>(
          `${ENDPOINT}/available?r=${nowRoute}&thisMonth=${thisMonth}&nextMonth=${nextMonth}&theMonthAfterNext=${theMonthAfterNext}`
        );
        console.log(response.data);
        const thisM =
          response.data.result.thisMonth === null
            ? [
                {
                  yymm: "",
                  date: "",
                  workTime: [],
                },
              ]
            : response.data.result.thisMonth;
        const nextM =
          response.data.result.nextMonth === null
            ? [
                {
                  yymm: "",
                  date: "",
                  workTime: [],
                },
              ]
            : response.data.result.nextMonth;
        const afterM =
          response.data.result.theMonthAfterNext === null
            ? [
                {
                  yymm: "",
                  date: "",
                  workTime: [],
                },
              ]
            : response.data.result.theMonthAfterNext;

        setSureTimeData({
          result: {
            thisMonth: thisM,
            nextMonth: nextM,
            theMonthAfterNext: afterM,
          },
        });
        setForChildSureData(thisM);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (updateWorkTime.create.length > 0 || updateWorkTime.update.length > 0) {
      const postData = async () => {
        try {
          const response = await axios.post<ResPostData>(
            `${ENDPOINT}/available`,
            {
              create: updateWorkTime.create,
              update: updateWorkTime.update,
            }
          );

          if (response.data.ok) {
            setUpdateWorkTime({
              create: [],
              update: [],
            });
          }
        } catch (error) {
          console.log(error);
        }
      };
      postData();
    }
  }, [updateWorkTime]);

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
              onUpdateWorkTime={handleUpdateWorkTime}
              updateBtnClick={updateBtnClick}
              clickEvents={dataFromCalendar}
              fetchWorkTimeDatas={forChildSureData}
              nowRoute={nowRoute}
              page={page}
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
