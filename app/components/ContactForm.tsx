"use client";

import { FormEvent, useState } from "react";

export default function ContactForm() {
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [feedback, setFeedback] = useState("");

  const esNombreValido = (n: string) => n.trim().length >= 3;
  const esEmailValido = (e: string) => e.includes("@") && e.includes(".");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (!esNombreValido(nombre)) {
      setFeedback("El nombre debe tener al menos 3 caracteres");
      return;
    }
    if (!esEmailValido(email)) {
      setFeedback("El correo no es válido");
      return;
    }
    if (mensaje.trim().length < 5) {
      setFeedback("El mensaje es muy corto");
      return;
    }

    setFeedback("✅ Formulario enviado correctamente");
    setNombre("");
    setEmail("");
    setMensaje("");
  };

  return (
    <div className="form-card contacto-card">
      <h2 id="contacto-titulo">
        <i className="bi bi-envelope me-2" style={{ color: "var(--gold)" }} />
        Contacto
      </h2>
      <p>¿Tienes sugerencias o quieres reportar un error en el catálogo? Escríbenos.</p>

      <h3 className="form-card-title">Envíanos un mensaje</h3>
      <form className="form-card-body" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="contacto-nombre">Nombre</label>
          <div className="input-icon-wrap">
            <i className="bi bi-person" />
            <input
              type="text"
              id="contacto-nombre"
              placeholder="Ej: Laura Gómez"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              required
            />
          </div>
        </div>
        <div className="form-group">
          <label htmlFor="contacto-email">Correo electrónico</label>
          <div className="input-icon-wrap">
            <i className="bi bi-envelope" />
            <input
              type="email"
              id="contacto-email"
              placeholder="Ej: laura@correo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
        </div>
        <div className="form-group">
          <label htmlFor="contacto-mensaje">Mensaje</label>
          <div className="input-icon-wrap">
            <i className="bi bi-pencil" style={{ top: "1rem", transform: "none" }} />
            <textarea
              id="contacto-mensaje"
              rows={4}
              placeholder="Escribe tu mensaje aquí..."
              value={mensaje}
              onChange={(e) => setMensaje(e.target.value)}
              required
              style={{ paddingTop: "0.65rem", resize: "vertical" }}
            />
          </div>
        </div>
        {feedback && (
          <p style={{ color: feedback.startsWith("✅") ? "var(--gold-light)" : "var(--gold)", fontSize: "0.85rem" }}>
            {feedback}
          </p>
        )}
        <button type="submit">
          <i className="bi bi-send me-2" />
          Enviar Mensaje
        </button>
      </form>
    </div>
  );
}
