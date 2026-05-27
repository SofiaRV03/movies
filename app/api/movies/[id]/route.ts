import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const id = parseInt((await params).id, 10);
  if (isNaN(id)) {
    return NextResponse.json({ error: 'ID inválido' }, { status: 400 });
  }

  const movie = await prisma.movie.findUnique({
    where: { id },
    include: {
      genres: { include: { genre: true } },
      directors: { include: { person: true } },
      cast: { include: { person: true }, orderBy: { billingOrder: 'asc' } },
    },
  });

  if (!movie) {
    return NextResponse.json({ error: 'Película no encontrada' }, { status: 404 });
  }

  return NextResponse.json({
    id: movie.id,
    title: movie.title,
    year: movie.year,
    runtimeMin: movie.runtimeMin,
    imdbRating: movie.imdbRating?.toString(),
    overview: movie.overview,
    posterUrl: movie.posterUrl,
    genres: movie.genres.map((g) => g.genre.name),
    directors: movie.directors.map((d) => d.person.name),
    cast: movie.cast.map((c) => ({
      id: c.person.id,
      name: c.person.name,
      billingOrder: c.billingOrder,
    })),
  });
}
