"use strict";

// Данные
const MONTHS_NOMINATIVE = ["Январь", "Февраль", "Март", "Апрель", "Май", "Июнь", "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"];
const MONTHS_GENITIVE = ["января", "февраля", "марта", "апреля", "мая", "июня", "июля", "августа", "сентября", "октября", "ноября", "декабря"];
const DAYS_OF_WEEK = ["Воскресенье", "Понедельник", "Вторник", "Среда", "Четверг", "Пятница", "Суббота"];
const TIME_OPTIONS = ["11:00", "12:30", "15:00", "16:00", "17:30", "19:00"];
const today = new Date();
today.setHours(0, 0, 0, 0);

// Состояние
const state = {
  currentMonth: today.getMonth(),
  currentYear: today.getFullYear(),
  selectedDay: today.getDate(),
  selectedTime: null,
  slots: []
};

// Чистые функции
function compareDates(a, b) {
  const first = new Date(a.year, a.month, a.day);
  const second = new Date(b.year, b.month, b.day);
  return Math.sign(first.getTime() - second.getTime());
}

function isDateSelectable(day, month, year, currentDate) {
  return compareDates({ day, month, year }, {
    day: currentDate.getDate(),
    month: currentDate.getMonth(),
    year: currentDate.getFullYear()
  }) >= 0;
}

function buildCalendarGrid(year, month) {
  const firstDay = (new Date(year, month, 1).getDay() + 6) % 7;
  const totalDays = new Date(year, month + 1, 0).getDate();
  const previousDays = new Date(year, month, 0).getDate();
  const cellsCount = Math.ceil((firstDay + totalDays) / 7) * 7;
  const weeks = [];

  for (let offset = 0; offset < cellsCount; offset += 7) {
    const week = [];
    for (let column = 0; column < 7; column++) {
      const index = offset + column - firstDay + 1;
      week.push({
        day: index < 1 ? previousDays + index : index > totalDays ? index - totalDays : index,
        otherMonth: index < 1 || index > totalDays
      });
    }
    weeks.push(week);
  }
  return weeks;
}

function formatDate(day, month, year, includeWeekday = true) {
  const date = new Date(year, month, day);
  const dayName = DAYS_OF_WEEK[date.getDay()];
  const formatted = day + " " + MONTHS_GENITIVE[month] + " " + year;
  return includeWeekday ? dayName + ", " + formatted : formatted;
}

function getSlots(day, month, year) {
  // Демонстрационное расписание. На разных датах занято разное время.
  const shift = (day + month * 2 + year) % TIME_OPTIONS.length;
  return TIME_OPTIONS.map((time, index) => ({
    time,
    available: (index + shift) % 4 !== 0
  }));
}

// Отрисовка
function renderCalendar() {
  const monthTitle = document.querySelector(".month-heading");
  const calendar = document.querySelector(".calendar-grid");
  monthTitle.textContent = MONTHS_NOMINATIVE[state.currentMonth] + " " + state.currentYear;

  const weekdays = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];
  let html = weekdays.map(day => '<span class="weekday">' + day + '</span>').join("");

  for (const week of buildCalendarGrid(state.currentYear, state.currentMonth)) {
    for (const cell of week) {
      if (cell.otherMonth) {
        html += '<span class="calendar-day other-month" aria-hidden="true">' + cell.day + '</span>';
        continue;
      }
      const allowed = isDateSelectable(cell.day, state.currentMonth, state.currentYear, today);
      const selected = cell.day === state.selectedDay;
      const classes = "calendar-day" + (selected ? " selected" : "") + (!allowed ? " disabled" : "");
      html += '<button type="button" class="' + classes + '" data-day="' + cell.day + '"' +
        (!allowed ? ' disabled' : "") + (selected ? ' aria-pressed="true"' : "") +
        '>' + cell.day + '</button>';
    }
  }
  calendar.innerHTML = html;
  calendar.querySelectorAll("button:not(:disabled)").forEach(button => {
    button.addEventListener("click", onDayClick);
  });
}

function renderTimeSlots() {
  const container = document.querySelector(".time-options");
  const title = document.querySelector(".times-heading");
  if (state.selectedDay === null) {
    title.textContent = "Выберите дату";
    container.innerHTML = '<p class="availability-note">Выберите доступный день, чтобы увидеть время записи.</p>';
    return;
  }
  title.textContent = "Время записи — " + state.selectedDay + " " + MONTHS_GENITIVE[state.currentMonth];
  state.slots = getSlots(state.selectedDay, state.currentMonth, state.currentYear);
  container.innerHTML = state.slots.map(slot => {
    const selected = slot.time === state.selectedTime;
    const classes = "time-option" + (!slot.available ? " unavailable" : "") + (selected ? " selected" : "");
    return '<button type="button" class="' + classes + '" data-time="' + slot.time + '"' +
      (!slot.available ? ' disabled aria-label="' + slot.time + ' — занято"' : "") +
      (selected ? ' aria-pressed="true"' : "") + '>' + slot.time + '</button>';
  }).join("");
  container.querySelectorAll("button:not(:disabled)").forEach(button => {
    button.addEventListener("click", onTimeSlotClick);
  });
}

function updateBottomBar() {
  const dateLabel = document.querySelector(".selected-date");
  const timeLabel = document.querySelector(".selected-time");
  const status = document.querySelector(".booking-status");
  const next = document.querySelector(".next-button");

  dateLabel.textContent = state.selectedDay === null ? "Не выбрана" :
    formatDate(state.selectedDay, state.currentMonth, state.currentYear);
  timeLabel.textContent = state.selectedTime || "Не выбрано";
  next.disabled = state.selectedDay === null || !state.selectedTime;
  status.textContent = next.disabled ? "Выберите свободное время, чтобы продолжить." : "";
}

// Обработчики
function onDayClick(event) {
  const day = Number(event.currentTarget.dataset.day);
  if (!isDateSelectable(day, state.currentMonth, state.currentYear, today)) return;
  state.selectedDay = day;
  state.selectedTime = null;
  renderCalendar();
  renderTimeSlots();
  updateBottomBar();
}

function onTimeSlotClick(event) {
  const time = event.currentTarget.dataset.time;
  if (!state.slots.some(slot => slot.time === time && slot.available)) return;
  state.selectedTime = time;
  renderTimeSlots();
  updateBottomBar();
}

function changeMonth(delta) {
  const next = new Date(state.currentYear, state.currentMonth + delta, 1);
  state.currentMonth = next.getMonth();
  state.currentYear = next.getFullYear();
  const inTodayMonth = state.currentYear === today.getFullYear() &&
    state.currentMonth === today.getMonth();
  const isPastMonth = new Date(state.currentYear, state.currentMonth + 1, 0) < today;

  state.selectedDay = isPastMonth ? null : inTodayMonth ? today.getDate() : 1;
  state.selectedTime = null;
  renderCalendar();
  renderTimeSlots();
  updateBottomBar();
}

function setupMonthNavigation() {
  document.querySelector(".previous-month").addEventListener("click", () => changeMonth(-1));
  document.querySelector(".next-month").addEventListener("click", () => changeMonth(1));
}

// Инициализация
function init() {
  setupMonthNavigation();
  document.querySelector(".next-button").addEventListener("click", () => {
    if (!state.selectedTime || state.selectedDay === null) return;
    document.querySelector(".booking-status").textContent =
      "Дата и время выбраны. Можно переходить к подтверждению записи.";
  });
  document.querySelector(".back-button").addEventListener("click", () => {
    window.history.back();
  });
  renderCalendar();
  renderTimeSlots();
  updateBottomBar();
}

document.addEventListener("DOMContentLoaded", init);
