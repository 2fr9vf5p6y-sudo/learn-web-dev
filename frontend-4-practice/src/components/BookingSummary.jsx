import { formatDate } from "../utils/date.js";

export default function BookingSummary({day,month,year,time,status,onNext}) {
  return <aside className="summary-card" aria-labelledby="summary-heading">
    <h2 className="summary-heading" id="summary-heading">Ваша запись</h2>
    <dl className="booking-details">
      <div className="booking-field"><dt className="field-label">Мастер</dt><dd className="field-value">Алексей Морозов</dd></div>
      <div className="booking-field"><dt className="field-label">Услуга</dt><dd className="field-value">Мужская стрижка</dd></div>
      <div className="booking-field"><dt className="field-label">Дата</dt><dd className="field-value selected-date">{day===null?"Не выбрана":formatDate(day,month,year)}</dd></div>
      <div className="booking-field"><dt className="field-label">Время</dt><dd className="field-value selected-time">{time||"Не выбрано"}</dd></div>
    </dl>
    <div className="summary-bottom">
      <div className="total"><span className="total-label">Итого</span><strong className="total-amount">2 200 ₽</strong></div>
      <p className="booking-status" aria-live="polite">{status || (!time?"Выберите свободное время, чтобы продолжить.":"")}</p>
      <div className="summary-actions">
        <button className="back-button" type="button" onClick={()=>window.history.back()}>Назад</button>
        <button className="next-button" type="button" disabled={!time} onClick={onNext}>Далее</button>
      </div>
    </div>
  </aside>;
}
