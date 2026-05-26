-- CreateTable
CREATE TABLE "people" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(200) NOT NULL,
    "is_director" BOOLEAN NOT NULL DEFAULT false,
    "is_actor" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "people_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "genres" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(100) NOT NULL,

    CONSTRAINT "genres_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "movies" (
    "id" SERIAL NOT NULL,
    "title" VARCHAR(300) NOT NULL,
    "year" SMALLINT,
    "runtime_min" SMALLINT,
    "imdb_rating" DECIMAL(3,1),
    "overview" TEXT,
    "poster_url" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "movies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "movie_directors" (
    "movie_id" INTEGER NOT NULL,
    "person_id" INTEGER NOT NULL,

    CONSTRAINT "movie_directors_pkey" PRIMARY KEY ("movie_id","person_id")
);

-- CreateTable
CREATE TABLE "movie_cast" (
    "movie_id" INTEGER NOT NULL,
    "person_id" INTEGER NOT NULL,
    "billing_order" SMALLINT NOT NULL DEFAULT 1,

    CONSTRAINT "movie_cast_pkey" PRIMARY KEY ("movie_id","person_id")
);

-- CreateTable
CREATE TABLE "movie_genres" (
    "movie_id" INTEGER NOT NULL,
    "genre_id" INTEGER NOT NULL,

    CONSTRAINT "movie_genres_pkey" PRIMARY KEY ("movie_id","genre_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "people_name_key" ON "people"("name");

-- CreateIndex
CREATE INDEX "idx_people_director" ON "people"("is_director");

-- CreateIndex
CREATE INDEX "idx_people_actor" ON "people"("is_actor");

-- CreateIndex
CREATE UNIQUE INDEX "genres_name_key" ON "genres"("name");

-- CreateIndex
CREATE INDEX "idx_year" ON "movies"("year");

-- CreateIndex
CREATE INDEX "idx_rating" ON "movies"("imdb_rating");

-- CreateIndex
CREATE INDEX "idx_cast_person" ON "movie_cast"("person_id");

-- AddForeignKey
ALTER TABLE "movie_directors" ADD CONSTRAINT "movie_directors_movie_id_fkey" FOREIGN KEY ("movie_id") REFERENCES "movies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "movie_directors" ADD CONSTRAINT "movie_directors_person_id_fkey" FOREIGN KEY ("person_id") REFERENCES "people"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "movie_cast" ADD CONSTRAINT "movie_cast_movie_id_fkey" FOREIGN KEY ("movie_id") REFERENCES "movies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "movie_cast" ADD CONSTRAINT "movie_cast_person_id_fkey" FOREIGN KEY ("person_id") REFERENCES "people"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "movie_genres" ADD CONSTRAINT "movie_genres_movie_id_fkey" FOREIGN KEY ("movie_id") REFERENCES "movies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "movie_genres" ADD CONSTRAINT "movie_genres_genre_id_fkey" FOREIGN KEY ("genre_id") REFERENCES "genres"("id") ON DELETE CASCADE ON UPDATE CASCADE;
