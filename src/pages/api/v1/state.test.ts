import { createMocks } from "node-mocks-http";

import quizHandler from "./state";

describe("Validation query amount", () => {
  test("Error if amount undefined", async () => {
    const { req, res } = createMocks({
      method: "GET",
    });
    await quizHandler(req, res);

    expect(res._getStatusCode()).toBe(400);
    const resp = res._getJSONData();
    expect(resp.error).toEqual({
      type: "query validation error",
      description: "Amount tidak boleh kosong",
    });
  });

  test("Error if amount null", async () => {
    const { req, res } = createMocks({
      method: "GET",
    });

    await quizHandler(req, res);

    expect(res._getStatusCode()).toBe(400);
    const resp = res._getJSONData();
    expect(resp.error).toEqual({
      type: "query validation error",
      description: "Amount tidak boleh kosong",
    });
  });

  test("Error if amount is not number", async () => {
    const { req, res } = createMocks({
      method: "GET",
      query: {
        amount: "aaaa",
      },
    });

    await quizHandler(req, res);

    expect(res._getStatusCode()).toBe(400);
    const resp = res._getJSONData();
    expect(resp.error).toEqual({
      type: "query validation error",
      description: "Amount harus berupa angka",
    });
  });
});

describe("Validation query mode", () => {
  test("Error if mode undefined", async () => {
    const { req, res } = createMocks({
      method: "GET",
      query: {
        amount: "10",
      },
    });
    await quizHandler(req, res);

    expect(res._getStatusCode()).toBe(400);
    const resp = res._getJSONData();
    expect(resp.error).toEqual({
      type: "query validation error",
      description: "Mode tidak boleh kosong",
    });
  });

  test("Error if mode null", async () => {
    const { req, res } = createMocks({
      method: "GET",
      query: {
        amount: "10",
        mode: "",
      },
    });

    await quizHandler(req, res);

    expect(res._getStatusCode()).toBe(400);
    const resp = res._getJSONData();
    expect(resp.error).toEqual({
      type: "query validation error",
      description: "Mode tidak boleh kosong",
    });
  });

  test("Error if mode not juz or surah", async () => {
    const { req, res } = createMocks({
      method: "GET",
      query: {
        amount: "10",
        mode: "aaa",
      },
    });

    await quizHandler(req, res);

    expect(res._getStatusCode()).toBe(400);
    const resp = res._getJSONData();
    expect(resp.error).toEqual({
      type: "query validation error",
      description: "Mode tidak valid, gunakan juz atau surah",
    });
  });
});

describe("Validation query select", () => {
  test("Error if select undefined", async () => {
    const { req, res } = createMocks({
      method: "GET",
      query: {
        amount: "10",
        mode: "juz",
      },
    });
    await quizHandler(req, res);

    expect(res._getStatusCode()).toBe(400);
    const resp = res._getJSONData();
    expect(resp.error).toEqual({
      type: "query validation error",
      description: "Select tidak boleh kosong",
    });
  });

  test("Error if select undefined", async () => {
    const { req, res } = createMocks({
      method: "GET",
      query: {
        amount: "10",
        mode: "juz",
      },
    });
    await quizHandler(req, res);

    expect(res._getStatusCode()).toBe(400);
    const resp = res._getJSONData();
    expect(resp.error).toEqual({
      type: "query validation error",
      description: "Select tidak boleh kosong",
    });
  });

  test("Error if select not array", async () => {
    const { req, res } = createMocks({
      method: "GET",
      query: {
        amount: "10",
        mode: "juz",
        select: "ab,ad,2",
      },
    });

    await quizHandler(req, res);

    expect(res._getStatusCode()).toBe(400);
    const resp = res._getJSONData();
    expect(resp.error).toEqual({
      type: "query validation error",
      description: "Select harus berupa array angka",
    });
  });

  test("Error if select exceeds the maximum limit of juz mode juz", async () => {
    const { req, res } = createMocks({
      method: "GET",
      query: {
        amount: "10",
        mode: "juz",
        select: "1,2,31",
      },
    });

    await quizHandler(req, res);

    expect(res._getStatusCode()).toBe(400);
    const resp = res._getJSONData();
    expect(resp.error).toEqual({
      type: "query validation error",
      description: "Select pada mode juz tidak boleh lebih dari 30",
    });
  });

  test("Error if select exceeds the maximum limit of juz mode surah", async () => {
    const { req, res } = createMocks({
      method: "GET",
      query: {
        amount: "10",
        mode: "surah",
        select: "1,2,31,114,115,1116",
      },
    });

    await quizHandler(req, res);

    expect(res._getStatusCode()).toBe(400);
    const resp = res._getJSONData();
    expect(resp.error).toEqual({
      type: "query validation error",
      description: "Select pada mode surah tidak boleh lebih dari 114",
    });
  });

  test("Error if select is less than the minimum limit of juz mode", async () => {
    const { req, res } = createMocks({
      method: "GET",
      query: {
        amount: "10",
        mode: "juz",
        select: "-1,0,2,1,2,31",
      },
    });

    await quizHandler(req, res);

    expect(res._getStatusCode()).toBe(400);
    const resp = res._getJSONData();
    expect(resp.error).toEqual({
      type: "query validation error",
      description: "Select pada mode juz tidak boleh kurang dari 1",
    });
  });

  test("Error if select is less than the minimum limit of surah mode", async () => {
    const { req, res } = createMocks({
      method: "GET",
      query: {
        amount: "10",
        mode: "surah",
        select: "-3,0,1,2,31,114,115,1116",
      },
    });

    await quizHandler(req, res);

    expect(res._getStatusCode()).toBe(400);
    const resp = res._getJSONData();
    expect(resp.error).toEqual({
      type: "query validation error",
      description: "Select pada mode surah tidak boleh kurang dari 1",
    });
  });

  test("No duplciate array select", async () => {
    const { req, res } = createMocks({
      method: "GET",
      query: {
        amount: "10",
        mode: "juz",
        select: "1,2,2,2,2,2,3,3,3,4",
      },
    });

    await quizHandler(req, res);

    expect(res._getStatusCode()).toBe(200);
    const resp = res._getJSONData();
    expect(resp.select).toEqual([1, 2, 3, 4]);
  });

  test("Sort return array select", async () => {
    const { req, res } = createMocks({
      method: "GET",
      query: {
        amount: "10",
        mode: "juz",
        select: "3,1,6,2",
      },
    });

    await quizHandler(req, res);

    expect(res._getStatusCode()).toBe(200);
    const resp = res._getJSONData();
    expect(resp.select).toEqual([1, 2, 3, 6]);
  });
});

describe("No Error", () => {
  test("No Error", async () => {
    const { req, res } = createMocks({
      method: "GET",
      query: {
        amount: "10",
        mode: "juz",
        select: "12,13,18",
      },
    });
    await quizHandler(req, res);

    expect(res._getStatusCode()).toBe(200);
    const resp = res._getJSONData();
    console.log(resp);
    // expect(resp.error).toEqual({
    //   type: "query validation error",
    //   description: "Select tidak boleh kosong",
    // });
  });
});
