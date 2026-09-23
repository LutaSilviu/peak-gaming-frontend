export function ContactSection() {
  return (
    <section id="contact">
      <div className="wrap">
        <div className="head"><h2>Unde ne <em>găsești</em></h2></div>
        <div className="cx">
          <div className="cinfo">
            <dl>
              <dt>Adresa</dt><dd>Strada Leca Morariu 2B, etaj 1<br />720176 Suceava</dd>
              <dt>Program</dt><dd>Zilnic, 12:00 – 24:00</dd>
              <dt>Telefon</dt><dd><a href="tel:+40746478853">0746 478 853</a></dd>
              <dt>Instagram</dt><dd><a href="https://www.instagram.com/peak.gaming.suceava/">@peak.gaming.suceava</a></dd>
            </dl>
          </div>
          <iframe
            className="map"
            title="Harta către Peak Gaming Suceava"
            loading="lazy"
            src="https://www.google.com/maps?q=Strada%20Leca%20Morariu%202B%20Suceava&output=embed"
          />
        </div>
      </div>
    </section>
  );
}
