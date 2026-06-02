export default function Footer() {
  return (
    <footer className="movix-footer">
      <div className="footer-content">
        <div className="footer-col">
          <h4>MOVIX</h4>
          <p>Sistema de Gestión de Bases de Datos Cinematográficas</p>
        </div>
        <div className="footer-col">
          <h4>Fuente de datos</h4>
          <a href="https://www.imdb.com/es/" target="_blank" rel="noopener noreferrer">
            <i className="bi bi-box-arrow-up-right me-1" />
            IMDB — Página Oficial
          </a>
        </div>
        <div className="footer-col">
          <h4>Soporte</h4>
          <address>
            <i className="bi bi-envelope me-1" />
            soporte@movix.co
          </address>
        </div>
      </div>
      <hr />
      <p className="footer-copy">
        <small>
          Movix &copy; 2026 &mdash; Sofia Restrepo, Claudia Patricia Galvis, Allison Mariana
          Restrepo &mdash; 6.&deg; Semestre
        </small>
      </p>
    </footer>
  );
}
