import { useSelector } from "react-redux";
import { RootState } from "../state/store.ts";
import styles from "./ReserveSectionBooking.module.css";
import { GetServiceTimeSpend } from "./ReserveSectionPriceList.tsx";
import axios from "axios";
import { ENDPOINT } from "../../App";
import { BookingData } from "../Calendar/CalenderNeeds.tsx";

const ReserveSectionBooking = () => {
  const reserveItems = useSelector(
    (state: RootState) => state.reserve.reserveItems
  );
  const reserveTime = useSelector(
    (state: RootState) => state.reserve.reserveTime
  );
  const reserveUser = useSelector((state: RootState) => state.reserve.user);

  const getReserveTitles = (): string[] => {
    if (reserveItems.length > 4) {
      let str1: string = "";
      let str2: string = "";
      reserveItems.forEach((item, i) => {
        if (i <= 3) {
          str1 += item.title + "、";
        } else {
          str2 += item.title + "、";
        }
      });
      str2 = str2.slice(0, -1);
      return [str1, str2];
    }

    const str = reserveItems
      .reduce((acc, curr) => (acc += `${curr.title}、`), "")
      .slice(0, -1);
    return [str];
  };

  const getReserveCosts = (): number => {
    return reserveItems.reduce((acc, curr) => (acc += curr.cost), 0);
  };

  const getReserveTimeString = (): string[] => {
    const d = `${reserveTime.date[0]} - ${reserveTime.date[1]} - ${reserveTime.date[2]}`;
    const t = `${
      reserveTime.clock === 2 ? "中午" : reserveTime.clock > 2 ? "下午" : "上午"
    } ${reserveTime.clock + 10}:00`;
    return [d, t];
  };

  const getSpentTime = (): number => {
    return reserveItems.reduce((acc, curr) => (acc += curr.time), 0);
  };

  // add to db booking
  const submitBooking = async () => {
    const reviseAvailData = {
      yymm: reserveTime.date[0] + "-" + reserveTime.date[1],
      date: reserveTime.date[2],
      hourIndex: reserveTime.clock,
      wholeHour: Math.ceil(getSpentTime() / 60),
    };
    const addReserve: BookingData = {
      titles: reserveItems.map((item) => item.title),
      detail: {
        time: GetServiceTimeSpend(getSpentTime()),
        cost: getReserveCosts().toString(),
        state: 0,
      },
      hour: {
        index: reserveTime.clock,
        whole: Math.ceil(getSpentTime() / 60),
      },
      yymm: reserveTime.date[0] + "-" + reserveTime.date[1],
      date: reserveTime.date[2],
      user: {
        name: reserveUser.name,
        phone: reserveUser.phone,
      },
    };

    try {
      const response = await axios.post<{ result: string }>(
        `${ENDPOINT}/reserve`,
        {
          reviseAvailable: reviseAvailData,
          addReserve: addReserve,
        }
      );

      if (response.data.result === "ok") {
        location.reload();
      }
    } catch (error) {
      console.log(error);
    } finally {
      // console.log(respon)
    }
  };

  return (
    <>
      <div className={styles.wrapper}>
        <div className={styles.block}>
          <h4>訂單內容</h4>
          <div>
            <div className={styles.line}>
              <p className={styles.title}>預約者姓名：</p>
              <p>{reserveUser.name}</p>
            </div>
            <div className={styles.line}>
              <p className={styles.title}>預約者電話：</p>
              <p>{reserveUser.phone}</p>
            </div>
            <div className={styles.line}>
              <p className={styles.title}>預約時間：</p>
              <p className={styles.clock}>{getReserveTimeString()[0]}</p>
              <p className={styles.clock}>{getReserveTimeString()[1]}</p>
            </div>
            <div className={styles.line}>
              <p className={styles.title}>預約項目：</p>
              {getReserveTitles().length === 1 && (
                <p>{getReserveTitles()[0]}</p>
              )}
              {getReserveTitles().length > 1 && (
                <>
                  <p>{getReserveTitles()[0]}</p> <p>{getReserveTitles()[1]}</p>
                </>
              )}
              <p className={styles.spendTime}>
                共約 {GetServiceTimeSpend(getSpentTime())}
              </p>
            </div>
            <div className={styles.line}>
              <p className={styles.title}>當日消費金額：</p>
              <p>{getReserveCosts()}</p>
            </div>
          </div>
          <div className={styles.buttons}>
            <div className={styles.cancel}>取 消</div>
            <div className={styles.appoint} onClick={() => submitBooking()}>
              預 約
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ReserveSectionBooking;
