export const CART_STORAGE_KEY = "saina-cart-v1";
export const WISHLIST_STORAGE_KEY = "saina-wishlist-v1";

export function readStoredRecord(storage, key) {
  try {
    const parsed = JSON.parse(storage.getItem(key) || "{}");
    return parsed && typeof parsed === "object" && !Array.isArray(parsed) ? parsed : {};
  } catch {
    return {};
  }
}

export function writeStoredRecord(storage, key, value) {
  storage.setItem(key, JSON.stringify(value));
}
