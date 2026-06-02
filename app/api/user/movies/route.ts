import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getSession } from '@/lib/auth';

export async function GET(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const movieId = searchParams.get('movieId');
  const listType = searchParams.get('listType');

  if (movieId) {
    const entries = await prisma.userMovie.findMany({
      where: { userId: session.userId, movieId: parseInt(movieId, 10) },
      select: { movieId: true, listType: true },
    });
    return NextResponse.json({ entries });
  }

  if (!listType) {
    return NextResponse.json({ error: 'Se requiere listType' }, { status: 400 });
  }

  const entries = await prisma.userMovie.findMany({
    where: { userId: session.userId, listType },
    include: {
      movie: {
        include: {
          genres: { include: { genre: true } },
          directors: { include: { person: true } },
          cast: { include: { person: true }, orderBy: { billingOrder: 'asc' } },
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  return NextResponse.json({
    entries: entries.map((e) => ({
      id: e.id,
      listType: e.listType,
      createdAt: e.createdAt.toISOString(),
      movie: {
        id: e.movie.id,
        title: e.movie.title,
        year: e.movie.year,
        imdbRating: e.movie.imdbRating?.toString() ?? null,
        overview: e.movie.overview,
        posterUrl: e.movie.posterUrl,
        genres: e.movie.genres.map((g) => g.genre.name),
        directors: e.movie.directors.map((d) => d.person.name),
        cast: e.movie.cast.map((c) => ({ name: c.person.name, billingOrder: c.billingOrder })),
      },
    })),
  });
}

export async function POST(request: Request) {
  const session = await getSession();
  if (!session || session.role !== 'USER') {
    return NextResponse.json({ error: 'No autorizado' }, { status: 403 });
  }

  const body = await request.json();
  const movieId = parseInt(body.movieId, 10);
  const listType = body.listType;

  if (isNaN(movieId)) {
    return NextResponse.json({ error: 'ID de película inválido' }, { status: 400 });
  }

  if (listType !== 'WATCHED' && listType !== 'WATCHLIST') {
    return NextResponse.json({ error: 'Tipo de lista inválido' }, { status: 400 });
  }

  const movie = await prisma.movie.findUnique({ where: { id: movieId } });
  if (!movie) {
    return NextResponse.json({ error: 'Película no encontrada' }, { status: 404 });
  }

  const existing = await prisma.userMovie.findUnique({
    where: { userId_movieId_listType: { userId: session.userId, movieId, listType } },
  });

  if (existing) {
    return NextResponse.json({ error: 'Ya está en esta lista' }, { status: 409 });
  }

  const entry = await prisma.userMovie.create({
    data: { userId: session.userId, movieId, listType },
  });

  return NextResponse.json({ id: entry.id, movieId: entry.movieId, listType: entry.listType }, { status: 201 });
}

export async function DELETE(request: Request) {
  const session = await getSession();
  if (!session || session.role !== 'USER') {
    return NextResponse.json({ error: 'No autorizado' }, { status: 403 });
  }

  const body = await request.json();
  const movieId = parseInt(body.movieId, 10);
  const listType = body.listType;

  if (isNaN(movieId) || (listType !== 'WATCHED' && listType !== 'WATCHLIST')) {
    return NextResponse.json({ error: 'Solicitud inválida' }, { status: 400 });
  }

  const entry = await prisma.userMovie.findUnique({
    where: { userId_movieId_listType: { userId: session.userId, movieId, listType } },
  });

  if (!entry) {
    return NextResponse.json({ error: 'No encontrado' }, { status: 404 });
  }

  await prisma.userMovie.delete({ where: { id: entry.id } });

  return NextResponse.json({ success: true });
}
