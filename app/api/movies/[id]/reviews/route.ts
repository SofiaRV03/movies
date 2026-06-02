import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getSession } from '@/lib/auth';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const id = parseInt((await params).id, 10);
  if (isNaN(id)) {
    return NextResponse.json({ error: 'ID inválido' }, { status: 400 });
  }

  const reviews = await prisma.review.findMany({
    where: { movieId: id },
    include: { user: { select: { id: true, name: true } } },
    orderBy: { createdAt: 'desc' },
  });

  const movixRating =
    reviews.length > 0
      ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
      : null;

  return NextResponse.json({
    reviews: reviews.map((r) => ({
      id: r.id,
      rating: r.rating,
      comment: r.comment,
      createdAt: r.createdAt.toISOString(),
      user: { id: r.user.id, name: r.user.name },
    })),
    movixRating,
    totalReviews: reviews.length,
  });
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  const id = parseInt((await params).id, 10);
  if (isNaN(id)) {
    return NextResponse.json({ error: 'ID inválido' }, { status: 400 });
  }

  const movie = await prisma.movie.findUnique({ where: { id } });
  if (!movie) {
    return NextResponse.json({ error: 'Película no encontrada' }, { status: 404 });
  }

  const body = await request.json();
  const rating = parseInt(body.rating, 10);
  const comment = typeof body.comment === 'string' ? body.comment.trim() : '';

  if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
    return NextResponse.json({ error: 'La calificación debe ser un número entre 1 y 5' }, { status: 400 });
  }

  if (!comment || comment.length < 2 || comment.length > 1000) {
    return NextResponse.json({ error: 'El comentario debe tener entre 2 y 1000 caracteres' }, { status: 400 });
  }

  const review = await prisma.review.create({
    data: {
      movieId: id,
      userId: session.userId,
      rating,
      comment,
    },
    include: { user: { select: { id: true, name: true } } },
  });

  return NextResponse.json({
    id: review.id,
    rating: review.rating,
    comment: review.comment,
    createdAt: review.createdAt.toISOString(),
    user: { id: review.user.id, name: review.user.name },
  }, { status: 201 });
}
