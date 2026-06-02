import { prisma } from "./lib/db.js";

const movies = await prisma.movie.findMany({ select: { posterUrl: true, title: true }, where: { posterUrl: { not: null } }, take: 300 });
const endings = new Set();
let allHaveJpg = true;
for (const m of movies) {
  if (!m.posterUrl) continue;
  if (!m.posterUrl.includes(".jpg")) {
    allHaveJpg = false;
    console.log("NO .jpg:", m.posterUrl.substring(0, 100));
  }
  const idx = m.posterUrl.lastIndexOf(".jpg");
  if (idx >= 0) {
    const after = m.posterUrl.substring(idx + 4);
    if (after.length > 1) endings.add(after.substring(0, 40));
  }
}
console.log("All have .jpg:", allHaveJpg);
console.log("Endings after .jpg:", [...endings]);
console.log("Total checked:", movies.length);

await prisma.$disconnect();
