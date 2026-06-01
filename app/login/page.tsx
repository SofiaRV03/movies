"use client";

import { useState, FormEvent, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/contexts/AuthContext";

export default function LoginPage() {
  const router = useRouter();
  const { refresh } = useAuth();
  const [tab, setTab] = useState<"login" | "register">("login");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [showTitle, setShowTitle] = useState(false);
  const [cursorDone, setCursorDone] = useState(false);
  const indicatorRef = useRef<HTMLDivElement>(null);
  const loginTabRef = useRef<HTMLButtonElement>(null);
  const registerTabRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    setMounted(true);
    const timer = setTimeout(() => setShowTitle(true), 600);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!showTitle) return;
    const timer = setTimeout(() => setCursorDone(true), 2200);
    return () => clearTimeout(timer);
  }, [showTitle]);

  useEffect(() => {
    if (!indicatorRef.current) return;
    const el = tab === "login" ? loginTabRef.current : registerTabRef.current;
    if (el) {
      indicatorRef.current.style.width = `${el.offsetWidth}px`;
      indicatorRef.current.style.transform = `translateX(${el.offsetLeft}px)`;
    }
  }, [tab, mounted]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const form = new FormData(e.currentTarget);
    const data: Record<string, string> = {};
    form.forEach((v, k) => { data[k] = v as string; });
    const endpoint = tab === "login" ? "/api/auth/login" : "/api/auth/register";
    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!res.ok) { setError(json.error || "Error inesperado"); return; }
      await refresh();
      router.push("/");
    } catch { setError("Error de conexión"); }
    finally { setLoading(false); }
  };

  return (
    <div
      style={{
        position: "relative",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        padding: "2rem",
        overflow: "hidden",
        background: "var(--bg)",
      }}
    >
      {/* Background */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `
            radial-gradient(ellipse 70% 45% at 50% 35%, rgba(201,168,76,0.04) 0%, transparent 60%),
            linear-gradient(180deg, #0a0a0a 0%, #0d0d0d 50%, #0a0a0a 100%)
          `,
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "radial-gradient(ellipse at center, transparent 25%, rgba(0,0,0,0.65) 100%)",
          pointerEvents: "none",
        }}
      />

      {/* Content: two columns */}
      <div
        style={{
          position: "relative",
          zIndex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "5rem",
          width: "100%",
          maxWidth: 1100,
          opacity: mounted ? 1 : 0,
          transition: "opacity 0.8s ease",
        }}
      >
        {/* Left: Brand + Text */}
        <div
          style={{
            display: "none",
            flex: "0 0 480px",
            maxWidth: 480,
          }}
          className="hero-brand"
        >
          {/* MOVIX */}
          <div
            style={{
              height: "5.5rem",
              display: "flex",
              alignItems: "center",
              transform: mounted ? "translateY(0)" : "translateY(20px)",
              opacity: mounted ? 1 : 0,
              transition: "opacity 0.6s ease 0.1s, transform 0.6s ease 0.1s",
            }}
          >
            <h1
              style={{
                color: "var(--gold)",
                fontFamily: "var(--font-display)",
                fontSize: "clamp(3rem, 5.5vw, 4.5rem)",
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                fontWeight: 700,
                margin: 0,
                lineHeight: 1,
                textShadow: "0 2px 30px rgba(0,0,0,0.5)",
                overflow: "hidden",
                whiteSpace: "nowrap",
                borderRight: cursorDone ? "none" : "3px solid var(--gold)",
                maxWidth: showTitle ? "20rem" : "0",
                transition: cursorDone ? "none" : "none",
                animation: showTitle && !cursorDone
                  ? "typewriter 1.2s steps(5) 0.1s forwards, blink 0.6s step-end 3"
                  : "none",
              }}
            >
              MOVIX
            </h1>
          </div>

          {/* Tagline */}
          <div
            style={{
              marginTop: "0.3rem",
              transform: showTitle ? "translateY(0)" : "translateY(20px)",
              opacity: showTitle ? 1 : 0,
              transition: "opacity 0.7s ease 0.3s, transform 0.7s ease 0.3s",
            }}
          >
            <h2
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(2rem, 4vw, 3.2rem)",
                fontWeight: 700,
                color: "var(--cream)",
                lineHeight: 1.15,
                margin: 0,
              }}
            >
              Gestiona tu mundo
              <br />
              <span
                style={{
                  color: "var(--gold)",
                  textShadow: "0 0 50px rgba(201,168,76,0.1)",
                }}
              >
                cinematográfico
              </span>
            </h2>
          </div>

          {/* Description */}
          <div
            style={{
              marginTop: "1.2rem",
              transform: showTitle ? "translateY(0)" : "translateY(20px)",
              opacity: showTitle ? 1 : 0,
              transition: "opacity 0.7s ease 0.45s, transform 0.7s ease 0.45s",
            }}
          >
            <p
              style={{
                color: "var(--text-muted)",
                fontSize: "clamp(1rem, 1.8vw, 1.2rem)",
                fontFamily: "var(--font-body)",
                lineHeight: 1.7,
                margin: 0,
                maxWidth: 420,
              }}
            >
              Explora, registra y administra películas, actores, directores y géneros. Todo tu catálogo en un solo lugar.
            </p>
          </div>
        </div>

        {/* Right: Auth Card */}
        <div
          style={{
            width: "100%",
            maxWidth: 460,
            transform: showTitle ? "translateY(0)" : "translateY(20px)",
            opacity: showTitle ? 1 : 0,
            transition: "opacity 0.7s ease 0.55s, transform 0.7s ease 0.55s",
          }}
        >
          <div
            style={{
              background: "rgba(13,13,13,0.75)",
              backdropFilter: "blur(24px)",
              WebkitBackdropFilter: "blur(24px)",
              border: "1px solid rgba(201,168,76,0.08)",
              borderRadius: "20px",
              padding: "clamp(2rem, 3vw, 3rem) clamp(1.8rem, 3vw, 2.8rem)",
              boxShadow: "0 20px 80px rgba(0,0,0,0.5)",
            }}
          >
            {/* Mobile brand */}
            <div className="hero-brand-mobile">
              <h1
                style={{
                  color: "var(--gold)",
                  fontFamily: "var(--font-display)",
                  fontSize: "1.8rem",
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  fontWeight: 700,
                  margin: 0,
                  textAlign: "center",
                }}
              >
                MOVIX
              </h1>
              <h2
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "1.3rem",
                  fontWeight: 600,
                  color: "var(--cream)",
                  margin: "0.8rem 0 0 0",
                  textAlign: "center",
                  lineHeight: 1.3,
                }}
              >
                Gestiona tu mundo <br />
                <span style={{ color: "var(--gold)" }}>cinematográfico</span>
              </h2>
            </div>

            {/* Tabs */}
            <div
              style={{
                position: "relative",
                display: "flex",
                marginTop: "2rem",
                background: "rgba(255,255,255,0.03)",
                borderRadius: "12px",
                padding: "4px",
              }}
            >
              <div
                ref={indicatorRef}
                style={{
                  position: "absolute",
                  top: 4,
                  left: 0,
                  height: "calc(100% - 8px)",
                  background: "rgba(201,168,76,0.08)",
                  border: "1px solid rgba(201,168,76,0.15)",
                  borderRadius: "10px",
                  transition: "transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1), width 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)",
                  zIndex: 0,
                }}
              />
              <button ref={loginTabRef} type="button" onClick={() => { setTab("login"); setError(""); }}
                style={{
                  flex: 1, position: "relative", zIndex: 1, padding: "0.9rem 0",
                  background: "none", border: "none", borderRadius: "9px",
                  color: tab === "login" ? "var(--gold)" : "var(--text-muted)",
                  fontFamily: "var(--font-display)", fontSize: "1rem", cursor: "pointer",
                  letterSpacing: "0.08em", textTransform: "uppercase",
                  fontWeight: tab === "login" ? 600 : 400, transition: "color 0.3s ease",
                }}
              >Iniciar Sesión</button>
              <button ref={registerTabRef} type="button" onClick={() => { setTab("register"); setError(""); }}
                style={{
                  flex: 1, position: "relative", zIndex: 1, padding: "0.9rem 0",
                  background: "none", border: "none", borderRadius: "9px",
                  color: tab === "register" ? "var(--gold)" : "var(--text-muted)",
                  fontFamily: "var(--font-display)", fontSize: "1rem", cursor: "pointer",
                  letterSpacing: "0.08em", textTransform: "uppercase",
                  fontWeight: tab === "register" ? 600 : 400, transition: "color 0.3s ease",
                }}
              >Registrarse</button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit}>
              <div style={{ display: "flex", flexDirection: "column", gap: "1.4rem", marginTop: "2rem" }}>
                {tab === "register" && (
                  <div style={{ animation: "fadeInUp 0.35s ease" }}>
                    <InputField id="name" name="name" type="text" label="Nombre" icon="bi-person" placeholder="Tu nombre completo" required />
                  </div>
                )}
                <InputField id="email" name="email" type="email" label="Correo Electrónico" icon="bi-envelope" placeholder="correo@ejemplo.com" required />
                <InputField id="password" name="password" type="password" label="Contraseña" icon="bi-lock" placeholder={tab === "register" ? "Mínimo 6 caracteres" : "Tu contraseña"} required minLength={6} />

                {error && (
                  <div style={{
                    display: "flex", alignItems: "center", gap: "0.6rem", padding: "0.8rem 1rem",
                    background: "rgba(231,76,60,0.06)", border: "1px solid rgba(231,76,60,0.15)",
                    borderRadius: "10px", color: "#e8736a", fontSize: "0.88rem",
                    fontFamily: "var(--font-body)", animation: "shake 0.4s ease",
                  }}>
                    <i className="bi bi-exclamation-triangle-fill" style={{ fontSize: "0.95rem", flexShrink: 0 }} />
                    <span>{error}</span>
                  </div>
                )}

                <button type="submit" disabled={loading}
                  style={{
                    width: "100%", marginTop: "0.3rem", padding: "1rem",
                    background: loading ? "rgba(201,168,76,0.1)" : "transparent",
                    border: "1px solid", borderRadius: "12px",
                    borderColor: loading ? "rgba(201,168,76,0.15)" : "rgba(201,168,76,0.3)",
                    color: loading ? "var(--text-muted)" : "var(--gold)",
                    cursor: loading ? "not-allowed" : "pointer",
                    fontFamily: "var(--font-display)", fontSize: "1rem", fontWeight: 600,
                    letterSpacing: "0.1em", textTransform: "uppercase",
                    transition: "all 0.3s ease, transform 0.15s ease",
                  }}
                  onMouseEnter={(e) => { if (!loading) { e.currentTarget.style.background = "var(--gold)"; e.currentTarget.style.color = "var(--bg)"; e.currentTarget.style.borderColor = "var(--gold)"; e.currentTarget.style.boxShadow = "0 0 40px rgba(201,168,76,0.2)"; } }}
                  onMouseLeave={(e) => { if (!loading) { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "var(--gold)"; e.currentTarget.style.borderColor = "rgba(201,168,76,0.3)"; e.currentTarget.style.boxShadow = "none"; } }}
                  onMouseDown={(e) => { if (!loading) e.currentTarget.style.transform = "scale(0.97)"; }}
                  onMouseUp={(e) => { if (!loading) e.currentTarget.style.transform = "scale(1)"; }}
                >
                  {loading ? (
                    <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.6rem" }}>
                      <span style={{ width: 18, height: 18, border: "2px solid var(--text-muted)", borderTopColor: "var(--gold)", borderRadius: "50%", animation: "spin 0.7s linear infinite", display: "inline-block" }} />
                      Procesando…
                    </span>
                  ) : tab === "login" ? (
                    <><i className="bi bi-box-arrow-in-right me-2" />Iniciar Sesión</>
                  ) : (
                    <><i className="bi bi-person-plus me-2" />Crear Cuenta</>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Keyframes */}
      {mounted && (
        <style>{`
          body { padding-top: 0 !important; }
          @media (min-width: 960px) {
            .hero-brand { display: block !important; }
            .hero-brand-mobile { display: none !important; }
          }
          @keyframes typewriter {
            from { max-width: 0; }
            to { max-width: 20rem; }
          }
          @keyframes blink {
            0%, 100% { border-color: var(--gold); }
            50% { border-color: transparent; }
          }
          @keyframes fadeInUp {
            from { opacity: 0; transform: translateY(12px); }
            to { opacity: 1; transform: translateY(0); }
          }
          @keyframes shake {
            0%, 100% { transform: translateX(0); }
            20% { transform: translateX(-6px); }
            40% { transform: translateX(6px); }
            60% { transform: translateX(-4px); }
            80% { transform: translateX(4px); }
          }
          @keyframes spin { to { transform: rotate(360deg); } }
        `}</style>
      )}
    </div>
  );
}

function InputField({ id, name, type, label, icon, placeholder, required, minLength }: {
  id: string; name: string; type: string; label: string; icon: string;
  placeholder: string; required?: boolean; minLength?: number;
}) {
  const [focused, setFocused] = useState(false);
  const [filled, setFilled] = useState(false);
  return (
    <div className="form-group" style={{ gap: "0.45rem" }}>
      <label htmlFor={id} style={{
        fontSize: "0.82rem", color: focused ? "var(--gold)" : "var(--text-muted)",
        letterSpacing: "0.08em", textTransform: "uppercase", transition: "color 0.25s ease",
        fontFamily: "var(--font-display)",
      }}>{label}</label>
      <div style={{
        position: "relative", display: "flex", alignItems: "center",
        background: "rgba(255,255,255,0.03)", border: "1px solid",
        borderColor: focused ? "rgba(201,168,76,0.35)" : "rgba(255,255,255,0.06)",
        borderRadius: "12px", transition: "border-color 0.25s ease, box-shadow 0.25s ease",
        boxShadow: focused ? "0 0 0 4px rgba(201,168,76,0.05)" : "none",
      }}>
        <i className={icon} style={{
          position: "absolute", left: "1rem",
          color: focused ? "var(--gold)" : "var(--text-muted)",
          fontSize: "0.95rem", transition: "color 0.25s ease",
          pointerEvents: "none", zIndex: 1,
        }} />
        <input id={id} name={name} type={type} placeholder={placeholder}
          required={required} minLength={minLength}
          onFocus={() => setFocused(true)}
          onBlur={(e) => { setFocused(false); setFilled(e.target.value.length > 0); }}
          onChange={(e) => setFilled(e.target.value.length > 0)}
          style={{
            width: "100%", padding: "1rem 1rem 1rem 2.9rem",
            background: "transparent", border: "none", outline: "none",
            color: filled ? "var(--cream)" : "var(--text)",
            fontFamily: "var(--font-body)", fontSize: "1rem", borderRadius: "12px",
          }} />
      </div>
    </div>
  );
}
