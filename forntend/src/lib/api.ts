/**
 * Frontend API client – public APIs only.
 * Base URL from .env. Do NOT put secrets here (Vite env is exposed to the client).
 */
import axios, { type AxiosInstance } from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3002/api';

export { API_BASE_URL };

/** Reusable axios instance; baseURL from VITE_API_BASE_URL. */
export const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000,
});

export async function apiRequest<T>(path: string, options?: RequestInit): Promise<T> {
  const url = path.startsWith('/') ? `${API_BASE_URL}${path}` : `${API_BASE_URL}/${path}`;
  const res = await fetch(url, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...(options?.headers as Record<string, string>) },
  });
  if (!res.ok) {
    const text = await res.text();
    let err: Error;
    try {
      const j = JSON.parse(text);
      err = new Error(j.message || text || `HTTP ${res.status}`);
    } catch {
      err = new Error(text || `HTTP ${res.status}`);
    }
    throw err;
  }
  return res.json();
}

// --- Categories (public) ---
export interface Category {
  _id: string;
  name: string;
  slug?: string;
}

export interface CategoriesResponse {
  success: boolean;
  data: Category[];
}

export async function getCategories(): Promise<CategoriesResponse> {
  try {
    const { data } = await api.get<CategoriesResponse>('/categories');
    
    // Handle error response from backend
    if (data?.success === false) {
      throw new Error(data.message || 'Failed to fetch categories');
    }
    
    return {
      success: data?.success !== false,
      data: Array.isArray(data?.data) ? data.data : [],
    };
  } catch (error: any) {
    // Re-throw with meaningful error message
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    if (error.message) {
      throw error;
    }
    throw new Error('Failed to fetch categories. Please try again later.');
  }
}

// --- Projects (public: active only) ---
export interface Project {
  _id: string;
  title: string;
  description?: string;
  image?: string;
  images?: string[];
  status?: string;
  tags?: string[];
  category?: string | { _id: string; name: string };
  gallery?: string[];
  projectUrl?: string;
  startDate?: string | null;
  endDate?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ProjectsResponse {
  success: boolean;
  page: number;
  limit: number;
  total: number;
  data: Project[];
  count?: number;
  pagination?: { page: number; limit: number; total: number; totalPages: number };
}

export interface GetProjectsParams {
  page?: number;
  limit?: number;
}

/**
 * Fetch projects with pagination. Uses Axios with `params` so query string
 * is built correctly. Missing/invalid page or limit are handled by the backend.
 */
export async function getProjects(params?: GetProjectsParams): Promise<ProjectsResponse> {
  try {
    const requestParams: Record<string, number> = {};
    if (params?.page != null && Number.isInteger(params.page)) requestParams.page = params.page;
    if (params?.limit != null && Number.isInteger(params.limit)) requestParams.limit = params.limit;

    const { data } = await api.get<ProjectsResponse>('/projects', { params: requestParams });
    
    // Handle error response from backend
    if (data?.success === false) {
      throw new Error(data.message || 'Failed to fetch projects');
    }
    
    return {
      success: data?.success !== false,
      page: typeof data?.page === 'number' ? data.page : 1,
      limit: typeof data?.limit === 'number' ? data.limit : 10,
      total: typeof data?.total === 'number' ? data.total : 0,
      data: Array.isArray(data?.data) ? data.data : [],
      count: typeof data?.count === 'number' ? data.count : (Array.isArray(data?.data) ? data.data.length : 0),
      pagination: data?.pagination || {
        page: typeof data?.page === 'number' ? data.page : 1,
        limit: typeof data?.limit === 'number' ? data.limit : 10,
        total: typeof data?.total === 'number' ? data.total : 0,
        totalPages: typeof data?.total === 'number' && typeof data?.limit === 'number' && data.limit > 0
          ? Math.ceil(data.total / data.limit)
          : 1,
      },
    };
  } catch (error: any) {
    // Re-throw with meaningful error message
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    if (error.message) {
      throw error;
    }
    throw new Error('Failed to fetch projects. Please try again later.');
  }
}

export async function getProject(id: string): Promise<{ success: boolean; data: Project }> {
  return apiRequest<{ success: boolean; data: Project }>(`/projects/${encodeURIComponent(id)}`);
}

// --- Blogs (public: published only) ---
export interface Blog {
  _id: string;
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  author?: string;
  featuredImage?: string;
  thumbnail?: string;
  status: string;
  keywords?: string[];
  publishedAt?: string | null;
  createdAt: string;
  updatedAt: string;
  metaTitle?: string;
  metaDescription?: string;
}

export interface BlogsResponse {
  success: boolean;
  count: number;
  data: Blog[];
  pagination?: { page: number; limit: number; total: number; totalPages: number };
}

export async function getBlogs(params?: { page?: number; limit?: number }): Promise<BlogsResponse> {
  const sp = new URLSearchParams();
  if (params?.page != null) sp.set('page', String(params.page));
  if (params?.limit != null) sp.set('limit', String(params.limit));
  const q = sp.toString();
  return apiRequest<BlogsResponse>(`/blogs${q ? `?${q}` : ''}`);
}

export async function getBlogBySlug(slug: string): Promise<{ success: boolean; data: Blog }> {
  return apiRequest<{ success: boolean; data: Blog }>(`/blogs/${encodeURIComponent(slug)}`);
}

// --- Contact form (public) ---
export async function postContact(data: {
  name: string;
  email: string;
  phone?: string;
  message: string;
}): Promise<{ success: boolean; message: string }> {
  return apiRequest<{ success: boolean; message: string }>('/contacts', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

// --- Newsletter (public) ---
export async function postNewsletter(email: string): Promise<{ success: boolean; message: string }> {
  return apiRequest<{ success: boolean; message: string }>('/newsletter', {
    method: 'POST',
    body: JSON.stringify({ email }),
  });
}

// --- Products (public: active only) ---
export interface Product {
  _id: string;
  name: string;
  slug: string;
  shortDescription?: string;
  description?: string;
  image?: string;
  price?: number | null;
  isActive: boolean;
  showOnHome: boolean;
  order?: number;
  createdAt: string;
  updatedAt: string;
}

export interface ProductsResponse {
  success: boolean;
  count: number;
  data: Product[];
}

export interface GetProductsParams {
  active?: boolean;
  home?: boolean;
}

export async function getProducts(params?: GetProductsParams): Promise<ProductsResponse> {
  try {
    const requestParams: Record<string, string> = {};
    if (params?.active === true) requestParams.active = 'true';
    if (params?.active === false) requestParams.active = 'false';
    if (params?.home === true) requestParams.home = 'true';
    if (params?.home === false) requestParams.home = 'false';

    const { data } = await api.get<ProductsResponse>('/products', { params: requestParams });
    
    if (data?.success === false) {
      throw new Error(data.message || 'Failed to fetch products');
    }
    
    return {
      success: data?.success !== false,
      count: typeof data?.count === 'number' ? data.count : (Array.isArray(data?.data) ? data.data.length : 0),
      data: Array.isArray(data?.data) ? data.data : [],
    };
  } catch (error: any) {
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    if (error.message) {
      throw error;
    }
    throw new Error('Failed to fetch products. Please try again later.');
  }
}

export async function getProductBySlug(slug: string): Promise<{ success: boolean; data: Product }> {
  return apiRequest<{ success: boolean; data: Product }>(`/products/${encodeURIComponent(slug)}`);
}

// --- Services (public: active only) ---
export interface Service {
  _id: string;
  title: string;
  slug: string;
  shortDescription: string;
  description: string;
  icon?: string;
  featuredImage?: string;
  isActive: boolean;
  showOnHome: boolean;
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface ServicesResponse {
  success: boolean;
  count: number;
  data: Service[];
}

export async function getServices(): Promise<ServicesResponse> {
  try {
    const { data } = await api.get<ServicesResponse>('/services');
    
    if (data?.success === false) {
      throw new Error(data.message || 'Failed to fetch services');
    }
    
    return {
      success: data?.success !== false,
      count: typeof data?.count === 'number' ? data.count : (Array.isArray(data?.data) ? data.data.length : 0),
      data: Array.isArray(data?.data) ? data.data : [],
    };
  } catch (error: any) {
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    if (error.message) {
      throw error;
    }
    throw new Error('Failed to fetch services. Please try again later.');
  }
}

export async function getHomeServices(): Promise<ServicesResponse> {
  try {
    const { data } = await api.get<ServicesResponse>('/services/home');
    
    if (data?.success === false) {
      throw new Error(data.message || 'Failed to fetch services');
    }
    
    return {
      success: data?.success !== false,
      count: typeof data?.count === 'number' ? data.count : (Array.isArray(data?.data) ? data.data.length : 0),
      data: Array.isArray(data?.data) ? data.data : [],
    };
  } catch (error: any) {
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    if (error.message) {
      throw error;
    }
    throw new Error('Failed to fetch services. Please try again later.');
  }
}

export async function getServiceBySlug(slug: string): Promise<{ success: boolean; data: Service }> {
  return apiRequest<{ success: boolean; data: Service }>(`/services/${encodeURIComponent(slug)}`);
}

// --- Jobs (public: active only) ---
export interface Job {
  _id: string;
  title: string;
  slug: string;
  department?: string;
  location?: string;
  employmentType: 'Full-Time' | 'Part-Time' | 'Contract' | 'Internship';
  experience?: string;
  description: string;
  requirements?: string[];
  responsibilities?: string[];
  isActive: boolean;
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface JobsResponse {
  success: boolean;
  count: number;
  data: Job[];
}

export async function getJobs(): Promise<JobsResponse> {
  try {
    const { data } = await api.get<JobsResponse>('/jobs');
    
    if (data?.success === false) {
      throw new Error(data.message || 'Failed to fetch jobs');
    }
    
    return {
      success: data?.success !== false,
      count: typeof data?.count === 'number' ? data.count : (Array.isArray(data?.data) ? data.data.length : 0),
      data: Array.isArray(data?.data) ? data.data : [],
    };
  } catch (error: any) {
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    if (error.message) {
      throw error;
    }
    throw new Error('Failed to fetch jobs. Please try again later.');
  }
}

export async function getJobBySlug(slug: string): Promise<{ success: boolean; data: Job }> {
  return apiRequest<{ success: boolean; data: Job }>(`/jobs/${encodeURIComponent(slug)}`);
}

export async function submitJobApplication(formData: FormData): Promise<{ success: boolean; message: string }> {
  try {
    const response = await fetch(`${API_BASE_URL}/jobs/apply`, {
      method: 'POST',
      body: formData,
    });
    
    if (!response.ok) {
      const text = await response.text();
      let err: Error;
      try {
        const j = JSON.parse(text);
        err = new Error(j.message || text || `HTTP ${response.status}`);
      } catch {
        err = new Error(text || `HTTP ${response.status}`);
      }
      throw err;
    }
    
    return response.json();
  } catch (error: any) {
    if (error.message) {
      throw error;
    }
    throw new Error('Failed to submit application. Please try again later.');
  }
}
