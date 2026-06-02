import { prisma } from "./lib/db.js";

// Check if any poster URLs contain commas
const movies = await prisma.movie.findMany({
  select: { id: true, title: true, posterUrl: true },
  where: { posterUrl: { contains: "," } },
  take: 5,
});

console.log("Movies with comma in posterUrl:");
for (const m of movies) {
  console.log(m.id, m.title);
  console.log("  Full URL:", m.posterUrl);
  console.log("  After split:", m.posterUrl?.split(",")[0]);
  console.log();
}

const totalWithComma = await prisma.movie.count({ where: { posterUrl: { contains: "," } } });
console.log("Total with comma:", totalWithComma);
const totalWithoutComma = await prisma.movie.count({ where: { posterUrl: { not: { contains: "," } } } });
console.log("Total without comma:", totalWithoutComma);

await prisma.$disconnect();
