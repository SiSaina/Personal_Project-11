import { beforeEach, describe, expect, it } from "vitest";
import { CART_STORAGE_KEY, readStoredRecord, writeStoredRecord } from "./cartStorage";

describe("cart persistence", () => {
  beforeEach(() => localStorage.clear());

  it("round-trips cart quantities", () => {
    writeStoredRecord(localStorage, CART_STORAGE_KEY, { 12: 2, 18: 1 });
    expect(readStoredRecord(localStorage, CART_STORAGE_KEY)).toEqual({ 12: 2, 18: 1 });
  });

  it("recovers safely from corrupt storage", () => {
    localStorage.setItem(CART_STORAGE_KEY, "not-json");
    expect(readStoredRecord(localStorage, CART_STORAGE_KEY)).toEqual({});
  });
});
