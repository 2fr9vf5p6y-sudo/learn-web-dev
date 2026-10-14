import { useState } from "react";
import Header from "./components/Header.jsx";
import Footer from "./components/Footer.jsx";
import Calendar from "./components/Calendar.jsx";
import TimeSlots from "./components/TimeSlots.jsx";
import BookingSummary from "./components/BookingSummary.jsx";
import { getSlots, isDateSelectable } from "./utils/date.js";
import "./booking.css";

const today = new Date();
today.setHours(0, 0, 0, 0);

export default function App() {
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [selectedDay, setSelectedDay] = useState(today.getDate());
  const [selectedTime, setSelectedTime] = useState(null);
  const [slots, setSlots] = useState(() => getSlots(today.getDate(), today.getMonth(), today.getFullYear()));
  const [status, setStatus] = useState("");

  function handleDayClick(day) {
    if (!isDateSelectable(day, currentMonth, currentYear, today)) return;
    setSelectedDay(day);
    setSelectedTime(null);
    setSlots(getSlots(day, currentMonth, currentYear));
    setStatus("");
  }

  function handleTimeClick(time) {
    if (!slots.some(slot => slot.time === time && slot.available)) return;
    setSelectedTime(time);
    setStatus("");
  }

  function handleMonthChange(delta) {
    const date = new Date(currentYear, currentMonth + delta, 1);
    const year = date.getFullYear();
    const month = date.getMonth();
    const pastMonth = new Date(year, month + 1, 0) < today;
    const day = pastMonth ? null :
      (year === today.getFullYear() && month === today.getMonth() ? today.getDate() : 1);

    setCurrentYear(year);
    setCurrentMonth(month);
    setSelectedDay(day);
    setSelectedTime(null);
    setSlots(day === null ? [] : getSlots(day, month, year));
    setStatus("");
  }

  return <div className="page">
    <Header />
    <main className="main">
      <section className="introduction" aria-labelledby="page-heading">
        <p className="step-description">Шаг 3 из 5&nbsp; • &nbsp;Дата и время</p>
        <p className="eyebrow">ЗАПИСЬ</p>
        <h1 className="page-heading" id="page-heading">Выберите дату и время</h1>
        <p className="page-description">Показываем только свободные слоты выбранного мастера.</p>
      </section>
      <div className="booking-layout">
        <section className="calendar-card" aria-labelledby="month-heading">
          <Calendar year={currentYear} month={currentMonth} selectedDay={selectedDay}
            today={today} onDayClick={handleDayClick} onMonthChange={handleMonthChange} />
          <TimeSlots day={selectedDay} month={currentMonth} slots={slots}
            selectedTime={selectedTime} onTimeClick={handleTimeClick} />
        </section>
        <BookingSummary day={selectedDay} month={currentMonth} year={currentYear}
          time={selectedTime} status={status}
          onNext={() => setStatus("Дата и время выбраны. Можно переходить к подтверждению записи.")} />
      </div>
    </main>
    <Footer />
  </div>;
}
