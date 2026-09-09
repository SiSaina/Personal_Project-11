import { apiRequest } from "./api";

export function getCategory({ id = null, includeProducts = false } = {}) {
  const query = includeProducts ? "?includeProducts=true" : "";
  return apiRequest(`/api/v1/categories${id ? `/${id}` : ""}${query}`, { auth: false });
}

export const postCategory = (body) => apiRequest("/api/v1/categories", { method: "POST", body });
export const putCategory = (id, body) => apiRequest(`/api/v1/categories/${id}`, { method: "PUT", body });
export const patchCategory = (id, body) => apiRequest(`/api/v1/categories/${id}`, { method: "PATCH", body });
export const deleteCategory = (id) => apiRequest(`/api/v1/categories/${id}`, { method: "DELETE" });
