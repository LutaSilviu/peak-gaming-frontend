"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { freeStationCount, assignStations } from "./booking-availability";
import { BOOKING_ENDPOINT, isValidPhone, SLOTS_ENDPOINT } from "./booking-config";
import { generateConfirmationCode } from "./booking-confirmation";
import { toISODate } from "./booking-dates";
import { DURATIONS, isDayOffer, MAX_PEOPLE, pricePerUnit, totalPrice, unitsFor } from "./booking-pricing";
import { notifyReservationsChanged, readDay, subscribeToReservations, writeDay } from "./booking-storage";
import { stepsFor } from "./booking-steps";
import type { BookingState, Reservation, StationType } from "./booking-types";

const today = () => {
  const d = new Date();
  d.setHours(12, 0, 0, 0);
  return d;
};

const initialState: BookingState = {
  tip: null,
  pers: 1,
  student: false,
  date: toISODate(today()),
  dur: 2,
  hour: null,
  name: "",
  tel: "",
};

export interface BookingResult {
  code: string;
  total: number | null;
  stations: string[];
  savedLocally: boolean;
}

export function useBookingWizard() {
  const [state, setState] = useState<BookingState>(initialState);
  const [step, setStep] = useState(0);
  // Local storage is synchronous, so the day's reservations can be derived
  // straight from `state.date` during render — no effect needed. `version`
  // exists only to force a re-read after this tab writes a new booking.
  const [version, setVersion] = useState(0);
  const [remoteDay, setRemoteDay] = useState<Reservation[] | null>(null);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<BookingResult | null>(null);

  const steps = useMemo(() => stepsFor(state.tip), [state.tip]);
  const currentStep = steps[step];
  const units = state.tip ? unitsFor(state.tip, state.pers) : 0;
  const total = totalPrice(state.tip, state.dur, state.hour, state.pers, state.student);

  // eslint-disable-next-line react-hooks/exhaustive-deps -- `version` is a manual refresh trigger, not a read dependency
  const localDay = useMemo(() => readDay(state.date), [state.date, version]);
  const day = SLOTS_ENDPOINT ? remoteDay ?? [] : localDay;

  const loadDay = useCallback(async (date: string) => {
    if (!SLOTS_ENDPOINT) {
      setVersion((v) => v + 1);
      return;
    }
    try {
      const r = await fetch(`${SLOTS_ENDPOINT}?data=${encodeURIComponent(date)}`);
      const j = await r.json();
      setRemoteDay(j.rezervari || []);
    } catch {
      setRemoteDay([]);
    }
  }, []);

  // Only the network path needs an effect; the local-storage path is
  // already reactive via the `localDay` memo above. Guarded because
  // SLOTS_ENDPOINT is a module-level constant, not conditional hook usage.
  useEffect(() => {
    if (!SLOTS_ENDPOINT) return;
    let cancelled = false;
    fetch(`${SLOTS_ENDPOINT}?data=${encodeURIComponent(state.date)}`)
      .then((r) => r.json())
      .then((j) => {
        if (!cancelled) setRemoteDay(j.rezervari || []);
      })
      .catch(() => {
        if (!cancelled) setRemoteDay([]);
      });
    return () => {
      cancelled = true;
    };
  }, [state.date]);

  // Refresh when another part of the app (e.g. the admin panel) writes a
  // reservation, so the slot picker reflects it without a page reload.
  useEffect(() => subscribeToReservations(() => setVersion((v) => v + 1)), []);

  const canContinue = (() => {
    switch (currentStep) {
      case "tip":
        return !!state.tip;
      case "pers":
        return state.pers >= 1;
      case "zi":
        return !!state.date;
      case "ora":
        return state.hour !== null && total !== null;
      case "date":
        return state.name.trim().length > 2 && isValidPhone(state.tel);
      default:
        return false;
    }
  })();

  function selectType(tip: StationType) {
    setState((s) => ({
      ...s,
      tip,
      pers: tip === "volan" ? 1 : Math.min(s.pers, MAX_PEOPLE[tip]),
      dur: DURATIONS[tip].includes(s.dur) ? s.dur : 2,
      hour: null,
    }));
    goNext();
  }

  function selectDate(date: string) {
    setState((s) => ({ ...s, date, hour: null }));
    loadDay(date).then(goNext);
  }

  function goNext() {
    setStep((s) => Math.min(s + 1, steps.length - 1));
  }
  function goBack() {
    setStep((s) => Math.max(s - 1, 0));
  }

  function reset() {
    setState(initialState);
    setStep(0);
    setSending(false);
    setResult(null);
    setError("");
    loadDay(initialState.date);
  }

  async function submit() {
    if (!currentStep || currentStep !== "date") {
      if (currentStep === "zi") await loadDay(state.date);
      goNext();
      return;
    }
    if (!canContinue) return;

    setSending(true);
    setError("");
    const type = state.tip!;
    const hour = state.hour!;
    const units = unitsFor(type, state.pers);
    const payload = {
      tip: type,
      persoane: state.pers,
      student: state.student,
      data: state.date,
      ora: hour,
      durata: state.dur,
      nume: state.name,
      telefon: state.tel,
      sursa: "website",
    };

    if (!BOOKING_ENDPOINT) {
      const freshDay = readDay(state.date);
      const stations = assignStations(freshDay, type, hour, state.dur, units);
      if (stations.length < units) {
        setSending(false);
        setError("Intervalul tocmai s-a ocupat. Alege altă oră.");
        return;
      }
      const code = generateConfirmationCode();
      const list = readDay(state.date);
      list.push({
        ...payload,
        cod: code,
        statii: stations,
        total,
        stare: "noua",
        creat: Date.now(),
      });
      writeDay(state.date, list);
      notifyReservationsChanged();
      setResult({ code, total, stations, savedLocally: true });
      setSending(false);
      return;
    }

    try {
      const r = await fetch(BOOKING_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const j = await r.json().catch(() => ({}));
      if (!r.ok) throw new Error(j.eroare || String(r.status));
      setResult({
        code: j.cod || generateConfirmationCode(),
        total: j.total ?? total,
        stations: j.statii || [],
        savedLocally: false,
      });
    } catch {
      setError("submit-failed");
    } finally {
      setSending(false);
    }
  }

  return {
    state,
    setState,
    step,
    steps,
    currentStep,
    day,
    units,
    total,
    sending,
    error,
    result,
    canContinue,
    selectType,
    selectDate,
    goNext,
    goBack,
    submit,
    reset,
    freeStationCount: (hour: number, duration: number) =>
      state.tip ? freeStationCount(day, state.tip, hour, duration) : 0,
    isDayOffer: (hour: number | null, duration: number) => isDayOffer(hour, duration),
    pricePerUnit: (duration: number, hour: number | null) =>
      state.tip ? pricePerUnit(state.tip, duration, hour, state.student) : null,
  };
}

export type BookingWizard = ReturnType<typeof useBookingWizard>;
