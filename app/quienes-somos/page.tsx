import ScrollAnimation from "../components/ScrollAnimation";

export default function QuienesSomosPage() {
  return (
    <>
      <section aria-labelledby="tit-quienes" className="fade-in-up">
        <h2 id="tit-quienes">
          <i className="bi bi-info-circle me-2" style={{ color: "var(--gold)" }} />
          ¿Quiénes Somos?
        </h2>
        <div className="form-card" style={{ padding: "2rem", maxWidth: "100%" }}>
          <p>
            En Movix creemos que encontrar una buena película no debería ser
            complicado. Somos una plataforma diseñada para ayudarte a descubrir
            películas que realmente se adapten a tus gustos, utilizando tecnología
            y recomendaciones personalizadas para ofrecer una mejor experiencia de
            entretenimiento.
          </p>
          <p>
            Nuestro objetivo es hacer que cada usuario encuentre algo increíble
            para ver, de forma rápida, sencilla y divertida.
          </p>
        </div>
      </section>

      <section className="row mt-5 fade-in-up">
        <div className="col-md-6 mb-4">
          <div className="form-card h-100" style={{ padding: "2rem", maxWidth: "100%" }}>
            <h3>
              <i className="bi bi-bullseye me-2" style={{ color: "var(--gold)" }} />
              Misión
            </h3>
            <p>
              En Movix buscamos ofrecer una experiencia de entretenimiento
              personalizada, ayudando a los usuarios a encontrar películas acordes
              a sus gustos e intereses de forma rápida y sencilla. A través de una
              plataforma moderna e intuitiva, queremos facilitar el descubrimiento
              de nuevo contenido y mejorar la experiencia al momento de elegir qué
              ver.
            </p>
          </div>
        </div>
        <div className="col-md-6 mb-4">
          <div className="form-card h-100" style={{ padding: "2rem", maxWidth: "100%" }}>
            <h3>
              <i className="bi bi-eye me-2" style={{ color: "var(--gold)" }} />
              Visión
            </h3>
            <p>
              Nuestra visión es convertir a Movix en una plataforma innovadora y
              reconocida en el ámbito de las recomendaciones de películas,
              destacándonos por brindar experiencias personalizadas, dinámicas y
              adaptadas a cada usuario mediante el uso de tecnología y diseño
              moderno.
            </p>
          </div>
        </div>
      </section>

      <ScrollAnimation>
        <section aria-labelledby="tit-equipo" className="mt-5 fade-in-up">
          <h2 id="tit-equipo">
            <i className="bi bi-people-fill me-2" style={{ color: "var(--gold)" }} />
            Nuestro Equipo
          </h2>
          <div className="form-card" style={{ padding: "2rem", maxWidth: "100%" }}>
            <p>
              Movix fue desarrollado por{" "}
              <strong>
                Claudia Patricia Galvis, Sofía Restrepo Villegas y Allison Mariana
                Restrepo
              </strong>
              , estudiantes de sexto y séptimo semestre de Ingeniería de Sistemas
              en la Universidad Libre.
            </p>
            <p>
              Este proyecto nació inicialmente como una propuesta académica para la
              materia de <strong>Programación Web</strong>, con el objetivo de
              aplicar conocimientos en desarrollo frontend, diseño de interfaces y
              lógica de programación en una solución interactiva y útil para los
              usuarios.
            </p>
            <p>
              A partir de esta idea, decidimos crear una plataforma enfocada en
              mejorar la experiencia de búsqueda y recomendación de películas,
              combinando tecnología, diseño moderno y una experiencia intuitiva.
              Durante el desarrollo del proyecto fortalecimos habilidades en trabajo
              en equipo, desarrollo web y creación de aplicaciones centradas en el
              usuario.
            </p>
            <p>
              Con Movix buscamos demostrar cómo la tecnología puede utilizarse para
              crear experiencias de entretenimiento más dinámicas, personalizadas y
              accesibles para todos los amantes del cine.
            </p>
          </div>
        </section>
      </ScrollAnimation>

      <hr />
    </>
  );
}
