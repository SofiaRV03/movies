"use client";

import Link from "next/link";
import { useAuth } from "@/app/contexts/AuthContext";

const modules = [
  {
    icon: "bi-search",
    title: "Consulta de Películas",
    desc: "Información detallada sobre películas, incluyendo título, director, actores, género y calificación IMDB.",
    color: "rgba(245,197,24,0.12)",
    border: "rgba(245,197,24,0.3)",
    href: "/galeria",
  },
  {
    icon: "bi-bookmark-star",
    title: "WatchList",
    desc: "Agrega películas a tu lista de seguimiento personalizada y no pierdas detalle de lo que quieres ver.",
    color: "rgba(201,168,76,0.1)",
    border: "rgba(201,168,76,0.25)",
    href: null,
  },
  {
    icon: "bi-plus-circle",
    title: "Registrar Película",
    desc: "Los administradores pueden agregar, editar y eliminar películas del catálogo del sistema fácilmente.",
    color: "rgba(100,200,150,0.1)",
    border: "rgba(100,200,150,0.25)",
    href: "/registrar-pelicula",
  },
  {
    icon: "bi-eye",
    title: "Lista de Películas Vistas",
    desc: "Lleva un registro de las películas que has visto y comparte tu historial con la comunidad.",
    color: "rgba(100,200,150,0.1)",
    border: "rgba(100,200,150,0.25)",
    href: null,
  },
  {
    icon: "bi-star",
    title: "Reseñas y Calificaciones",
    desc: "Califica películas, escribe reseñas y descubre la opinión de la comunidad Movix.",
    color: "rgba(245,197,24,0.08)",
    border: "rgba(245,197,24,0.2)",
    href: null,
  },
];

export default function ModuleGrid() {
  const { user } = useAuth();

  return (
    <div className="module-grid">
      {modules.map((m) => {
        const canLink = m.href && (m.href !== "/registrar-pelicula" || user?.role === "ADMIN");
        const card = (
          <div
            key={m.title}
            className="module-card"
            style={{
              "--card-bg": m.color,
              "--card-border": m.border,
              cursor: canLink ? "pointer" : "default",
            } as React.CSSProperties}
          >
            <div className="module-card-icon">
              <i className={`bi ${m.icon}`} />
            </div>
            <h3 className="module-card-title">{m.title}</h3>
            <p className="module-card-desc">{m.desc}</p>
          </div>
        );

        if (canLink) {
          return (
            <Link key={m.title} href={m.href} style={{ textDecoration: "none" }}>
              {card}
            </Link>
          );
        }

        return card;
      })}
    </div>
  );
}
