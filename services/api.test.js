import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { ApiError, apiRequest, resolveImageUrl } from "./api";

describe("API client", () => {
  beforeEach(() => { localStorage.clear(); global.fetch = vi.fn(); });
  afterEach(() => vi.restoreAllMocks());

  it("allows anonymous reads and parses JSON", async () => {
    fetch.mockResolvedValue(new Response(JSON.stringify({ data: [] }), { status: 200, headers: { "Content-Type": "application/json" } }));
    await expect(apiRequest("/api/v1/products", { auth: false })).resolves.toEqual({ data: [] });
    expect(fetch).toHaveBeenCalledWith(expect.stringContaining("/api/v1/products"), expect.objectContaining({ headers: expect.not.objectContaining({ Authorization: expect.anything() }) }));
  });

  it("normalizes Laravel validation errors", async () => {
    localStorage.setItem("token", "token");
    fetch.mockResolvedValue(new Response(JSON.stringify({ message: "Invalid", errors: { email: ["Email is invalid."] } }), { status: 422 }));
    await expect(apiRequest("/api/example")).rejects.toMatchObject({ name: "ApiError", status: 422, message: "Email is invalid." });
  });

  it("rejects protected calls without a token", async () => {
    await expect(apiRequest("/api/user")).rejects.toBeInstanceOf(ApiError);
    expect(fetch).not.toHaveBeenCalled();
  });

  it("resolves relative uploaded images", () => {
    expect(resolveImageUrl("storage/products/item.webp")).toMatch(/\/storage\/products\/item\.webp$/);
  });
});
