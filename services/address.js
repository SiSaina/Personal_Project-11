import { apiRequest } from "./api";

export function getAddress({ id = null } = {}) {
  return apiRequest(`/api/v1/addresses${id ? `/${id}` : ""}`);
}

export const postAddress = (body) => apiRequest("/api/v1/addresses", { method: "POST", body });
export const deleteAddress = (id) => apiRequest(`/api/v1/addresses/${id}`, { method: "DELETE" });
