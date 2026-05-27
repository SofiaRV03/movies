"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/", label: "Inicio", icon: "bi-book" },
  { href: "/galeria", label: "Galería", icon: "bi-film" },
  { href: "/base-de-datos", label: "Base de Datos", icon: "bi-database" },
  { href: "/quienes-somos", label: "Quiénes Somos", icon: "bi-people" },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav
      className="navbar navbar-dark fixed-top"
      style={{ 
        backgroundColor: "var(--surface)", 
        borderBottom: "1px solid var(--border)",
        zIndex: 1050,
        padding: "0.75rem 2rem"
      }}
    >
      <div style={{ 
        display: "flex", 
        alignItems: "center", 
        justifyContent: "space-between",
        width: "100%",
        maxWidth: "1140px",
        margin: "0 auto"
      }}>
        <Link 
          href="/" 
          style={{ 
            color: "var(--gold)", 
            letterSpacing: "0.15em",
            fontSize: "1.5rem",
            fontWeight: "bold",
            textDecoration: "none",
            fontFamily: "var(--font-display)"
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
                color: pathname === link.href ? "var(--gold)" : "var(--text-muted)",
                fontFamily: "var(--font-display)",
                fontSize: "0.9rem",
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                textDecoration: "none",
                borderBottom: pathname === link.href ? "2px solid var(--gold)" : "2px solid transparent",
                transition: "color 180ms ease, border-color 180ms ease"
              }}
            >
              <i className={`${link.icon} me-1`} />
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
