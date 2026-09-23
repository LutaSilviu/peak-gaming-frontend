import { MAX_PEOPLE } from "../../lib/peak-gaming/booking-pricing";
import { STEP_TITLE } from "../../lib/peak-gaming/booking-steps";
import type { BookingWizard } from "../../lib/peak-gaming/use-booking-wizard";

export function StepPeople({ wizard }: { wizard: BookingWizard }) {
  const { state, setState, units } = wizard;
  if (!state.tip) return null;
  const max = MAX_PEOPLE[state.tip];

  return (
    <div>
      <h3>{STEP_TITLE.pers}</h3>
      <p className="sub">
        {state.tip === "ps5"
          ? "O stație PlayStation e pentru două persoane."
          : "Fiecare persoană primește câte un calculator."}
      </p>
      <div className="cnt">
        <button
          disabled={state.pers <= 1}
          onClick={() => setState((s) => ({ ...s, pers: Math.max(1, s.pers - 1) }))}
        >
          −
        </button>
        <span className="val">{state.pers}</span>
        <button
          disabled={state.pers >= max}
          onClick={() => setState((s) => ({ ...s, pers: Math.min(max, s.pers + 1) }))}
        >
          +
        </button>
      </div>
      <p className="cnt-note">
        Se rezervă <b>{units} {units === 1 ? "stație" : "stații"}</b>
        {state.tip === "ps5" && state.pers % 2 ? " — a doua persoană de pe ultima stație rămâne liberă" : ""}
      </p>
      <label className="sw" style={{ justifyContent: "center", marginTop: 24 }}>
        <input
          type="checkbox"
          checked={state.student}
          onChange={(e) => setState((s) => ({ ...s, student: e.target.checked }))}
        />
        <i />
        <span>Suntem elevi sau studenți{state.tip === "pc" ? " (reducerea e doar la PlayStation și volan)" : ""}</span>
      </label>
    </div>
  );
}
