import type { NextApiRequest, NextApiResponse } from "next";
import { prismaClient } from "~/src/lib/prisma";

import { getRawData } from "~/src/utils/api";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  // const amount = 3;
  // const mode = "surah";
  // const select = [112, 113, 114];
  // const data = await getRawData({ select, mode, amount });
  const data = await prismaClient.quran.findMany({
    where: {
      chapter_id: { in: 12 },
    },
    take: 2,
  });

  res.status(200).json({ data });
}
