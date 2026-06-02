import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function BaseDeDatos() {
  const session = await getSession();

  if (!session || session.role !== "ADMIN") {
    redirect("/");
  }

  return (
    <>
      <span id="top" />
      <section>
        <span className="section-tag">Administración</span>
        <h2>Estructura de la Base de Datos</h2>
        <p className="section-desc" style={{ textAlign: "left", margin: "0.5rem 0 1.5rem" }}>
          A continuación se muestran las tablas que conforman el modelo relacional de Movix, con un registro de ejemplo por tabla.
        </p>

        <nav aria-label="Índice de tablas" className="table-index">
          <p className="table-index-label"><i className="bi bi-list-ul me-2" /><strong>Ir a una tabla:</strong></p>
          <div className="table-index-pills">
            <a href="#heading-movies" className="table-pill"><i className="bi bi-film me-1" />movies</a>
            <a href="#heading-genre" className="table-pill"><i className="bi bi-tags me-1" />genre</a>
            <a href="#heading-movie-genres" className="table-pill"><i className="bi bi-arrow-left-right me-1" />movie_genres</a>
            <a href="#heading-people" className="table-pill"><i className="bi bi-people me-1" />people</a>
            <a href="#heading-movie-cast" className="table-pill"><i className="bi bi-person-badge me-1" />movie_cast</a>
            <a href="#heading-movie-directors" className="table-pill"><i className="bi bi-camera-video me-1" />movie_directors</a>
            <a href="#heading-diagrama" className="table-pill table-pill-gold"><i className="bi bi-diagram-3 me-1" />Diagrama E-R</a>
          </div>
        </nav>
      </section>

      <section className="section-divider" aria-hidden="true" />

      <section aria-labelledby="heading-movies">
        <span className="section-tag">Tabla principal</span>
        <h2 id="heading-movies">Tabla: <code>movies</code></h2>
        <p>Tabla principal que almacena la información de cada película del catálogo.</p>
        <div className="table-wrap">
          <table>
            <caption><strong>movies</strong> — Campos y ejemplo de registro</caption>
            <thead>
              <tr>
                <th scope="col">id</th>
                <th scope="col">year</th>
                <th scope="col">title</th>
                <th scope="col">runtime_min</th>
                <th scope="col">created_at</th>
                <th scope="col">overview</th>
                <th scope="col">imdb_rating</th>
                <th scope="col">poster_url</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>1</td>
                <td>1994</td>
                <td>The Shawshank Redemption</td>
                <td>142</td>
                <td><time dateTime="2024-01-15">2024-01-15</time></td>
                <td>Two imprisoned men bond over years...</td>
                <td>9.3</td>
                <td><img src="/img/shawshank.jpg" alt="The Shawshank Redemption" width="80" /></td>
              </tr>
            </tbody>
            <tfoot>
              <tr>
                <td colSpan={8}><strong>Total de campos: 8</strong></td>
              </tr>
            </tfoot>
          </table>
        </div>
        <p><a href="#top">↑ Volver al índice</a></p>
      </section>

      <section className="section-divider" aria-hidden="true" />

      <section aria-labelledby="heading-genre">
        <span className="section-tag">Catálogo</span>
        <h2 id="heading-genre">Tabla: <code>genre</code></h2>
        <p>Catálogo de géneros cinematográficos disponibles en el sistema.</p>
        <div className="table-wrap">
          <table>
            <caption><strong>genre</strong> — Campos y ejemplo de registro</caption>
            <thead>
              <tr>
                <th scope="col">id</th>
                <th scope="col">name</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>1</td>
                <td>Drama</td>
              </tr>
            </tbody>
            <tfoot>
              <tr>
                <td colSpan={2}><strong>Total de campos: 2</strong></td>
              </tr>
            </tfoot>
          </table>
        </div>
        <p><a href="#top">↑ Volver al índice</a></p>
      </section>

      <section className="section-divider" aria-hidden="true" />

      <section aria-labelledby="heading-movie-genres">
        <span className="section-tag">Relación</span>
        <h2 id="heading-movie-genres">Tabla: <code>movie_genres</code></h2>
        <p>Tabla intermedia que resuelve la relación <strong>muchos a muchos</strong> entre películas y géneros.</p>
        <div className="table-wrap">
          <table>
            <caption><strong>movie_genres</strong> — Campos y ejemplo de registro</caption>
            <thead>
              <tr>
                <th scope="col">movie_id</th>
                <th scope="col">genre_id</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>1</td>
                <td>1</td>
              </tr>
            </tbody>
            <tfoot>
              <tr>
                <td colSpan={2}><strong>Total de campos: 2</strong></td>
              </tr>
            </tfoot>
          </table>
        </div>
        <p><a href="#top">↑ Volver al índice</a></p>
      </section>

      <section className="section-divider" aria-hidden="true" />

      <section aria-labelledby="heading-people">
        <span className="section-tag">Actores y directores</span>
        <h2 id="heading-people">Tabla: <code>people</code></h2>
        <p>Almacena actores y directores en una sola tabla; los campos <code>is_actor</code> e <code>is_director</code> determinan el rol de cada persona.</p>
        <div className="table-wrap">
          <table>
            <caption><strong>people</strong> — Campos y ejemplo de registro</caption>
            <thead>
              <tr>
                <th scope="col">id</th>
                <th scope="col">name</th>
                <th scope="col">is_actor</th>
                <th scope="col">is_director</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>1</td>
                <td>Tim Robbins</td>
                <td>True</td>
                <td>False</td>
              </tr>
            </tbody>
            <tfoot>
              <tr>
                <td colSpan={4}><strong>Total de campos: 4</strong></td>
              </tr>
            </tfoot>
          </table>
        </div>
        <p><a href="#top">↑ Volver al índice</a></p>
      </section>

      <section className="section-divider" aria-hidden="true" />

      <section aria-labelledby="heading-movie-cast">
        <span className="section-tag">Relación</span>
        <h2 id="heading-movie-cast">Tabla: <code>movie_cast</code></h2>
        <p>Tabla intermedia que relaciona películas con sus actores (<code>is_actor = True</code>). El campo <code>billing_order</code> indica el orden de crédito en pantalla.</p>
        <div className="table-wrap">
          <table>
            <caption><strong>movie_cast</strong> — Campos y ejemplo de registro</caption>
            <thead>
              <tr>
                <th scope="col">movie_id</th>
                <th scope="col">person_id</th>
                <th scope="col">billing_order</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>1</td>
                <td>1</td>
                <td>1</td>
              </tr>
            </tbody>
            <tfoot>
              <tr>
                <td colSpan={3}><strong>Total de campos: 3</strong></td>
              </tr>
            </tfoot>
          </table>
        </div>
        <p><a href="#top">↑ Volver al índice</a></p>
      </section>

      <section className="section-divider" aria-hidden="true" />

      <section aria-labelledby="heading-movie-directors">
        <span className="section-tag">Relación</span>
        <h2 id="heading-movie-directors">Tabla: <code>movie_directors</code></h2>
        <p>Tabla intermedia que relaciona películas con sus directores (<code>is_director = True</code>).</p>
        <div className="table-wrap">
          <table>
            <caption><strong>movie_directors</strong> — Campos y ejemplo de registro</caption>
            <thead>
              <tr>
                <th scope="col">movie_id</th>
                <th scope="col">person_id</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>1</td>
                <td>2</td>
              </tr>
            </tbody>
            <tfoot>
              <tr>
                <td colSpan={2}><strong>Total de campos: 2</strong></td>
              </tr>
            </tfoot>
          </table>
        </div>
        <p><a href="#top">↑ Volver al índice</a></p>
      </section>

      <section className="section-divider" aria-hidden="true" />

      <section aria-labelledby="heading-resumen">
        <span className="section-tag">Resumen</span>
        <h2 id="heading-resumen">Resumen del Modelo Relacional</h2>
        <div className="table-wrap">
          <table>
            <caption>Visión general de todas las tablas y sus relaciones</caption>
            <thead>
              <tr>
                <th scope="col">Tabla</th>
                <th scope="col">Tipo</th>
                <th scope="col">Campos</th>
                <th scope="col">Descripción</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><code>movies</code></td>
                <td>Entidad principal</td>
                <td>8</td>
                <td>Catálogo de películas</td>
              </tr>
              <tr>
                <td><code>genre</code></td>
                <td>Entidad principal</td>
                <td>2</td>
                <td>Géneros cinematográficos</td>
              </tr>
              <tr>
                <td><code>people</code></td>
                <td>Entidad principal</td>
                <td>4</td>
                <td>Actores y directores</td>
              </tr>
              <tr>
                <td><code>movie_genres</code></td>
                <td>Relación N:M</td>
                <td>2</td>
                <td>Películas ↔ Géneros</td>
              </tr>
              <tr>
                <td><code>movie_cast</code></td>
                <td>Relación N:M</td>
                <td>3</td>
                <td>Películas ↔ Actores</td>
              </tr>
              <tr>
                <td><code>movie_directors</code></td>
                <td>Relación N:M</td>
                <td>2</td>
                <td>Películas ↔ Directores</td>
              </tr>
            </tbody>
            <tfoot>
              <tr>
                <td colSpan={4}><strong>Total: 6 tablas — 21 campos en total</strong></td>
              </tr>
            </tfoot>
          </table>
        </div>
      </section>

      <section className="section-divider" aria-hidden="true" />

      <section aria-labelledby="heading-diagrama">
        <span className="section-tag">Diagrama</span>
        <h2 id="heading-diagrama">Diagrama Entidad–Relación</h2>
        <div className="table-wrap" style={{ padding: "1rem" }}>
          <figure style={{ margin: 0 }}>
            <img src="/img/diagrama-bd.png"
                alt="Diagrama entidad-relación del Sistema Movix: muestra las tablas movies, genre, people y sus tablas intermedias movie_genres, movie_cast y movie_directors"
                width="100%" />
            <figcaption style={{ marginTop: "0.8rem" }}>
              <em>Diagrama E-R — Sistema Movix, versión 2026.</em>
              Modelo relacional con 3 entidades principales y 3 tablas de relación N:M.
            </figcaption>
          </figure>
        </div>
        <p><a href="#top">↑ Volver al índice</a></p>
      </section>
    </>
  );
}
