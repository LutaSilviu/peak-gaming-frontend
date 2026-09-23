import { monthShort, toISODate, weekdayShort } from "../../lib/peak-gaming/booking-dates";
import { STEP_TITLE } from "../../lib/peak-gaming/booking-steps";
import type { BookingWizard } from "../../lib/peak-gaming/use-booking-wizard";

const DAY_COUNT = 14;

function upcomingDays(): Date[] {
  const start = new Date();
  start.setHours(12, 0, 0, 0);
  return Array.from({ length: DAY_COUNT }, (_, i) => {
    const d = new Date(start);
    d.setDate(d.getDate() + i);
    return d;
  });
}

export function StepDay({ wizard }: { wizard: BookingWizard }) {
  const { state, selectDate } = wizard;
  const days = upcomingDays();

  return (
    <div>
      <h3>{STEP_TITLE.zi}</h3>
      <p className="sub">Deschis zilnic, 12:00 – 24:00.</p>
      <div className="days">
        {days.map((d, i) => {
          const iso = toISODate(d);
          const label = i === 0 ? "azi" : i === 1 ? "mâine" : weekdayShort(d);
          return (
            <button
              key={iso}
              className={`day${iso === state.date ? " on" : ""}`}
              onClick={() => selectDate(iso)}
            >
              <span className="w">{label}</span>
              <span className="n">{d.getDate()}</span>
              <span className="m">{monthShort(d)}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
