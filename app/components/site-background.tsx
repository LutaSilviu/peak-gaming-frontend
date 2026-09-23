"use client";

import { useEffect, useRef } from "react";
import { mountHeroScene } from "../lib/peak-gaming/hero-scene";

export function SiteBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    return mountHeroScene(canvasRef.current);
  }, []);

  return (
    <>
      <canvas ref={canvasRef} id="hall" aria-hidden="true" />
      <div className="vig" aria-hidden="true" />
      <div className="grain" aria-hidden="true" />
    </>
  );
}
