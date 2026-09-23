import { HeroTicker } from "./hero-ticker";

export function HeroSection() {
  return (
    <section className="hero">
      <div className="hero-type">
        <h1><span>Peak</span><span className="l2">Gaming</span></h1>
        <div className="hero-sub">
          <p><b>14 stații</b> în centrul Sucevei. Cinci PlayStation 5, nouă PC-uri și un post cu volan — vii, te așezi, joci.</p>
          <div className="acts">
            <a className="btn btn-1" href="#rezervare">Rezervă o stație</a>
            <a className="btn btn-2" href="#sala">Vezi sala</a>
          </div>
        </div>
      </div>
      <HeroTicker />
    </section>
  );
}
