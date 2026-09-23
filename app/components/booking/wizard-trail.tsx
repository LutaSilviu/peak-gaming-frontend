import { formatDayLabel, formatHourRange } from "../../lib/peak-gaming/booking-dates";
import { STATION_SHORT_NAME } from "../../lib/peak-gaming/booking-pricing";
import type { BookingWizard } from "../../lib/peak-gaming/use-booking-wizard";

export function WizardTrail({ wizard }: { wizard: BookingWizard }) {
  const { state, step, steps } = wizard;
  const parts: React.ReactNode[] = [];

  if (state.tip) parts.push(<b key="tip">{STATION_SHORT_NAME[state.tip]}</b>);
  if (state.tip && state.tip !== "volan") {
    parts.push(`${state.pers} ${state.pers === 1 ? "persoană" : "persoane"}`);
  }
  if (step >= steps.indexOf("ora") && state.date) parts.push(formatDayLabel(state.date));
  if (state.hour !== null && step >= steps.indexOf("date")) {
    parts.push(<b key="hour">{formatHourRange(state.hour, state.dur)}</b>);
  }

  return (
    <>
      {parts.map((p, i) => (
        <span key={i}>{i > 0 && " · "}{p}</span>
      ))}
    </>
  );
}
