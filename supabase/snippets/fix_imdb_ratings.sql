-- Fix IMDB ratings that were stored on 1-10 scale (e.g. 8.0) instead of
-- the intended 0-100 scale (e.g. 80.0). This happens when the source JSON
-- had single-digit values like "imdb_rating": 8 instead of 80.
-- The frontend divides by 10 to display, so DB must store on 0-100 scale.

UPDATE movies SET imdb_rating = imdb_rating * 10 WHERE imdb_rating < 10 AND imdb_rating IS NOT NULL;
