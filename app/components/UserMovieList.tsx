"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/app/contexts/AuthContext";
import { useRouter } from "next/navigation";

interface MovieEntry {
  id: number;
  listType: string;
  createdAt: string;
  movie: {
    id: number;
    title: string;
    year: number | null;
    imdbRating: string | null;
    overview: string | null;
    posterUrl: string | null;
    genres: string[];
    directors: string[];
    cast: { name: string; billingOrder: number }[];
  };
}

export default function UserMovieList({ listType, title, icon, emptyMsg }: {
  listType: "WATCHED" | "WATCHLIST";
  title: string;
  icon: string;
  emptyMsg: string;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [entries, setEntries] = useState<MovieEntry[]>([]);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    if (loading) return;
    if (!user || user.role !== "USER") {
      router.push("/login");
      return;
    }
    setFetching(true);
    fetch(`/api/user/movies?listType=${listType}`)
      .then((r) => r.json())
      .then((data) => setEntries(data.entries ?? []))
      .catch(() => setEntries([]))
      .finally(() => setFetching(false));
  }, [user, loading, listType, router]);

  if (loading || fetching) {
    return (
      <section className="fade-in-up" style={{ textAlign: "center", padding: "4rem 2rem" }}>
        <div className="spinner-border" style={{ color: "var(--gold)" }} role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
      </section>
    );
  }

  return (
    <>
      <section className="fade-in-up" style={{ paddingBottom: 0 }}>
        <span className="section-tag">Mis listas</span>
        <h2>
          <i className={`bi ${icon} me-2`} style={{ color: "var(--gold)" }} />
          {title}
        </h2>
        <p style={{ color: "var(--text-muted)" }}>
          {entries.length} {entries.length === 1 ? "película" : "películas"}
        </p>
      </section>

      <section style={{ paddingTop: "1rem" }}>
        {entries.length === 0 ? (
          <p style={{ textAlign: "center", color: "var(--text-muted)", padding: "3rem 0" }}>
            {emptyMsg}
          </p>
        ) : (
          <div className="movie-grid">
            {entries.map((entry) => (
              <Link
                key={entry.id}
                href={`/galeria/${entry.movie.id}`}
                className="movie-card"
              >
                <div className="movie-card-poster">
                  {entry.movie.posterUrl ? (
                    <img
                      src={entry.movie.posterUrl.split(",")[0]}
                      alt={entry.movie.title}
                      loading="lazy"
                    />
                  ) : (
                    <div className="movie-card-no-poster">
                      <i className="bi bi-film" style={{ fontSize: "2rem" }} />
                    </div>
                  )}
                  {entry.movie.imdbRating && (
                    <span className="movie-card-rating">
                      <i className="bi bi-star-fill" style={{ color: "#f5c518", marginRight: "0.2rem", fontSize: "0.7rem" }} />
                      {(parseFloat(entry.movie.imdbRating) / 10).toFixed(1)}
                    </span>
                  )}
                </div>
                <div className="movie-card-body">
                  <h3 className="movie-card-title">{entry.movie.title}</h3>
                  <div className="movie-card-meta">
                    {entry.movie.year && <span>{entry.movie.year}</span>}
                    <span>{entry.movie.genres.slice(0, 2).join(" · ")}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </>
  );
}
