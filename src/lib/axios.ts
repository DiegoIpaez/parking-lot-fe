import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8000/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const authStorage = localStorage.getItem("auth-storage");
    const data = authStorage ? JSON.parse(authStorage) : null;
    if (!data) return config;

    const token = data?.state?.token;
    if (!token) return config;
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
