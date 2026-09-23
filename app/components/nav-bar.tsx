export function NavBar() {
  return (
    <header className="nav">
      <a className="brand" href="#top">
        <img className="mark" src="/assets/logo-mic.jpg" alt="" />
        PEAK GAMING
      </a>
      <ul>
        <li><a href="#sala">Sala</a></li>
        <li><a href="#jocuri">Jocuri</a></li>
        <li><a href="#preturi">Prețuri</a></li>
        <li><a href="#atmosfera">Atmosferă</a></li>
        <li><a href="#rezervare">Rezervare</a></li>
        <li><a href="#contact">Contact</a></li>
      </ul>
      <a className="navcta" href="#rezervare">Rezervă</a>
    </header>
  );
}
