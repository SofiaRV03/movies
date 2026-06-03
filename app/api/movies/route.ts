import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { requireAdmin } from '@/lib/auth';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q')?.trim();
  const genre = searchParams.get('genre')?.trim();
  const page = Math.max(1, parseInt(searchParams.get('page') ?? '1', 10));
  const limit = Math.min(50, Math.max(1, parseInt(searchParams.get('limit') ?? '20', 10)));
  const skip = (page - 1) * limit;

  const where: Record<string, unknown> = {};

  if (query) {
    where.OR = [
      { title: { contains: query, mode: 'insensitive' } },
      { overview: { contains: query, mode: 'insensitive' } },
      { directors: { some: { person: { name: { contains: query, mode: 'insensitive' } } } } },
      { cast: { some: { person: { name: { contains: query, mode: 'insensitive' } } } } },
      { genres: { some: { genre: { name: { contains: query, mode: 'insensitive' } } } } },
    ];
  }

  if (genre) {
    where.genres = { some: { genre: { name: { contains: genre, mode: 'insensitive' } } } };
  }

  const [movies, total] = await Promise.all([
    prisma.movie.findMany({
      where,
      skip,
      take: limit,
      orderBy: { year: 'desc' },
      include: {
        genres: { include: { genre: true } },
        directors: { include: { person: true } },
        cast: { include: { person: true }, orderBy: { billingOrder: 'asc' }, take: 5 },
      },
    }),
    prisma.movie.count({ where }),
  ]);

  return NextResponse.json({
    movies: movies.map((m) => ({
      id: m.id,
      title: m.title,
      year: m.year,
      runtimeMin: m.runtimeMin,
      imdbRating: m.imdbRating?.toString(),
      overview: m.overview,
      posterUrl: m.posterUrl,
      genres: m.genres.map((g) => g.genre.name),
      directors: m.directors.map((d) => ({ id: d.person.id, name: d.person.name })),
      cast: m.cast.map((c) => ({ id: c.person.id, name: c.person.name })),
    })),
    pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
  });
}

export async function POST(request: NextRequest) {
  await requireAdmin();

  const body = await request.json();
  const { title, year, runtimeMin, imdbRating, overview, posterUrl, genreIds, directorName, actorNames } = body;

  if (!title?.trim()) {
    return NextResponse.json({ error: 'El título es obligatorio' }, { status: 400 });
  }

  const movie = await prisma.movie.create({
    data: {
      title: title.trim(),
      year: year ? parseInt(year, 10) : null,
      runtimeMin: runtimeMin ? parseInt(runtimeMin, 10) : null,
      imdbRating: imdbRating ? parseInt(imdbRating, 10) : null,
      overview: overview?.trim() || null,
      posterUrl: posterUrl?.trim() || null,
    },
  });

  for (const genreId of (genreIds as number[] ?? [])) {
    await prisma.movieGenre.create({ data: { movieId: movie.id, genreId } });
  }

  if (directorName?.trim()) {
    const person = await prisma.person.upsert({
      where: { name: directorName.trim() },
      update: { isDirector: true },
      create: { name: directorName.trim(), isDirector: true },
    });
    await prisma.movieDirector.create({ data: { movieId: movie.id, personId: person.id } });
  }

  if (actorNames?.length) {
    for (let i = 0; i < actorNames.length; i++) {
      const name = actorNames[i]?.trim();
      if (!name) continue;
      const person = await prisma.person.upsert({
        where: { name },
        update: { isActor: true },
        create: { name, isActor: true },
      });
      await prisma.movieCast.create({
        data: { movieId: movie.id, personId: person.id, billingOrder: i + 1 },
      });
    }
  }

  const created = await prisma.movie.findUnique({
    where: { id: movie.id },
    include: {
      genres: { include: { genre: true } },
    },
  });

  return NextResponse.json({ id: created!.id, title: created!.title }, { status: 201 });
}
