// import FullCalendar from "@fullcalendar/react";
// import dayGridPlugin from "@fullcalendar/daygrid";
import Calendar from "./Calendar";

const ReservePage = () => {
  return (
    <>
      <main>
        <div className="calendar-wrapper">
          <div className="calendar-outter">
            <Calendar />
            {/* <FullCalendar
              plugins={[dayGridPlugin]}
              initialView="dayGridMonth"
            /> */}
          </div>
        </div>
      </main>
    </>
  );
};

export default ReservePage;
