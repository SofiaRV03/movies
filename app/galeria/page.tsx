"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import ScrollAnimation from "@/app/components/ScrollAnimation";

interface Movie {
  id: number;
  title: string;
  year: number | null;
  imdbRating: string | null;
  overview: string | null;
  posterUrl: string | null;
  genres: string[];
  directors: { id: number; name: string }[];
  cast: { id: number; name: string }[];
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export default function GaleriaPage() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [searchInput, setSearchInput] = useState("");
  const [genreFilter, setGenreFilter] = useState("");
  const [genres, setGenres] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchKey, setSearchKey] = useState(0);
  const [page, setPage] = useState(1);
  const prevQuery = useRef("");
  const prevGenre = useRef("");

  useEffect(() => {
    fetch("/api/genres")
      .then((r) => r.json())
      .then((data) => setGenres(data.map((g: { name: string }) => g.name)))
      .catch(() => {});
  }, []);

  useEffect(() => {
    const params = new URLSearchParams();
    params.set("page", page.toString());
    params.set("limit", "24");
    const q = prevQuery.current;
    const g = prevGenre.current;
    if (q) params.set("q", q);
    if (g) params.set("genre", g);

    queueMicrotask(() => setLoading(true));
    fetch(`/api/movies?${params}`)
      .then((r) => r.json())
      .then((data) => {
        setMovies(data.movies);
        setPagination(data.pagination);
      })
      .catch(() => setMovies([]))
      .finally(() => queueMicrotask(() => setLoading(false)));
  }, [page, searchKey]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    prevQuery.current = searchInput;
    prevGenre.current = genreFilter;
    setPage(1);
    setSearchKey((k) => k + 1);
  };

  const handleGenreChange = (g: string) => {
    setGenreFilter(g);
    prevQuery.current = searchInput;
    prevGenre.current = g;
    setPage(1);
    setSearchKey((k) => k + 1);
  };

  return (
    <>
      <section className="fade-in-up" style={{ paddingBottom: 0 }}>
        <span className="section-tag">Catálogo</span>
        <h2>
          <i className="bi bi-film me-2" style={{ color: "var(--gold)" }} />
          Galería de Películas
        </h2>
        <p className="section-desc" style={{ textAlign: "left", margin: "0.5rem 0 1rem" }}>
          Explora las {pagination?.total ?? "..."} películas en nuestro catálogo.
        </p>

        <form onSubmit={handleSearch} style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", margin: "1.5rem 0" }}>
          <div className="input-icon-wrap" style={{ flex: "1 1 260px", position: "relative" }}>
            <i className="bi bi-search" style={{ position: "absolute", left: "0.9rem", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
            <input
              type="search"
              placeholder="Buscar película, director, actor..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              style={{
                width: "100%",
                padding: "0.65rem 1rem 0.65rem 2.4rem",
                background: "var(--surface-2)",
                border: "1px solid var(--border)",
                borderRadius: "var(--radius)",
                color: "var(--cream)",
                fontFamily: "var(--font-body)",
                fontSize: "0.95rem",
                outline: "none",
              }}
            />
          </div>
          <select
            value={genreFilter}
            onChange={(e) => handleGenreChange(e.target.value)}
            style={{
              padding: "0.65rem 1rem",
              background: "var(--surface-2)",
              border: "1px solid var(--border)",
              borderRadius: "var(--radius)",
              color: "var(--cream)",
              fontFamily: "var(--font-body)",
              fontSize: "0.95rem",
              outline: "none",
              minWidth: "140px",
            }}
          >
            <option value="">Todos los géneros</option>
            {genres.map((g) => (
              <option key={g} value={g}>{g}</option>
            ))}
          </select>
          <button
            type="submit"
            style={{
              padding: "0.65rem 1.6rem",
              background: "transparent",
              border: "1px solid var(--gold-dim)",
              borderRadius: "var(--radius)",
              color: "var(--gold)",
              cursor: "pointer",
              fontFamily: "var(--font-display)",
              fontSize: "0.85rem",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              transition: "background 180ms ease, color 180ms ease",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "var(--gold)"; e.currentTarget.style.color = "var(--bg)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "var(--gold)"; }}
          >
            <i className="bi bi-search me-2" />
            Buscar
          </button>
        </form>
      </section>

      <ScrollAnimation>
      <section style={{ paddingTop: "1rem" }}>
        {loading ? (
          <div style={{ textAlign: "center", padding: "3rem 0" }}>
            <div className="spinner-border" style={{ color: "var(--gold)" }} role="status">
              <span className="visually-hidden">Cargando...</span>
            </div>
          </div>
        ) : movies.length === 0 ? (
          <p style={{ textAlign: "center", color: "var(--text-muted)", padding: "3rem 0" }}>
            No se encontraron películas.
          </p>
        ) : (
          <>
            <div className="movie-grid">
              {movies.map((movie) => (
                <Link
                  key={movie.id}
                  href={`/galeria/${movie.id}`}
                  className="movie-card"
                >
                  <div className="movie-card-poster">
                    {movie.posterUrl ? (
                      <img
                        src={movie.posterUrl.split(",")[0]}
                        alt={movie.title}
                        loading="lazy"
                      />
                    ) : (
                      <div className="movie-card-no-poster">
                        <i className="bi bi-film" style={{ fontSize: "2rem" }} />
                      </div>
                    )}
                    {movie.imdbRating && (
                      <span className="movie-card-rating">
                        <i className="bi bi-star-fill" style={{ color: "#f5c518", marginRight: "0.2rem", fontSize: "0.7rem" }} />
                        {(parseFloat(movie.imdbRating) / 10).toFixed(1)}
                      </span>
                    )}
                  </div>
                  <div className="movie-card-body">
                    <h3 className="movie-card-title">{movie.title}</h3>
                    <div className="movie-card-meta">
                      {movie.year && <span>{movie.year}</span>}
                      <span>{movie.genres.slice(0, 2).join(" · ")}</span>
                    </div>
                    <div className="movie-card-people">
                      {movie.directors.length > 0 && (
                        <span className="movie-card-people-item">
                          <i className="bi bi-camera-reels me-1" />
                          {movie.directors[0].name}
                        </span>
                      )}
                      {movie.cast.length > 0 && (
                        <span className="movie-card-people-item">
                          <i className="bi bi-person me-1" />
                          {movie.cast[0].name}
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {pagination && pagination.totalPages > 1 && (
              <nav aria-label="Paginación" style={{ marginTop: "2rem", display: "flex", justifyContent: "center", gap: "0.5rem", flexWrap: "wrap" }}>
                <button
                  disabled={page <= 1}
                  onClick={() => setPage(page - 1)}
                  className="page-btn"
                >
                  <i className="bi bi-chevron-left" />
                </button>
                {Array.from({ length: Math.min(pagination.totalPages, 7) }, (_, i) => {
                  let pageNum: number;
                  if (pagination.totalPages <= 7) {
                    pageNum = i + 1;
                  } else if (page <= 4) {
                    pageNum = i + 1;
                  } else if (page >= pagination.totalPages - 3) {
                    pageNum = pagination.totalPages - 6 + i;
                  } else {
                    pageNum = page - 3 + i;
                  }
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setPage(pageNum)}
                      className={`page-btn ${pageNum === page ? "page-btn-active" : ""}`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
                <button
                  disabled={page >= pagination.totalPages}
                  onClick={() => setPage(page + 1)}
                  className="page-btn"
                >
                  <i className="bi bi-chevron-right" />
                </button>
              </nav>
            )}
          </>
        )}
      </section>
      </ScrollAnimation>
    </>
  );
}
