import { useState } from "react";

const ACCESS_CODE = "peak2026"; // replaced by middleware.ts auth in production

export function AdminGate({ onUnlock }: { onUnlock: () => void }) {
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");

  function tryUnlock() {
    if (pin.trim() !== ACCESS_CODE) {
      setError("Cod greșit.");
      return;
    }
    setError("");
    onUnlock();
  }

  return (
    <div className="gate">
      <h3 style={{ fontSize: 16 }}>Cod de acces</h3>
      <p>Panoul e vizibil doar personalului.</p>
      <input
        type="password"
        placeholder="peak2026"
        autoComplete="off"
        value={pin}
        onChange={(e) => setPin(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && tryUnlock()}
      />
      <button onClick={tryUnlock}>Intră</button>
      <div className="bad">{error}</div>
    </div>
  );
}
