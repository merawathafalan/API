/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Quran } from "@prisma/client";
import { assign, createMachine } from "xstate";

import {
  createQuestion,
  getQuranData,
  validateAmount,
  validateMode,
  validateSelect,
} from "./services";
import { QuizContext, QuizEvent } from "./type";

// xstate-ignore-next-line
/** @xstate-layout N4IgpgJg5mDOIC5QEcCuBLAXgOnRANmAMQBKAogIoCqZAygCqKgAOA9rOgC7qsB2TIAB6IAtAEYALAFYATNgDsAZgAM0iYoAcANgCcUnRoA0IAJ6jNY7GKkble+RJ07F8rQF83xtFmwA3AIb4eP7cfNgATmBocJyQRBB8YLi8vqwA1kkBQRAhYACCALasqLycAmwcofxIQqK2igoy8naOOmKSRqbmypaKilKuGjoyUhLKyooeXhg4WcFVEVGoMXFg4eGs4djM+CEAZpsFfoHz+UUlZTUVXDzVoMII4soa8laywxp9Dk4SxmaPkmU2HUyik-Q0Ay0Mk+EimIG8sxOOQWcwgAAJ-OdSvFEslUhljtlcgBZVgQMDldg3PgCB7iHRAnSuUZ9LRSGzs35dR4qXr9QbDUbjSaeeEzQnzW4S9GY4rYtYbLY7faHaUkskUq5Uqq00QSeRyZ5adRiHRaDQaMSKSR-USA4EqKSmiZSZ4SCQyOEItUopFoorknG8JLoFLpJLe1EhKWo-0ahCh1IAY2jfAA2soALqUyq3XUIa1yLRsy1SKEGV3u22PGRtKy6ctjPQMnRe8VR33ZOOBhWbba7TgHcJHSNI1O8aXdsAJsMpqoZ7Na3M0moPdnYFSgkbKY1Dcadf7iMYO0ESLRica1j2w0WjolVINJWCcXLYO+SlcsbV51eIDQyBo9HaVwDHNRQ9GrEQRgaBwXkUJplHkeQnQ0NsfBgTg0TQcJ-F4NFkX8R88XDbAMKw1AcLwgic2pO5agQJCGhLf82nGJkrWrGRQWwBkLScM15CtHQb2mHwk0iXJyJiW4iMTEjxLASTomfH8v2XOiHjEGQtAUVxlBGCRTXZLixE46RsEQz54PUfVzQ0G9RV4DV4Bqb08EIGidV-AEtGebAZAvfRhLEeQmU0SDFC0V4otaAxoTNfQ0MRe8pUiZTYggTzVPo8RTUsM8ehUdRIqQiKrQ3JoDCqlldBFUTko-CdY1lC4ss-HLRmiriRjEKKrQAg9zHK+DQuLMs+iCpKfRjP0A01NTaPzRQJGBaxrHgsDjQZLlD1rV5VDGWRmkM5pUNvdsx07PA0VgMBCCTS4Fq8+5EBsHTlvA+z5CGawHEgppou0dlQVsXQJBeKaO2y65npyrTrGBXyrVUVlSu5ERNCkCrbC4-lkMikSxR8XtwjRKH2ph7K6QvWwrGhK1auK0zuQvDdJGaZxz2QgDvqmsjsNw-CQn8NqNL-cZsCi5koS4tooUgxxsH0dktBUHnjSdKaFKU5YVIp792oeTQ5EMq0nWNACXC0TjyoGKzPjsKLZCkKbYFQJMkzgWApPCf4nqpu1+gUXqGWLC8XWsG2Gks2sXD6OwIfOrBRfzcRVbkALQR+EKwsGx5pFeeDbC04SHCheQPA8IA */
export const quizMachine = createMachine(
  // xstate-ignore-next-line
  /** @xstate-layout N4IgpgJg5mDOIC5QEcCuBLAXgOnRANmAMQBKAogIoCqZAygCqKgAOA9rOgC7qsB2TIAB6IAtAEYADGIDs2MQE4ATIoAcANgAsE+WokaANCACeojauwBmAKwr5VqxYkTpEi-IC+7w2izYAbgCG+HgB3HzYAE5gaHCckEQQfGC4vH6sANbJgcEQoWAAggC2rKi8nAJsHGH8SMaiijKWVjqKjm7OGmoqhsIIItK62B0yDlZqalaKVp7eGDjZIdWR0aix8WAREawR2Mz4oQBm24X+QYsFxaXltZVcPDWgveIKEtg2elbSbhYqLmqGJj6KkU2GkYg00k+ajcELMGhmIB88zOuSWCwgAAIApcykQAGr5AAyAEkACL5ehkDEAWQA8qSyBV2Hc+AIntIVFZsEpFGoxJJmg1XADRBYQV1OfzPsD+Rppl5EXNTjlQvdsMUIMQCSTyZSMbQyISyABhRg3ZnVNmieTA7By1RgyTyeR-EUIDQaSwNDTyNyKJxdNSKBFI7AwThYoyhdWsTWR0JEADiZHo+qoJHyAAkmVV7lb3Y45PIxA0XRIJooNOo3ZW1NhdNDJnK1PINCWQ0rw-HODG4wEo5wkymMQApKgALRzLIeQkQlZBP00GjFKjlKnBVjdYs9LkcLc5HLsKg7vi7-YTZD8YDKGMUU8ttSeFlknRczRUFhk-smbrEtt+cpWFIgb2NIJ44GeA6kHQAAKtIAHIGveeaPogf7yHaEjKCo656DoXwGHUfQ6Ngqi6ByUwulWwLgeqASZBiMSwEsADGUR5BinARKsWK8LAADuGy7OgLHpBiEQBLwiSFN2vGYrwqCFAARhsGJHBEjGrMx9xEJe14RmIyGsqhCCckWQE+vYFgWGoYKEYCKjlphH5kTyn7yrMviFPRYCabEapsWAHFcTxkkCUJLEABZgKJGIasQek3oZ5q5sZjxzmIpGKF8NrlroChmG6divOu1hiNC+56MeCqht5DFMax7FxJx3G+WFgk7FFMVifFulXjed4pdO+ZiGMbz+p0nSOG2Cj-ERrZcg40KuA0XT8mIngKrwsZwAIoZ4IQRkzk8-LjKCz6dBIvxTOCihuiIih2HaBEyDhHTwjVSroqq4RRA1kBHfmIjFU0VmreuAz3Q0sjWC0bTyB0XS0d9aIoliOLXCwFooelfQOCC2jTbhnIumI90-PWxYllTlblpWH2eciKpLPFgMmcDz7mRINg2soJbkyolP8o9wtaEGDOKr4KNqrAYCECxmMgLcD64xzIIyDZdgQt+9lodolPAq2Ew6OM0gS6G0tpUr2NWydAZ2pMvz8toZZzYCD22F6H7vlYf6TB5ksQWAEbnj28XdmzuPKK8bYIzaChuEowpEbT9auGbvo4ZMCi0ZB0bh7AqASZFkezu6rRyN7HKOa+Yg2Vu9jclITj+rZEKfrnwfdr2vkAFaoJgpe9K0GGOmbYxmyTz5umLciVpIs3SEvJYB6GeeK8rONl7NdovPHvrOv6Fi-l09YWJZfOto9la0XVvkNQFTW+SFbV8R1wmxRJUmsDJodyRiCllKqXUn5bSVtN623qBhSskIJovCXmCN2iBISvG5rYF0PwgK8jULfHyoDGpBWai-Xi4VOrRViqzIaKsy6aDtMWX03MxhBj5m6dQo8ph6BstIZ0rYPCfS8ngh+4RArBVaiQ9+AQDhxAiEPNCIJISfm1mYUaijuhEUkI9OhnJubLyws+XB9UtIENEaFN+QkVLqTALIhAo1ZCaCwpMaEn5VybnUVhDCPpOQwJXL7Da-CcB33wY-Qhz8xHtQ2NYkQDhSIQkmHoeBy8kEIFsoLbQWEW6jV9G4Ax98jGPwCMHXJ-lwE22OogNwL5HotgXkoM2nRWEtlBBwxwdcbBilXkqQJQiZwQLKX0JeMTYHxIRggu6REGxz1GrNCEWE5S0SiLANgfFrHPhjmKZ07xPyaDJkRcQzhQQOCmT8JQniOm+A2FsGRVCt4nRLJ6CEkhyINGsEk3kFghhdCTqNZalYzmD2uZAvoJZwRvBrp8b4vxyz3SAq8MUS9XB-iwuMVcm13BAA */

  {
    context: {
      res: undefined,
      query: {},
      error: undefined,
      amount: undefined,
      mode: undefined,
      select: undefined,
      result: undefined,
      quranRaw: undefined,
    },
    tsTypes: {} as import("./quizMachine.typegen").Typegen0,
    schema: { context: {} as QuizContext, events: {} as QuizEvent },
    predictableActionArguments: true,
    id: "quiz",
    initial: "idle",
    states: {
      idle: {
        on: {
          REQUEST: {
            actions: "assignQueryNextRes",
            target: "validation",
          },
        },
      },
      validation: {
        initial: "requested",
        states: {
          requested: {
            invoke: {
              src: validateAmount,
              id: "validateAmount",
              onDone: [
                {
                  actions: "assignAmount",
                  target: "valid amount",
                },
              ],
              onError: [
                {
                  actions: "assignError",
                  target: "#quiz.error validation",
                },
              ],
            },
          },
          "valid amount": {
            invoke: {
              src: validateMode,
              id: "validateMode",
              onDone: [
                {
                  actions: "assignMode",
                  target: "valid mode",
                },
              ],
              onError: [
                {
                  actions: "assignError",
                  target: "#quiz.error validation",
                },
              ],
            },
          },
          "valid mode": {
            invoke: {
              src: validateSelect,
              onDone: [
                {
                  actions: "assignSelect",
                  target: "valid select",
                },
              ],
              onError: [
                {
                  actions: "assignError",
                  target: "#quiz.error validation",
                },
              ],
            },
          },
          "valid select": {
            type: "final",
          },
        },
        onDone: {
          target: "get quran data",
        },
      },
      "error validation": {
        exit: (context, _) => {
          return context.res?.status(400).json({
            error: {
              type: "query validation error",
              description: context.error,
            },
          });
        },
        type: "final",
      },
      "get quran data": {
        invoke: {
          src: getQuranData,
          id: "get quran data",
          onDone: [
            {
              actions: "assignQuranRaw",
              target: "create question",
            },
          ],
        },
      },
      "create question": {
        invoke: {
          src: createQuestion,
          id: "create question",
          onDone: [
            {
              actions: "assignResult",
              target: "success query",
            },
          ],
        },
      },
      "success query": {
        exit: (context, _) => {
          const { amount, mode, select, result, quranRaw } = context;
          return context.res
            ?.status(200)
            .json({ amount, mode, select, result });
        },
        type: "final",
      },
    },
  },
  {
    actions: {
      assignQueryNextRes: assign<
        QuizContext,
        {
          type: "REQUEST";
          query: QuizContext["query"];
          res: QuizContext["res"];
        }
      >({
        query: (context, event) => event.query,
        res: (context, event) => event.res,
      }),
      assignError: assign({
        error: (_, event) => event.data as string,
      }),
      assignAmount: assign({
        amount: (_, event) => event.data as number,
      }),
      assignMode: assign({
        mode: (_, event) => event.data as string,
      }),
      assignSelect: assign({
        select: (_, event) => event.data as number[],
      }),
      assignQuranRaw: assign({
        quranRaw: (_, event) => event.data as Quran[],
      }),
      assignResult: assign({
        result: (_, event) => event.data as never,
      }),
    },
  },
);
