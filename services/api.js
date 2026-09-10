const configuredUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

export const API_URL = configuredUrl.replace(/\/$/, "");

export class ApiError extends Error {
  constructor(message, { status = 0, errors = null, data = null } = {}) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.errors = errors;
    this.data = data;
  }
}

function getToken() {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem("token");
}

export async function apiRequest(path, { auth = true, body, headers, ...options } = {}) {
  const token = getToken();
  if (auth && !token) {
    throw new ApiError("Please log in to continue.", { status: 401 });
  }

  const isFormData = typeof FormData !== "undefined" && body instanceof FormData;
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      Accept: "application/json",
      ...(body !== undefined && !isFormData ? { "Content-Type": "application/json" } : {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
    body: body === undefined ? undefined : (isFormData ? body : JSON.stringify(body)),
  });

  const data = response.status === 204
    ? null
    : await response.json().catch(() => null);

  if (!response.ok) {
    if (response.status === 401 && typeof window !== "undefined") localStorage.removeItem("token");
    const validationMessage = data?.errors
      ? Object.values(data.errors).flat().join(" ")
      : null;
    throw new ApiError(validationMessage || data?.message || `Request failed (${response.status}).`, {
      status: response.status,
      errors: data?.errors ?? null,
      data,
    });
  }

  return data;
}

export function resolveImageUrl(value) {
  if (!value) return null;
  if (/^(https?:|data:|blob:)/i.test(value)) return value;
  return `${API_URL}/${String(value).replace(/^\/+/, "")}`;
}
