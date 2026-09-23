"use client";

import { useEffect } from "react";

/** Makes every in-page `#hash` link scroll smoothly instead of jumping. */
export function SmoothScrollLinks() {
  useEffect(() => {
    function onClick(e: MouseEvent) {
      const a = (e.target as HTMLElement).closest<HTMLAnchorElement>('a[href^="#"]');
      if (!a) return;
      e.preventDefault();
      const id = a.getAttribute("href")!.slice(1);
      const el = id === "top" ? document.body : document.getElementById(id);
      if (el?.scrollIntoView) el.scrollIntoView({ behavior: "smooth", block: "start" });
      else scrollTo({ top: 0, behavior: "smooth" });
    }
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  return null;
}
