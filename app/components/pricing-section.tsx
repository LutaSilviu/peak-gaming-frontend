"use client";

import { useState } from "react";
import {
  CURVE_AREA_PATH,
  CURVE_GRID_LINES,
  CURVE_LAYOUT,
  CURVE_PATH,
  CURVE_POINTS,
  CURVE_VIEWBOX,
  formatHours,
  formatRate,
} from "../lib/peak-gaming/pricing-curve";

const DEFAULT_INDEX = 3; // 4 hours, matches the original page's initial readout

export function PricingSection() {
  const [activeIndex, setActiveIndex] = useState(DEFAULT_INDEX);
  const active = CURVE_POINTS[activeIndex];

  return (
    <section id="preturi">
      <div className="wrap">
        <div className="head">
          <h2>Cu cât stai mai mult, <em>cu atât e mai ieftin</em></h2>
          <p className="lede">Curba arată cât te costă efectiv fiecare oră pe PC. Apasă pe un punct.</p>
        </div>
        <div className="chart-wrap">
          <div className="chart">
            <div className="readout">
              <div className="h">{formatHours(active.hours)}</div>
              <div className="v">{active.total} lei</div>
              <div className="e">{formatRate(active.total, active.hours)}</div>
            </div>
            <svg
              viewBox={CURVE_VIEWBOX}
              id="curve"
              role="img"
              aria-label="Tariful pe oră scade de la 12 lei la 7,5 lei"
            >
              <defs>
                <linearGradient id="ar" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#25E37A" stopOpacity=".4" />
                  <stop offset="100%" stopColor="#25E37A" stopOpacity="0" />
                </linearGradient>
              </defs>
              {CURVE_GRID_LINES.map((line) => (
                <g key={line.rate}>
                  <line
                    x1={44}
                    y1={line.y}
                    x2={CURVE_LAYOUT.width - 24}
                    y2={line.y}
                    stroke="rgba(37,227,122,.12)"
                  />
                  <text x={34} y={line.y + 4} fill="#8B84A8" fontSize={11} fontFamily="Manrope" textAnchor="end">
                    {line.rate}
                  </text>
                </g>
              ))}
              <path d={CURVE_AREA_PATH} fill="url(#ar)" />
              <path d={CURVE_PATH} fill="none" stroke="#25E37A" strokeWidth={2.5} strokeLinejoin="round" />
              {CURVE_POINTS.map((p, i) => (
                <g
                  key={p.hours}
                  className={`pt${i === activeIndex ? " on" : ""}`}
                  tabIndex={0}
                  onMouseEnter={() => setActiveIndex(i)}
                  onFocus={() => setActiveIndex(i)}
                  onClick={() => setActiveIndex(i)}
                >
                  <circle cx={p.x} cy={p.y} r={16} fill="transparent" />
                  <circle className="dot" cx={p.x} cy={p.y} r={4.5} fill="#EFEBFA" />
                  <text
                    x={p.x}
                    y={CURVE_LAYOUT.height - CURVE_LAYOUT.padBottom + 20}
                    fill="#8B84A8"
                    fontSize={11}
                    fontFamily="Manrope"
                    textAnchor="middle"
                  >
                    {p.hours}h
                  </text>
                </g>
              ))}
            </svg>
          </div>
          <div className="side">
            <div className="tier">
              <div className="k">PS5 — Clasic</div><div className="s">Pe stație, doi jucători</div>
              <ul><li><span>1 oră</span><b>30 lei</b></li><li><span>2 ore</span><b>55 lei</b></li>
                <li><span>3 ore</span><b>75 lei</b></li><li><span>5 ore</span><b>115 lei</b></li></ul>
            </div>
            <div className="tier hot">
              <div className="k">PS5 — Elev / Student</div><div className="s">Cu carnet valabil</div>
              <ul><li><span>1 oră</span><b>25 lei</b></li><li><span>2 ore</span><b>45 lei</b></li>
                <li><span>3 ore</span><b>60 lei</b></li><li><span>5 ore</span><b>90 lei</b></li></ul>
            </div>
          </div>
        </div>
        <div className="offer">
          <div className="t">Ofertă de zi — <span>12:00 până la 16:00</span></div>
          <div className="p"><div><i>PC</i><strong>12 lei/h</strong></div><div><i>PS5</i><strong>20 lei/h</strong></div></div>
        </div>
      </div>
    </section>
  );
}
