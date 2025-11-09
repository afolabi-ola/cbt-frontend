import axios from "axios";
import { NextRequest } from "next/server";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.log("Unauthorized — redirect to login");
      // todo: handleLogout
    }

    return Promise.reject(error);
  }
);

export default api;
