/*
  Warnings:

  - You are about to drop the `Alquran` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "Alquran";

-- CreateTable
CREATE TABLE "Quran" (
    "id" INTEGER NOT NULL,
    "verse_number" INTEGER NOT NULL,
    "verse_key" TEXT NOT NULL,
    "juz_number" INTEGER NOT NULL,
    "hizb_number" INTEGER NOT NULL,
    "rub_el_hizb_number" INTEGER NOT NULL,
    "ruku_number" INTEGER NOT NULL,
    "manzil_number" INTEGER NOT NULL,
    "surah_number" INTEGER NOT NULL,
    "chapter_id" INTEGER NOT NULL,
    "text_imlaei" TEXT NOT NULL,
    "text_uthmani" TEXT NOT NULL,
    "page_number" TEXT NOT NULL,

    CONSTRAINT "Quran_pkey" PRIMARY KEY ("id")
);
