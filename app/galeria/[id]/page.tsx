import { prisma } from '@/lib/db';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import MovieDetailClient from './MovieDetailClient';

interface Props {
  params: Promise<{ id: string }>;
}

export default async function MovieDetailPage({ params }: Props) {
  const id = parseInt((await params).id, 10);
  if (isNaN(id)) notFound();

  const movie = await prisma.movie.findUnique({
    where: { id },
    include: {
      genres: { include: { genre: true } },
      directors: { include: { person: true } },
      cast: { include: { person: true }, orderBy: { billingOrder: 'asc' } },
    },
  });

  if (!movie) notFound();

  const data = {
    id: movie.id,
    title: movie.title,
    year: movie.year,
    runtimeMin: movie.runtimeMin,
    imdbRating: movie.imdbRating?.toString() ?? null,
    overview: movie.overview,
    posterUrl: movie.posterUrl,
    genres: movie.genres.map((g) => g.genre.name),
    directors: movie.directors.map((d) => d.person.name),
    cast: movie.cast.map((c) => ({
      name: c.person.name,
      billingOrder: c.billingOrder,
    })),
  };

  return (
    <>
      <section className="fade-in-up" style={{ paddingBottom: 0 }}>
        <Link
          href="/galeria"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.5rem",
            color: "var(--gold)",
            fontFamily: "var(--font-display)",
            fontSize: "0.9rem",
            marginBottom: "1.5rem",
          }}
        >
          <i className="bi bi-arrow-left" />
          Volver a la galería
        </Link>
      </section>

      <MovieDetailClient movie={data} />
    </>
  );
}
