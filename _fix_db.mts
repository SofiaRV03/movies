import { prisma } from "./lib/db.js";

const movies = await prisma.movie.findMany({
  select: { id: true, title: true, posterUrl: true },
  where: { posterUrl: { not: null } },
});

let fixed = 0;
for (const m of movies) {
  if (!m.posterUrl) continue;
  const idx = m.posterUrl.lastIndexOf(".jpg");
  if (idx === -1) continue;
  const cleanUrl = m.posterUrl.substring(0, idx + 4);
  if (cleanUrl !== m.posterUrl) {
    await prisma.movie.update({
      where: { id: m.id },
      data: { posterUrl: cleanUrl },
    });
    fixed++;
    if (fixed <= 3) console.log(`Fixed: ${m.id} ${m.title}`);
  }
}

console.log(`\nFixed ${fixed} movies`);
await prisma.$disconnect();
