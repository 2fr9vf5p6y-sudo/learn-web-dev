import { MONTHS_GENITIVE } from "../utils/date.js";

export default function TimeSlots({day,month,slots,selectedTime,onTimeClick}) {
  return <div className="times">
    <h3 className="times-heading">{day===null?"Выберите дату":"Время записи — "+day+" "+MONTHS_GENITIVE[month]}</h3>
    {day===null ? <p className="availability-note">Выберите доступный день, чтобы увидеть время записи.</p> :
      <div className="time-options">
        {slots.map(slot=><button key={slot.time} type="button" disabled={!slot.available}
          className={"time-option"+(!slot.available?" unavailable":"")+(selectedTime===slot.time?" selected":"")}
          aria-pressed={selectedTime===slot.time}
          aria-label={slot.available?slot.time:slot.time+" — занято"}
          onClick={()=>onTimeClick(slot.time)}>{slot.time}</button>)}
      </div>}
    {day!==null&&<p className="availability-note">Серым отмечено занятое время</p>}
  </div>;
}
