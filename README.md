Peak Gaming Suceava — marketing site and booking flow, built with [Next.js](https://nextjs.org) (App Router).

## Getting started

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Structure

- `app/page.tsx` — composes the page from the section components below.
- `app/peak-gaming.css` — site styles (ported from the original static build).
- `app/components/` — one component per page section (`hero-section`, `room-plan-section`, `games-section`, `pricing-section`, `booking-section`, `admin-panel`, …). The multi-step booking form and the admin panel each have their own subfolder (`components/booking/`, `components/admin/`).
- `app/lib/peak-gaming/` — framework-free logic used by those components: pricing and availability rules (`booking-pricing.ts`, `booking-availability.ts`), the booking state machine (`use-booking-wizard.ts`), localStorage-backed persistence (`booking-storage.ts`), the games/zone catalogs, and the two Three.js scenes (`room-scene.ts`, `hero-scene.ts`).
- `public/assets/` — images referenced by the page (`logo.jpg`, `hero.jpg`, etc.) — add them here.

Three.js itself is still loaded from cdnjs as a global `<script>` (see `page.tsx`), matching the original static site; `room-scene.ts` and `hero-scene.ts` read it off `window.THREE`.

## Booking backend

`app/lib/peak-gaming/booking-config.ts` defines `BOOKING_ENDPOINT` / `SLOTS_ENDPOINT`, both currently empty. While empty, bookings are saved to the browser's `localStorage` only (see `booking-storage.ts`). Point them at `/api/rezervari` once that route exists on the server; the server must always recompute the price rather than trust the client — pricing rules live in `booking-pricing.ts` and must stay identical to whatever the server implements.
# peak-gaming-frontend
