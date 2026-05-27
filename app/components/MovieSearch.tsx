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
    <div className="form-card">
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
              placeholder="Ej: Interstellar, star wars, Chihiro..."
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
          <div style={{ marginTop: "1rem" }}>
            <img
              src={result.poster_url}
              alt={result.title}
              style={{
                width: "150px",
                borderRadius: "8px",
                marginBottom: "10px",
                boxShadow: "0 5px 15px rgba(0,0,0,0.5)",
              }}
            />
            <p>
              🎬 <strong>{result.title}</strong>
              <br />
              📅 Año: {result.year}
              <br />
              ⭐ IMDB: {result.imdb_rating}
              <br />
              📝 {result.overview}
            </p>
          </div>
        )}

        {notFound && (
          <p style={{ marginTop: "1rem", color: "var(--gold)" }}>
            ❌ No encontramos esa película
          </p>
        )}
      </form>
    </div>
  );
}
