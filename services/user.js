import { apiRequest } from "./api";

export async function getUser() {
  const response = await apiRequest("/api/user?includeAddresses=true");
  return response.data;
}

export const getUserAddress = getUser;
