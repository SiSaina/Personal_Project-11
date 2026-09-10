import { apiRequest } from "./api";

export function getImage({ id = null } = {}) {
  return apiRequest(`/api/v1/images${id ? `/${id}` : ""}`, { auth: false });
}

export const postImage = (body) => apiRequest("/api/v1/images", { method: "POST", body });
export const putImage = (id, body) => apiRequest(`/api/v1/images/${id}`, { method: "PUT", body });
export const patchImage = (id, body) => apiRequest(`/api/v1/images/${id}`, { method: "PATCH", body });
export const deleteImage = (id) => apiRequest(`/api/v1/images/${id}`, { method: "DELETE" });

export function uploadImage(productId, image) {
  const body = new FormData();
  body.append("productId", productId);
  body.append("image", image);
  return apiRequest("/api/v1/images/upload", { method: "POST", body });
}
