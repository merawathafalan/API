/* eslint-disable @typescript-eslint/no-unused-vars */
import { sortBy, sortedUniq, uniq } from "lodash";
import { NextApiResponse } from "next";
import { assign, createMachine } from "xstate";
import { z } from "zod";

interface ContextQuiz {
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
  result?: number[];
}

// xstate-ignore-next-line
/** @xstate-layout N4IgpgJg5mDOIC5QEcCuBLAXgOnRANmAMQBKAogIoCqZAygCqKgAOA9rOgC7qsB2TIAB6IAtAEYALAFYATNgDsAZgAM0iYoAcANgCcUnRoA0IAJ6jNY7GKkble+RJ07F8rQF83xtFmwA3AIb4eP7cfNgATmBocJyQRBB8YLi8vqwA1kkBQRAhYACCALasqLycAmwcofxIQqK2igoy8naOOmKSRqbmypaKilKuGjoyUhLKyooeXhg4WcFVEVGoMXFg4eGs4djM+CEAZpsFfoHz+UUlZTUVXDzVoMII4soa8laywxp9Dk4SxmaPkmU2HUyik-Q0Ay0Mk+EimIG8sxOOQWcwgAAJ-OdSvFEslUhljtlcgBZVgQMDldg3PgCB7iHRAnSuUZ9LRSGzs35dR4qXr9QbDUbjSaeeEzQnzW4S9GY4rYtYbLY7faHaUkskUq5Uqq00QSeRyZ5adRiHRaDQaMSKSR-USA4EqKSmiZSZ4SCQyOEItUopFoorknG8JLoFLpJLe1EhKWo-0ahCh1IAY2jfAA2soALqUyq3XUIa1yLRsy1SKEGV3u22PGRtKy6ctjPQMnRe8VR33ZOOBhWbba7TgHcJHSNI1O8aXdsAJsMpqoZ7Na3M0moPdnYFSgkbKY1Dcadf7iMYO0ESLRica1j2w0XemCcDEmELYANgR8hIgAcTI9DRtCoJB5AAEjm1J3LUCBaPIOjYMawxNJaygyFo1aulosEaLWtjPICMg3tMPj3u+nAvhqxFfj+aIAFJUAAWqBOqrogjiWBo7rSFaFrWmyXL-DYEgKNBugOJh-Tmm2hFgA+-hPpwRBkL4YClGiMgMXmTEIDI7TYE4LSYQaPTSDI1bunIejtPIlnOO05ryBJOBETJH7kLQAAKADyABytBkGpK73MxmjYNoSFmjIzzNCM1ZiFoDTQaezjGvIYgyIonq3uKBT+BkaLRLACxJpEuRopw4TLBivCwAA7ms2zoEmaRouE-i8AkBTERV6K8KgBQAEZrGiQ65cs+W3PJinKWIfngQ8fQCWyjrMslSHGdyF7FsCbF6LFMW6E09kvtlb55QVRWxCVZVvi11W1UmAAWYANVO41KQ+U1LmB+ZNEC5pCuewmjFI0VaUCe6SIoPzITYB1ZTlJ1SoVYDFaV5XXTVWz3Y9jWvi9ymqR9jEBQgYxSDp8hsQaSgSJIyXA6CsEpc4bopQaYgeKKvAavANTenghDTfm4haM82Ag-oOjU9BSgHuYUGwd8TiYUMbKthlPgdlKkQnZAAsaeIpqWGePQqOoihQfI1YiNaDRpdBQxDCyugigRiJEp2eAYlilwsNq6lEyIoyvFCSFOlBVqpTLPJWhuTRmmysX9E4B0a2EsavrrROKAJ1NOmCyGfHBqiW7WryqCT32S88ydju76KwGAhBJt7IDXITEE2OhWcQxTQzWA4xeWRhbKujYO4Sy81du37Le+-5EHiFppNG1aqispZluaKTtZQRDf3NKCB2ObJpHksRGcQWeMEvMt5aWU0YioeMGETJZPRYc7YqSdJx+vmisCoM1O658HhQSLDnbQDI2I7iBtyc8pMmSuG3m0ZwHpD5SWIifN8AArVAmBgHMSGPWJkYJLIQgllWWBG1wrKANM2GQqU8JoO-iEfBxNpDBUsutEulMH7cg9BoBQNkmhm0so4DQMMjrDRiAjM6b4UZXUqujOqT1mqtVYO1Jy0lWpom6n1AaQ14Zz1btPB49CgQgwkC8c0Z4BgUP+BeC8VgxLbj0pZCRcMRqnSRudeRFUboYwek9dOBMTGIGtjpVomhiwugNDA+xjNgo9DDibaQ7g1Y4FhsdTxMjvFyMun4pR-g9ixHCKw5CcgtLtHZFnGwXFgaEIGE6Pou9LH6ncVk6RYREbI3yWjWq-Uhyah9suGazEaHYDsJhYWShdCmmLPUmCjTrCpQGIWdKLtDoeM6RObpPjemKLWKwuZosLyWMGDYhwvFEDOAEbtF4YJjQjDaekzZHTRpdOalJN5bdjFzxAWeYKVinApU3HoaKCTbAxQGK4UKLh2lSPeeBX5oyEBiANCc1QVi2JskudWbQ6FTSWhGMlBkWk0kbMiLANglVWHnivm0YUDJzROFWvY2QMcs6IP6JU-aLzezhDRCnJFs8UVPFsFYaEVonam14fYoE1p9R2DNmi2QLhxEvP-kmJMcBYBSPCP8YZn0NLJVJqPeQo9Qq1h0JbC8cgs4xUtEyKG7oP4IlYULNKGLxaSyZJoS20hXjOu0Eba+bN2ZAA */
export const quizMachine = createMachine(
  // xstate-ignore-next-line
  /** @xstate-layout N4IgpgJg5mDOIC5QEcCuBLAXgOnRANmAMQBKAogIoCqZAygCqKgAOA9rOgC7qsB2TIAB6IAtAEYADGIDs2MQE4ATIoAcANgAsE+WokaANCACeojauwBmAKwr5VqxYkTpEi-IC+7w2izYAbgCG+HgB3HzYAE5gaHCckEQQfGC4vH6sANbJgcEQoWAAggC2rKi8nAJsHGH8SMaiijKWVjqKjm7OGmoqhsIIItK62B0yDlZqalaKVp7eGDjZIdWR0aix8WAREawR2Mz4oQBm24X+QYsFxaXltZVcPDWgveIKEtg2elbSbhYqLmqGJj6KkU2GkYg00k+ajcELMGhmIB88zOuSWCwgAAIApcykQAGr5AAyAEkACL5ehkDEAWQA8qSyBV2Hc+AIntIVFZsEpFGoxJJmg1XADRBYQV1OfzPsD+Rppl5EXNTjlQvdsMUIMQCSTyZSMbQyISyABhRg3ZnVNmieTA7By1RgyTyeR-EUIDQaSwNDTyNyKJxdNSKBFI7AwThYoyhdWsTWR0JEADiZHo+qoJHyAAkmVV7lb3Y45PIxA0XRIJooNOo3ZW1NhdNDJnK1PINCWQ0rw-HODG4wEo5wkymMQApKgALRzLIeQkQlZBP00GjFKjlKnBVjdYs9LkcLc5HLsKg7vi7-YTZD8YDKGMUU8ttSeFlknRczRUFhk-smbrEtt+cpWFIgb2NIJ44GeA6kHQAAKtIAHIGveeaPogf7yHaEjKCo656DoXwGHUfQ6Ngqi6ByUwulWwLgeqASZBiMSwEsADGUR5BinARKsWK8LAADuGy7OgLHpBiEQBLwiSFN2vGYrwqCFAARhsGJHBEjGrMx9xEJe14RmIyGsqhCCckWQE+vYFgWGoYKEYCKjlphH5kTyn7yrMviFPRYCabEapsWAHFcTxkkCUJLEABZgKJGIasQek3oZ5q5sZjxzmIpGKF8NrlroChmG6divOu1hiNC+56MeCqht5DFMax7FxJx3G+WFgk7FFMVifFulXjed4pdO+ZiGMbz+p0nSOG2Cj-ERrZcg40KuA0XT8mIngKrwsZwAIoZ4IQRkzk8-LjKCz6dBIvxTOCihuiIih2HaBEyDhHTwjVSroqq4RRA1kBHfmIjFU0VmreuAz3Q0sjWC0bTyB0XS0d9aIoliOLXCwFooelfQOCC2jTbhnIumI90-PWxYllTlblpWH2eciKpLPFgMmcDz7mRINg2soJbkyolP8o9wtaEGDOKr4KNqrAYCECxmMgLcD64xzIIyDZdgQt+9lodolPAq2Ew6OM0gS6G0tpUr2NWydAZ2pMvz8toZZzYCD22F6H7vlYf6TB5ksQWAEbnj28XdmzuPKK8bYIzaChuEowpEbT9auGbvo4ZMCi0ZB0bh7AqASZFkezu6rRyN7HKOa+Yg2Vu9jclITj+rZEKfrnwfdr2vkAFaoJgpe9K0GGOmbYxmyTz5umLciVpIs3SEvJYB6GeeK8rONl7NdovPHvrOv6Fi-l09YWJZfOto9la0XVvkNQFTW+SFbV8R1wmxRJUmsDJodyRiCllKqXUn5bSVtN623qBhSskIJovCXmCN2iBISvG5rYF0PwgK8jULfHyoDGpBWai-Xi4VOrRViqzIaKsy6aDtMWX03MxhBj5m6dQo8ph6BstIZ0rYPCfS8ngh+4RArBVaiQ9+AQDhxAiEPNCIJISfm1mYUaijuhEUkI9OhnJubLyws+XB9UtIENEaFN+QkVLqTALIhAo1ZCaCwpMaEn5VybnUVhDCPpOQwJXL7Da-CcB33wY-Qhz8xHtQ2NYkQDhSIQkmHoeBy8kEIFsoLbQWEW6jV9G4Ax98jGPwCMHXJ-lwE22OogNwL5HotgXkoM2nRWEtlBBwxwdcbBilXkqQJQiZwQLKX0JeMTYHxIRggu6REGxz1GrNCEWE5S0SiLANgfFrHPhjmKZ07xPyaDJkRcQzhQQOCmT8JQniOm+A2FsGRVCt4nRLJ6CEkhyINGsEk3kFghhdCTqNZalYzmD2uZAvoJZwRvBrp8b4vxyz3SAq8MUS9XB-iwuMVcm13BAA */

  {
    predictableActionArguments: true,
    context: {
      res: undefined,
      query: {},
      error: undefined,
      amount: undefined,
      mode: undefined,
      select: undefined,
      result: undefined,
    },
    tsTypes: {} as import("./quizMachine.typegen").Typegen0,
    schema: {
      context: {} as ContextQuiz,
      events: {} as {
        type: "REQUEST";
        query: ContextQuiz["query"];
        res: ContextQuiz["res"];
      },
    },
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
        onDone: "success query",
        states: {
          requested: {
            invoke: {
              src: "validateAmount",
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
              src: "validateMode",
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
              src: "validateSelect",
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
      },
      "get ayat": {
        initial: "mode ayat",
        states: {
          "mode ayat": {
            on: {
              "GET SURAH": {
                target: "mode surah",
              },
              "GET JUZ": {
                target: "mode juz",
              },
            },
          },
          "mode surah": {},
          "mode juz": {},
        },
        on: {
          "Event 2": {
            target: "make question",
          },
          RESPONSE: {
            target: "respons",
          },
        },
      },
      "make question": {
        initial: "create true answer",
        states: {
          "create true answer": {
            initial: "pick random ayat and number for question",
            states: {
              "pick random ayat and number for question": {
                on: {
                  "Event 1": {
                    target: "check mode",
                  },
                },
              },
              "check mode": {
                on: {
                  "Event 1": {
                    target: "after",
                  },
                  "Event 2": {
                    target: "before",
                  },
                },
              },
              after: {},
              before: {},
            },
          },
          "craete question": {},
        },
      },
      respons: {},
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
      "success query": {
        type: "final",
        exit: (context, _) => {
          const { amount, mode, select } = context;
          return context.res?.status(200).json({ amount, mode, select });
        },
      },
    },
  },
  {
    services: {
      validateMode: (context, _) => {
        const { mode } = context.query;
        if (mode === undefined || mode === "") {
          return Promise.reject("Mode tidak boleh kosong");
        }

        const ModeEnum = z.enum(["juz", "surah"]).safeParse(mode.toLowerCase());

        if (!ModeEnum.success) {
          return Promise.reject("Mode tidak valid, gunakan juz atau surah");
        }

        return Promise.resolve(ModeEnum.data);
      },
      validateAmount: (context, _) => {
        const { amount } = context.query;

        const AmountIsRequired = z
          .string({ required_error: "Amount tidak boleh kosong" })
          .safeParse(amount);

        if (!AmountIsRequired.success) {
          return Promise.reject(AmountIsRequired.error.issues[0].message);
        }

        const AmountIsNumber = z
          .number({ invalid_type_error: "Amount harus berupa angka" })
          .safeParse(parseFloat(amount));

        if (!AmountIsNumber.success) {
          return Promise.reject(AmountIsNumber.error.issues[0].message);
        }

        return Promise.resolve(AmountIsNumber.data);
      },
      validateSelect: (context, _) => {
        const { select } = context.query;

        const SelectIsRequired = z
          .string({ required_error: "Select tidak boleh kosong" })
          .safeParse(select);

        if (!SelectIsRequired.success) {
          return Promise.reject(SelectIsRequired.error.issues[0].message);
        }

        const splitSelect = sortBy(
          uniq(
            SelectIsRequired.data
              .split(",")
              .map((item: string) => parseInt(item)),
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
      },
    },
    actions: {
      assignQueryNextRes: assign<
        ContextQuiz,
        {
          type: "REQUEST";
          query: ContextQuiz["query"];
          res: ContextQuiz["res"];
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
    },
  },
);
