import { NextApiRequest, NextApiResponse } from "next";
import { assign, createMachine, interpret } from "xstate";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const counterService = interpret(counterMachine).start();

  counterService.send("INC");
  counterService.send("INC");
  counterService.send("INC");
  counterService.send("INC");
  counterService.send("INC");

  return res.json({ ok: counterService.state.context.count });
}

const counterMachine = createMachine({
  id: "counter",
  tsTypes: {} as import("./state.typegen").Typegen0,
  schema: {
    events: {} as { type: "INC" } | { type: "DEC" },
    context: {} as {
      count: number;
    },
  },
  initial: "active",
  context: { count: 0 },
  states: {
    active: {
      on: {
        INC: {
          actions: assign({ count: (context) => context.count + 1 }),
        },
        DEC: {
          actions: assign({ count: (context) => context.count - 1 }),
        },
      },
    },
  },
});
