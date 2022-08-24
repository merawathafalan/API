import type { NextApiRequest, NextApiResponse } from "next";
import { interpret } from "xstate";
import { waitFor } from "xstate/lib/waitFor";

import { quizMachine } from "~/src/machine/quizMachine";

export default async function quizHandler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { mode, amount, select } = req.query as {
    mode: string;
    amount: string;
    select: string;
  };

  // const quizService = interpret(quizMachine).onTransition((state) =>
  //   console.log(state.value),
  // );

  const quizService = interpret(quizMachine);

  quizService.start();

  quizService.send({
    type: "REQUEST",
    query: { mode, amount, select },
    res,
  });

  await waitFor(quizService, (state) => state.done == true);

  // res
  //   .status(200)
  //   .json({ state: quizService.state, value: quizService.state.value });
}
