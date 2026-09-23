import { PC_PRICE, PS5_PRICE, PS5_STUDENT_PRICE, STATION_NAME } from "../../lib/peak-gaming/booking-pricing";
import { STATION_ICON, STATION_PICK_DESCRIPTION, STEP_TITLE } from "../../lib/peak-gaming/booking-steps";
import type { StationType } from "../../lib/peak-gaming/booking-types";
import type { BookingWizard } from "../../lib/peak-gaming/use-booking-wizard";

const OPTIONS: StationType[] = ["ps5", "pc", "volan"];

export function StepType({ wizard }: { wizard: BookingWizard }) {
  const { state, selectType } = wizard;
  const startingPrice = (t: StationType) => (t === "pc" ? PC_PRICE[1] : (state.student ? PS5_STUDENT_PRICE : PS5_PRICE)[1]);

  return (
    <div>
      <h3>{STEP_TITLE.tip}</h3>
      <p className="sub">Alege ce te interesează. Prețurile pornesc de la o oră.</p>
      <div className="pick">
        {OPTIONS.map((t) => (
          <button key={t} className={state.tip === t ? "on" : ""} onClick={() => selectType(t)}>
            <svg className="ic" viewBox="0 0 40 40" dangerouslySetInnerHTML={{ __html: STATION_ICON[t] }} />
            <span className="tx"><b>{STATION_NAME[t]}</b><span>{STATION_PICK_DESCRIPTION[t]}</span></span>
            <span className="pz">de la {startingPrice(t)} lei</span>
          </button>
        ))}
      </div>
    </div>
  );
}
