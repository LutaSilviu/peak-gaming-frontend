import { formatDayLabel, formatHourRange } from "../../lib/peak-gaming/booking-dates";
import { STATION_NAME } from "../../lib/peak-gaming/booking-pricing";
import { STEP_TITLE } from "../../lib/peak-gaming/booking-steps";
import type { BookingWizard } from "../../lib/peak-gaming/use-booking-wizard";

export function StepDetails({ wizard }: { wizard: BookingWizard }) {
  const { state, setState, units, total, error } = wizard;
  if (!state.tip) return null;

  return (
    <div>
      <h3>{STEP_TITLE.date}</h3>
      <p className="sub">Ca să știm pe cine așteptăm.</p>
      <div className="two2">
        <div className="fld">
          <label htmlFor="nm">Nume</label>
          <input
            type="text"
            id="nm"
            value={state.name}
            placeholder="Andrei Popescu"
            autoComplete="name"
            onChange={(e) => setState((s) => ({ ...s, name: e.target.value }))}
          />
        </div>
        <div className="fld">
          <label htmlFor="tel">Telefon</label>
          <input
            type="tel"
            id="tel"
            value={state.tel}
            placeholder="07xx xxx xxx"
            autoComplete="tel"
            onChange={(e) => setState((s) => ({ ...s, tel: e.target.value }))}
          />
        </div>
      </div>
      <div className="recap">
        <div><span>Ce</span><b>{STATION_NAME[state.tip]}{state.student && state.tip !== "pc" ? " · student" : ""}</b></div>
        <div><span>Câți</span><b>{state.pers} {state.pers === 1 ? "persoană" : "persoane"} · {units} {units === 1 ? "stație" : "stații"}</b></div>
        <div><span>Când</span><b>{formatDayLabel(state.date)}, {formatHourRange(state.hour, state.dur)}</b></div>
        <div><span>Total</span><b>{total} lei, la fața locului</b></div>
      </div>
      <div className="errline">
        {error === "submit-failed" && (
          <>
            Nu am putut confirma. Sună la <a href="tel:+40746478853" style={{ color: "var(--acid)" }}>0746 478 853</a> și îți ținem locul.
          </>
        )}
        {error && error !== "submit-failed" && error}
      </div>
    </div>
  );
}
