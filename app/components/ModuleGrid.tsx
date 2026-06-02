const modules = [
  {
    icon: "bi-search",
    title: "Consulta de Películas",
    desc: "Información detallada sobre películas, incluyendo título, director, actores, género y calificación IMDB.",
    color: "rgba(245,197,24,0.12)",
    border: "rgba(245,197,24,0.3)",
  },
  {
    icon: "bi-bookmark-star",
    title: "WatchList",
    desc: "Agrega películas a tu lista de seguimiento personalizada y no pierdas detalle de lo que quieres ver.",
    color: "rgba(201,168,76,0.1)",
    border: "rgba(201,168,76,0.25)",
  },
  {
    icon: "bi-plus-circle",
    title: "Registrar Película",
    desc: "Los administradores pueden agregar nuevas películas al catálogo del sistema fácilmente.",
    color: "rgba(100,200,150,0.1)",
    border: "rgba(100,200,150,0.25)",
  },
  {
    icon: "bi-bar-chart",
    title: "Dashboard",
    desc: "Visualiza estadísticas y métricas sobre el catálogo de películas con gráficos dinámicos.",
    color: "rgba(100,150,255,0.1)",
    border: "rgba(100,150,255,0.25)",
  },
  {
    icon: "bi-dice",
    title: "¿Qué película ver hoy?",
    desc: "Recomendaciones basadas en tus preferencias de género, director y actor favoritos.",
    color: "rgba(200,120,200,0.1)",
    border: "rgba(200,120,200,0.25)",
  },
  {
    icon: "bi-star",
    title: "Reseñas y Calificaciones",
    desc: "Califica películas, escribe reseñas y descubre la opinión de la comunidad Movix.",
    color: "rgba(245,197,24,0.08)",
    border: "rgba(245,197,24,0.2)",
  },
];

export default function ModuleGrid() {
  return (
    <div className="module-grid">
      {modules.map((m) => (
        <div
          key={m.title}
          className="module-card"
          style={{
            "--card-bg": m.color,
            "--card-border": m.border,
          } as React.CSSProperties}
        >
          <div className="module-card-icon">
            <i className={`bi ${m.icon}`} />
          </div>
          <h3 className="module-card-title">{m.title}</h3>
          <p className="module-card-desc">{m.desc}</p>
        </div>
      ))}
    </div>
  );
}
