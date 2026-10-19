import { MONTHS_GENITIVE } from "../utils/date.js";

export default function TimeSlots({day,month,slots,selectedTime,onTimeClick,loading,error,onRetry}) {
  return <div className="times" aria-busy={loading}>
    <h3 className="times-heading">{day===null?"Выберите дату":"Время записи — "+day+" "+MONTHS_GENITIVE[month]}</h3>
    {day===null ? <p className="availability-note">Выберите доступный день, чтобы увидеть время записи.</p> :
      loading ? <p role="status">Загрузка слотов…</p> :
      error ? <div role="alert"><p>Не удалось загрузить время: {error}</p>
        <button className="retry-button" onClick={onRetry}>Повторить загрузку слотов</button></div> :
      slots.length === 0 ? <p role="status">На этот день нет доступного времени.</p> :
      <div className="time-options">
        {slots.map(slot=><button key={slot.time} type="button" disabled={!slot.available}
          className={"time-option"+(!slot.available?" unavailable":"")+(selectedTime===slot.time?" selected":"")}
          aria-pressed={selectedTime===slot.time}
          aria-label={slot.available?slot.time:slot.time+" — занято"}
          onClick={()=>onTimeClick(slot.time)}>{slot.time}</button>)}
      </div>}
    {day!==null&&!loading&&!error&&slots.length>0&&<p className="availability-note">Серым отмечено занятое время</p>}
  </div>;
}
