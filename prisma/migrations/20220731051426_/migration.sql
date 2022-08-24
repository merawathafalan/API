/*
  Warnings:

  - You are about to drop the column `surah_number` on the `Quran` table. All the data in the column will be lost.
  - Added the required column `sajdah_number` to the `Quran` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Quran" DROP COLUMN "surah_number",
ADD COLUMN     "sajdah_number" INTEGER NOT NULL;
