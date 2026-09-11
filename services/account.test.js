import { beforeEach, describe, expect, it, vi } from "vitest";
import { updateAccount } from "./account";
import { importProducts } from "./admin";

describe("account and administration contracts", () => {
  beforeEach(() => { localStorage.setItem("token", "token"); global.fetch = vi.fn().mockResolvedValue(new Response(JSON.stringify({ data: {} }), { status: 200, headers: { "Content-Type": "application/json" } })); });
  it("updates notification preferences with camelCase fields", async () => { await updateAccount({ notificationPreferences: { orders: true } }); expect(fetch).toHaveBeenCalledWith(expect.stringContaining("/api/account"), expect.objectContaining({ method: "PATCH", body: JSON.stringify({ notificationPreferences: { orders: true } }) })); });
  it("uploads product CSV as multipart data", async () => { const file = new File(["sku,name"], "products.csv", { type: "text/csv" }); await importProducts(file); const options = fetch.mock.calls[0][1]; expect(options.body).toBeInstanceOf(FormData); expect(options.headers).not.toHaveProperty("Content-Type"); });
});
