import { apiRequest } from "./api";

export function getOrders() {
  return apiRequest("/api/v1/orders");
}

export function getOrder(id) {
  return apiRequest(`/api/v1/orders/${id}`);
}

export function checkoutOrder(addressId, items) {
  return apiRequest("/api/v1/orders", {
    method: "POST",
    body: { addressId, items },
  });
}

export function updateOrder(id, status) {
  return apiRequest(`/api/v1/orders/${id}`, {
    method: "PATCH",
    body: { status },
  });
}

export const deleteOrder = (id) => apiRequest(`/api/v1/orders/${id}`, { method: "DELETE" });
