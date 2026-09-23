export function SiteFooter({ onOpenAdmin }: { onOpenAdmin: () => void }) {
  return (
    <footer>
      <span>© 2026 Peak Gaming, Suceava</span>
      <nav>
        <a href="https://peak-gaming.site/politica-de-confidentialitate">Confidențialitate</a>
        <a href="https://peak-gaming.site/termeni-si-conditii">Termeni</a>
        <a href="https://www.instagram.com/peak.gaming.suceava/">Instagram</a>
        <button className="admlink" onClick={onOpenAdmin}>Administrare</button>
      </nav>
    </footer>
  );
}
