import axios, { AxiosInstance, InternalAxiosRequestConfig } from 'axios';

/**
 * Centralized Axios instance for admin (protected APIs).
 * - Base URL from .env (VITE_API_BASE_URL)
 * - JWT from localStorage on every request
 * - 401 → clear auth and redirect to /login
 */
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3002/api';

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      headers: { 'Content-Type': 'application/json' },
    });
    this.setupInterceptors();
  }

  private setupInterceptors(): void {
    this.client.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        const token = localStorage.getItem('token');
        if (token && config.headers) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        // Let the browser set multipart/form-data with boundary when sending FormData
        if (config.data instanceof FormData && config.headers) {
          delete config.headers['Content-Type'];
        }
        return config;
      },
      (e) => Promise.reject(e)
    );

    this.client.interceptors.response.use(
      (r) => r,
      (err) => {
        if (err.response?.status === 401) {
          localStorage.removeItem('token');
          localStorage.removeItem('admin');
          window.location.href = '/login';
        }
        return Promise.reject(err);
      }
    );
  }

  get instance(): AxiosInstance {
    return this.client;
  }
}

export const apiClient = new ApiClient().instance;
