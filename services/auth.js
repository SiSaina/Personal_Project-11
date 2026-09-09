import { apiRequest } from "./api";

export async function register(name, email, password, passwordConfirmation) {
  await apiRequest("/api/register", {
    auth: false,
    method: "POST",
    body: { name, email, password, password_confirmation: passwordConfirmation },
  });
  return login(email, password);
}

export async function login(email, password) {
  const data = await apiRequest("/api/login", {
    auth: false,
    method: "POST",
    body: { email, password },
  });
  localStorage.setItem("token", data.access_token);
  return data.user;
}

export async function logout() {
  try {
    await apiRequest("/api/logout", { method: "POST" });
  } finally {
    localStorage.removeItem("token");
  }
}
