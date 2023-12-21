import { useEffect } from "react";
import ReserveSectionCalendar from "./ReserveSectionCalendar.tsx";
import ReserveSectionPriceList from "./ReserveSectionPriceList.tsx";
import styles from "./ReservePage.module.css";
import { useSelector } from "react-redux";
import { RootState } from "../state/store.ts";

const ReservePage: React.FC = () => {
  const part = useSelector((state: RootState) => state.reserve.part);

  useEffect(() => {
    console.log(part);
  }, [part]);

  return (
    <div className={styles.wrapper}>
      <header>
        <div className={styles.block}>
          <div
            className={`${styles.circle} ${
              part === "part1" ? styles.show : ""
            }`}
          >
            1
          </div>
          <div>·</div>
          <div className={styles.circle}>2</div>
          <div>·</div>
          <div className={styles.circle}>3</div>
        </div>
        <hr />
      </header>
      {part === "part1" && <ReserveSectionPriceList />}
      {part === "part2" && <ReserveSectionCalendar />}
      {part === "part1" && <div></div>}
    </div>
  );
};

export default ReservePage;
