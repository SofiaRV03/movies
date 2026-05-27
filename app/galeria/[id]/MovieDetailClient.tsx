"use client";

import Image from "next/image";

interface MovieData {
  id: number;
  title: string;
  year: number | null;
  runtimeMin: number | null;
  imdbRating: string | null;
  overview: string | null;
  posterUrl: string | null;
  genres: string[];
  directors: string[];
  cast: { name: string; billingOrder: number }[];
}

export default function MovieDetailClient({ movie }: { movie: MovieData }) {
  const posterSrc = movie.posterUrl?.split(",")[0] ?? null;

  return (
    <section>
      <div className="movie-detail">
        <div className="movie-detail-poster">
          {posterSrc ? (
            <Image
              src={posterSrc}
              alt={movie.title}
              width={400}
              height={600}
              style={{
                width: "100%",
                height: "auto",
                borderRadius: "var(--radius-lg)",
                boxShadow: "0 10px 40px rgba(0,0,0,0.5)",
              }}
              priority
            />
          ) : (
            <div
              style={{
                width: "100%",
                aspectRatio: "2/3",
                background: "var(--surface-2)",
                borderRadius: "var(--radius-lg)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "var(--text-muted)",
                fontSize: "3rem",
                border: "1px solid var(--border)",
              }}
            >
              <i className="bi bi-film" />
            </div>
          )}
        </div>

        <div className="movie-detail-info">
          <h1 style={{ color: "var(--gold)", marginBottom: "0.5rem" }}>
            {movie.title}
          </h1>

          <div className="movie-detail-meta">
            {movie.year && (
              <span className="movie-detail-badge">
                <i className="bi bi-calendar me-1" />
                {movie.year}
              </span>
            )}
            {movie.runtimeMin && (
              <span className="movie-detail-badge">
                <i className="bi bi-clock me-1" />
                {movie.runtimeMin} min
              </span>
            )}
            {movie.imdbRating && (
              <span className="movie-detail-badge" style={{ background: "rgba(245,197,24,0.15)", borderColor: "#f5c518" }}>
                <i className="bi bi-star-fill me-1" style={{ color: "#f5c518" }} />
                {(parseFloat(movie.imdbRating) / 10).toFixed(1)}
              </span>
            )}
          </div>

          <div className="movie-detail-tags">
            {movie.genres.map((genre) => (
              <span key={genre} className="movie-detail-tag">
                {genre}
              </span>
            ))}
          </div>

          {movie.overview && (
            <div className="movie-detail-section">
              <h3>Sinopsis</h3>
              <p style={{ lineHeight: 1.8, color: "var(--text)", fontSize: "1rem" }}>
                {movie.overview}
              </p>
            </div>
          )}

          <div className="movie-detail-section">
            <h3>
              <i className="bi bi-camera-reels me-2" style={{ color: "var(--gold)" }} />
              Directores
            </h3>
            <div className="movie-detail-people">
              {movie.directors.map((name) => (
                <span key={name} className="movie-detail-person">
                  {name}
                </span>
              ))}
            </div>
          </div>

          <div className="movie-detail-section">
            <h3>
              <i className="bi bi-people me-2" style={{ color: "var(--gold)" }} />
              Reparto Principal
            </h3>
            <div className="movie-detail-people">
              {movie.cast
                .sort((a, b) => a.billingOrder - b.billingOrder)
                .slice(0, 10)
                .map((actor) => (
                  <span key={actor.name} className="movie-detail-person">
                    {actor.name}
                    <span style={{ color: "var(--text-muted)", fontSize: "0.75rem", marginLeft: "0.4rem" }}>
                      #{actor.billingOrder}
                    </span>
                  </span>
                ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
