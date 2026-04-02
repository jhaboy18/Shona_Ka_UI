import axios from "axios";

const apiUpload = axios.create({
  baseURL: "https://shona-backend-ea93.onrender.com/api",
  headers: {
    "Content-Type": "multipart/form-data"
  }
});

// ✅ token yaha bhi lagana important hai
apiUpload.interceptors.request.use(config => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default apiUpload;