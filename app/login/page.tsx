"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/contexts/AuthContext";

export default function LoginPage() {
  const router = useRouter();
  const { refresh } = useAuth();
  const [tab, setTab] = useState<"login" | "register">("login");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

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
    <div style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      minHeight: "calc(100vh - var(--nav-height))",
      padding: "2rem",
    }}>
      <div className="form-card" style={{ maxWidth: 440, width: "100%" }}>
        <div className="form-card-icon-wrap">
          <i className={`bi ${tab === "login" ? "bi-box-arrow-in-right" : "bi-person-plus"}`} />
        </div>
        <div className="form-card-title">
          {tab === "login" ? "Iniciar Sesión" : "Crear Cuenta"}
        </div>

        <div style={{ display: "flex", marginBottom: "1.5rem", borderBottom: "1px solid var(--border)" }}>
          <button
            type="button"
            onClick={() => { setTab("login"); setError(""); }}
            style={{
              flex: 1,
              padding: "0.6rem 0",
              background: "none",
              border: "none",
              borderBottom: tab === "login" ? "2px solid var(--gold)" : "2px solid transparent",
              color: tab === "login" ? "var(--gold)" : "var(--text-muted)",
              fontFamily: "var(--font-display)",
              fontSize: "0.9rem",
              cursor: "pointer",
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              transition: "color 180ms ease, border-color 180ms ease",
            }}
          >
            Iniciar Sesión
          </button>
          <button
            type="button"
            onClick={() => { setTab("register"); setError(""); }}
            style={{
              flex: 1,
              padding: "0.6rem 0",
              background: "none",
              border: "none",
              borderBottom: tab === "register" ? "2px solid var(--gold)" : "2px solid transparent",
              color: tab === "register" ? "var(--gold)" : "var(--text-muted)",
              fontFamily: "var(--font-display)",
              fontSize: "0.9rem",
              cursor: "pointer",
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              transition: "color 180ms ease, border-color 180ms ease",
            }}
          >
            Registrarse
          </button>
        </div>

        <form onSubmit={handleSubmit} className="form-card-body">
          {tab === "register" && (
            <div className="form-group">
              <label htmlFor="name">Nombre</label>
              <div className="input-icon-wrap">
                <i className="bi bi-person" />
                <input id="name" name="name" type="text" placeholder="Tu nombre" required />
              </div>
            </div>
          )}

          <div className="form-group">
            <label htmlFor="email">Correo Electrónico</label>
            <div className="input-icon-wrap">
              <i className="bi bi-envelope" />
              <input id="email" name="email" type="email" placeholder="correo@ejemplo.com" required />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="password">Contraseña</label>
            <div className="input-icon-wrap">
              <i className="bi bi-lock" />
              <input id="password" name="password" type="password" placeholder="Mínimo 6 caracteres" required minLength={6} />
            </div>
          </div>

          {error && (
            <p style={{ color: "#e74c3c", fontSize: "0.85rem", margin: 0 }}>
              <i className="bi bi-exclamation-circle me-1" />
              {error}
            </p>
          )}

          <button type="submit" disabled={loading} style={{ alignSelf: "stretch", marginTop: 0 }}>
            {loading
              ? "Procesando..."
              : tab === "login"
                ? "Iniciar Sesión"
                : "Crear Cuenta"}
          </button>
        </form>
      </div>
    </div>
  );
}
