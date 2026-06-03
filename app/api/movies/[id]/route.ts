import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { requireAdmin } from '@/lib/auth';

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
    genreIds: movie.genres.map((g) => g.genre.id),
    directorName: movie.directors[0]?.person.name ?? null,
    actorNames: movie.cast.map((c) => c.person.name),
  });
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  await requireAdmin();

  const id = parseInt((await params).id, 10);
  if (isNaN(id)) {
    return NextResponse.json({ error: 'ID inválido' }, { status: 400 });
  }

  const body = await request.json();
  const { title, year, runtimeMin, imdbRating, overview, posterUrl, genreIds, directorName, actorNames } = body;

  if (!title?.trim()) {
    return NextResponse.json({ error: 'El título es obligatorio' }, { status: 400 });
  }

  const existing = await prisma.movie.findUnique({ where: { id } });
  if (!existing) {
    return NextResponse.json({ error: 'Película no encontrada' }, { status: 404 });
  }

  await prisma.movieGenre.deleteMany({ where: { movieId: id } });
  await prisma.movieDirector.deleteMany({ where: { movieId: id } });
  await prisma.movieCast.deleteMany({ where: { movieId: id } });

  await prisma.movie.update({
    where: { id },
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
    await prisma.movieGenre.create({ data: { movieId: id, genreId } });
  }

  if (directorName?.trim()) {
    const person = await prisma.person.upsert({
      where: { name: directorName.trim() },
      update: { isDirector: true },
      create: { name: directorName.trim(), isDirector: true },
    });
    await prisma.movieDirector.create({ data: { movieId: id, personId: person.id } });
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
        data: { movieId: id, personId: person.id, billingOrder: i + 1 },
      });
    }
  }

  const updated = await prisma.movie.findUnique({
    where: { id },
    include: {
      genres: { include: { genre: true } },
      directors: { include: { person: true } },
      cast: { include: { person: true }, orderBy: { billingOrder: 'asc' } },
    },
  });

  return NextResponse.json({
    id: updated!.id,
    title: updated!.title,
    year: updated!.year,
    runtimeMin: updated!.runtimeMin,
    imdbRating: updated!.imdbRating?.toString(),
  });
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  await requireAdmin();

  const id = parseInt((await params).id, 10);
  if (isNaN(id)) {
    return NextResponse.json({ error: 'ID inválido' }, { status: 400 });
  }

  const existing = await prisma.movie.findUnique({ where: { id } });
  if (!existing) {
    return NextResponse.json({ error: 'Película no encontrada' }, { status: 404 });
  }

  await prisma.movie.delete({ where: { id } });

  return NextResponse.json({ message: 'Película eliminada' });
}
