import MovieSearch from "../components/MovieSearch";

export default function ConsultasPage() {
  return (
    <>
      <section aria-labelledby="tit-consulta" className="fade-in-up">
        <h2 id="tit-consulta">
          <i className="bi bi-search me-2" style={{ color: "var(--gold)" }} />
          Consulta de Películas
        </h2>
        <p>Busca cualquier película de nuestro catálogo por su nombre.</p>

        <MovieSearch />

        <hr />
      </section>

      <section aria-labelledby="tit-trailer">
        <h2 id="tit-trailer">
          <i className="bi bi-film m-3" />
          Trailer de Interstellar
        </h2>
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
            <strong>Interstellar</strong> (2014) — Dir. Christopher Nolan.
            <br />
            <em>Tráiler oficial. Fuente: catálogo Movix.</em>
          </figcaption>
        </figure>
      </section>
    </>
  );
}
