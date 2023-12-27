import axios from "axios";
import Calendar from "../Calendar/Calendar";
import TimeBlock from "../Calendar/TimeBlock";
import { useState, useEffect } from "react";
import { ENDPOINT } from "../../App";
import { WorkTimeData, BookingData } from "../Calendar/CalenderNeeds";
import { CLickEvents, getMonthUrlQuery } from "../Constant";
import styles from "./AdminCalPage.module.css";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../state/store.ts";
import { setBookingData } from "../state/booking/bookingSlice";
import {
  setManyOn,
  setAlertShow,
  resetSelectDate,
} from "../state/many/manySlice";

interface ResAvailable {
  result: {
    thisMonth: WorkTimeData[];
    nextMonth: WorkTimeData[];
    theMonthAfterNext: WorkTimeData[];
  };
}

interface ResAdminData {
  workTime: {
    thisMonth: WorkTimeData[];
    nextMonth: WorkTimeData[];
    theMonthAfterNext: WorkTimeData[];
  };
  bookings: {
    thisMonth: BookingData[];
    nextMonth: BookingData[];
    theMonthAfterNext: BookingData[];
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
  const dispatch = useDispatch();
  const nowRoute = "admin";
  const [page, setPage] = useState(0);
  const [allSelect, setAllSelect] = useState(0);
  const [allCancel, setAllCancel] = useState(0);
  const [updateBtnClick, setUpdateBtnClick] = useState(false);
  const [getFetchResponse, setGetFetchResponse] = useState(false);
  const [waitGif, setWaitGif] = useState(false);
  const [mode, setMode] = useState<string>("BOOKS");
  const manyStore = useSelector((state: RootState) => state.many);

  const [dataFromCalendar, setDataFromCalendar] = useState<CLickEvents>({
    detect: false,
    date: "",
  });
  const [forChildSureData, setForChildSureData] = useState<WorkTimeData[]>([]);
  const [updateWorkTime, setUpdateWorkTime] = useState<PostData>({
    create: [],
    update: [],
  });

  const [sureTimeData, setSureTimeData] = useState<ResAvailable>({
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

    setPage(pg);
  };

  const handleUpdateWorkTime = (
    createData: WorkTimeData[],
    updateData: WorkTimeData[]
  ) => {
    console.log("create:", createData);
    console.log("update:", updateData);

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

  const handleModeChange = (clickBtnMode: string) => {
    if (clickBtnMode === mode) return;
    if (clickBtnMode === "BOOKS") {
      setMode("BOOKS");
      if (manyStore.manyOn) {
        dispatch(
          setManyOn({
            b: false,
          })
        );
      }
    } else {
      setMode("SHIFTS");
    }
  };

  const handleUpdateArrangeData = () => {
    if (mode === "BOOKS") return;

    setUpdateBtnClick(true);
    setTimeout(() => setUpdateBtnClick(false));
  };

  const handleAllSelect = () => {
    setAllSelect((prev) => prev + 1);
  };

  const handleAllCancel = () => {
    setAllCancel((prev) => prev + 1);
  };

  const handleSelectMany = () => {
    if (manyStore.manyOn) {
      dispatch(
        setAlertShow({
          b: true,
        })
      );
    } else {
      dispatch(
        setManyOn({
          b: true,
        })
      );
    }
  };

  const handleAlert = (bool: boolean) => {
    if (bool) {
      // keep many mode
    } else {
      // back to origin state
      dispatch(
        setManyOn({
          b: false,
        })
      );
      dispatch(resetSelectDate());
    }
    dispatch(
      setAlertShow({
        b: false,
      })
    );
  };

  useEffect(() => {
    if (sureTimeData.result.thisMonth.length === 0) return;

    const thisMonth = getMonth()[0];
    const nextMonth = getMonth()[1];
    const theMonthAfterNext = getMonth()[2];
    const fetchAdminData = async () => {
      try {
        const response = await axios.get<ResAdminData>(
          `${ENDPOINT}/admin?thisMonth=${thisMonth}&nextMonth=${nextMonth}&theMonthAfterNext=${theMonthAfterNext}`
        );
        const thisMWorkTime =
          response.data.workTime.thisMonth === null
            ? []
            : response.data.workTime.thisMonth;
        const nextMWorkTime =
          response.data.workTime.nextMonth === null
            ? []
            : response.data.workTime.nextMonth;
        const afterMWorkTime =
          response.data.workTime.theMonthAfterNext === null
            ? []
            : response.data.workTime.theMonthAfterNext;

        setSureTimeData({
          result: {
            thisMonth: thisMWorkTime,
            nextMonth: nextMWorkTime,
            theMonthAfterNext: afterMWorkTime,
          },
        });

        const thisMBooking =
          response.data.bookings.thisMonth === null
            ? []
            : response.data.bookings.thisMonth;
        const nextMBooking =
          response.data.bookings.nextMonth === null
            ? []
            : response.data.bookings.nextMonth;
        const afterMBooking =
          response.data.bookings.theMonthAfterNext === null
            ? []
            : response.data.bookings.theMonthAfterNext;
        dispatch(
          setBookingData({
            thisMonth: thisMBooking,
            nextMonth: nextMBooking,
            theMonthAfterNext: afterMBooking,
          })
        );
        setForChildSureData(thisMWorkTime);
      } catch (error) {
        console.log(error);
      } finally {
        setGetFetchResponse(true);
      }
    };
    fetchAdminData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (updateWorkTime.create.length > 0 || updateWorkTime.update.length > 0) {
      setWaitGif(true);
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

            setTimeout(() => {
              setWaitGif(false);
            }, 500);
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
      <header>
        <div className={styles.selects}>
          {buttons.map((item, i) => {
            return (
              <div
                key={i}
                onClick={() => handleModeChange(item.mode)}
                className={`${styles.button} ${styles.books} ${
                  mode === item.mode ? styles.active : ""
                }`}
              >
                {item.title}
              </div>
            );
          })}
        </div>
      </header>
      <main>
        <div className="calendar-wrapper">
          <div className="calendar-outter">
            <Calendar
              onTodayDataChange={handleTodayDataChange}
              onPageChange={handlePageChange}
              fetchWorkTimeDatas={forChildSureData}
              getFetchResponse={getFetchResponse}
              nowRoute={nowRoute}
              mode={mode}
            />
            <TimeBlock
              onUpdateWorkTime={handleUpdateWorkTime}
              updateBtnClick={updateBtnClick}
              clickEvents={dataFromCalendar}
              getFetchResponse={getFetchResponse}
              fetchWorkTimeDatas={forChildSureData}
              nowRoute={nowRoute}
              page={page}
              mode={mode}
              allSelect={allSelect}
              allCancel={allCancel}
            />
            {mode === "SHIFTS" && (
              <div className={styles.adminBtns}>
                {manyStore.alertShow && (
                  <div className={styles.manySelectAlert}>
                    <span className={styles.symbol}>※</span>
                    <p>
                      需要上傳多選資料請先點擊
                      <span className={styles.strong}>繼續選擇</span>
                      按鈕，然後再點擊
                      <span className={styles.strong}>班表上傳</span>按鈕
                    </p>
                    <span className={styles.symbol}>※</span>
                    <p>
                      需要取消剛剛全選的所有狀態，請點擊
                      <span className={styles.strong}>確定取消</span>按鈕
                    </p>
                    <div className={styles.alertBtns}>
                      <button onClick={() => handleAlert(true)}>
                        繼續選擇
                      </button>
                      <button onClick={() => handleAlert(false)}>
                        確定取消
                      </button>
                    </div>
                  </div>
                )}
                <div
                  className={`${styles.adminBtnSmall} ${styles.many} ${
                    manyStore.manyOn ? styles.clicked : ""
                  }`}
                  onClick={() => handleSelectMany()}
                >
                  多選
                </div>
                <div
                  className={`${styles.adminBtnSmall} ${
                    manyStore.manyOn ? styles.fade : ""
                  }`}
                  onClick={() => handleAllSelect()}
                >
                  全選
                </div>
                <div
                  className={`${styles.adminBtnSmall} ${
                    manyStore.manyOn ? styles.fade : ""
                  }`}
                  onClick={() => handleAllCancel()}
                >
                  全消
                </div>
                <div
                  className={styles.submitBtn}
                  onClick={() => handleUpdateArrangeData()}
                >
                  班表上傳
                  {waitGif && (
                    <div className={styles.waitBlock}>
                      <div className={styles.waitGif}></div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </>
  );
};

export default AdminCalPage;

const buttons = [
  {
    id: 0,
    title: "訂單模式",
    mode: "BOOKS",
  },
  {
    id: 1,
    title: "排班模式",
    mode: "SHIFTS",
  },
];
