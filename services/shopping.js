import { apiRequest } from "./api";
export const mergeCart = (items) => apiRequest("/api/v1/cart/merge", { method: "POST", body: { items } });
export const getSavedCarts = () => apiRequest("/api/v1/saved-carts");
export const saveCart = (name, items) => apiRequest("/api/v1/saved-carts", { method: "POST", body: { name, items } });
export const createProductAlert = (productId, type) => apiRequest(`/api/v1/products/${productId}/alerts`, { method: "POST", body: { type } });
export const getBrowsingHistory = () => apiRequest("/api/v1/browsing-history");
export const recordProductView = (productId) => apiRequest(`/api/v1/products/${productId}/viewed`, { method: "POST" });
export const getShippingOptions = (body) => apiRequest("/api/v1/shipping/options", { auth: false, method: "POST", body });
export const validateAddress = (body) => apiRequest("/api/v1/addresses/validate", { auth: false, method: "POST", body });
export const cancelOrder = (id) => apiRequest(`/api/v1/orders/${id}/cancel`, { method: "POST" });
export const reorder = (id) => apiRequest(`/api/v1/orders/${id}/reorder`, { method: "POST" });
export const requestReturn = (id, body) => apiRequest(`/api/v1/orders/${id}/returns`, { method: "POST", body });
export const invoiceUrl = (id) => `${process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000"}/api/v1/orders/${id}/invoice`;
export const updateShipment = (id, body) => apiRequest(`/api/v1/orders/${id}/shipments`, { method: "POST", body });
export const fulfillItem = (id, body) => apiRequest(`/api/v1/orders/${id}/fulfill-item`, { method: "POST", body });
export const processReturn = (id, body) => apiRequest(`/api/v1/returns/${id}`, { method: "PATCH", body });
export const packingSlipUrl = (id) => `${process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000"}/api/v1/orders/${id}/packing-slip`;
export const getSuggestions = (q) => apiRequest(`/api/v1/products/suggestions?q=${encodeURIComponent(q)}`, { auth: false });
export async function downloadOrderDocument(id,type="invoice"){const base=process.env.NEXT_PUBLIC_API_URL||"http://127.0.0.1:8000";const response=await fetch(`${base}/api/v1/orders/${id}/${type}`,{headers:{Authorization:`Bearer ${localStorage.getItem("token")}`,Accept:"application/pdf"}});if(!response.ok)throw new Error("Document download failed.");const url=URL.createObjectURL(await response.blob());const link=document.createElement("a");link.href=url;link.download=`${type}-${id}.pdf`;link.click();URL.revokeObjectURL(url);}
