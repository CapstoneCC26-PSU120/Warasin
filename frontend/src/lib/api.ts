import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000/api",
  withCredentials: true, // Required to send HTTP-Only cookies
});

export default api;
