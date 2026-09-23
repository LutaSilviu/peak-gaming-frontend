export function AtmosphereSection() {
  return (
    <section id="atmosfera">
      <div className="wrap">
        <div className="head"><h2>Cum arată <em>o seară aici</em></h2></div>
        <div className="sheet">
          <figure className="f lead" role="img" aria-label="Doi jucători la o partidă de FC pe PlayStation 5, sub LED-uri roșii"><figcaption className="cap">Meci de FC, vineri seara</figcaption></figure>
          <figure className="f sq"><img src="/assets/perete-ps5.jpg" alt="Peretele cu sigla Peak Gaming și stațiile PS5" /><figcaption className="cap">Peretele PS5</figcaption></figure>
          <figure className="f sq"><img src="/assets/rand-pc.jpg" alt="Rândul de PC-uri cu jucători" /><figcaption className="cap">Rândul de PC-uri</figcaption></figure>
          <figure className="f sq"><img src="/assets/controller.jpg" alt="Controller DualSense în mâini" /><figcaption className="cap">DualSense</figcaption></figure>
          <figure className="f sq"><img src="/assets/ecran-fc.jpg" alt="Ecran mare cu meniul jocului FC" /><figcaption className="cap">Ecranul mare</figcaption></figure>
          <figure className="f sq"><img src="/assets/neon.jpg" alt="Colț din sală cu neon roșu" /><figcaption className="cap">Colțul cu neon</figcaption></figure>
          <p className="sheet-note">Fotografii din sală, Strada Leca Morariu 2B.</p>
        </div>
        <div className="atmo-txt">
          <div>
            <p>Peak Gaming e făcut pentru oameni care vor hardware bun și un loc unde nu îi grăbește nimeni. Paisprezece stații, curate și răcoroase, pregătite să intri direct în joc.</p>
            <p>Vii pentru o rundă între cursuri sau pentru un grind de douăsprezece ore — spațiul rămâne același. Poți veni singur și îți găsești pe cineva de jucat, sau rezervi mai multe stații pentru o seară cu prietenii.</p>
          </div>
          <ul className="facts">
            <li>Aer condiționat în toată sala</li>
            <li>Scaune de gaming reglabile</li>
            <li>Gustări și băuturi la fața locului</li>
            <li>Reducere permanentă pentru elevi și studenți</li>
            <li>Rezervări prin telefon sau online</li>
          </ul>
        </div>
      </div>
    </section>
  );
}
