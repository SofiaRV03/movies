"use client";

import { useState, FormEvent, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/contexts/AuthContext";

const SPOTLIGHT_SIZE = 600;

export default function LoginPage() {
  const router = useRouter();
  const { refresh } = useAuth();
  const [tab, setTab] = useState<"login" | "register">("login");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });
  const [mounted, setMounted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const indicatorRef = useRef<HTMLDivElement>(null);
  const loginTabRef = useRef<HTMLButtonElement>(null);
  const registerTabRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!indicatorRef.current) return;
    const el = tab === "login" ? loginTabRef.current : registerTabRef.current;
    if (el) {
      indicatorRef.current.style.width = `${el.offsetWidth}px`;
      indicatorRef.current.style.transform = `translateX(${el.offsetLeft}px)`;
    }
  }, [tab, mounted]);

  const handleMouse = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setMousePos({ x, y });
  };

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

      if (!res.ok) {
        setError(json.error || "Error inesperado");
        return;
      }

      await refresh();
      router.push("/");
    } catch {
      setError("Error de conexión");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouse}
      style={{
        position: "relative",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "calc(100vh - var(--nav-height))",
        padding: "2rem",
        overflow: "hidden",
        background: "var(--bg)",
      }}
    >
      {/* Spotlight follow cursor */}
      <div
        style={{
          position: "absolute",
          width: SPOTLIGHT_SIZE,
          height: SPOTLIGHT_SIZE,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(201,168,76,0.06) 0%, transparent 70%)",
          left: `calc(${mousePos.x}% - ${SPOTLIGHT_SIZE / 2}px)`,
          top: `calc(${mousePos.y}% - ${SPOTLIGHT_SIZE / 2}px)`,
          pointerEvents: "none",
          transition: "left 0.4s ease-out, top 0.4s ease-out",
        }}
      />

      {/* Subtle radial glow bottom-right */}
      <div
        style={{
          position: "absolute",
          bottom: "-20%",
          right: "-10%",
          width: "50%",
          height: "60%",
          background:
            "radial-gradient(ellipse, rgba(201,168,76,0.05) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      {/* Film grain overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          opacity: 0.035,
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E\")",
          backgroundRepeat: "repeat",
          backgroundSize: "256px 256px",
          pointerEvents: "none",
        }}
      />

      {/* Card */}
      <div
        style={{
          position: "relative",
          width: "100%",
          maxWidth: 420,
          opacity: mounted ? 1 : 0,
          transform: mounted ? "translateY(0)" : "translateY(24px)",
          transition: "opacity 0.7s ease, transform 0.7s ease",
        }}
      >
        {/* Decorative top line */}
        <div
          style={{
            width: "60px",
            height: "3px",
            background: "linear-gradient(90deg, var(--gold), transparent)",
            marginBottom: "1.5rem",
            borderRadius: "2px",
            opacity: mounted ? 1 : 0,
            transition: "opacity 0.6s ease 0.15s",
          }}
        />

        {/* Brand */}
        <div
          style={{
            marginBottom: "2.5rem",
            opacity: mounted ? 1 : 0,
            transform: mounted ? "translateY(0)" : "translateY(12px)",
            transition: "opacity 0.6s ease 0.2s, transform 0.6s ease 0.2s",
          }}
        >
          <h1
            style={{
              color: "var(--gold)",
              fontFamily: "var(--font-display)",
              fontSize: "2.2rem",
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              margin: 0,
              fontWeight: 700,
            }}
          >
            MOVIX
          </h1>
          <p
            style={{
              color: "var(--text-muted)",
              fontFamily: "var(--font-display)",
              fontSize: "0.82rem",
              fontStyle: "italic",
              letterSpacing: "0.08em",
              margin: "0.3rem 0 0 0",
            }}
          >
            Gestión Cinematográfica
          </p>
        </div>

        {/* Form card */}
        <div
          style={{
            background: "rgba(22, 22, 22, 0.8)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            border: "1px solid rgba(201, 168, 76, 0.15)",
            borderRadius: "16px",
            padding: "2.2rem 2rem",
            boxShadow:
              "0 0 0 1px rgba(201,168,76,0.05), 0 20px 60px rgba(0,0,0,0.5), 0 0 40px rgba(201,168,76,0.03)",
            opacity: mounted ? 1 : 0,
            transform: mounted ? "translateY(0)" : "translateY(16px)",
            transition: "opacity 0.6s ease 0.3s, transform 0.6s ease 0.3s",
          }}
        >
          {/* Tab switcher */}
          <div
            style={{
              position: "relative",
              display: "flex",
              marginBottom: "2rem",
              background: "var(--surface-2)",
              borderRadius: "10px",
              padding: "3px",
            }}
          >
            <div
              ref={indicatorRef}
              style={{
                position: "absolute",
                top: 3,
                left: 0,
                height: "calc(100% - 6px)",
                background: "rgba(201, 168, 76, 0.12)",
                border: "1px solid rgba(201, 168, 76, 0.25)",
                borderRadius: "8px",
                transition: "transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1), width 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)",
                zIndex: 0,
              }}
            />
            <button
              ref={loginTabRef}
              type="button"
              onClick={() => { setTab("login"); setError(""); }}
              style={{
                flex: 1,
                position: "relative",
                zIndex: 1,
                padding: "0.7rem 0",
                background: "none",
                border: "none",
                borderRadius: "7px",
                color: tab === "login" ? "var(--gold)" : "var(--text-muted)",
                fontFamily: "var(--font-display)",
                fontSize: "0.88rem",
                cursor: "pointer",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                transition: "color 0.3s ease",
              }}
            >
              Iniciar Sesión
            </button>
            <button
              ref={registerTabRef}
              type="button"
              onClick={() => { setTab("register"); setError(""); }}
              style={{
                flex: 1,
                position: "relative",
                zIndex: 1,
                padding: "0.7rem 0",
                background: "none",
                border: "none",
                borderRadius: "7px",
                color: tab === "register" ? "var(--gold)" : "var(--text-muted)",
                fontFamily: "var(--font-display)",
                fontSize: "0.88rem",
                cursor: "pointer",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                transition: "color 0.3s ease",
              }}
            >
              Registrarse
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "1.2rem",
              }}
            >
              {tab === "register" && (
                <div
                  style={{
                    animation: mounted ? "fadeInUp 0.35s ease" : "none",
                  }}
                >
                  <InputField
                    id="name"
                    name="name"
                    type="text"
                    label="Nombre"
                    icon="bi-person"
                    placeholder="Tu nombre completo"
                    required
                  />
                </div>
              )}

              <InputField
                id="email"
                name="email"
                type="email"
                label="Correo Electrónico"
                icon="bi-envelope"
                placeholder="correo@ejemplo.com"
                required
              />

              <InputField
                id="password"
                name="password"
                type="password"
                label="Contraseña"
                icon="bi-lock"
                placeholder={tab === "register" ? "Mínimo 6 caracteres" : "Tu contraseña"}
                required
                minLength={6}
              />

              {error && (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    padding: "0.65rem 0.9rem",
                    background: "rgba(231, 76, 60, 0.08)",
                    border: "1px solid rgba(231, 76, 60, 0.2)",
                    borderRadius: "8px",
                    color: "#e8736a",
                    fontSize: "0.82rem",
                    fontFamily: "var(--font-body)",
                    animation: "shake 0.4s ease",
                  }}
                >
                  <i
                    className="bi bi-exclamation-triangle-fill"
                    style={{ fontSize: "0.9rem", flexShrink: 0 }}
                  />
                  <span>{error}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                style={{
                  position: "relative",
                  width: "100%",
                  marginTop: "0.3rem",
                  padding: "0.8rem 1.6rem",
                  background: loading
                    ? "rgba(201, 168, 76, 0.15)"
                    : "transparent",
                  border: "1px solid var(--gold-dim)",
                  borderRadius: "10px",
                  color: loading ? "var(--text-muted)" : "var(--gold)",
                  cursor: loading ? "not-allowed" : "pointer",
                  fontFamily: "var(--font-display)",
                  fontSize: "0.88rem",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  transition:
                    "background 0.3s ease, color 0.3s ease, border-color 0.3s ease, transform 0.15s ease",
                  overflow: "hidden",
                }}
                onMouseEnter={(e) => {
                  if (!loading) {
                    e.currentTarget.style.background = "var(--gold)";
                    e.currentTarget.style.color = "var(--bg)";
                    e.currentTarget.style.borderColor = "var(--gold)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!loading) {
                    e.currentTarget.style.background = "transparent";
                    e.currentTarget.style.color = "var(--gold)";
                    e.currentTarget.style.borderColor = "var(--gold-dim)";
                  }
                }}
                onMouseDown={(e) => {
                  if (!loading) {
                    e.currentTarget.style.transform = "scale(0.97)";
                  }
                }}
                onMouseUp={(e) => {
                  if (!loading) {
                    e.currentTarget.style.transform = "scale(1)";
                  }
                }}
              >
                {loading ? (
                  <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.6rem" }}>
                    <span
                      style={{
                        width: 14,
                        height: 14,
                        border: "2px solid var(--text-muted)",
                        borderTopColor: "var(--gold)",
                        borderRadius: "50%",
                        animation: "spin 0.7s linear infinite",
                        display: "inline-block",
                      }}
                    />
                    Procesando…
                  </span>
                ) : tab === "login" ? (
                  <>
                    <i className="bi bi-box-arrow-in-right me-2" />
                    Iniciar Sesión
                  </>
                ) : (
                  <>
                    <i className="bi bi-person-plus me-2" />
                    Crear Cuenta
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Footer note */}
        <p
          style={{
            marginTop: "1.5rem",
            color: "var(--text-muted)",
            fontSize: "0.75rem",
            textAlign: "center",
            fontFamily: "var(--font-display)",
            letterSpacing: "0.04em",
            opacity: mounted ? 1 : 0,
            transition: "opacity 0.6s ease 0.5s",
          }}
        >
          <i className="bi bi-shield-check me-1" />
          Tus datos están protegidos
        </p>
      </div>

      {/* Keyframes injected once */}
      {mounted && (
        <style>{`
          @keyframes fadeInUp {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }
          @keyframes shake {
            0%, 100% { transform: translateX(0); }
            20% { transform: translateX(-6px); }
            40% { transform: translateX(6px); }
            60% { transform: translateX(-4px); }
            80% { transform: translateX(4px); }
          }
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      )}
    </div>
  );
}

function InputField({
  id,
  name,
  type,
  label,
  icon,
  placeholder,
  required,
  minLength,
}: {
  id: string;
  name: string;
  type: string;
  label: string;
  icon: string;
  placeholder: string;
  required?: boolean;
  minLength?: number;
}) {
  const [focused, setFocused] = useState(false);
  const [filled, setFilled] = useState(false);

  return (
    <div className="form-group" style={{ gap: "0.4rem" }}>
      <label
        htmlFor={id}
        style={{
          fontSize: "0.75rem",
          color: focused ? "var(--gold)" : "var(--text-muted)",
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          transition: "color 0.25s ease",
          fontFamily: "var(--font-display)",
        }}
      >
        {label}
      </label>
      <div
        style={{
          position: "relative",
          display: "flex",
          alignItems: "center",
          background: "var(--surface-2)",
          border: "1px solid",
          borderColor: focused
            ? "var(--gold-dim)"
            : "var(--border)",
          borderRadius: "10px",
          transition:
            "border-color 0.25s ease, box-shadow 0.25s ease",
          boxShadow: focused
            ? "0 0 0 3px rgba(201, 168, 76, 0.08), inset 0 0 0 1px rgba(201, 168, 76, 0.1)"
            : "none",
        }}
      >
        <i
          className={icon}
          style={{
            position: "absolute",
            left: "0.9rem",
            color: focused ? "var(--gold)" : "var(--text-muted)",
            fontSize: "0.85rem",
            transition: "color 0.25s ease",
            pointerEvents: "none",
            zIndex: 1,
          }}
        />
        <input
          id={id}
          name={name}
          type={type}
          placeholder={placeholder}
          required={required}
          minLength={minLength}
          onFocus={() => setFocused(true)}
          onBlur={(e) => {
            setFocused(false);
            setFilled(e.target.value.length > 0);
          }}
          onChange={(e) => setFilled(e.target.value.length > 0)}
          style={{
            width: "100%",
            padding: "0.75rem 1rem 0.75rem 2.6rem",
            background: "transparent",
            border: "none",
            outline: "none",
            color: filled ? "var(--cream)" : "var(--text)",
            fontFamily: "var(--font-body)",
            fontSize: "0.92rem",
            borderRadius: "10px",
          }}
        />
      </div>
    </div>
  );
}
