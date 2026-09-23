"use client";

import { useEffect, useRef, useState } from "react";
import { mountRoomScene } from "../lib/peak-gaming/room-scene";
import {
  ZONE_DEFAULT,
  ZONE_INFO,
  ZONE_LABEL,
  ZONE_ORDER,
  type ZoneKey,
} from "../lib/peak-gaming/room-zones";

export function RoomPlanSection() {
  const [active, setActive] = useState<ZoneKey | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const boxRef = useRef<HTMLDivElement>(null);
  const highlightRef = useRef<(zone: ZoneKey | null) => void>(() => {});

  useEffect(() => {
    if (!canvasRef.current || !boxRef.current) return;
    const handle = mountRoomScene(canvasRef.current, boxRef.current, (zone) => setActive(zone));
    if (!handle) return;
    highlightRef.current = handle.highlightZone;
    return handle.destroy;
  }, []);

  useEffect(() => {
    highlightRef.current(active);
  }, [active]);

  const info = active ? ZONE_INFO[active] : ZONE_DEFAULT;

  return (
    <section id="sala">
      <div className="wrap">
        <div className="head">
          <h2>Harta <em>sălii</em></h2>
          <p className="lede">Treci cu mouse-ul peste zone ca să vezi ce închiriezi. Etajul 1, Strada Leca Morariu 2B.</p>
        </div>
        <div className="plan-grid">
          <div className="plan-box" id="planBox" ref={boxRef}>
            <canvas id="room" ref={canvasRef} />
            <div className="chips">
              {ZONE_ORDER.map((k) => (
                <button
                  key={k}
                  className={`zchip${active === k ? " on" : ""}`}
                  onMouseEnter={() => setActive(k)}
                  onFocus={() => setActive(k)}
                  onClick={() => setActive(k)}
                >
                  {ZONE_LABEL[k]}
                </button>
              ))}
            </div>
            <div className="plan-hint">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M9 6 4 12l5 6M15 6l5 6-5 6" /></svg>
              Trage ca să rotești macheta
            </div>
          </div>
          <aside className="plan-info">
            <div className="tag">{info.tag}</div>
            <h3>{info.title}</h3>
            <p>{info.text}</p>
            <div className="meta"><span>Capacitate<b>{info.capacity}</b></span><span>Program<b>{info.hours}</b></span></div>
          </aside>
        </div>
      </div>
    </section>
  );
}
