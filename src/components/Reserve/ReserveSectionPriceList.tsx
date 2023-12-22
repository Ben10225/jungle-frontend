import styles from "./ReserveSectionPriceList.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faDollarSign,
  faCheck,
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";
import { faClock } from "@fortawesome/free-regular-svg-icons";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { setPart, setReserveItems } from "../state/reserve/reserveSlice";

interface Service {
  title: string;
  time: number;
  cost: number;
  clicked: boolean;
}

const ReserveSectionPriceList = () => {
  const dispatch = useDispatch();
  const [serviceList, setServiceList] = useState<Service[]>(priceList);
  const [clickToCalendar, setClickToCalendar] = useState<boolean>(false);

  const handleClick = (i: number) => {
    let noCLick = true;
    setServiceList(
      serviceList.map((it, index) => {
        if (i === index) {
          it.clicked = !it.clicked;
        }
        if (it.clicked) noCLick = false;
        return it;
      })
    );
    if (noCLick) {
      setClickToCalendar(false);
    } else {
      setClickToCalendar(true);
    }
  };

  const handleClear = () => {
    const tmp = [...serviceList];
    tmp.forEach((item) => (item.clicked = false));
    setServiceList(tmp);
  };

  const handleCLickToCalendar = () => {
    const clickItems = getClickedItems();
    if (clickItems[0] === 0) return;

    const bookingItems = serviceList.filter((item) => item.clicked);
    dispatch(setReserveItems(bookingItems));
    dispatch(setPart("part2"));
  };

  const getClickedItems = (): number[] => {
    const arr = serviceList.filter((item) => item.clicked);
    const min = arr.reduce((prev, current) => prev + current.time, 0);
    const sum = arr.reduce((prev, current) => prev + current.cost, 0);
    return [arr.length, min, sum];
  };

  return (
    <div className={styles.wrapper}>
      <h4 className={styles.title}>價目表</h4>
      <span>(服務可複選)</span>
      <div className={styles.table}>
        {serviceList.map((item, i) => {
          return (
            <div
              key={i}
              className={`${styles.block} ${item.clicked ? styles.select : ""}`}
              onClick={() => handleClick(i)}
            >
              {item.clicked && (
                <div className={styles.check}>
                  <FontAwesomeIcon className={styles.icon} icon={faCheck} />
                </div>
              )}
              <p>{item.title}</p>
              <div className={styles.description}>
                <div className={styles.time}>
                  <FontAwesomeIcon className={styles.icon} icon={faClock} />
                  <span>{GetServiceTimeSpend(item.time)}</span>
                </div>
                <div className={styles.price}>
                  <FontAwesomeIcon
                    className={styles.icon}
                    icon={faDollarSign}
                  />
                  <span className={styles.price}>{item.cost}元</span>
                </div>
              </div>
            </div>
          );
        })}
        <div className={styles.nullBlock}></div>
      </div>
      <div className={styles.next}>
        <div className={styles.nextBlock}>
          <div className={styles.count}>
            <p className={styles.first}>已選 {getClickedItems()[0]} 項服務：</p>
            <p>
              {GetServiceTimeSpend(getClickedItems()[1])} /{" "}
              {getClickedItems()[2]} 元
            </p>
            <p className={styles.clear} onClick={() => handleClear()}>
              清空
            </p>
          </div>
          <div className={styles.buttons}>
            <div className={styles.back}>
              <FontAwesomeIcon className={styles.icon} icon={faChevronLeft} />
            </div>
            <div
              className={`${styles.calendar} ${
                !clickToCalendar ? styles.fade : ""
              }`}
              onClick={() => handleCLickToCalendar()}
            >
              選擇日期與時間
              <FontAwesomeIcon
                className={`${styles.icon} ${
                  !clickToCalendar ? styles.fade : ""
                }`}
                icon={faChevronRight}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReserveSectionPriceList;

const priceList: Service[] = [
  {
    title: "修眉毛",
    time: 20,
    cost: 1000,
    clicked: false,
  },
  {
    title: "修鬍子",
    time: 10,
    cost: 500,
    clicked: false,
  },
  {
    title: "修手毛",
    time: 30,
    cost: 1500,
    clicked: false,
  },
  {
    title: "修腳毛",
    time: 30,
    cost: 1500,
    clicked: false,
  },
  {
    title: "修私密處",
    time: 60,
    cost: 3000,
    clicked: false,
  },
];

export const GetServiceTimeSpend = (n: number): string => {
  if (n < 60) return `${n} 分鐘`;
  let hr = 0;
  let minute = n;
  while (minute >= 60) {
    minute -= 60;
    hr++;
  }
  return minute === 0 ? `${hr} 小時` : `${hr} 小時 ${minute} 分鐘`;
};
