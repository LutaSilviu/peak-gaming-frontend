import { TICKER_ITEMS } from "../lib/peak-gaming/ticker-items";

function TickerRun() {
  return (
    <>
      {TICKER_ITEMS.map((item, i) => (
        <span key={i}>
          {item.live && <i className="live" />}
          <b>{item.label}</b> {item.detail}
        </span>
      ))}
    </>
  );
}

export function HeroTicker() {
  return (
    <div className="ticker" aria-hidden="true">
      <div className="ticker-in">
        <TickerRun />
        <TickerRun />
      </div>
    </div>
  );
}
