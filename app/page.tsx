import MovieCarousel from "./components/MovieCarousel";
import ContactForm from "./components/ContactForm";
import ScrollAnimation from "./components/ScrollAnimation";
import Header from "./components/Header";

export default function Home() {
  return (
    <>
      <Header />
      <MovieCarousel />

      <section aria-labelledby="bienvenida-titulo">
        <h2 id="bienvenida-titulo">Bienvenido a Movix</h2>
        <p>
          Explora y gestiona información sobre películas, actores, directores y
          géneros cinematográficos.
        </p>
        <hr />
      </section>

      <section aria-labelledby="que-es-titulo">
        <h2 id="que-es-titulo">¿Qué es Movix?</h2>
        <p>
          <strong>Movix</strong> es una plataforma para administrar información
          cinematográfica, permitiendo registrar, consultar y analizar datos de
          películas, actores, directores y géneros.
        </p>

        <dl>
          <dt>
            <strong>Inicio de operaciones:</strong>
          </dt>
          <dd>
            <time dateTime="2026-03-18">18 de marzo de 2026</time>
          </dd>
          <dt>
            <strong>Recomendado para:</strong>
          </dt>
          <dd>
            <mark>Amantes del cine y la gestión de datos</mark>
          </dd>
        </dl>
        <hr />
      </section>

      <section aria-labelledby="modulos-titulo">
        <h2 id="modulos-titulo">Módulos del Sistema</h2>

        <details>
          <summary>
            <strong>Consulta de Películas</strong>
          </summary>
          <p>
            Permite consultar información detallada sobre películas, incluyendo
            título, director, actores, género y calificación según IMDB.
          </p>
          <p>
            <strong>Tablas relacionadas:</strong>
          </p>
          <ul>
            <li>
              <code>tbl_peliculas</code>
            </li>
            <li>
              <code>tbl_actores</code>
            </li>
            <li>
              <code>tbl_directores</code>
            </li>
            <li>
              <code>tbl_generos</code>
            </li>
          </ul>
        </details>

        <details>
          <summary>
            <strong>WatchList</strong>
          </summary>
          <p>
            Permite a los usuarios agregar películas a una lista de seguimiento
            personalizada.
          </p>
          <p>
            <strong>Tablas relacionadas:</strong>
          </p>
          <ul>
            <li>
              <code>tbl_watchlist</code>
            </li>
          </ul>
        </details>

        <details>
          <summary>
            <strong>Registrar Película</strong>
          </summary>
          <p>
            Permite al administrador agregar películas al catálogo del sistema.
          </p>
          <p>
            <strong>Tablas relacionadas:</strong>
          </p>
          <ul>
            <li>
              <code>tbl_peliculas</code>
            </li>
            <li>
              <code>tbl_actores</code>
            </li>
            <li>
              <code>tbl_directores</code>
            </li>
            <li>
              <code>tbl_generos</code>
            </li>
          </ul>
        </details>

        <details>
          <summary>
            <strong>Dashboard</strong>
          </summary>
          <p>
            Permite al usuario visualizar estadísticas y métricas sobre el
            catálogo de películas.
          </p>
          <p>
            <strong>Tablas relacionadas:</strong>
          </p>
          <ul>
            <li>
              <code>tbl_peliculas</code>
            </li>
            <li>
              <code>tbl_actores</code>
            </li>
            <li>
              <code>tbl_directores</code>
            </li>
            <li>
              <code>tbl_generos</code>
            </li>
          </ul>
        </details>

        <details>
          <summary>
            <strong>¿Qué película ver hoy?</strong>
          </summary>
          <p>
            Permite al usuario ver recomendaciones basadas en sus preferencias de
            género, director y actor.
          </p>
          <p>
            <strong>Tablas relacionadas:</strong>
          </p>
          <ul>
            <li>
              <code>tbl_peliculas</code>
            </li>
            <li>
              <code>tbl_actores</code>
            </li>
            <li>
              <code>tbl_directores</code>
            </li>
            <li>
              <code>tbl_generos</code>
            </li>
          </ul>
        </details>
        <hr />
      </section>

      <section aria-labelledby="tablas-titulo">
        <h2 id="tablas-titulo">Resumen de Tablas del Sistema</h2>
        <table>
          <caption>
            Tablas de la base de datos Movix y los módulos que las utilizan
          </caption>
          <thead>
            <tr>
              <th scope="col">Tabla</th>
              <th scope="col">Módulos que la usan</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <code>tbl_peliculas</code>
              </td>
              <td>Consulta, Registrar, Dashboard, Recomendaciones</td>
            </tr>
            <tr>
              <td>
                <code>tbl_actores</code>
              </td>
              <td>Consulta, Registrar, Dashboard, Recomendaciones</td>
            </tr>
            <tr>
              <td>
                <code>tbl_directores</code>
              </td>
              <td>Consulta, Registrar, Dashboard, Recomendaciones</td>
            </tr>
            <tr>
              <td>
                <code>tbl_generos</code>
              </td>
              <td>Consulta, Registrar, Dashboard, Recomendaciones</td>
            </tr>
            <tr>
              <td>
                <code>tbl_watchlist</code>
              </td>
              <td>WatchList</td>
            </tr>
          </tbody>
        </table>
      </section>

      <section aria-labelledby="contacto-titulo" className="contacto-section">
        <div className="contacto-bg">
          <img
            src="/img/minecraft.png"
            alt=""
            className="contacto-bg-img"
            aria-hidden="true"
          />
          <div className="contacto-overlay" />
          <div className="contacto-inner">
            <ScrollAnimation>
              <ContactForm />
            </ScrollAnimation>
          </div>
        </div>
        <hr />
      </section>
    </>
  );
}
