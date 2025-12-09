import apiClient from "./apiClient";

export const loginAdminApi = async (email, password) => {
  const { data } = await apiClient.post("/api/auth/login", { email, password });

  return data;
};
