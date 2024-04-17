import axios from "axios";
import router from "../router";
// import { format } from "@redtea/format-axios-error";
function getToken() {
  const token = JSON.parse(localStorage.getItem("token"));
  return token;
}

const apiClient = axios.create({
  baseURL: process.env.VUE_APP_BACKEND_URL,
  timeout: 20000,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use(
  (config) => {
    if (config.authorization !== false) {
      const token = getToken();
      if (token) {
        config.headers.Authorization = token;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    // if (process.env.NODE_NV != "production") {
    //   console.error(JSON.stringify(format(error), null, 2));
    // }

    if (error.response?.status == 401) {
      localStorage.clear();
      router.push({ name: "auth.login" });
    }

    if (error.response?.status == 404) {
      router.push({ name: "NotFound" });
    }

    throw error;
  }
);

export default apiClient;
