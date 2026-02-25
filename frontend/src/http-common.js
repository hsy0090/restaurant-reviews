import axios from "axios";

const apiBase =
  process.env.REACT_APP_API_BASE_URL || "http://localhost:5000/api/v1/restaurants";
const authBase =
  process.env.REACT_APP_AUTH_BASE_URL ||
  apiBase.replace("/api/v1/restaurants", "/api/v1/auth");

const api = axios.create({
  baseURL: apiBase,
  headers: {
    "Content-type": "application/json"
  }
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("auth_access_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

let isRefreshing = false;
let refreshQueue = [];

function processQueue(error, token = null) {
  refreshQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  refreshQueue = [];
}

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (!originalRequest || error.response?.status !== 401) {
      return Promise.reject(error);
    }

    if (originalRequest._retry) {
      return Promise.reject(error);
    }
    originalRequest._retry = true;

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        refreshQueue.push({ resolve, reject });
      }).then((token) => {
        originalRequest.headers.Authorization = `Bearer ${token}`;
        return api(originalRequest);
      });
    }

    isRefreshing = true;
    const refreshToken = localStorage.getItem("auth_refresh_token");
    if (!refreshToken) {
      isRefreshing = false;
      return Promise.reject(error);
    }

    try {
      const response = await axios.post(`${authBase}/refresh`, { refreshToken });
      const { accessToken, refreshToken: newRefreshToken, user } = response.data;
      localStorage.setItem("auth_access_token", accessToken);
      localStorage.setItem("auth_refresh_token", newRefreshToken);
      localStorage.setItem("auth_user", JSON.stringify(user));
      processQueue(null, accessToken);
      originalRequest.headers.Authorization = `Bearer ${accessToken}`;
      return api(originalRequest);
    } catch (refreshError) {
      processQueue(refreshError, null);
      localStorage.removeItem("auth_access_token");
      localStorage.removeItem("auth_refresh_token");
      localStorage.removeItem("auth_user");
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }
);

export default api;
