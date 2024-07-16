import axios from "axios";

export const setAuthToken = (tokens) => {
  sessionStorage.setItem("accessToken", tokens.access);
  sessionStorage.setItem("refreshToken", tokens.refresh);
};

export const getAuthToken = () => {
  return {
    access: sessionStorage.getItem("accessToken"),
    refresh: sessionStorage.getItem("refreshToken"),
  };
};

export const clearAuthToken = () => {
  sessionStorage.removeItem("accessToken");
  sessionStorage.removeItem("refreshToken");
};

export const isAuthenticated = () => {
  return !!sessionStorage.getItem("accessToken");
};

export const setUserId = (userId) => {
  sessionStorage.setItem("userId", userId);
};

export const getUserId = () => {
  return sessionStorage.getItem("userId");
};

export const clearUserId = () => {
  sessionStorage.removeItem("userId");
};

export const isUserIdSet = () => {
  return !!getUserId();
};

export const setUserName = (userName) => {
  sessionStorage.setItem("userName", userName);
};

export const getUserName = () => {
  return sessionStorage.getItem("userName");
};

export const clearUserName = () => {
  sessionStorage.removeItem("userName");
};

export const setUserEmail = (userEmail) => {
  sessionStorage.setItem("userEmail", userEmail);
};

export const getUserEmail = () => {
  return sessionStorage.getItem("userEmail");
};

export const clearUserEmail = () => {
  sessionStorage.removeItem("userEmail");
};

export const setUserRole = (userRole) => {
  sessionStorage.setItem("userRole", userRole);
};

export const getUserRole = () => {
  return sessionStorage.getItem("userRole");
};

export const clearUserRole = () => {
  sessionStorage.removeItem("userRole");
};

export const clearAuthData = () => {
  clearAuthToken();
  clearUserId();
  clearUserName();
  clearUserEmail();
  clearUserRole();
};
export const refreshAccessToken = async () => {
  const refreshToken = sessionStorage.getItem("refreshToken");

  try {
    const response = await axios.post(
      "http://localhost:8000/authentication/token/refresh/",
      { refresh: refreshToken }
    );

    const newTokens = response.data;
    setAuthToken(newTokens); // Store the new tokens
    return newTokens.access; // Return the new access token
  } catch (error) {
    console.error("Error refreshing token:", error);
    throw error; // Throw error for handling in the calling function
  }
};
