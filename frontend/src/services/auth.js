import axios from "axios";

const baseURL =
  process.env.REACT_APP_AUTH_BASE_URL ||
  (process.env.REACT_APP_API_BASE_URL
    ? process.env.REACT_APP_API_BASE_URL.replace("/api/v1/restaurants", "/api/v1/auth")
    : "http://localhost:5000/api/v1/auth");

const authApi = axios.create({
  baseURL,
  headers: {
    "Content-type": "application/json"
  }
});

class AuthService {
  async register({ name, email, password }) {
    const response = await authApi.post("/register", { name, email, password });
    return response.data;
  }

  async login({ email, password }) {
    const response = await authApi.post("/login", { email, password });
    return response.data;
  }

  async refresh(refreshToken) {
    const response = await authApi.post("/refresh", { refreshToken });
    return response.data;
  }

  async logout(refreshToken) {
    const response = await authApi.post("/logout", { refreshToken });
    return response.data;
  }
}

const authService = new AuthService();
export default authService;
