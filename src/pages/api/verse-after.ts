import type { NextApiRequest, NextApiResponse } from "next";

import { getRawData } from "~/src/utils/api";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const amount = 3;
  const mode = "surah";
  const select = [112, 113, 114];
  const data = await getRawData({ select, mode, amount });
  res.status(200).json({ data });
}
