// apiUpload.js
import axios from "axios";

const apiUpload = axios.create({
  baseURL: "https://shona-backend-ea93.onrender.com/api",
  withCredentials: true, // optional
});

export default apiUpload;