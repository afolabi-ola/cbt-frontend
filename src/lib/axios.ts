import axios from "axios";
import toast from "react-hot-toast";

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
      // todo: handleLogout if unauthorized
    }

    return Promise.reject(error);
  }
);

export default api;

export const errorLogger = (error: unknown) => {
  const defaultErrorMessage = "Server Error. Please try again";

  if (typeof error === "string") return toast.error(error);

  if (!axios.isAxiosError(error)) return toast.error(defaultErrorMessage);

  if (error.response?.data) {
    const responseError =
      error.response?.data.message ||
      error.response?.data.details ||
      error.response?.data.error ||
      defaultErrorMessage;

    return toast.error(responseError);
  }

  return toast.error(defaultErrorMessage);
};
