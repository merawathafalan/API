import copy from "fast-copy";
import { omit, pullAt, random, shuffle, sortBy, uniq } from "lodash";
import { z } from "zod";

import { prismaClient } from "~/src/lib/prisma";

import logger from "../utils/logger";
import { QuizContext } from "./type";

export const validateSelect = (context: QuizContext) => {
  const { select } = context.query;

  const SelectIsRequired = z
    .string({ required_error: "Select tidak boleh kosong" })
    .safeParse(select);

  if (!SelectIsRequired.success) {
    return Promise.reject(SelectIsRequired.error.issues[0].message);
  }

  const splitSelect = sortBy(
    uniq(
      SelectIsRequired.data.split(",").map((item: string) => parseInt(item)),
    ),
  );

  const SelectIsArray = z
    .array(
      z.number({
        invalid_type_error: "Select harus berupa array angka",
      }),
    )
    .safeParse(splitSelect);

  if (!SelectIsArray.success) {
    return Promise.reject(SelectIsArray.error.issues[0].message);
  }

  const maxLimit = context.mode === "juz" ? 30 : 114;

  const SelectIsInLimit = z
    .array(
      z
        .number()
        .max(maxLimit, {
          message: `Select pada mode ${context.mode} tidak boleh lebih dari ${maxLimit}`,
        })
        .min(1, {
          message: `Select pada mode ${context.mode} tidak boleh kurang dari 1`,
        }),
    )
    .safeParse(splitSelect);

  if (!SelectIsInLimit.success) {
    return Promise.reject(SelectIsInLimit.error.issues[0].message);
  }

  // surah with ayat less than < 5
  // SELECT chapter_id, COUNT(*) FROM "Quran" GROUP BY chapter_id HAVING COUNT(*) < 5 ORDER BY COUNT(*);
  const surahWithAyahLessThan5 = [103, 106, 108, 110, 112];
  if (context.mode == "surah" && SelectIsInLimit.data.length === 1) {
    if (surahWithAyahLessThan5.includes(SelectIsInLimit.data[0])) {
      return Promise.reject(
        "Surah dengan jumlah ayat kurang dari 5 tidak dapat dijadikan soal",
      );
    }
  }

  return Promise.resolve(splitSelect);
};

export const validateAmount = (context: QuizContext) => {
  const { amount } = context.query;

  const AmountIsRequired = z
    .string({ required_error: "Amount tidak boleh kosong" })
    .safeParse(amount);

  if (!AmountIsRequired.success) {
    return Promise.reject(AmountIsRequired.error.issues[0].message);
  }

  const AmountIsNumber = z
    .number({ invalid_type_error: "Amount harus berupa angka" })
    .safeParse(parseFloat(AmountIsRequired.data));

  if (!AmountIsNumber.success) {
    return Promise.reject(AmountIsNumber.error.issues[0].message);
  }

  return Promise.resolve(AmountIsNumber.data);
};

export const validateMode = (context: QuizContext) => {
  const { mode } = context.query;
  if (mode === undefined || mode === "") {
    return Promise.reject("Mode tidak boleh kosong");
  }

  const ModeEnum = z.enum(["juz", "surah"]).safeParse(mode.toLowerCase());

  if (!ModeEnum.success) {
    return Promise.reject("Mode tidak valid, gunakan juz atau surah");
  }

  return Promise.resolve(ModeEnum.data);
};

export const getQuranData = async (context: QuizContext) => {
  try {
    if (context.mode === "juz") {
      const data = await prismaClient.quran.findMany({
        where: {
          juz_number: { in: context.select },
        },
      });

      return Promise.resolve(data);
    }

    const data = await prismaClient.quran.findMany({
      where: {
        chapter_id: { in: context.select },
      },
    });

    return Promise.resolve(data);
  } catch (error) {
    return Promise.reject(error);
  }
};

export const createQuestion = async (context: QuizContext) => {
  const { amount } = context;

  const result: Result[] = [];

  for (let i = 0; i < (amount as number); i++) {
    result.push(QuestionFactory(context, i));
  }

  return Promise.resolve(result);
};

const QuestionFactory = (context: QuizContext, index: number) => {
  const quranRaw = copy(
    (context as Required<Pick<QuizContext, "quranRaw">>).quranRaw,
  );

  const result: Result = {
    id: index,
  };

  const randomQuestionId = random(1, quranRaw.length - 2); // exclude first and last index for the answer
  // logger.info(`Random Question Id: ${randomQuestionId}`);

  result.question = {
    text: quranRaw[randomQuestionId].text_imlaei,
    meta: omit(quranRaw[randomQuestionId], ["text_imlaei", "text_uthmani"]),
  };
  // logger.info("Succes create question");

  const AMOUNT_OPTION = 4;
  const randomAnswerId = randomQuestionId + 1;
  const trueOption: Result["options"] = [
    {
      value: 1,
      option: quranRaw[randomAnswerId].text_imlaei,
    },
  ];
  // logger.info("Succes create answer");
  pullAt(quranRaw, [randomQuestionId, randomAnswerId]); // remove the question from the array

  const falseOption: Result["options"] = [];
  for (let i = 0; i < AMOUNT_OPTION - 1; i++) {
    const randomQuestionId = random(0, quranRaw.length - 1);
    // logger.info(`Random question id ${randomQuestionId}`);
    falseOption.push({
      value: 0,
      option: quranRaw[randomQuestionId].text_imlaei,
    });
    // logger.info(`Success create question ${i}`);
    pullAt(quranRaw, randomQuestionId);
  }

  result.options = shuffle([...trueOption, ...falseOption]);

  return result;
};

interface Result {
  id?: number;
  question?: {
    text: string;
    meta: object;
  };
  options?: {
    value: 0 | 1;
    option: string;
  }[];
}
