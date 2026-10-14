import { buildCalendarGrid,isDateSelectable,MONTHS_NOMINATIVE } from "../utils/date.js";

export default function Calendar({year,month,selectedDay,today,onDayClick,onMonthChange}) {
  const weeks=buildCalendarGrid(year,month);
  return <>
    <div className="calendar-header">
      <h2 className="month-heading" id="month-heading">{MONTHS_NOMINATIVE[month]} {year}</h2>
      <div className="calendar-controls">
        <button className="calendar-arrow previous-month" type="button" aria-label="Предыдущий месяц" onClick={()=>onMonthChange(-1)}>‹</button>
        <button className="calendar-arrow next-month" type="button" aria-label="Следующий месяц" onClick={()=>onMonthChange(1)}>›</button>
      </div>
    </div>
    <div className="calendar-grid" aria-label="Календарь">
      {["Пн","Вт","Ср","Чт","Пт","Сб","Вс"].map(weekday=><span className="weekday" key={weekday}>{weekday}</span>)}
      {weeks.map((week,weekIndex)=>week.map((cell,column)=>{
        const key=weekIndex+"-"+column;
        if(cell.otherMonth) return <span key={key} className="calendar-day other-month" aria-hidden="true">{cell.day}</span>;
        const available=isDateSelectable(cell.day,month,year,today);
        const selected=cell.day===selectedDay;
        return <button key={key} className={"calendar-day"+(selected?" selected":"")+(!available?" disabled":"")} type="button" disabled={!available} aria-pressed={selected} onClick={()=>onDayClick(cell.day)}>{cell.day}</button>;
      }))}
    </div>
  </>;
}
