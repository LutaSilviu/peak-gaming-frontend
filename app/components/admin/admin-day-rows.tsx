import { pad2 } from "../../lib/peak-gaming/booking-dates";
import { STATION_SHORT_NAME } from "../../lib/peak-gaming/booking-pricing";
import type { Reservation } from "../../lib/peak-gaming/booking-types";

export function AdminDayRows({
  list,
  onSetState,
}: {
  list: Reservation[];
  onSetState: (index: number, state: Reservation["stare"]) => void;
}) {
  if (!list.length) return <p className="empty">Nicio rezervare în ziua asta.</p>;

  return (
    <div className="rows">
      {list.map((r, i) => {
        const off = r.stare === "anulata";
        const tel = (r.telefon || "").replace(/\s/g, "");
        return (
          <div key={i} className={`r${off ? " off" : ""}`}>
            <span className="cd">{r.cod || "—"}</span>
            <span>
              {pad2(r.ora)}:00 – {pad2(r.ora + r.durata)}:00<br />
              <span className="who2">{r.durata}h{r.student ? " · student" : ""}</span>
            </span>
            <span>
              <b>{STATION_SHORT_NAME[r.tip] || "—"} — {r.persoane || 1} {r.persoane === 1 ? "persoană" : "persoane"}</b><br />
              <span className="who2">{(r.statii || []).join(", ")} · {r.nume || ""} — <a href={`tel:${tel}`}>{r.telefon || ""}</a></span>
            </span>
            <span className="tt">{r.total} lei</span>
            <span className="btns">
              {off ? (
                <button onClick={() => onSetState(i, "noua")}>Reactivează</button>
              ) : (
                <>
                  <button className="ok2" onClick={() => onSetState(i, "confirmata")}>
                    {r.stare === "confirmata" ? "Confirmată ✓" : "Confirmă"}
                  </button>
                  <button className="no" onClick={() => onSetState(i, "anulata")}>Anulează</button>
                </>
              )}
            </span>
          </div>
        );
      })}
    </div>
  );
}
