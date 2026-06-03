import { prisma } from '@/lib/db';
import { notFound } from 'next/navigation';
import EditMovieClient from './EditMovieClient';

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditMoviePage({ params }: Props) {
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
    year: movie.year ?? undefined,
    runtimeMin: movie.runtimeMin ?? undefined,
    imdbRating: movie.imdbRating ? Number(movie.imdbRating) : undefined,
    overview: movie.overview ?? undefined,
    posterUrl: movie.posterUrl ?? undefined,
    genreIds: movie.genres.map((g) => g.genre.id),
    directorName: movie.directors[0]?.person.name ?? undefined,
    actorNames: movie.cast.map((c) => c.person.name),
  };

  return <EditMovieClient movie={data} />;
}
