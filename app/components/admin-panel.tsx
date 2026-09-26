"use client";

import { useEffect, useMemo, useState } from "react";
import { ADMIN_API_ENABLED, fetchDay, fetchDayStats, updateReservationStatus } from "../lib/peak-gaming/admin-api";
import { computeDayStats, type DayStats } from "../lib/peak-gaming/admin-stats";
import { formatDayLabel, toISODate } from "../lib/peak-gaming/booking-dates";
import { notifyReservationsChanged, readDay, subscribeToReservations, writeDay } from "../lib/peak-gaming/booking-storage";
import type { Reservation } from "../lib/peak-gaming/booking-types";
import { AdminDayRows } from "./admin/admin-day-rows";
import { AdminGate } from "./admin/admin-gate";

export function AdminPanel({ open, onClose }: { open: boolean; onClose: () => void }) {
  // Holds the admin key only after AdminGate has verified it against the
  // backend; never persisted, never hardcoded — see admin-gate.tsx.
  const [adminKey, setAdminKey] = useState<string | null>(null);
  const unlocked = adminKey !== null;
  const [day, setDay] = useState(() => toISODate(new Date()));
  // Local storage is synchronous, so the list is derived straight from
  // `day` during render; `version` forces a re-read after a write, and also
  // triggers a re-fetch on the API path (see the effect below).
  const [version, setVersion] = useState(0);
  const [remoteList, setRemoteList] = useState<Reservation[]>([]);
  const [remoteStats, setRemoteStats] = useState<DayStats | null>(null);
  const [loadError, setLoadError] = useState("");

  const localList = useMemo(
    () => (unlocked ? readDay(day).slice().sort((a, b) => a.ora - b.ora) : []),
    // eslint-disable-next-line react-hooks/exhaustive-deps -- `version` is a manual refresh trigger, not a read dependency
    [unlocked, day, version],
  );

  // Fetches the day's reservations from the backend whenever the selected
  // day, admin key, or a manual refresh (`version`) changes. Guarded against
  // races: a stale in-flight request from a previous day/version is ignored
  // if a newer one has already started.
  useEffect(() => {
    if (!ADMIN_API_ENABLED || !adminKey) return;
    let cancelled = false;
    (async () => {
      try {
        const [list, stats] = await Promise.all([fetchDay(day), fetchDayStats(day, adminKey)]);
        if (cancelled) return;
        setRemoteList(list.slice().sort((a, b) => a.ora - b.ora));
        setRemoteStats(stats);
        setLoadError("");
      } catch {
        if (!cancelled) setLoadError("Nu am putut încărca rezervările de pe server.");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [adminKey, day, version]);

  useEffect(() => subscribeToReservations(() => setVersion((v) => v + 1)), []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    addEventListener("keydown", onKey);
    return () => removeEventListener("keydown", onKey);
  }, [open, onClose]);

  function shiftDay(delta: number) {
    const d = new Date(`${day}T12:00:00`);
    d.setDate(d.getDate() + delta);
    setDay(toISODate(d));
  }

  async function setReservationState(index: number, state: Reservation["stare"]) {
    if (ADMIN_API_ENABLED) {
      const reservation = remoteList[index];
      if (reservation?.id == null || !adminKey) return;
      try {
        await updateReservationStatus(reservation.id, state, adminKey);
        setVersion((v) => v + 1); // triggers the fetch effect above to reload
      } catch {
        setLoadError("Nu am putut actualiza rezervarea.");
      }
      return;
    }
    const fresh = readDay(day).slice().sort((a, b) => a.ora - b.ora);
    fresh[index].stare = state;
    writeDay(day, fresh);
    // Triggers this panel's own subscription below, which bumps `version`.
    notifyReservationsChanged();
  }

  const list = ADMIN_API_ENABLED ? remoteList : localList;
  const stats = ADMIN_API_ENABLED ? (remoteStats ?? computeDayStats([])) : computeDayStats(list);

  return (
    <div className={`adm${open ? " open" : ""}`} role="dialog" aria-modal="true" aria-label="Panou de administrare">
      <div className="box">
        <div className="top">
          <h3>Rezervări — Peak Gaming</h3>
          <button className="x" onClick={onClose}>Închide</button>
        </div>

        {!unlocked ? (
          <AdminGate onUnlock={setAdminKey} />
        ) : (
          <div>
            <div className="ctl">
              <button onClick={() => shiftDay(-1)}>← Ziua precedentă</button>
              <input type="date" value={day} onChange={(e) => setDay(e.target.value)} />
              <button onClick={() => shiftDay(1)}>Ziua următoare →</button>
              <button onClick={() => setDay(toISODate(new Date()))}>Azi</button>
            </div>

            <div className="stats">
              <div><span>{formatDayLabel(day)}</span><b>{stats.total}</b></div>
              <div><span>Persoane așteptate</span><b>{stats.peopleExpected}</b></div>
              <div><span>Ore-stație vândute</span><b>{stats.stationHours}</b></div>
              <div><span>Încasări estimate</span><b>{stats.estimatedRevenue} lei</b></div>
              <div><span>Anulate</span><b>{stats.cancelled}</b></div>
            </div>

            {loadError && <p className="hint" style={{ borderColor: "var(--crimson)", color: "#FFA6AF" }}>{loadError}</p>}

            <AdminDayRows list={list} onSetState={setReservationState} />

            <p className="hint">
              {ADMIN_API_ENABLED
                ? "Panoul citește rezervările de pe server (aceeași bază de date ca formularul din pagină)."
                : "Panoul citește aceleași rezervări ca formularul din pagină, salvate local în acest browser."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
