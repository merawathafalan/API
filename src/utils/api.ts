import { prismaClient } from "~/src/lib/prisma";

import { QuizQuery } from "../types/api";
import { Verse } from "../types/quran";

export const getRawData = async ({ select, mode, amount }: QuizQuery) => {
  let data: Verse[];

  // if surah, select where chapter_id
  if (mode == "surah") {
    data = await prismaClient.quran.findMany({
      where: {
        chapter_id: { in: select },
      },
      take: amount,
    });
    return data;
  }

  // if surah, select where juz id
  if (mode == "juz") {
    data = await prismaClient.quran.findMany({
      where: {
        juz_number: { in: select },
      },
      take: amount,
    });
    return data;
  }

  return data;
};
