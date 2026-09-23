"use client";

import Script from "next/script";
import { useState } from "react";
import "./peak-gaming.css";
import { AdminPanel } from "./components/admin-panel";
import { AtmosphereSection } from "./components/atmosphere-section";
import { BookingSection } from "./components/booking-section";
import { ContactSection } from "./components/contact-section";
import { CtaSection } from "./components/cta-section";
import { GamesSection } from "./components/games-section";
import { HeroSection } from "./components/hero-section";
import { NavBar } from "./components/nav-bar";
import { PricingSection } from "./components/pricing-section";
import { RoomPlanSection } from "./components/room-plan-section";
import { SiteBackground } from "./components/site-background";
import { SiteFooter } from "./components/site-footer";
import { SmoothScrollLinks } from "./components/smooth-scroll-links";

export default function Home() {
  const [adminOpen, setAdminOpen] = useState(false);

  return (
    <>
      <SiteBackground />

      <div className="page">
        <NavBar />

        <main id="top">
          <HeroSection />

          <div className="shell">
            <RoomPlanSection />
            <GamesSection />
            <PricingSection />
            <AtmosphereSection />
            <BookingSection />
            <ContactSection />
            <CtaSection />
            <SiteFooter onOpenAdmin={() => setAdminOpen(true)} />
          </div>
        </main>
      </div>

      <AdminPanel open={adminOpen} onClose={() => setAdminOpen(false)} />
      <SmoothScrollLinks />

      <Script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js" strategy="beforeInteractive" />
    </>
  );
}
