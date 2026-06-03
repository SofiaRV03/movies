"use client";

import { useState, useEffect, FormEvent, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/contexts/AuthContext";

interface Genre {
  id: number;
  name: string;
}

const GENRE_ICONS: Record<string, string> = {
  Acción: "bi-lightning-fill",
  Aventura: "bi-compass-fill",
  Animación: "bi-camera-reels-fill",
  Comedia: "bi-emoji-laughing-fill",
  Crimen: "bi-shield-fill-exclamation",
  Documental: "bi-camera-video-fill",
  Drama: "bi-mask",
  Familia: "bi-people-fill",
  Fantasía: "bi-stars",
  Historia: "bi-clock-history",
  Terror: "bi-emoji-dizzy-fill",
  Música: "bi-music-note-beamed",
  Misterio: "bi-question-diamond-fill",
  Romance: "bi-heart-fill",
  "Ciencia Ficción": "bi-rocket-takeoff-fill",
  Suspenso: "bi-exclamation-triangle-fill",
  Guerra: "bi-shield-fill",
  Western: "bi-tree-fill",
};

export default function RegistrarPeliculaPage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [genres, setGenres] = useState<Genre[]>([]);
  const [selectedGenres, setSelectedGenres] = useState<number[]>([]);
  const [actorInputs, setActorInputs] = useState<string[]>([""]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [posterPreview, setPosterPreview] = useState("");
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!loading && (!user || user.role !== "ADMIN")) {
      router.push("/");
    }
  }, [user, loading, router]);

  useEffect(() => {
    fetch("/api/genres")
      .then((r) => r.json())
      .then((data) => setGenres(data))
      .catch(() => {});
  }, []);

  const handleGenreToggle = (genreId: number) => {
    setSelectedGenres((prev) =>
      prev.includes(genreId)
        ? prev.filter((id) => id !== genreId)
        : [...prev, genreId]
    );
  };

  const handleActorChange = (index: number, value: string) => {
    const updated = [...actorInputs];
    updated[index] = value;
    setActorInputs(updated);
  };

  const addActorField = () => setActorInputs([...actorInputs, ""]);

  const removeActorField = (index: number) => {
    if (actorInputs.length > 1) {
      setActorInputs(actorInputs.filter((_, i) => i !== index));
    }
  };

  const validate = (): string[] => {
    const missing: string[] = [];

    const get = (id: string) => (document.getElementById(id) as HTMLInputElement)?.value?.trim();

    const title = get("title");
    if (!title) missing.push("Título");

    const year = get("year");
    if (!year) missing.push("Año");
    else if (isNaN(Number(year)) || Number(year) < 1888 || Number(year) > 2099)
      missing.push("Año (debe ser entre 1888 y 2099)");

    const runtime = get("runtimeMin");
    if (!runtime) missing.push("Duración");
    else if (isNaN(Number(runtime)) || Number(runtime) < 1)
      missing.push("Duración (debe ser un número positivo)");

    const rating = get("imdbRating");
    if (!rating) missing.push("Rating IMDb");
    else if (isNaN(Number(rating)) || Number(rating) < 0 || Number(rating) > 100)
      missing.push("Rating IMDb (debe ser entre 0 y 100)");

    const overview = get("overview");
    if (!overview) missing.push("Sinopsis");

    const posterUrl = get("posterUrl");
    if (!posterUrl) missing.push("URL del póster");

    const director = get("directorName");
    if (!director) missing.push("Director");

    if (!selectedGenres.length) missing.push("Género");

    const actors = actorInputs.filter((a) => a.trim());
    if (actors.length === 0) missing.push("Al menos un actor");

    return missing;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const missing = validate();
    if (missing.length > 0) {
      setError(`Campos requeridos incompletos: ${missing.join(", ")}`);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    setSubmitting(true);

    const form = new FormData(e.currentTarget);
    const data: Record<string, unknown> = {};
    form.forEach((v, k) => {
      if (v) data[k] = v;
    });

    data.genreIds = selectedGenres;
    data.actorNames = actorInputs.filter((a) => a.trim());

    try {
      const res = await fetch("/api/movies", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!res.ok) {
        setError(json.error || "Error al registrar la película");
        window.scrollTo({ top: 0, behavior: "smooth" });
        return;
      }
      setSuccess(`"${json.title}" registrada correctamente`);
      window.scrollTo({ top: 0, behavior: "smooth" });
      formRef.current?.reset();
      setSelectedGenres([]);
      setActorInputs([""]);
      setPosterPreview("");
    } catch {
      setError("Error de conexión");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return null;

  return (
    <section
      style={{
        maxWidth: 780,
        margin: "0 auto",
        padding: "3rem 2rem 5rem",
        opacity: mounted ? 1 : 0,
        transform: mounted ? "translateY(0)" : "translateY(20px)",
        transition: "opacity 0.6s ease, transform 0.6s ease",
      }}
    >
      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            width: 64,
            height: 64,
            borderRadius: "50%",
            background: "rgba(201,168,76,0.1)",
            border: "1px solid var(--gold-dim)",
            fontSize: "1.6rem",
            color: "var(--gold)",
            marginBottom: "1rem",
            animation: mounted ? "registerFloat 3s ease-in-out infinite" : "none",
          }}
        >
          <i className="bi bi-plus-circle" />
        </div>
        <h1
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(1.8rem, 4vw, 2.5rem)",
            color: "var(--cream)",
            letterSpacing: "0.04em",
            marginBottom: "0.4rem",
          }}
        >
          Registrar Película
        </h1>
        <p
          style={{
            color: "var(--text-muted)",
            fontStyle: "italic",
            fontSize: "0.95rem",
            maxWidth: 440,
            margin: "0 auto",
          }}
        >
          Completa los datos para agregar una nueva película al catálogo
        </p>
      </div>

      <form ref={formRef} onSubmit={handleSubmit} noValidate>
        {/* Error / Success messages */}
        {error && (
          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              gap: "0.6rem",
              padding: "0.9rem 1.2rem",
              background: "rgba(231,76,60,0.06)",
              border: "1px solid rgba(231,76,60,0.15)",
              borderRadius: "var(--radius-lg)",
              color: "#e8736a",
              fontSize: "0.88rem",
              marginBottom: "1.5rem",
              animation: "fadeSlideIn 0.3s ease",
            }}
          >
            <i className="bi bi-exclamation-triangle-fill" style={{ fontSize: "1rem", flexShrink: 0, marginTop: "0.1rem" }} />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.6rem",
              padding: "0.9rem 1.2rem",
              background: "rgba(46,204,113,0.06)",
              border: "1px solid rgba(46,204,113,0.15)",
              borderRadius: "var(--radius-lg)",
              color: "#5ddb9e",
              fontSize: "0.88rem",
              marginBottom: "1.5rem",
            }}
          >
            <i className="bi bi-check-circle-fill" style={{ fontSize: "1rem", flexShrink: 0 }} />
            <div>
              <strong style={{ color: "#5ddb9e" }}>¡Listo!</strong> {success}
            </div>
          </div>
        )}

        {/* Card: Basic Info */}
        <div
          style={{
            background: "var(--surface)",
            border: "1px solid var(--border)",
            borderRadius: "var(--radius-lg)",
            padding: "1.8rem 2rem 2rem",
            marginBottom: "1.5rem",
            transition: "border-color 0.3s ease",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.borderColor = "var(--gold-dim)")}
          onMouseLeave={(e) => (e.currentTarget.style.borderColor = "var(--border)")}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1.5rem" }}>
            <div style={{ width: 36, height: 36, borderRadius: "var(--radius)", background: "rgba(201,168,76,0.1)", border: "1px solid var(--gold-dim)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--gold)", fontSize: "1rem" }}>
              <i className="bi bi-card-text" />
            </div>
            <div>
              <div style={{ fontFamily: "var(--font-display)", color: "var(--cream)", fontWeight: 600, fontSize: "0.95rem" }}>Información básica</div>
              <div style={{ color: "var(--text-muted)", fontSize: "0.78rem" }}>Título, año, duración y calificación</div>
            </div>
          </div>

          <div style={{ display: "grid", gap: "1.2rem" }}>
            <div className="form-group">
              <label htmlFor="title" style={{ fontSize: "0.8rem" }}>
                Título de la película <span style={{ color: "var(--gold)" }}>*</span>
              </label>
              <div className="input-icon-wrap">
                <i className="bi bi-pencil" />
                <input id="title" name="title" type="text" placeholder="Ej: Inception, El Padrino..." />
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "1rem" }}>
              <div className="form-group">
                <label htmlFor="year" style={{ fontSize: "0.8rem" }}>Año de estreno <span style={{ color: "var(--gold)" }}>*</span></label>
                <div className="input-icon-wrap">
                  <i className="bi bi-calendar3" />
                  <input id="year" name="year" type="number" min={1888} max={2099} placeholder="2024" required />
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="runtimeMin" style={{ fontSize: "0.8rem" }}>Duración (min) <span style={{ color: "var(--gold)" }}>*</span></label>
                <div className="input-icon-wrap">
                  <i className="bi bi-clock" />
                  <input id="runtimeMin" name="runtimeMin" type="number" min={1} placeholder="142" required />
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="imdbRating" style={{ fontSize: "0.8rem" }}>Rating IMDb <span style={{ color: "var(--gold)" }}>*</span></label>
                <div className="input-icon-wrap">
                  <i className="bi bi-star-fill" />
                  <input id="imdbRating" name="imdbRating" type="number" step="1" min={0} max={100} placeholder="93" required />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Card: Synopsis & Media */}
        <div
          style={{
            background: "var(--surface)",
            border: "1px solid var(--border)",
            borderRadius: "var(--radius-lg)",
            padding: "1.8rem 2rem 2rem",
            marginBottom: "1.5rem",
            transition: "border-color 0.3s ease",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.borderColor = "var(--gold-dim)")}
          onMouseLeave={(e) => (e.currentTarget.style.borderColor = "var(--border)")}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1.5rem" }}>
            <div style={{ width: 36, height: 36, borderRadius: "var(--radius)", background: "rgba(201,168,76,0.1)", border: "1px solid var(--gold-dim)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--gold)", fontSize: "1rem" }}>
              <i className="bi bi-image" />
            </div>
            <div>
              <div style={{ fontFamily: "var(--font-display)", color: "var(--cream)", fontWeight: 600, fontSize: "0.95rem" }}>Sinopsis y medios</div>
              <div style={{ color: "var(--text-muted)", fontSize: "0.78rem" }}>Descripción, géneros y póster</div>
            </div>
          </div>

          <div style={{ display: "grid", gap: "1.2rem" }}>
            <div className="form-group">
              <label htmlFor="overview" style={{ fontSize: "0.8rem" }}>Sinopsis <span style={{ color: "var(--gold)" }}>*</span></label>
              <textarea
                id="overview"
                name="overview"
                rows={4}
                placeholder="Escribe una descripción de la película..."
                required
                style={{
                  background: "var(--surface-2)",
                  border: "1px solid var(--border)",
                  borderRadius: "var(--radius)",
                  color: "var(--cream)",
                  fontFamily: "var(--font-body)",
                  fontSize: "0.9rem",
                  padding: "0.75rem 1rem",
                  outline: "none",
                  transition: "border-color var(--transition), box-shadow var(--transition)",
                  width: "100%",
                  resize: "vertical",
                  lineHeight: 1.6,
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = "var(--gold-dim)";
                  e.currentTarget.style.boxShadow = "0 0 0 3px rgba(122,99,48,0.2)";
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = "var(--border)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              />
            </div>

            <div className="form-group">
              <label style={{ fontSize: "0.8rem" }}>
                Géneros <span style={{ color: "var(--gold)" }}>*</span>
              </label>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginTop: "0.3rem" }}>
                {genres.map((g) => {
                  const active = selectedGenres.includes(g.id);
                  return (
                    <button
                      key={g.id}
                      type="button"
                      onClick={() => handleGenreToggle(g.id)}
                      style={{
                        display: "inline-flex", alignItems: "center", gap: "0.4rem",
                        padding: "0.4rem 1rem",
                        background: active ? "rgba(201,168,76,0.12)" : "var(--surface-2)",
                        border: active ? "1px solid var(--gold)" : "1px solid var(--border)",
                        borderRadius: "999px",
                        color: active ? "var(--gold)" : "var(--text)",
                        cursor: "pointer", fontFamily: "var(--font-display)", fontSize: "0.8rem",
                        transition: "all 0.25s ease",
                        transform: active ? "scale(1.05)" : "scale(1)",
                      }}
                      onMouseEnter={(e) => {
                        if (!active) { e.currentTarget.style.borderColor = "var(--gold-dim)"; e.currentTarget.style.color = "var(--gold)"; }
                      }}
                      onMouseLeave={(e) => {
                        if (!active) { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.color = "var(--text)"; }
                      }}
                    >
                      <i className={GENRE_ICONS[g.name] || "bi-tag-fill"} style={{ fontSize: "0.7rem" }} />
                      {g.name}
                      {active && <i className="bi bi-check-circle-fill" style={{ fontSize: "0.65rem", color: "var(--gold)" }} />}
                    </button>
                  );
                })}
              </div>
              {selectedGenres.length > 0 && (
                <div style={{ marginTop: "0.5rem", fontSize: "0.75rem", color: "var(--text-muted)" }}>
                  {selectedGenres.length} seleccionado{selectedGenres.length !== 1 ? "s" : ""}
                </div>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="posterUrl" style={{ fontSize: "0.8rem" }}>URL del póster <span style={{ color: "var(--gold)" }}>*</span></label>
              <div style={{ display: "flex", gap: "0.75rem", alignItems: "flex-start" }}>
                <div style={{ flex: 1 }}>
                  <div className="input-icon-wrap">
                    <i className="bi bi-link-45deg" />
                      <input
                        id="posterUrl" name="posterUrl" type="url"
                        placeholder="https://ejemplo.com/poster.jpg" required
                        onChange={(e) => setPosterPreview(e.target.value)}
                    />
                  </div>
                </div>
                {posterPreview && (
                  <div style={{ width: 60, height: 90, borderRadius: "var(--radius)", overflow: "hidden", border: "1px solid var(--border)", flexShrink: 0, background: "var(--surface-2)" }}>
                    <img
                      src={posterPreview}
                      alt="preview"
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                      onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Card: Cast & Crew */}
        <div
          style={{
            background: "var(--surface)",
            border: "1px solid var(--border)",
            borderRadius: "var(--radius-lg)",
            padding: "1.8rem 2rem 2rem",
            marginBottom: "2rem",
            transition: "border-color 0.3s ease",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.borderColor = "var(--gold-dim)")}
          onMouseLeave={(e) => (e.currentTarget.style.borderColor = "var(--border)")}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1.5rem" }}>
            <div style={{ width: 36, height: 36, borderRadius: "var(--radius)", background: "rgba(201,168,76,0.1)", border: "1px solid var(--gold-dim)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--gold)", fontSize: "1rem" }}>
              <i className="bi bi-camera-reels" />
            </div>
            <div>
              <div style={{ fontFamily: "var(--font-display)", color: "var(--cream)", fontWeight: 600, fontSize: "0.95rem" }}>Reparto y equipo</div>
              <div style={{ color: "var(--text-muted)", fontSize: "0.78rem" }}>Director y actores principales</div>
            </div>
          </div>

          <div style={{ display: "grid", gap: "1.2rem" }}>
            <div className="form-group">
              <label htmlFor="directorName" style={{ fontSize: "0.8rem" }}>Director <span style={{ color: "var(--gold)" }}>*</span></label>
              <div className="input-icon-wrap">
                <i className="bi bi-person-badge-fill" />
                <input id="directorName" name="directorName" type="text" placeholder="Ej: Christopher Nolan" required />
              </div>
            </div>

            <div className="form-group">
              <label style={{ fontSize: "0.8rem" }}>Actores <span style={{ color: "var(--gold)" }}>*</span></label>
              {actorInputs.map((actor, i) => (
                <div key={i} style={{ display: "flex", gap: "0.5rem", alignItems: "center", animation: "fadeSlideIn 0.25s ease" }}>
                  <div className="input-icon-wrap" style={{ flex: 1 }}>
                    <i className="bi bi-person-fill" />
                    <input type="text" value={actor} onChange={(e) => handleActorChange(i, e.target.value)} placeholder={`Actor ${i + 1}`} />
                  </div>
                  {actorInputs.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeActorField(i)}
                      style={{ width: 38, height: 38, display: "flex", alignItems: "center", justifyContent: "center", background: "transparent", border: "1px solid var(--border)", borderRadius: "var(--radius)", color: "var(--text-muted)", cursor: "pointer", fontSize: "0.9rem", transition: "all var(--transition)", flexShrink: 0 }}
                      onMouseEnter={(e) => { e.currentTarget.style.color = "#e74c3c"; e.currentTarget.style.borderColor = "#e74c3c"; e.currentTarget.style.background = "rgba(231,76,60,0.08)"; }}
                      onMouseLeave={(e) => { e.currentTarget.style.color = "var(--text-muted)"; e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.background = "transparent"; }}
                    >
                      <i className="bi bi-dash-lg" />
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={addActorField}
                style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem", alignSelf: "flex-start", background: "transparent", border: "1px dashed var(--border)", borderRadius: "var(--radius)", color: "var(--text-muted)", cursor: "pointer", fontFamily: "var(--font-display)", fontSize: "0.78rem", padding: "0.5rem 1.2rem", transition: "all var(--transition)", marginTop: "0.3rem" }}
                onMouseEnter={(e) => { e.currentTarget.style.color = "var(--gold)"; e.currentTarget.style.borderColor = "var(--gold-dim)"; e.currentTarget.style.borderStyle = "solid"; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = "var(--text-muted)"; e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.borderStyle = "dashed"; }}
              >
                <i className="bi bi-plus-circle" /> Agregar otro actor
              </button>
            </div>
          </div>
        </div>

        {/* Submit */}
        <div style={{ textAlign: "center" }}>
          <button
            type="submit"
            disabled={submitting}
            style={{
              padding: "0.85rem 3rem",
              background: submitting ? "rgba(201,168,76,0.1)" : "transparent",
              border: "1px solid",
              borderRadius: "var(--radius)",
              borderColor: submitting ? "rgba(201,168,76,0.15)" : "var(--gold-dim)",
              color: submitting ? "var(--text-muted)" : "var(--gold)",
              cursor: submitting ? "not-allowed" : "pointer",
              fontFamily: "var(--font-display)",
              fontSize: "0.9rem",
              fontWeight: 600,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              transition: "all 0.3s ease",
            }}
            onMouseEnter={(e) => {
              if (!submitting) {
                e.currentTarget.style.background = "var(--gold)";
                e.currentTarget.style.color = "var(--bg)";
                e.currentTarget.style.borderColor = "var(--gold)";
                e.currentTarget.style.boxShadow = "0 0 40px rgba(201,168,76,0.2)";
              }
            }}
            onMouseLeave={(e) => {
              if (!submitting) {
                e.currentTarget.style.background = "transparent";
                e.currentTarget.style.color = "var(--gold)";
                e.currentTarget.style.borderColor = "var(--gold-dim)";
                e.currentTarget.style.boxShadow = "none";
              }
            }}
          >
            {submitting ? (
              <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.6rem" }}>
                <span style={{ width: 16, height: 16, border: "2px solid var(--text-muted)", borderTopColor: "var(--gold)", borderRadius: "50%", animation: "registerSpin 0.7s linear infinite", display: "inline-block" }} />
                Registrando…
              </span>
            ) : (
              <><i className="bi bi-check-lg me-2" />Registrar Película</>
            )}
          </button>
        </div>

        {/* Success actions */}
        {success && (
          <div style={{ display: "flex", gap: "1rem", justifyContent: "center", marginTop: "1.5rem" }}>
            <button
              type="button"
              onClick={() => { setSuccess(""); formRef.current?.reset(); setSelectedGenres([]); setActorInputs([""]); setPosterPreview(""); }}
              style={{ padding: "0.7rem 2rem", background: "transparent", border: "1px solid var(--gold-dim)", borderRadius: "var(--radius)", color: "var(--gold)", cursor: "pointer", fontFamily: "var(--font-display)", fontSize: "0.85rem", letterSpacing: "0.06em", textTransform: "uppercase", transition: "all 0.3s ease" }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "var(--gold)"; e.currentTarget.style.color = "var(--bg)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "var(--gold)"; }}
            >
              <i className="bi bi-plus-circle me-1" />Nueva película
            </button>
            <button
              type="button"
              onClick={() => router.push("/galeria")}
              style={{ padding: "0.7rem 2rem", background: "transparent", border: "1px solid var(--border)", borderRadius: "var(--radius)", color: "var(--text-muted)", cursor: "pointer", fontFamily: "var(--font-display)", fontSize: "0.85rem", letterSpacing: "0.06em", textTransform: "uppercase", transition: "all 0.3s ease" }}
              onMouseEnter={(e) => { e.currentTarget.style.color = "var(--gold)"; e.currentTarget.style.borderColor = "var(--gold-dim)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = "var(--text-muted)"; e.currentTarget.style.borderColor = "var(--border)"; }}
            >
              <i className="bi bi-film me-1" />Ir a Galería
            </button>
          </div>
        )}
      </form>

      <style>{`
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateY(-6px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes registerFloat {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-6px); }
        }
        @keyframes registerSpin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </section>
  );
}
