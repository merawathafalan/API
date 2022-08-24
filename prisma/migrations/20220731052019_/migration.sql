/*
  Warnings:

  - Changed the type of `page_number` on the `Quran` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Quran" DROP COLUMN "page_number",
ADD COLUMN     "page_number" INTEGER NOT NULL,
ALTER COLUMN "sajdah_number" DROP NOT NULL;
