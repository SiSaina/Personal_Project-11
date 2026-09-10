import { beforeEach, describe, expect, it, vi } from "vitest";
import { checkoutOrder } from "./order";

describe("checkout order journey", () => {
  beforeEach(() => {
    localStorage.setItem("token", "customer-token");
    global.fetch = vi.fn().mockResolvedValue(new Response(JSON.stringify({
      data: { id: 42, subtotal: "25.00", discountTotal: "5.00", total: "20.00" },
    }), { status: 201, headers: { "Content-Type": "application/json" } }));
  });

  it("sends the selected payment method and returns the real order totals", async () => {
    const response = await checkoutOrder(7, [{ productId: 3, quantity: 2 }], {
      couponCode: "SAVE20",
      paymentMethod: "bank_transfer",
    });

    expect(response.data).toMatchObject({ id: 42, subtotal: "25.00", total: "20.00" });
    expect(fetch).toHaveBeenCalledWith(expect.stringContaining("/api/v1/orders"), expect.objectContaining({
      method: "POST",
      body: JSON.stringify({ addressId: 7, items: [{ productId: 3, quantity: 2 }], couponCode: "SAVE20", paymentMethod: "bank_transfer" }),
    }));
  });
});
