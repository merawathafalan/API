import { PrismaClient } from "@prisma/client";
import fetch from "node-fetch";

import { Chapter, Verse } from "~/src/types/quran";

async function main() {
  const prisma = new PrismaClient();

  console.log("[+] Fetch Quran data...");
  const quranFile =
    "https://github.com/merawathafalan/data-al-quran/raw/main/quran.json";
  const quran: Verse[] = (await fetch(quranFile).then((res) => res.json()))
    .verses;

  console.log("[+] Seeding Quran data...");
  await prisma.quran.createMany({
    data: [...quran],
    skipDuplicates: true,
  });

  console.log("[+] Fetch surah data...");
  const surahFile =
    "https://github.com/merawathafalan/data-al-quran/raw/main/surah.json";
  const surah: Chapter[] = (await fetch(surahFile).then((res) => res.json()))
    .chapters;

  console.log("[+] Seeding surah data...");
  await prisma.surah.createMany({
    data: [...surah],
    skipDuplicates: true,
  });
}

main();
