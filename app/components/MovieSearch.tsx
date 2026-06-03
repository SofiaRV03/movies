"use client";

import { useState } from "react";

interface Movie {
  title: string;
  year: number;
  imdb_rating: number;
  overview: string;
  poster_url: string;
  genres: string[];
}

export default function MovieSearch() {
  const [query, setQuery] = useState("");
  const [result, setResult] = useState<Movie | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    setNotFound(false);

    try {
      const res = await fetch("/data/peliculas.json");
      const peliculas: Movie[] = await res.json();
      const q = query.toLowerCase();

      const found = peliculas.find(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.year.toString().includes(q) ||
          p.genres.join().toLowerCase().includes(q)
      );

      if (found) {
        setResult(found);
      } else {
        setNotFound(true);
      }
    } catch {
      setNotFound(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-card" style={{ maxWidth: "100%" }}>
      <div className="form-card-icon-wrap">
        <i className="bi bi-film" />
      </div>
      <h3 className="form-card-title">Buscar en el catálogo</h3>
      <form className="form-card-body" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="nombre">Nombre de la Película</label>
          <div className="input-icon-wrap">
            <i className="bi bi-search" />
            <input
              type="text"
              id="nombre"
              name="nombre"
              placeholder="Ej: Interstellar, Star Wars, Chihiro..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              required
            />
          </div>
        </div>
        <button type="submit" disabled={loading}>
          <i className="bi bi-search me-2" />
          {loading ? "Buscando..." : "Enviar Consulta"}
        </button>

        {result && (
          <div className="search-result">
            <div className="search-result-poster">
              <img
                src={result.poster_url}
                alt={result.title}
              />
            </div>
            <div className="search-result-info">
              <h4 className="search-result-title">
                <i className="bi bi-film me-2" style={{ color: "var(--gold)" }} />
                {result.title}
              </h4>
              <div className="search-result-meta">
                <span className="movie-detail-badge">
                  <i className="bi bi-calendar me-1" />
                  {result.year}
                </span>
                <span className="movie-detail-badge" style={{ background: "rgba(245,197,24,0.15)", borderColor: "#f5c518" }}>
                  <i className="bi bi-star-fill me-1" style={{ color: "#f5c518" }} />
                  {(result.imdb_rating / 10).toFixed(1)}
                </span>
              </div>
              {result.genres.length > 0 && (
                <div className="movie-detail-tags" style={{ marginTop: "0.5rem" }}>
                  {result.genres.slice(0, 3).map((g) => (
                    <span key={g} className="movie-detail-tag">{g}</span>
                  ))}
                </div>
              )}
              <p className="search-result-overview">{result.overview}</p>
            </div>
          </div>
        )}

        {notFound && (
          <div className="search-notfound">
            <i className="bi bi-search me-2" />
            No encontramos esa película en el catálogo local
          </div>
        )}
      </form>
    </div>
  );
}
