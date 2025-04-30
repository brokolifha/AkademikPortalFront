import { useCookie } from "@core/composable/useCookie";
import axios from "axios";

// Axios instance oluştur
const useApi = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "/api",
  headers: {
    Accept: "application/json",
  },
});

// Request interceptor - token ekle
useApi.interceptors.request.use(
  (config) => {
    const accessToken = useCookie("accessToken").value;
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - JSON parse et
/*
useApi.interceptors.response.use(
  (response) => {
    let parsedData = null;
    try {
      parsedData = destr(response.data);
    } catch (error) {
      console.error(error);
    }
    response.data = parsedData;
    return response;
  },
  (error) => {
    return Promise.reject(error);
  }
);
*/

export { useApi };
