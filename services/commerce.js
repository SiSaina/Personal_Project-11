import { apiRequest } from "./api";

export const getWishlist = () => apiRequest("/api/v1/wishlist");
export const addWishlist = (productId) => apiRequest(`/api/v1/wishlist/${productId}`, { method: "POST" });
export const removeWishlist = (productId) => apiRequest(`/api/v1/wishlist/${productId}`, { method: "DELETE" });
export const getReviews = (productId) => apiRequest(`/api/v1/products/${productId}/reviews`, { auth: false });
export const saveReview = (productId, body) => apiRequest(`/api/v1/products/${productId}/reviews`, { method: "POST", body });
export const forgotPassword = (email) => apiRequest("/api/forgot-password", { auth: false, method: "POST", body: { email } });
export const resetPassword = (body) => apiRequest("/api/reset-password", { auth: false, method: "POST", body });
