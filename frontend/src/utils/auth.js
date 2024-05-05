export const setAuthToken = (token) => {
  sessionStorage.setItem("token", token);
};

export const getAuthToken = () => {
  return sessionStorage.getItem("token");
};

export const clearAuthToken = () => {
  sessionStorage.removeItem("token");
};

export const isAuthenticated = () => {
  return !!getAuthToken();
};
