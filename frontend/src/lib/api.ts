import axios from "axios";

let backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";

// Ensure the backend URL has a valid protocol to avoid being treated as a relative path
if (backendUrl && !backendUrl.startsWith("http://") && !backendUrl.startsWith("https://")) {
  backendUrl = `https://${backendUrl}`;
}

const api = axios.create({
  baseURL: `${backendUrl}/api`,
  withCredentials: true, // Required to send HTTP-Only cookies
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
