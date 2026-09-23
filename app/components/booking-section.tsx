"use client";

import { isDayOffer } from "../lib/peak-gaming/booking-pricing";
import { useBookingWizard } from "../lib/peak-gaming/use-booking-wizard";
import { StepDay } from "./booking/step-day";
import { StepDetails } from "./booking/step-details";
import { StepDone } from "./booking/step-done";
import { StepPeople } from "./booking/step-people";
import { StepTime } from "./booking/step-time";
import { StepType } from "./booking/step-type";
import { WizardTrail } from "./booking/wizard-trail";

export function BookingSection() {
  const wizard = useBookingWizard();
  const { state, step, steps, currentStep, total, units, sending, canContinue, goBack, submit, result } = wizard;

  if (result) {
    return (
      <section id="rezervare">
        <div className="wrap">
          <div className="head">
            <h2>Rezervă în <em>patru pași</em></h2>
            <p className="lede">Alegi ce joci, câți sunteți și când. Primești confirmarea pe loc.</p>
          </div>
          <div className="wz">
            <div className="wz-body wz-done">
              <StepDone wizard={wizard} />
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="rezervare">
      <div className="wrap">
        <div className="head">
          <h2>Rezervă în <em>patru pași</em></h2>
          <p className="lede">Alegi ce joci, câți sunteți și când. Primești confirmarea pe loc.</p>
        </div>

        <div className="wz">
          <div className="wz-top">
            <div className="wz-prog">
              {steps.map((_, i) => (
                <i key={i} className={i === step ? "on" : i < step ? "past" : ""} />
              ))}
            </div>
            <div className="wz-meta">
              <span className="k">PASUL {step + 1} DIN {steps.length}</span>
              <span className="trail"><WizardTrail wizard={wizard} /></span>
            </div>
          </div>

          <div className="wz-body">
            {currentStep === "tip" && <StepType wizard={wizard} />}
            {currentStep === "pers" && <StepPeople wizard={wizard} />}
            {currentStep === "zi" && <StepDay wizard={wizard} />}
            {currentStep === "ora" && <StepTime wizard={wizard} />}
            {currentStep === "date" && <StepDetails wizard={wizard} />}
          </div>

          <div className="wz-foot">
            <button className="wz-back" hidden={step === 0} onClick={goBack}>← Înapoi</button>
            <div className="wz-right">
              <div className="wz-price">
                {total !== null && currentStep !== "tip" && (
                  <>
                    <b>{total} lei</b>
                    <span>
                      {isDayOffer(state.hour, state.dur)
                        ? "tarif de zi"
                        : `${units > 1 ? units + " stații" : "1 stație"}`}
                    </span>
                  </>
                )}
              </div>
              <button className="wz-next" disabled={!canContinue || sending} onClick={submit}>
                {sending ? "Se trimite…" : currentStep === "date" ? "Confirmă rezervarea" : "Continuă"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
