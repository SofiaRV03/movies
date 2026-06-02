import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { requireAdmin } from '@/lib/auth';

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string; reviewId: string }> }
) {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: 'Acceso denegado' }, { status: 403 });
  }

  const movieId = parseInt((await params).id, 10);
  const reviewId = parseInt((await params).reviewId, 10);

  if (isNaN(movieId) || isNaN(reviewId)) {
    return NextResponse.json({ error: 'ID inválido' }, { status: 400 });
  }

  const review = await prisma.review.findUnique({
    where: { id: reviewId },
  });

  if (!review || review.movieId !== movieId) {
    return NextResponse.json({ error: 'Reseña no encontrada' }, { status: 404 });
  }

  await prisma.review.delete({ where: { id: reviewId } });

  return NextResponse.json({ success: true });
}
