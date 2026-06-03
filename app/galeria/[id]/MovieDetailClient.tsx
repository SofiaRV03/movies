"use client";

import Image from "next/image";
import { useState, useCallback, useEffect } from "react";
import { useAuth } from "@/app/contexts/AuthContext";

interface ReviewData {
  id: number;
  rating: number;
  comment: string;
  createdAt: string;
  user: { id: number; name: string };
}

interface MovieData {
  id: number;
  title: string;
  year: number | null;
  runtimeMin: number | null;
  imdbRating: string | null;
  movixRating: string | null;
  overview: string | null;
  posterUrl: string | null;
  genres: string[];
  directors: string[];
  cast: { name: string; billingOrder: number }[];
  reviews: ReviewData[];
  totalReviews: number;
}

function StarRating({
  value,
  onChange,
  readonly = false,
}: {
  value: number;
  onChange?: (v: number) => void;
  readonly?: boolean;
}) {
  return (
    <span style={{ display: "inline-flex", gap: "0.15rem" }}>
      {[1, 2, 3, 4, 5].map((star) => (
        <i
          key={star}
          className={`bi ${star <= value ? "bi-star-fill" : "bi-star"}`}
          style={{
            color: star <= value ? "#f5c518" : "var(--text-muted)",
            cursor: readonly ? "default" : "pointer",
            fontSize: "1.1rem",
            transition: "color 150ms ease",
          }}
          onClick={() => !readonly && onChange?.(star)}
          onMouseEnter={(e) => {
            if (!readonly && onChange) {
              const parent = e.currentTarget.parentElement;
              if (parent) {
                parent
                  .querySelectorAll("i")
                  .forEach((el, i) => {
                    (el as HTMLElement).style.color =
                      i < star ? "#f5c518" : "var(--text-muted)";
                  });
              }
            }
          }}
          onMouseLeave={(e) => {
            if (!readonly && onChange) {
              const parent = e.currentTarget.parentElement;
              if (parent) {
                parent
                  .querySelectorAll("i")
                  .forEach((el, i) => {
                    (el as HTMLElement).style.color =
                      i < value ? "#f5c518" : "var(--text-muted)";
                  });
              }
            }
          }}
        />
      ))}
    </span>
  );
}

export default function MovieDetailClient({ movie }: { movie: MovieData }) {
  const { user } = useAuth();
  const posterSrc = movie.posterUrl?.split(",")[0] ?? null;

  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [deleting, setDeleting] = useState<number | null>(null);
  const [error, setError] = useState("");
  const [reviews, setReviews] = useState<ReviewData[]>(movie.reviews);
  const [movixRating, setMovixRating] = useState(movie.movixRating);
  const [totalReviews, setTotalReviews] = useState(movie.totalReviews);
  const [listStatus, setListStatus] = useState<{ watched: boolean; watchlist: boolean }>({ watched: false, watchlist: false });
  const [toggling, setToggling] = useState<string | null>(null);

  useEffect(() => {
    if (!user || user.role !== "USER") return;
    fetch(`/api/user/movies?movieId=${movie.id}`)
      .then((r) => r.json())
      .then((data) => {
        const entries = data.entries ?? [];
        setListStatus({
          watched: entries.some((e: { listType: string }) => e.listType === "WATCHED"),
          watchlist: entries.some((e: { listType: string }) => e.listType === "WATCHLIST"),
        });
      })
      .catch(() => {});
  }, [user, movie.id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    if (rating < 1) {
      setError("Selecciona una calificación");
      return;
    }
    if (comment.trim().length < 2) {
      setError("El comentario debe tener al menos 2 caracteres");
      return;
    }
    setSubmitting(true);
    setError("");

    try {
      const res = await fetch(`/api/movies/${movie.id}/reviews`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rating, comment: comment.trim() }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Error al enviar reseña");
      }

      const newReview = await res.json();

      const updatedRes = await fetch(`/api/movies/${movie.id}/reviews`);
      const updatedData = await updatedRes.json();

      setReviews(updatedData.reviews);
      setMovixRating(updatedData.movixRating);
      setTotalReviews(updatedData.totalReviews);
      setRating(0);
      setComment("");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error al enviar reseña");
    } finally {
      setSubmitting(false);
    }
  };

  const refreshReviews = useCallback(async () => {
    try {
      const res = await fetch(`/api/movies/${movie.id}/reviews`);
      const data = await res.json();
      setReviews(data.reviews);
      setMovixRating(data.movixRating);
      setTotalReviews(data.totalReviews);
    } catch {
      /* ignore */
    }
  }, [movie.id]);

  const handleDelete = async (reviewId: number) => {
    if (!confirm("¿Eliminar esta reseña?")) return;
    setDeleting(reviewId);
    try {
      const res = await fetch(`/api/movies/${movie.id}/reviews/${reviewId}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Error al eliminar");
      await refreshReviews();
    } catch {
      setError("No se pudo eliminar la reseña");
    } finally {
      setDeleting(null);
    }
  };

  const toggleList = async (listType: "WATCHED" | "WATCHLIST") => {
    if (!user || user.role !== "USER") return;
    setToggling(listType);
    const isActive = listType === "WATCHED" ? listStatus.watched : listStatus.watchlist;
    try {
      const res = await fetch(`/api/user/movies`, {
        method: isActive ? "DELETE" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ movieId: movie.id, listType }),
      });
      if (res.ok) {
        setListStatus((prev) => ({ ...prev, [listType === "WATCHED" ? "watched" : "watchlist"]: !isActive }));
      } else if (res.status !== 409) {
        const data = await res.json();
        throw new Error(data.error || "Error");
      }
    } catch {
      /* ignore */
    } finally {
      setToggling(null);
    }
  };

  const formatDate = (iso: string) => {
    return new Date(iso).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

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
          <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "0.3rem", flexWrap: "wrap" }}>
            <h1 style={{ color: "var(--gold)", margin: 0 }}>
              {movie.title}
            </h1>
            {user?.role === "ADMIN" && (
              <div style={{ display: "flex", gap: "0.5rem", marginLeft: "auto" }}>
                <a
                  href={`/editar-pelicula/${movie.id}`}
                  style={{
                    display: "inline-flex", alignItems: "center", gap: "0.4rem",
                    padding: "0.4rem 1rem", background: "transparent",
                    border: "1px solid var(--gold-dim)", borderRadius: "var(--radius)",
                    color: "var(--gold)", cursor: "pointer",
                    fontFamily: "var(--font-display)", fontSize: "0.78rem",
                    letterSpacing: "0.06em", textTransform: "uppercase",
                    textDecoration: "none", transition: "all 0.3s ease",
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = "var(--gold)"; e.currentTarget.style.color = "var(--bg)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "var(--gold)"; }}
                >
                  <i className="bi bi-pencil" /> Editar
                </a>
                <button
                  onClick={async () => {
                    if (!confirm("¿Eliminar esta película? Esta acción no se puede deshacer.")) return;
                    try {
                      const res = await fetch(`/api/movies/${movie.id}`, { method: "DELETE" });
                      if (!res.ok) throw new Error();
                      window.location.href = "/galeria";
                    } catch {
                      alert("Error al eliminar la película");
                    }
                  }}
                  style={{
                    display: "inline-flex", alignItems: "center", gap: "0.4rem",
                    padding: "0.4rem 1rem", background: "transparent",
                    border: "1px solid rgba(231,76,60,0.3)", borderRadius: "var(--radius)",
                    color: "#e8736a", cursor: "pointer",
                    fontFamily: "var(--font-display)", fontSize: "0.78rem",
                    letterSpacing: "0.06em", textTransform: "uppercase",
                    transition: "all 0.3s ease",
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(231,76,60,0.1)"; e.currentTarget.style.borderColor = "#e74c3c"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.borderColor = "rgba(231,76,60,0.3)"; }}
                >
                  <i className="bi bi-trash" /> Eliminar
                </button>
              </div>
            )}
          </div>

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
                <span style={{ color: "var(--text-muted)", marginLeft: "0.25rem", fontSize: "0.7rem" }}>IMDB</span>
              </span>
            )}
            {movixRating && (
              <span className="movie-detail-badge" style={{ background: "rgba(201,168,76,0.12)", borderColor: "var(--gold-dim)" }}>
                <i className="bi bi-people-fill me-1" style={{ color: "var(--gold)" }} />
                {movixRating}
                <span style={{ color: "var(--text-muted)", marginLeft: "0.25rem", fontSize: "0.7rem" }}>
                  Movix ({totalReviews})
                </span>
              </span>
            )}
          </div>

          {user?.role === "USER" && (
            <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", marginBottom: "1rem" }}>
              <button
                onClick={() => toggleList("WATCHED")}
                disabled={toggling !== null}
                className={`list-toggle-btn ${listStatus.watched ? "active" : ""}`}
              >
                <i className={`bi ${listStatus.watched ? "bi-check-circle-fill" : "bi-check-circle"} me-1`} />
                {listStatus.watched ? "Vista" : "Marcar como vista"}
              </button>
              <button
                onClick={() => toggleList("WATCHLIST")}
                disabled={toggling !== null}
                className={`list-toggle-btn ${listStatus.watchlist ? "active" : ""}`}
              >
                <i className={`bi ${listStatus.watchlist ? "bi-bookmark-fill" : "bi-bookmark"} me-1`} />
                {listStatus.watchlist ? "En watchlist" : "Agregar a watchlist"}
              </button>
            </div>
          )}

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

          <hr style={{ borderColor: "var(--border)" }} />

          <div className="movie-detail-section">
            <h3>
              <i className="bi bi-chat-square-text me-2" style={{ color: "var(--gold)" }} />
              Reseñas ({totalReviews})
            </h3>

            {reviews.length > 0 && (
              <div className="review-list">
                {reviews.map((review) => (
                  <div key={review.id} className="review-card">
                    <div className="review-card-header">
                      <span className="review-card-user">
                        <i className="bi bi-person-circle me-1" />
                        {review.user.name}
                      </span>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                        <StarRating value={review.rating} readonly />
                        {user?.role === "ADMIN" && (
                          <button
                            onClick={() => handleDelete(review.id)}
                            disabled={deleting === review.id}
                            className="review-delete-btn"
                            title="Eliminar reseña"
                          >
                            <i className="bi bi-trash" />
                          </button>
                        )}
                      </div>
                    </div>
                    <p className="review-card-comment">{review.comment}</p>
                    <span className="review-card-date">{formatDate(review.createdAt)}</span>
                  </div>
                ))}
              </div>
            )}

            {reviews.length === 0 && (
              <p style={{ color: "var(--text-muted)", fontStyle: "italic", fontSize: "0.9rem", marginBottom: "1rem" }}>
                Aún no hay reseñas para esta película.
              </p>
            )}

            {user?.role === "USER" && (
              <form onSubmit={handleSubmit} className="review-form">
                <div className="review-form-row">
                  <label style={{ color: "var(--text)", fontSize: "0.85rem", marginBottom: "0.3rem" }}>
                    Tu calificación
                  </label>
                  <StarRating value={rating} onChange={setRating} />
                </div>
                <div className="review-form-row">
                  <label style={{ color: "var(--text)", fontSize: "0.85rem", marginBottom: "0.3rem" }}>
                    Tu comentario
                  </label>
                  <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Escribe tu reseña..."
                    rows={3}
                    style={{
                      width: "100%",
                      padding: "0.65rem 1rem",
                      background: "var(--surface-2)",
                      border: "1px solid var(--border)",
                      borderRadius: "var(--radius)",
                      color: "var(--cream)",
                      fontFamily: "var(--font-body)",
                      fontSize: "0.9rem",
                      outline: "none",
                      resize: "vertical",
                    }}
                  />
                </div>
                {error && (
                  <p style={{ color: "#e74c3c", fontSize: "0.85rem", margin: 0 }}>
                    {error}
                  </p>
                )}
                <button type="submit" disabled={submitting} className="review-submit-btn">
                  {submitting ? "Enviando..." : "Publicar reseña"}
                </button>
              </form>
            )}

            {!user && (
              <p style={{ color: "var(--text-muted)", fontStyle: "italic", fontSize: "0.9rem" }}>
                <a href="/login" style={{ color: "var(--gold)" }}>Inicia sesión</a> para dejar una reseña.
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
