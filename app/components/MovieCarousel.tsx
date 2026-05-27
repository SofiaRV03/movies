"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";

const slides = [
  {
    src: "/img/inter.jpg",
    alt: "Interstellar",
    badge: "⭐ 8.7 IMDB",
    title: "Interstellar",
    description: "Un viaje épico más allá de los límites del universo — 2014",
  },
  {
    src: "/img/barbie.jpg",
    alt: "Barbie",
    badge: "⭐ 6.9 IMDB",
    title: "Barbie",
    description: "La película que lo tuvo todo — 2023",
  },
  {
    src: "/img/chihiro.jpg",
    alt: "El viaje de Chihiro",
    badge: "⭐ 8.6 IMDB",
    title: "El Viaje de Chihiro",
    description: "La obra maestra de Hayao Miyazaki — 2001",
  },
  {
    src: "/img/shawshank.jpg",
    alt: "The Shawshank Redemption",
    badge: "⭐ 9.3 IMDB",
    title: "The Shawshank Redemption",
    description: "La #1 en IMDB de todos los tiempos — 1994",
  },
];

export default function MovieCarousel() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let carouselInstance: unknown;
    (async () => {
      const bootstrap = await import("bootstrap");
      if (ref.current) {
        carouselInstance = new bootstrap.Carousel(ref.current, {
          ride: "carousel",
          interval: 4500,
        });
      }
    })();
    return () => {
      if (carouselInstance && typeof carouselInstance === "object" && "dispose" in carouselInstance) {
        (carouselInstance as { dispose: () => void }).dispose();
      }
    };
  }, []);

  return (
    <div ref={ref} id="carouselMovies" className="carousel slide" data-bs-ride="carousel">
      <div className="carousel-indicators">
        {slides.map((_, i) => (
          <button
            key={i}
            type="button"
            data-bs-target="#carouselMovies"
            data-bs-slide-to={i}
            className={i === 0 ? "active" : ""}
            aria-label={`Slide ${i + 1}`}
          />
        ))}
      </div>

      <div className="carousel-inner">
        {slides.map((slide, i) => (
          <div key={i} className={`carousel-item ${i === 0 ? "active" : ""}`}>
            <Image
              src={slide.src}
              alt={slide.alt}
              width={1920}
              height={500}
              className="d-block w-100 carousel-img"
              priority={i === 0}
            />
            <div className="carousel-caption d-none d-md-block">
              <div className="carousel-badge">{slide.badge}</div>
              <h5>{slide.title}</h5>
              <p>{slide.description}</p>
            </div>
          </div>
        ))}
      </div>

      <button className="carousel-control-prev" type="button" data-bs-target="#carouselMovies" data-bs-slide="prev">
        <span className="carousel-control-prev-icon" aria-hidden="true" />
        <span className="visually-hidden">Anterior</span>
      </button>
      <button className="carousel-control-next" type="button" data-bs-target="#carouselMovies" data-bs-slide="next">
        <span className="carousel-control-next-icon" aria-hidden="true" />
        <span className="visually-hidden">Siguiente</span>
      </button>
    </div>
  );
}
