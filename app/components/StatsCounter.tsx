"use client";

import { useEffect, useRef, useState } from "react";

const stats = [
  { icon: "bi-film", label: "Películas", value: 1000, suffix: "" },
  { icon: "bi-person", label: "Actores", value: 2000, suffix: "+" },
  { icon: "bi-camera-reels", label: "Directores", value: 500, suffix: "+" },
  { icon: "bi-tags", label: "Géneros", value: 21, suffix: "" },
];

function Counter({ target, suffix }: { target: number; suffix: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const counted = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || counted.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !counted.current) {
          counted.current = true;
          const duration = 1500;
          const steps = 40;
          const increment = target / steps;
          let current = 0;
          const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
              setCount(target);
              clearInterval(timer);
            } else {
              setCount(Math.floor(current));
            }
          }, duration / steps);
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [target]);

  return (
    <span ref={ref}>
      {count}{suffix}
    </span>
  );
}

export default function StatsCounter() {
  return (
    <div className="stats-grid">
      {stats.map((s) => (
        <div key={s.label} className="stat-card">
          <div className="stat-icon">
            <i className={`bi ${s.icon}`} />
          </div>
          <span className="stat-value">
            <Counter target={s.value} suffix={s.suffix} />
          </span>
          <span className="stat-label">{s.label}</span>
        </div>
      ))}
    </div>
  );
}
