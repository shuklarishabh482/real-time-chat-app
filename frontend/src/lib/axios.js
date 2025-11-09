import axios from "axios";
export const axiosInstance = axios.create({
  baseURL:import.meta.env.VITE_BACKEND_API_URL || "http://localhost:4000/api",
  withCredentials: true,
});
