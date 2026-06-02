import MovieSearch from "../components/MovieSearch";
import ScrollAnimation from "../components/ScrollAnimation";

export default function ConsultasPage() {
  return (
    <>
      <ScrollAnimation>
        <section aria-labelledby="tit-consulta" className="fade-in-up">
          <span className="section-tag">Búsqueda</span>
          <h2 id="tit-consulta">
            <i className="bi bi-search me-2" style={{ color: "var(--gold)" }} />
            Consulta de Películas
          </h2>
          <p className="section-desc" style={{ textAlign: "left", margin: "0.5rem 0 1.5rem" }}>
            Busca cualquier película de nuestro catálogo local por su nombre, año o género.
          </p>

          <MovieSearch />
        </section>
      </ScrollAnimation>

      <section className="section-divider" aria-hidden="true" />

      <ScrollAnimation>
        <section aria-labelledby="tit-trailer">
          <span className="section-tag">Multimedia</span>
          <h2 id="tit-trailer">
            <i className="bi bi-film me-2" style={{ color: "var(--gold)" }} />
            Trailer de Interstellar
          </h2>
          <div className="trailer-wrap">
            <figure>
              <video className="w-100" controls preload="metadata">
                <source src="/assets/InterstellarTrailer.mp4" type="video/mp4" />
                <p>
                  Tu navegador no soporta video HTML5.
                  <a href="/assets/InterstellarTrailer.mp4">
                    Descargar el tráiler
                  </a>
                  .
                </p>
              </video>
              <figcaption>
                <i className="bi bi-info-circle me-1" style={{ color: "var(--gold)" }} />
                <strong>Interstellar</strong> (2014) — Dir. Christopher Nolan.
                <br />
                <em>Tráiler oficial. Fuente: catálogo Movix.</em>
              </figcaption>
            </figure>
          </div>
        </section>
      </ScrollAnimation>
    </>
  );
}
