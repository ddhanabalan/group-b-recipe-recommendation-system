import axios from "axios";
import { getAuthToken } from "./auth"; // Adjust the import path based on your project structure

const axiosInstance = axios.create({
  baseURL: "http://localhost:8000", // Adjust this to your API base URL
});

axiosInstance.interceptors.request.use(
  (config) => {
    const authToken = getAuthToken();
    if (authToken && authToken.access) {
      config.headers.Authorization = `Bearer ${authToken.access}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;
