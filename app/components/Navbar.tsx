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
      ? [
          { href: "/base-de-datos", label: "Base de Datos", icon: "bi-database" },
          { href: "/registrar-pelicula", label: "Registrar", icon: "bi-plus-circle" },
        ]
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
        padding: "0 1.5rem",
        height: 60,
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
          gap: "0.75rem",
          height: "100%",
        }}
      >
        <Link
          href="/"
          style={{
            color: "var(--gold)",
            letterSpacing: "0.15em",
            fontSize: "1.3rem",
            fontWeight: "bold",
            textDecoration: "none",
            fontFamily: "var(--font-display)",
            flexShrink: 0,
          }}
        >
          MOVIX
        </Link>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.25rem",
            overflowX: "auto",
            overflowY: "hidden",
            flex: "1 1 auto",
            minWidth: 0,
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
          className="nav-links-scroll"
        >
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              style={{
                padding: "0.5rem 0.9rem",
                color:
                  pathname === link.href
                    ? "var(--gold)"
                    : "var(--text-muted)",
                fontFamily: "var(--font-display)",
                fontSize: "0.8rem",
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                textDecoration: "none",
                whiteSpace: "nowrap",
                borderBottom:
                  pathname === link.href
                    ? "2px solid var(--gold)"
                    : "2px solid transparent",
                transition:
                  "color 180ms ease, border-color 180ms ease",
                flexShrink: 0,
              }}
            >
              <i className={`${link.icon} me-1`} />
              {link.label}
            </Link>
          ))}
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            flexShrink: 0,
          }}
        >
          {!loading && user && (
            <>
              <span
                style={{
                  color: "var(--text-muted)",
                  fontSize: "0.78rem",
                  fontFamily: "var(--font-display)",
                  display: "none",
                }}
                className="nav-user-name"
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
                  fontSize: "0.72rem",
                  padding: "0.25rem 0.65rem",
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                  transition: "color 180ms ease, border-color 180ms ease",
                  whiteSpace: "nowrap",
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
            </>
          )}
        </div>
      </div>

      <style>{`
        .nav-links-scroll::-webkit-scrollbar { display: none; }
        @media (min-width: 800px) {
          .nav-user-name { display: inline !important; }
        }
      `}</style>
    </nav>
  );
}
