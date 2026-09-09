import { apiRequest } from "./api";

function productPath(id, options = {}) {
  const params = new URLSearchParams();
  if (options.includeImages) params.set("includeImages", "true");
  if (options.includeCategory) params.set("includeCategory", "true");
  const query = params.toString();
  return `/api/v1/products${id ? `/${id}` : ""}${query ? `?${query}` : ""}`;
}

export function getProduct({ id = null, ...options } = {}) {
  return apiRequest(productPath(id, options), { auth: false });
}

export function getOneProduct(productId, options = {}) {
  return apiRequest(productPath(productId, options), { auth: false });
}

export const postProduct = (body) => apiRequest("/api/v1/products", { method: "POST", body });
export const putProduct = (id, body) => apiRequest(`/api/v1/products/${id}`, { method: "PUT", body });
export const patchProduct = (id, body) => apiRequest(`/api/v1/products/${id}`, { method: "PATCH", body });
export const deleteProduct = (id) => apiRequest(`/api/v1/products/${id}`, { method: "DELETE" });
