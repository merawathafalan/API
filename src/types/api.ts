export type QuizQuery = {
  amount: number;
  mode: quranType;
  select: number[];
};

export type quranType = "surah" | "juz";
