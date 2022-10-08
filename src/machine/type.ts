import { Quran } from "@prisma/client";
import { NextApiResponse } from "next";

export interface QuizContext {
  query: {
    amount?: string;
    mode?: string;
    select?: string;
  };
  select?: number[];
  amount?: number;
  mode?: string;
  res?: NextApiResponse;
  error?: string;
  result?: any;
  quranRaw?: Quran[];
}

export type QuizEvent = {
  type: "REQUEST";
  query: QuizContext["query"];
  res: QuizContext["res"];
};

export type QuizTypestate =
  | {
      value: "idle";
      context: QuizContext;
    }
  | {
      value: "validation";
      context: QuizContext;
    }
  | {
      value: "error validation";
      context: QuizContext;
    }
  | {
      value: "success query";
      context: QuizContext;
    };
