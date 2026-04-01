/**
 * La Última Tarde — App Entry
 * This app has no hub screen. Each role is accessed via direct URL / QR.
 * This component just provides a minimal fallback for the root path.
 */

export default function App() {
  // The real pages are standalone HTML files in /public:
  //   /tv-interior.html  → TV Interior
  //   /tv-exterior.html  → TV Exterior
  //   /admin-movil.html  → Admin
  //   /player.html       → Jugadores (via QR)
  //
  // Root path shows nothing useful — redirect to player as default
  // or show a minimal "wrong door" message.

  return (
    <div style={{
      width: '100vw',
      height: '100vh',
      background: '#0f0c06',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: "'Special Elite', serif",
      color: 'rgba(232,220,196,0.2)',
      fontSize: '14px',
      letterSpacing: '0.1em',
    }}>
      <span>La Última Tarde · 2022–2026</span>
    </div>
  );
}
