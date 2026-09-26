import { useState } from "react";
import { fetchDayStats } from "../../lib/peak-gaming/admin-api";
import { toISODate } from "../../lib/peak-gaming/booking-dates";

export function AdminGate({ onUnlock }: { onUnlock: (adminKey: string) => void }) {
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const [checking, setChecking] = useState(false);

  async function tryUnlock() {
    const key = pin.trim();
    if (!key) {
      setError("Introdu codul de acces.");
      return;
    }
    setChecking(true);
    setError("");
    try {
      // No separate client-side password: this succeeds only if `key`
      // actually matches the backend's X-Admin-Key, so the real admin key
      // is the only thing that unlocks the panel — nothing is hardcoded here.
      await fetchDayStats(toISODate(new Date()), key);
      onUnlock(key);
    } catch {
      setError("Cod greșit.");
    } finally {
      setChecking(false);
    }
  }

  return (
    <div className="gate">
      <h3 style={{ fontSize: 16 }}>Cod de acces</h3>
      <p>Panoul e vizibil doar personalului.</p>
      <input
        type="password"
        autoComplete="off"
        value={pin}
        onChange={(e) => setPin(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && tryUnlock()}
        disabled={checking}
      />
      <button onClick={tryUnlock} disabled={checking}>{checking ? "Se verifică…" : "Intră"}</button>
      <div className="bad">{error}</div>
    </div>
  );
}
