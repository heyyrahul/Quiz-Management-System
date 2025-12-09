export const saveAuthToken = (token) => {
  localStorage.setItem("quiz_token", token);
};

export const clearAuthToken = () => {
  localStorage.removeItem("quiz_token");
};

export const isAuthenticated = () => {
  return !!localStorage.getItem("quiz_token");
};

export const getAuthToken = () => {
  return localStorage.getItem("quiz_token");
};
