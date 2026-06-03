UPDATE movies SET imdb_rating = imdb_rating * 10 WHERE imdb_rating < 10 AND imdb_rating IS NOT NULL;

