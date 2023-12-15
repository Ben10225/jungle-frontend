import { useRef } from "react";

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
  const prevIcon = useRef<HTMLSpanElement>(null);
  const nextIcon = useRef<HTMLSpanElement>(null);

  const handlePrevNextIcon = (e: React.MouseEvent<HTMLSpanElement>) => {
    const targetButton = e.target as HTMLButtonElement;
    if (nowRoute === "reserve") {
      if (
        (clientPage === 0 && targetButton.id === "prev") ||
        (clientPage === 1 && targetButton.id === "next")
      )
        return;
    } else if (nowRoute === "arrange") {
      if (
        (clientPage === 0 && targetButton.id === "prev") ||
        (clientPage === 2 && targetButton.id === "next")
      )
        return;
    }

    let page = clientPage;
    let nowMonth = date.currMonth;

    if (targetButton.id === "prev") {
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
    <div className="icons">
      {nowRoute === "reserve" && (
        <>
          <span
            ref={prevIcon}
            id="prev"
            className={`material-symbols-rounded ${
              clientPage === 0 ? "inactive" : ""
            }`}
            onClick={(e) => handlePrevNextIcon(e)}
          >
            chevron_left
          </span>
          <span
            ref={nextIcon}
            id="next"
            className={`material-symbols-rounded ${
              clientPage === 1 ? "inactive" : ""
            }`}
            onClick={(e) => handlePrevNextIcon(e)}
          >
            chevron_right
          </span>
        </>
      )}
      {nowRoute === "arrange" && (
        <>
          <span
            ref={prevIcon}
            id="prev"
            className={`material-symbols-rounded ${
              clientPage === 0 ? "inactive" : ""
            }`}
            onClick={(e) => handlePrevNextIcon(e)}
          >
            chevron_left
          </span>
          <span
            ref={nextIcon}
            id="next"
            className={`material-symbols-rounded ${
              clientPage === 2 ? "inactive" : ""
            }`}
            onClick={(e) => handlePrevNextIcon(e)}
          >
            chevron_right
          </span>
        </>
      )}
    </div>
  );
};

export default PrevNextBtn;
