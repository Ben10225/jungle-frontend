import { useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretLeft, faCaretRight } from "@fortawesome/free-solid-svg-icons";
import styles from "./PrevNextBtn.module.css";

interface PrevNextBtnProps {
  clientPage: number;
  date: {
    currYear: number;
    currMonth: number;
    currDate: number;
  };
  nowRoute: string;
  onPrevNextBtnClick: (data: number) => void;
  onNewDate: () => void;
  onAddCurrentMonth: () => void;
  onMinusCurrentMonth: () => void;
  onPageChange: (page: number) => void;
}

const PrevNextBtn = ({
  clientPage,
  date,
  nowRoute,
  onPrevNextBtnClick,
  onNewDate,
  onAddCurrentMonth,
  onMinusCurrentMonth,
  onPageChange,
}: PrevNextBtnProps) => {
  const prevIcon = useRef<SVGSVGElement>(null);
  const nextIcon = useRef<SVGSVGElement>(null);

  const handlePrevNextIcon = (e: React.MouseEvent<SVGSVGElement>) => {
    const tg = e.currentTarget;
    const n = nowRoute === "reserve" ? 1 : 2;

    if (
      (clientPage === 0 && tg.id === "prev") ||
      (clientPage === n && tg.id === "next")
    )
      return;

    let page = clientPage;
    let nowMonth = date.currMonth;

    if (tg.id === "prev") {
      nowMonth--;
      onMinusCurrentMonth();
      onPrevNextBtnClick(clientPage - 1);
      page--;
    } else {
      nowMonth++;
      onAddCurrentMonth();
      onPrevNextBtnClick(clientPage + 1);
      page++;
    }

    if (nowMonth < 0 || nowMonth > 11) {
      onNewDate();
    }

    onPageChange(page);
  };

  return (
    <div className={styles.icons}>
      {nowRoute === "reserve" && (
        <>
          <div className={styles.block}>
            <FontAwesomeIcon
              ref={prevIcon}
              id="prev"
              className={`${clientPage === 0 ? `${styles.inactive}` : ""} ${
                styles.icon
              }`}
              onClick={(e) => handlePrevNextIcon(e)}
              icon={faCaretLeft}
            />
          </div>
          <div className={styles.block}>
            <FontAwesomeIcon
              ref={nextIcon}
              id="next"
              className={`${clientPage === 1 ? `${styles.inactive}` : ""} ${
                styles.icon
              }`}
              onClick={(e) => handlePrevNextIcon(e)}
              icon={faCaretRight}
            />
          </div>
        </>
      )}
      {nowRoute === "admin" && (
        <>
          <div className={styles.block}>
            <FontAwesomeIcon
              ref={prevIcon}
              id="prev"
              className={`${clientPage === 0 ? `${styles.inactive}` : ""} ${
                styles.icon
              }`}
              onClick={(e) => handlePrevNextIcon(e)}
              icon={faCaretLeft}
            />
          </div>
          <div className={styles.block}>
            <FontAwesomeIcon
              ref={nextIcon}
              id="next"
              className={`${clientPage === 2 ? `${styles.inactive}` : ""} ${
                styles.icon
              }`}
              onClick={(e) => handlePrevNextIcon(e)}
              icon={faCaretRight}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default PrevNextBtn;
