import MovieCarousel from "./components/MovieCarousel";
import ContactForm from "./components/ContactForm";
import ScrollAnimation from "./components/ScrollAnimation";
import Header from "./components/Header";
import StatsCounter from "./components/StatsCounter";
import ModuleGrid from "./components/ModuleGrid";

export default function Home() {
  return (
    <>
      <Header />

      <section className="section-divider" aria-hidden="true" />

      <MovieCarousel />

      <ScrollAnimation>
        <section className="stats-section" aria-label="Estadísticas del sistema">
          <StatsCounter />
        </section>
      </ScrollAnimation>

      <ScrollAnimation>
        <section className="welcome-section" aria-labelledby="bienvenida-titulo">
          <div className="welcome-content">
            <span className="section-tag">Plataforma cinematográfica</span>
            <h2 id="bienvenida-titulo">Explora, Gestiona, Descubre</h2>
            <p>
              <strong>Movix</strong> te permite administrar información
              cinematográfica, registrar películas, consultar actores y directores,
              y descubrir nuevas obras maestras del séptimo arte.
            </p>
            <div className="welcome-features">
              <div className="welcome-feature">
                <i className="bi bi-search" />
                <span>Consulta detallada</span>
              </div>
              <div className="welcome-feature">
                <i className="bi bi-star" />
                <span>Calificaciones IMDB y Movix</span>
              </div>
              <div className="welcome-feature">
                <i className="bi bi-bookmark" />
                <span>Watchlist personal</span>
              </div>
              <div className="welcome-feature">
                <i className="bi bi-people" />
                <span>Comunidad de reseñas</span>
              </div>
            </div>
          </div>
          <div className="welcome-visual">
            <div className="welcome-card-glass">
              <i className="bi bi-film" />
              <span>+{new Date().getFullYear() - 2014} años de cine en tu pantalla</span>
            </div>
          </div>
        </section>
      </ScrollAnimation>

      <section className="section-divider" aria-hidden="true" />

      <ScrollAnimation>
        <section className="modules-section" aria-labelledby="modulos-titulo">
          <div className="modules-header">
            <span className="section-tag">Funcionalidades</span>
            <h2 id="modulos-titulo">Módulos del Sistema</h2>
            <p className="section-desc">
              Todo lo que necesitas para gestionar tu experiencia cinematográfica
            </p>
          </div>
          <ModuleGrid />
        </section>
      </ScrollAnimation>

      <section className="section-divider" aria-hidden="true" />

      <ScrollAnimation>
        <section className="table-section" aria-labelledby="tablas-titulo">
          <span className="section-tag">Base de datos</span>
          <h2 id="tablas-titulo">Resumen de Tablas del Sistema</h2>
          <div className="table-wrap">
            <table>
              <caption>
                Tablas de la base de datos Movix y los módulos que las utilizan
              </caption>
              <thead>
                <tr>
                  <th scope="col">Tabla</th>
                  <th scope="col">Módulos que la usan</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><code>tbl_peliculas</code></td>
                  <td>Consulta, Registrar, Dashboard, Recomendaciones</td>
                </tr>
                <tr>
                  <td><code>tbl_actores</code></td>
                  <td>Consulta, Registrar, Dashboard, Recomendaciones</td>
                </tr>
                <tr>
                  <td><code>tbl_directores</code></td>
                  <td>Consulta, Registrar, Dashboard, Recomendaciones</td>
                </tr>
                <tr>
                  <td><code>tbl_generos</code></td>
                  <td>Consulta, Registrar, Dashboard, Recomendaciones</td>
                </tr>
                <tr>
                  <td><code>tbl_watchlist</code></td>
                  <td>WatchList</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      </ScrollAnimation>

      <section className="section-divider" aria-hidden="true" />

      <section aria-labelledby="contacto-titulo" className="contacto-section">
        <div className="contacto-bg">
          <img
            src="/img/minecraft.png"
            alt=""
            className="contacto-bg-img"
            aria-hidden="true"
          />
          <div className="contacto-overlay" />
          <div className="contacto-inner">
            <ScrollAnimation>
              <ContactForm />
            </ScrollAnimation>
          </div>
        </div>
      </section>
    </>
  );
}
