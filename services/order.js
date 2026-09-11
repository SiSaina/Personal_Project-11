import { apiRequest } from "./api";

export function getOrders() {
  return apiRequest("/api/v1/orders");
}

export function getOrder(id) {
  return apiRequest(`/api/v1/orders/${id}`);
}

export function checkoutOrder(addressId, items, options = {}) {
  return apiRequest("/api/v1/orders", {
    method: "POST",
    body: { addressId, items, couponCode: options.couponCode || null, paymentMethod: options.paymentMethod || "manual", billingAddressId: options.billingAddressId || addressId, shippingMethod: options.shippingMethod || "standard", clickAndCollect: Boolean(options.clickAndCollect), giftWrapping: Boolean(options.giftWrapping), customerNote: options.customerNote || null },
  });
}

export function updateOrder(id, updates) {
  return apiRequest(`/api/v1/orders/${id}`, {
    method: "PATCH",
    body: typeof updates === "string" ? { status: updates } : updates,
  });
}

export const deleteOrder = (id) => apiRequest(`/api/v1/orders/${id}`, { method: "DELETE" });
