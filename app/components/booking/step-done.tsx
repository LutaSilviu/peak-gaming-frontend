import { buildCalendarFileUrl } from "../../lib/peak-gaming/booking-confirmation";
import { formatDayLabel, formatHourRange } from "../../lib/peak-gaming/booking-dates";
import { STATION_SHORT_NAME } from "../../lib/peak-gaming/booking-pricing";
import type { BookingWizard } from "../../lib/peak-gaming/use-booking-wizard";

export function StepDone({ wizard }: { wizard: BookingWizard }) {
  const { state, result, reset } = wizard;
  if (!result || !state.tip || state.hour === null) return null;

  const calendarUrl = buildCalendarFileUrl({
    code: result.code,
    type: state.tip,
    date: state.date,
    hour: state.hour,
    duration: state.dur,
    total: result.total,
  });

  return (
    <>
      <div className="ok"><svg viewBox="0 0 24 24"><path d="M4 12.5 9.5 18 20 6.5" /></svg></div>
      <h3>Rezervare confirmată</h3>
      <div className="code">{result.code}</div>
      <div className="lbl">Spune codul la intrare</div>
      <div className="tbl">
        <div><dt>Ce</dt><dd>{STATION_SHORT_NAME[state.tip]} × {result.stations.length}</dd></div>
        <div><dt>Când</dt><dd>{formatDayLabel(state.date)}</dd></div>
        <div><dt>Interval</dt><dd>{formatHourRange(state.hour, state.dur)}</dd></div>
        <div><dt>Total</dt><dd>{result.total} lei</dd></div>
      </div>
      <div className="acts2">
        <a className="sm" href={calendarUrl} download={`peak-gaming-${result.code}.ics`}>Adaugă în calendar</a>
        <button
          className="sm"
          onClick={() => {
            reset();
            document.getElementById("rezervare")?.scrollIntoView({ behavior: "smooth", block: "start" });
          }}
        >
          Fă altă rezervare
        </button>
      </div>
      <p className="fine">
        Ți-am repartizat {result.stations.length === 1 ? "stația" : "stațiile"} <b>{result.stations.join(", ")}</b>.<br />
        Plătești la fața locului, cash sau card. Anulezi gratuit sunând cu o oră înainte.<br />
        Strada Leca Morariu 2B, etaj 1, Suceava.
      </p>
      {result.savedLocally && (
        <div className="demo2">Salvat în browser. Setează BOOKING_ENDPOINT ca rezervările să ajungă la sală.</div>
      )}
    </>
  );
}
