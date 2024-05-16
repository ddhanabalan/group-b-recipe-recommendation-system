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
export const setUserId = (userId) => {
  sessionStorage.setItem("userId", userId);
};

// Retrieve user ID from sessionStorage
export const getUserId = () => {
  return sessionStorage.getItem("userId");
};

// Clear user ID from sessionStorage
export const clearUserId = () => {
  sessionStorage.removeItem("userId");
};

// Check if user ID exists in sessionStorage
export const isUserIdSet = () => {
  return !!getUserId();
};
