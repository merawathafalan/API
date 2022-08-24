-- CreateEnum
CREATE TYPE "RevelationPlace" AS ENUM ('madinah', 'makkah');

-- CreateTable
CREATE TABLE "Surah" (
    "id" INTEGER NOT NULL,
    "revelation_place" "RevelationPlace" NOT NULL,
    "revelation_order" INTEGER NOT NULL,
    "bismillah_pre" BOOLEAN NOT NULL,
    "name_simple" TEXT NOT NULL,
    "name_complex" TEXT NOT NULL,
    "name_arabic" TEXT NOT NULL,
    "verses_count" INTEGER NOT NULL,
    "pages" INTEGER[],
    "slug" JSONB NOT NULL,
    "translated_name" JSONB NOT NULL,

    CONSTRAINT "Surah_pkey" PRIMARY KEY ("id")
);
