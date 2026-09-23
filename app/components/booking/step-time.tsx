import { formatDayLabel, pad2, toISODate } from "../../lib/peak-gaming/booking-dates";
import { CLOSE_HOUR, DURATIONS, OPEN_HOUR, STATION_SHORT_NAME } from "../../lib/peak-gaming/booking-pricing";
import { STEP_TITLE } from "../../lib/peak-gaming/booking-steps";
import type { BookingWizard } from "../../lib/peak-gaming/use-booking-wizard";

export function StepTime({ wizard }: { wizard: BookingWizard }) {
  const { state, setState, units, freeStationCount, pricePerUnit } = wizard;
  if (!state.tip) return null;

  const durationOptions = DURATIONS[state.tip];
  // Falls back to a valid duration for this station type without a render-time
  // state write — mirrors what the effect used to do, but as a pure derivation.
  const dur = durationOptions.includes(state.dur) ? state.dur : durationOptions[1] ?? durationOptions[0];

  const now = new Date();
  const isToday = state.date === toISODate(now);
  const isSlotValid = (hour: number) => {
    const past = isToday && hour <= now.getHours();
    const tooLate = hour + dur > CLOSE_HOUR;
    const full = freeStationCount(hour, dur) < units;
    return !past && !tooLate && !full;
  };
  // A hour chosen under a previous duration/day can become invalid; treat it
  // as unselected here rather than writing it back with an effect.
  const hour = state.hour !== null && isSlotValid(state.hour) ? state.hour : null;

  return (
    <div>
      <h3>{STEP_TITLE.ora}</h3>
      <p className="sub">{formatDayLabel(state.date)} · {units} {units === 1 ? "stație" : "stații"} {STATION_SHORT_NAME[state.tip]}</p>

      <div className="lbl2">Cât stați</div>
      <div className="chips2">
        {durationOptions.map((d) => {
          const price = pricePerUnit(d, hour);
          return (
            <button
              key={d}
              className={`ch${d === dur ? " on" : ""}`}
              onClick={() => setState((s) => ({ ...s, dur: d }))}
            >
              <b>{d}h</b><i>{price !== null ? price * units : "—"} lei</i>
            </button>
          );
        })}
      </div>

      <div className="lbl2">Ora de început</div>
      <div className="timeline">
        {Array.from({ length: CLOSE_HOUR - OPEN_HOUR }, (_, i) => OPEN_HOUR + i).map((h) => {
          const past = isToday && h <= now.getHours();
          const tooLate = h + dur > CLOSE_HOUR;
          const free = freeStationCount(h, dur);
          const full = free < units;
          const disabled = past || tooLate || full;
          const label = past ? "a trecut" : tooLate ? "se închide" : full ? (free ? `${free} rămase` : "ocupat") : `${free} libere`;
          return (
            <button
              key={h}
              className={`slot${h === hour ? " on" : ""}${!disabled && free <= 2 ? " tight" : ""}`}
              disabled={disabled}
              onClick={() => setState((s) => ({ ...s, dur, hour: h }))}
            >
              <span className="t">{pad2(h)}:00</span>
              <span className="f">{label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
