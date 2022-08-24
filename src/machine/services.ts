import { sortBy, uniq } from "lodash";
import { z } from "zod";

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
