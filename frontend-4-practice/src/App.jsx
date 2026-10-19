import { useEffect, useState } from "react";
import Header from "./components/Header.jsx";
import Footer from "./components/Footer.jsx";
import Calendar from "./components/Calendar.jsx";
import TimeSlots from "./components/TimeSlots.jsx";
import BookingSummary from "./components/BookingSummary.jsx";
import { isDateSelectable } from "./utils/date.js";
import "./booking.css";

import { fetchToday, fetchSlots } from "./api.js";

export default function App() {
  const [today, setToday] = useState(null);
  const [error, setError] = useState("");
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let active = true;
    const controller = new AbortController();
    fetchToday(controller.signal).then(date => {
      if (active) setToday(new Date(date.year, date.month, date.day));
    }).catch(error => {
      if (active) setError(error.message);
    });
    return () => { active = false; controller.abort(); };
  }, [attempt]);

  if (today) return <BookingPage today={today} />;
  return <div className="page"><Header /><main className="main">
    <h1 className="page-heading">Выберите дату и время</h1>
    {error ? <div role="alert"><p>Не удалось загрузить дату: {error}</p>
      <button className="retry-button" onClick={() => { setError(""); setAttempt(value => value + 1); }}>Повторить загрузку</button>
    </div> : <p role="status">Загрузка…</p>}
  </main><Footer /></div>;
}

function BookingPage({ today }) {
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [selectedDay, setSelectedDay] = useState(today.getDate());
  const [selectedTime, setSelectedTime] = useState(null);
  const [slots, setSlots] = useState([]);
  const [slotsLoading, setSlotsLoading] = useState(true);
  const [slotsError, setSlotsError] = useState("");
  const [slotsAttempt, setSlotsAttempt] = useState(0);
  const [status, setStatus] = useState("");

  useEffect(() => {
    if (selectedDay === null) return;
    let active = true;
    const controller = new AbortController();
    const date = { day: selectedDay, month: currentMonth, year: currentYear };
    fetchSlots(date, controller.signal).then(data => {
      if (!active) return;
      if (data.date.day !== date.day || data.date.month !== date.month || data.date.year !== date.year) {
        throw new Error("Сервер вернул слоты для другой даты.");
      }
      setSlots(data.slots);
      setSlotsLoading(false);
    }).catch(error => {
      if (!active) return;
      setSlotsError(error.message);
      setSlotsLoading(false);
    });
    return () => { active = false; controller.abort(); };
  }, [selectedDay, currentMonth, currentYear, slotsAttempt]);

  function resetSlots(day) {
    setSlots([]);
    setSlotsError("");
    setSlotsLoading(day !== null);
    setSelectedTime(null);
    setStatus("");
  }

  function handleDayClick(day) {
    if (!isDateSelectable(day, currentMonth, currentYear, today)) return;
    if (day === selectedDay) return;
    setSelectedDay(day);
    resetSlots(day);
  }

  function handleTimeClick(time) {
    if (slotsLoading || slotsError || !slots.some(slot => slot.time === time && slot.available)) return;
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
    resetSlots(day);
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
            selectedTime={selectedTime} onTimeClick={handleTimeClick}
            loading={slotsLoading} error={slotsError} onRetry={() => {
              resetSlots(selectedDay);
              setSlotsAttempt(value => value + 1);
            }} />
        </section>
        <BookingSummary day={selectedDay} month={currentMonth} year={currentYear}
          time={selectedTime} status={status}
          onNext={() => setStatus("Дата и время выбраны. Можно переходить к подтверждению записи.")} />
      </div>
    </main>
    <Footer />
  </div>;
}
