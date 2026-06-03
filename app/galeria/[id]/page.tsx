import { prisma } from '@/lib/db';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import MovieDetailClient from './MovieDetailClient';

interface Props {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ page?: string }>;
}

export default async function MovieDetailPage({ params, searchParams }: Props) {
  const { page } = await searchParams;
  const id = parseInt((await params).id, 10);
  if (isNaN(id)) notFound();

  const movie = await prisma.movie.findUnique({
    where: { id },
    include: {
      genres: { include: { genre: true } },
      directors: { include: { person: true } },
      cast: { include: { person: true }, orderBy: { billingOrder: 'asc' } },
      reviews: {
        include: { user: { select: { id: true, name: true } } },
        orderBy: { createdAt: 'desc' },
      },
    },
  });

  if (!movie) notFound();

  const movixRating =
    movie.reviews.length > 0
      ? (movie.reviews.reduce((sum, r) => sum + r.rating, 0) / movie.reviews.length).toFixed(1)
      : null;

  const data = {
    id: movie.id,
    title: movie.title,
    year: movie.year,
    runtimeMin: movie.runtimeMin,
    imdbRating: movie.imdbRating?.toString() ?? null,
    movixRating,
    overview: movie.overview,
    posterUrl: movie.posterUrl,
    genres: movie.genres.map((g) => g.genre.name),
    directors: movie.directors.map((d) => d.person.name),
    cast: movie.cast.map((c) => ({
      name: c.person.name,
      billingOrder: c.billingOrder,
    })),
    reviews: movie.reviews.map((r) => ({
      id: r.id,
      rating: r.rating,
      comment: r.comment,
      createdAt: r.createdAt.toISOString(),
      user: { id: r.user.id, name: r.user.name },
    })),
    totalReviews: movie.reviews.length,
  };

  return (
    <>
      <section className="fade-in-up" style={{ paddingBottom: 0 }}>
        <Link
          href={page ? `/galeria?page=${page}` : "/galeria"}
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
