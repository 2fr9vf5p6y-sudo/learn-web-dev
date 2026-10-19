export const MONTHS_NOMINATIVE = ["Январь","Февраль","Март","Апрель","Май","Июнь","Июль","Август","Сентябрь","Октябрь","Ноябрь","Декабрь"];
export const MONTHS_GENITIVE = ["января","февраля","марта","апреля","мая","июня","июля","августа","сентября","октября","ноября","декабря"];
export const DAYS_OF_WEEK = ["Воскресенье","Понедельник","Вторник","Среда","Четверг","Пятница","Суббота"];

export function compareDates(a,b) {
  return Math.sign(new Date(a.year,a.month,a.day)-new Date(b.year,b.month,b.day));
}
export function isDateSelectable(day,month,year,today) {
  return compareDates({day,month,year},{day:today.getDate(),month:today.getMonth(),year:today.getFullYear()}) >= 0;
}
export function buildCalendarGrid(year,month) {
  const offset = (new Date(year,month,1).getDay()+6)%7;
  const days = new Date(year,month+1,0).getDate();
  const previous = new Date(year,month,0).getDate();
  const cells = Math.ceil((offset+days)/7)*7;
  return Array.from({length:cells/7},(_,week)=>Array.from({length:7},(_,column)=>{
    const number = week*7+column-offset+1;
    return {day:number<1?previous+number:number>days?number-days:number,otherMonth:number<1||number>days};
  }));
}
export function formatDate(day,month,year) {
  const weekday = DAYS_OF_WEEK[new Date(year,month,day).getDay()];
  return weekday+", "+day+" "+MONTHS_GENITIVE[month]+" "+year;
}
