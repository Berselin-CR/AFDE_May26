import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8000",
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  const role = sessionStorage.getItem("role");
  if (role) config.headers["X-Role"] = role;
  return config;
});

export default api;
