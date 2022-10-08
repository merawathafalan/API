// This file was automatically generated. Edits will be overwritten

export interface Typegen0 {
  "@@xstate/typegen": true;
  internalEvents: {
    "done.invoke.create question": {
      type: "done.invoke.create question";
      data: unknown;
      __tip: "See the XState TS docs to learn how to strongly type this.";
    };
    "done.invoke.get quran data": {
      type: "done.invoke.get quran data";
      data: unknown;
      __tip: "See the XState TS docs to learn how to strongly type this.";
    };
    "done.invoke.quiz.validation.valid mode:invocation[0]": {
      type: "done.invoke.quiz.validation.valid mode:invocation[0]";
      data: unknown;
      __tip: "See the XState TS docs to learn how to strongly type this.";
    };
    "done.invoke.validateAmount": {
      type: "done.invoke.validateAmount";
      data: unknown;
      __tip: "See the XState TS docs to learn how to strongly type this.";
    };
    "done.invoke.validateMode": {
      type: "done.invoke.validateMode";
      data: unknown;
      __tip: "See the XState TS docs to learn how to strongly type this.";
    };
    "error.platform.quiz.validation.valid mode:invocation[0]": {
      type: "error.platform.quiz.validation.valid mode:invocation[0]";
      data: unknown;
    };
    "error.platform.validateAmount": {
      type: "error.platform.validateAmount";
      data: unknown;
    };
    "error.platform.validateMode": {
      type: "error.platform.validateMode";
      data: unknown;
    };
    "xstate.init": { type: "xstate.init" };
    "xstate.stop": { type: "xstate.stop" };
  };
  invokeSrcNameMap: {};
  missingImplementations: {
    actions: never;
    services: never;
    guards: never;
    delays: never;
  };
  eventsCausingActions: {
    assignAmount: "done.invoke.validateAmount";
    assignError:
      | "error.platform.quiz.validation.valid mode:invocation[0]"
      | "error.platform.validateAmount"
      | "error.platform.validateMode";
    assignMode: "done.invoke.validateMode";
    assignQueryNextRes: "REQUEST";
    assignQuranRaw: "done.invoke.get quran data";
    assignResult: "done.invoke.create question";
    assignSelect: "done.invoke.quiz.validation.valid mode:invocation[0]";
  };
  eventsCausingServices: {};
  eventsCausingGuards: {};
  eventsCausingDelays: {};
  matchesStates:
    | "create question"
    | "error validation"
    | "get quran data"
    | "idle"
    | "success query"
    | "validation"
    | "validation.requested"
    | "validation.valid amount"
    | "validation.valid mode"
    | "validation.valid select"
    | {
        validation?:
          | "requested"
          | "valid amount"
          | "valid mode"
          | "valid select";
      };
  tags: never;
}
