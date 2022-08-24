/*
  Warnings:

  - You are about to drop the column `pages` on the `Surah` table. All the data in the column will be lost.
  - You are about to drop the column `slug` on the `Surah` table. All the data in the column will be lost.
  - You are about to drop the column `translated_name` on the `Surah` table. All the data in the column will be lost.
  - Added the required column `pageEnd` to the `Surah` table without a default value. This is not possible if the table is not empty.
  - Added the required column `pageStart` to the `Surah` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Surah" DROP COLUMN "pages",
DROP COLUMN "slug",
DROP COLUMN "translated_name",
ADD COLUMN     "pageEnd" INTEGER NOT NULL,
ADD COLUMN     "pageStart" INTEGER NOT NULL;
