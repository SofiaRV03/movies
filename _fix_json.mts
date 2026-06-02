import { readFileSync, writeFileSync } from "fs";

const raw = readFileSync("public/data/peliculas.json", "utf-8");
const data = JSON.parse(raw);

let fixed = 0;
for (const movie of data) {
  if (!movie.poster_url) continue;
  const idx = movie.poster_url.lastIndexOf(".jpg");
  if (idx === -1) continue;
  const clean = movie.poster_url.substring(0, idx + 4);
  if (clean !== movie.poster_url) {
    movie.poster_url = clean;
    fixed++;
  }
}

writeFileSync("public/data/peliculas.json", JSON.stringify(data, null, 2));
console.log(`Fixed ${fixed} entries in peliculas.json`);
