import axios from "axios";

const api = axios.create({
  baseURL: "https://shona-backend-ea93.onrender.com/api", // REST routes ka base
  withCredentials: true,
  headers: {
    "Content-Type": "application/json"
  }
});

// request interceptor → automatically token attach kare
api.interceptors.request.use(config => {
  const token = localStorage.getItem("token"); // login ke baad store hua token
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;