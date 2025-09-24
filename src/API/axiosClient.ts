import axios, {
  type AxiosInstance,
  type AxiosRequestConfig,
  type AxiosResponse,
  type Method,
  type AxiosError,
  type InternalAxiosRequestConfig,
} from 'axios';
import type { ApiResponse, ErrorResponse } from './types/api';

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

console.log('API_BASE_URL', API_BASE_URL);

// Default configuration for FPL API
const defaultConfig: AxiosRequestConfig = {
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
  },
};

// Create axios instance
const axiosClient: AxiosInstance = axios.create(defaultConfig);

// Request interceptor
axiosClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Log request in development
    if (import.meta.env.VITE_DEV) {
      console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`);
    }
    return config;
  },
  (error: AxiosError) => {
    console.error('Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
axiosClient.interceptors.response.use(
  (response: AxiosResponse) => {
    // Log response in development
    if (import.meta.env.VITE_DEV) {
      console.log(`API Response: ${response.status} ${response.config.url}`);
    }
    return response;
  },
  (error: AxiosError) => {
    // Handle different types of errors
    if (error.response) {
      // Server responded with error status
      console.error('API Error Response:', {
        status: error.response.status,
        statusText: error.response.statusText,
        url: error.config?.url,
        data: error.response.data,
      });
    } else if (error.request) {
      // Request was made but no response received
      console.error('Network Error:', error.message);
    } else {
      // Something else happened
      console.error('Request Setup Error:', error.message);
    }

    return Promise.reject(error);
  }
);

/*Generic request function*/
const ApiRequest = <T = unknown, D = unknown>(options: {
  method: Method;
  url: string;
  data?: D;
  config?: AxiosRequestConfig;
}): Promise<ApiResponse<T>> => {
  return axiosClient
    .request({
      method: options.method,
      url: options.url,
      data: options.data,
      ...options.config,
    })
    .then((response: AxiosResponse<ApiResponse<T>>) => response.data)
    .catch((error: AxiosError<ErrorResponse>) => {
      throw new Error(
        error.response?.data?.error?.message || 'An error occurred'
      );
    });
};

export default ApiRequest;
