"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/app/contexts/AuthContext";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading, logout } = useAuth();

  if (pathname === "/login") return null;

  const links = [
    { href: "/", label: "Inicio", icon: "bi-book" },
    { href: "/galeria", label: "Galería", icon: "bi-film" },
    ...(user?.role === "ADMIN"
      ? [{ href: "/base-de-datos", label: "Base de Datos", icon: "bi-database" }]
      : user?.role === "USER"
      ? [
          { href: "/vistas", label: "Vistas", icon: "bi-eye-fill" },
          { href: "/watchlist", label: "Watchlist", icon: "bi-bookmark-fill" },
        ]
      : []),
    { href: "/quienes-somos", label: "Quiénes Somos", icon: "bi-people" },
  ];

  return (
    <nav
      className="navbar navbar-dark fixed-top"
      style={{
        backgroundColor: "var(--surface)",
        borderBottom: "1px solid var(--border)",
        zIndex: 1050,
        padding: "0.75rem 2rem",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          width: "100%",
          maxWidth: "1140px",
          margin: "0 auto",
        }}
      >
        <Link
          href="/"
          style={{
            color: "var(--gold)",
            letterSpacing: "0.15em",
            fontSize: "1.5rem",
            fontWeight: "bold",
            textDecoration: "none",
            fontFamily: "var(--font-display)",
          }}
        >
          MOVIX
        </Link>

        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              style={{
                padding: "0.75rem 1.25rem",
                color:
                  pathname === link.href
                    ? "var(--gold)"
                    : "var(--text-muted)",
                fontFamily: "var(--font-display)",
                fontSize: "0.9rem",
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                textDecoration: "none",
                borderBottom:
                  pathname === link.href
                    ? "2px solid var(--gold)"
                    : "2px solid transparent",
                transition:
                  "color 180ms ease, border-color 180ms ease",
              }}
            >
              <i className={`${link.icon} me-1`} />
              {link.label}
            </Link>
          ))}

          {!loading && user && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.75rem",
                marginLeft: "1rem",
                paddingLeft: "1rem",
                borderLeft: "1px solid var(--border)",
              }}
            >
              <span
                style={{
                  color: "var(--text-muted)",
                  fontSize: "0.82rem",
                  fontFamily: "var(--font-display)",
                }}
              >
                <i className="bi bi-person-circle me-1" />
                {user.name}
              </span>
              <button
                onClick={async () => {
                  await logout();
                  router.push("/login");
                }}
                style={{
                  background: "none",
                  border: "1px solid var(--border)",
                  borderRadius: "var(--radius)",
                  color: "var(--text-muted)",
                  cursor: "pointer",
                  fontFamily: "var(--font-display)",
                  fontSize: "0.78rem",
                  padding: "0.3rem 0.8rem",
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                  transition: "color 180ms ease, border-color 180ms ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = "var(--gold)";
                  e.currentTarget.style.borderColor = "var(--gold-dim)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = "var(--text-muted)";
                  e.currentTarget.style.borderColor = "var(--border)";
                }}
              >
                <i className="bi bi-box-arrow-right me-1" />
                Salir
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
