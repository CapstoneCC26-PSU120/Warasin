import axios from "axios";

const api = axios.create({
  baseURL: `${process.env.BACKEND_URL}/api`,
  withCredentials: true, // Required to send HTTP-Only cookies
});

export default api;
