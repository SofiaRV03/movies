export default function Header() {
  return (
    <header className="hero-header">
      <div className="hero-overlay" />
      <div className="hero-content">
        <span className="hero-badge">Bienvenido a</span>
        <h1 className="hero-title">MOVIX</h1>
        <p className="hero-subtitle">
          Sistema de Gestión de Bases de Datos Cinematográficas
        </p>
        <div className="hero-cta">
          <a href="/galeria" className="hero-btn">
            <i className="bi bi-film me-2" />
            Explorar Catálogo
          </a>
        </div>
      </div>
      <div className="hero-scroll">
        <span>Descubre el cine</span>
        <i className="bi bi-chevron-down" />
      </div>
    </header>
  );
}
