import axios from "axios";

const api = axios.create({
  baseURL: "https://shona-backend-ea93.onrender.com/api",
  headers: {
    "Content-Type": "application/json"
  }
});

// ✅ token auto attach
api.interceptors.request.use(config => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;