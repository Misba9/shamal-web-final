import { apiClient } from './api';

export interface Admin {
  id: string;
  email: string;
  role: string;
  createdAt: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  token: string;
  admin: Admin;
}

export interface ProjectsByStatus {
  draft: number;
  active: number;
  completed: number;
}

export interface RecentActivity {
  action: string;
  entity: string;
  entityId?: string | null;
  details?: string;
  createdAt: string;
  adminId?: { email?: string } | null;
}

export interface DashboardData {
  projectsCount: number;
  projectsByStatus: ProjectsByStatus;
  blogsThisMonth: number;
  newUsersToday: number;
  newUsersThisWeek: number;
  websiteVisits: number;
  recentActivities: RecentActivity[];
  // Backward compatibility
  totalProjects?: number;
  totalBlogs?: number;
  totalUsers?: number;
  totalLeads?: number;
}

export interface Category {
  _id: string;
  name: string;
  slug?: string;
}

export interface Project {
  _id: string;
  title: string;
  description?: string;
  tags?: string[];
  category?: string | Category | null;
  images?: string[];
  projectUrl?: string;
  startDate?: string | null;
  endDate?: string | null;
  archived?: boolean;
  archivedAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ProjectsListParams {
  page?: number;
  limit?: number;
  category?: string;
  archived?: boolean;
}

export interface ProjectsResponse {
  success: boolean;
  count: number;
  data: Project[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export type BlogStatus = 'draft' | 'published';

export interface Blog {
  _id: string;
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  author?: string;
  featuredImage?: string;
  thumbnail?: string;
  status: BlogStatus;
  published?: boolean;
  metaTitle?: string;
  metaDescription?: string;
  keywords?: string[];
  publishedAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface BlogsListParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: BlogStatus;
}

export interface BlogsResponse {
  success: boolean;
  count: number;
  data: Blog[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export const authApi = {
  login: async (credentials: LoginCredentials): Promise<LoginResponse> => {
    const response = await apiClient.post<LoginResponse>('/auth/admin/login', credentials);
    return response.data;
  },
};

export const adminApi = {
  getDashboard: async (): Promise<DashboardData> => {
    const response = await apiClient.get<DashboardData>('/admin/dashboard');
    return response.data;
  },
};

export const categoriesApi = {
  getAll: async (): Promise<{ success: boolean; data: Category[] }> => {
    const response = await apiClient.get<{ success: boolean; data: Category[] }>('/categories');
    return response.data;
  },
  create: async (data: { name: string }): Promise<{ success: boolean; message: string; data: Category }> => {
    const response = await apiClient.post<{ success: boolean; message: string; data: Category }>('/categories', data);
    return response.data;
  },
  delete: async (id: string): Promise<{ success: boolean; message: string }> => {
    const response = await apiClient.delete<{ success: boolean; message: string }>(`/categories/${id}`);
    return response.data;
  },
};

export const projectsApi = {
  getAll: async (params?: ProjectsListParams): Promise<ProjectsResponse> => {
    const response = await apiClient.get<ProjectsResponse>('/projects', {
      params: {
        ...(params?.page != null && { page: params.page }),
        ...(params?.limit != null && { limit: params.limit }),
        ...(params?.category && { category: params.category }),
        ...(params?.archived === true && { archived: 'true' }),
        ...(params?.archived === false && { archived: 'false' }),
      },
    });
    const d = response.data;
    return { ...d, data: Array.isArray(d?.data) ? d.data : [] };
  },
  getById: async (id: string): Promise<{ success: boolean; data: Project }> => {
    const response = await apiClient.get<{ success: boolean; data: Project }>(`/projects/${id}`);
    return response.data;
  },
  create: async (data: Partial<Project> | FormData): Promise<{ success: boolean; message: string; data: Project }> => {
    const response = await apiClient.post<{ success: boolean; message: string; data: Project }>('/projects', data, {
      headers: data instanceof FormData ? { 'Content-Type': 'multipart/form-data' } : {},
    });
    return response.data;
  },
  update: async (id: string, data: Partial<Project> | FormData): Promise<{ success: boolean; message: string; data: Project }> => {
    const response = await apiClient.put<{ success: boolean; message: string; data: Project }>(`/projects/${id}`, data, {
      headers: data instanceof FormData ? { 'Content-Type': 'multipart/form-data' } : {},
    });
    return response.data;
  },
  delete: async (id: string): Promise<{ success: boolean; message: string; data: Project }> => {
    const response = await apiClient.delete<{ success: boolean; message: string; data: Project }>(`/projects/${id}`);
    return response.data;
  },
  uploadImages: async (files: File[]): Promise<{ success: boolean; data: { paths: string[] } }> => {
    const form = new FormData();
    files.forEach((f) => form.append('images', f));
    const response = await apiClient.post<{ success: boolean; data: { paths: string[] } }>('/projects/upload-images', form);
    return response.data;
  },
};

export const blogsApi = {
  getAll: async (params?: BlogsListParams): Promise<BlogsResponse> => {
    const sp = new URLSearchParams();
    if (params?.page != null) sp.set('page', String(params.page));
    if (params?.limit != null) sp.set('limit', String(params.limit));
    if (params?.search) sp.set('search', params.search);
    if (params?.status) sp.set('status', params.status);
    const q = sp.toString();
    const response = await apiClient.get<BlogsResponse>(`/blogs${q ? `?${q}` : ''}`);
    return response.data;
  },
  checkSlug: async (slug: string, excludeId?: string): Promise<{ success: boolean; available: boolean }> => {
    const sp = new URLSearchParams({ slug });
    if (excludeId) sp.set('excludeId', excludeId);
    const response = await apiClient.get<{ success: boolean; available: boolean }>(`/blogs/check-slug?${sp}`);
    return response.data;
  },
  getById: async (id: string): Promise<{ success: boolean; data: Blog }> => {
    const response = await apiClient.get<{ success: boolean; data: Blog }>(`/blogs/${id}`);
    return response.data;
  },
  create: async (data: Partial<Blog> | FormData): Promise<{ success: boolean; message: string; data: Blog }> => {
    const response = await apiClient.post<{ success: boolean; message: string; data: Blog }>('/blogs', data, {
      headers: data instanceof FormData ? { 'Content-Type': 'multipart/form-data' } : {},
    });
    return response.data;
  },
  update: async (id: string, data: Partial<Blog> | FormData): Promise<{ success: boolean; message: string; data: Blog }> => {
    const response = await apiClient.put<{ success: boolean; message: string; data: Blog }>(`/blogs/${id}`, data, {
      headers: data instanceof FormData ? { 'Content-Type': 'multipart/form-data' } : {},
    });
    return response.data;
  },
  delete: async (id: string): Promise<{ success: boolean; message: string; data: Blog }> => {
    const response = await apiClient.delete<{ success: boolean; message: string; data: Blog }>(`/blogs/${id}`);
    return response.data;
  },
  uploadImage: async (file: File): Promise<{ success: boolean; url: string }> => {
    const form = new FormData();
    form.append('image', file);
    const response = await apiClient.post<{ success: boolean; url: string }>('/blogs/upload-image', form, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
};

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

export interface ProductsListParams {
  active?: boolean;
  home?: boolean;
}

export const productsApi = {
  getAll: async (params?: ProductsListParams): Promise<ProductsResponse> => {
    const sp = new URLSearchParams();
    if (params?.active === true) sp.set('active', 'true');
    if (params?.active === false) sp.set('active', 'false');
    if (params?.home === true) sp.set('home', 'true');
    if (params?.home === false) sp.set('home', 'false');
    const q = sp.toString();
    const response = await apiClient.get<ProductsResponse>(`/products${q ? `?${q}` : ''}`);
    return response.data;
  },
  getBySlug: async (slug: string): Promise<{ success: boolean; data: Product }> => {
    const response = await apiClient.get<{ success: boolean; data: Product }>(`/products/${slug}`);
    return response.data;
  },
  getById: async (id: string): Promise<{ success: boolean; data: Product }> => {
    // Backend supports getting by ID when slug is an ObjectId (for admin)
    const response = await apiClient.get<{ success: boolean; data: Product }>(`/products/${id}`);
    return response.data;
  },
  create: async (data: Partial<Product> | FormData): Promise<{ success: boolean; message: string; data: Product }> => {
    const response = await apiClient.post<{ success: boolean; message: string; data: Product }>('/products', data, {
      headers: data instanceof FormData ? { 'Content-Type': 'multipart/form-data' } : {},
    });
    return response.data;
  },
  update: async (id: string, data: Partial<Product> | FormData): Promise<{ success: boolean; message: string; data: Product }> => {
    const response = await apiClient.put<{ success: boolean; message: string; data: Product }>(`/products/${id}`, data, {
      headers: data instanceof FormData ? { 'Content-Type': 'multipart/form-data' } : {},
    });
    return response.data;
  },
  delete: async (id: string): Promise<{ success: boolean; message: string; data: Product }> => {
    const response = await apiClient.delete<{ success: boolean; message: string; data: Product }>(`/products/${id}`);
    return response.data;
  },
  uploadImage: async (file: File): Promise<{ success: boolean; url: string }> => {
    const form = new FormData();
    form.append('image', file);
    const response = await apiClient.post<{ success: boolean; url: string }>('/products/upload-image', form, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
};

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

export interface ServicesListParams {
  active?: boolean;
  home?: boolean;
}

export const servicesApi = {
  getAll: async (params?: ServicesListParams): Promise<ServicesResponse> => {
    const sp = new URLSearchParams();
    if (params?.active === true) sp.set('active', 'true');
    if (params?.active === false) sp.set('active', 'false');
    if (params?.home === true) sp.set('home', 'true');
    if (params?.home === false) sp.set('home', 'false');
    const q = sp.toString();
    const response = await apiClient.get<ServicesResponse>(`/services${q ? `?${q}` : ''}`);
    return response.data;
  },
  getBySlug: async (slug: string): Promise<{ success: boolean; data: Service }> => {
    const response = await apiClient.get<{ success: boolean; data: Service }>(`/services/${slug}`);
    return response.data;
  },
  getById: async (id: string): Promise<{ success: boolean; data: Service }> => {
    const response = await apiClient.get<{ success: boolean; data: Service }>(`/services/${id}`);
    return response.data;
  },
  create: async (data: Partial<Service> | FormData): Promise<{ success: boolean; message: string; data: Service }> => {
    const response = await apiClient.post<{ success: boolean; message: string; data: Service }>('/services', data, {
      headers: data instanceof FormData ? { 'Content-Type': 'multipart/form-data' } : {},
    });
    return response.data;
  },
  update: async (id: string, data: Partial<Service> | FormData): Promise<{ success: boolean; message: string; data: Service }> => {
    const response = await apiClient.put<{ success: boolean; message: string; data: Service }>(`/services/${id}`, data, {
      headers: data instanceof FormData ? { 'Content-Type': 'multipart/form-data' } : {},
    });
    return response.data;
  },
  delete: async (id: string): Promise<{ success: boolean; message: string; data: Service }> => {
    const response = await apiClient.delete<{ success: boolean; message: string; data: Service }>(`/services/${id}`);
    return response.data;
  },
  uploadImage: async (file: File): Promise<{ success: boolean; url: string }> => {
    const form = new FormData();
    form.append('image', file);
    const response = await apiClient.post<{ success: boolean; url: string }>('/services/upload-image', form, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
};

export type EmploymentType = 'Full-Time' | 'Part-Time' | 'Contract' | 'Internship';

export interface Job {
  _id: string;
  title: string;
  slug: string;
  department?: string;
  location?: string;
  employmentType: EmploymentType;
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

export interface JobsListParams {
  active?: boolean;
}

export const jobsApi = {
  getAll: async (params?: JobsListParams): Promise<JobsResponse> => {
    const sp = new URLSearchParams();
    if (params?.active === true) sp.set('active', 'true');
    if (params?.active === false) sp.set('active', 'false');
    const q = sp.toString();
    const response = await apiClient.get<JobsResponse>(`/jobs${q ? `?${q}` : ''}`);
    return response.data;
  },
  getBySlug: async (slug: string): Promise<{ success: boolean; data: Job }> => {
    const response = await apiClient.get<{ success: boolean; data: Job }>(`/jobs/${slug}`);
    return response.data;
  },
  getById: async (id: string): Promise<{ success: boolean; data: Job }> => {
    const response = await apiClient.get<{ success: boolean; data: Job }>(`/jobs/${id}`);
    return response.data;
  },
  create: async (data: Partial<Job> | FormData): Promise<{ success: boolean; message: string; data: Job }> => {
    const response = await apiClient.post<{ success: boolean; message: string; data: Job }>('/jobs', data, {
      headers: data instanceof FormData ? { 'Content-Type': 'multipart/form-data' } : {},
    });
    return response.data;
  },
  update: async (id: string, data: Partial<Job> | FormData): Promise<{ success: boolean; message: string; data: Job }> => {
    const response = await apiClient.put<{ success: boolean; message: string; data: Job }>(`/jobs/${id}`, data, {
      headers: data instanceof FormData ? { 'Content-Type': 'multipart/form-data' } : {},
    });
    return response.data;
  },
  delete: async (id: string): Promise<{ success: boolean; message: string; data: Job }> => {
    const response = await apiClient.delete<{ success: boolean; message: string; data: Job }>(`/jobs/${id}`);
    return response.data;
  },
};

export type ApplicationStatus = 'New' | 'Reviewed' | 'Shortlisted' | 'Rejected';

export interface JobApplication {
  _id: string;
  jobId: string | { _id: string; title: string; slug?: string };
  jobTitle: string;
  fullName: string;
  email: string;
  phone?: string;
  coverLetter?: string;
  resumeUrl: string;
  status: ApplicationStatus;
  createdAt: string;
  updatedAt: string;
}

export interface ApplicationsResponse {
  success: boolean;
  count: number;
  data: JobApplication[];
}

export interface ApplicationsListParams {
  jobId?: string;
}

export const applicationsApi = {
  getAll: async (params?: ApplicationsListParams): Promise<ApplicationsResponse> => {
    const sp = new URLSearchParams();
    if (params?.jobId) sp.set('jobId', params.jobId);
    const q = sp.toString();
    const response = await apiClient.get<ApplicationsResponse>(`/admin/applications${q ? `?${q}` : ''}`);
    return response.data;
  },
  getByJob: async (jobId: string): Promise<ApplicationsResponse> => {
    const response = await apiClient.get<ApplicationsResponse>(`/admin/applications/job/${jobId}`);
    return response.data;
  },
  updateStatus: async (id: string, status: ApplicationStatus): Promise<{ success: boolean; message: string; data: JobApplication }> => {
    const response = await apiClient.put<{ success: boolean; message: string; data: JobApplication }>(`/admin/applications/${id}`, { status });
    return response.data;
  },
};

export type LeadStatus = 'new' | 'contacted' | 'converted';

export interface Lead {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
  status: LeadStatus;
  internalNotes?: string;
  emailNotify?: boolean;
  read?: boolean;
  source?: string;
  createdAt: string;
  updatedAt: string;
}

export interface LeadsListParams {
  status?: LeadStatus;
  search?: string;
}

export interface LeadsResponse {
  success: boolean;
  count: number;
  data: Lead[];
}

export const leadsApi = {
  getAll: async (params?: LeadsListParams | string): Promise<LeadsResponse> => {
    const sp = new URLSearchParams();
    if (params != null) {
      if (typeof params === 'string') {
        if (params) sp.set('status', params);
      } else {
        if (params.status) sp.set('status', params.status);
        if (params.search) sp.set('search', params.search);
      }
    }
    const q = sp.toString();
    const response = await apiClient.get<LeadsResponse>(`/contacts${q ? `?${q}` : ''}`);
    return response.data;
  },
  getById: async (id: string): Promise<{ success: boolean; data: Lead }> => {
    const response = await apiClient.get<{ success: boolean; data: Lead }>(`/contacts/${id}`);
    return response.data;
  },
  create: async (data: Partial<Lead> | FormData): Promise<{ success: boolean; message: string; data: Lead }> => {
    const response = await apiClient.post<{ success: boolean; message: string; data: Lead }>('/contacts', data, {
      headers: data instanceof FormData ? { 'Content-Type': 'multipart/form-data' } : {},
    });
    return response.data;
  },
  update: async (id: string, data: Partial<Pick<Lead, 'status' | 'internalNotes' | 'emailNotify' | 'name' | 'email' | 'phone' | 'message' | 'read'>> | FormData): Promise<{ success: boolean; message: string; data: Lead }> => {
    const response = await apiClient.patch<{ success: boolean; message: string; data: Lead }>(`/contacts/${id}`, data, {
      headers: data instanceof FormData ? { 'Content-Type': 'multipart/form-data' } : {},
    });
    return response.data;
  },
  /** Trigger CSV download. Uses same filters as getAll. */
  exportCsv: async (params?: LeadsListParams): Promise<void> => {
    const sp = new URLSearchParams();
    if (params?.status) sp.set('status', params.status);
    if (params?.search) sp.set('search', params.search);
    const q = sp.toString();
    const response = await apiClient.get<Blob>(`/contacts/export${q ? `?${q}` : ''}`, { responseType: 'blob' });
    const blob = response.data;
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `contacts-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  },
  delete: async (id: string): Promise<{ success: boolean; message: string; data: Lead }> => {
    const response = await apiClient.delete<{ success: boolean; message: string; data: Lead }>(`/contacts/${id}`);
    return response.data;
  },
};

export interface NewsletterSubscriber {
  _id: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

export interface NewsletterResponse {
  success: boolean;
  count: number;
  data: NewsletterSubscriber[];
}

export const newsletterApi = {
  getAll: async (): Promise<NewsletterResponse> => {
    const response = await apiClient.get<NewsletterResponse>('/newsletter');
    return response.data;
  },
  exportCsv: async (): Promise<void> => {
    const response = await apiClient.get<Blob>('/newsletter/export', { responseType: 'blob' });
    const blob = response.data;
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `newsletter-subscribers-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  },
  delete: async (id: string): Promise<{ success: boolean; message: string; data: NewsletterSubscriber }> => {
    const response = await apiClient.delete<{ success: boolean; message: string; data: NewsletterSubscriber }>(`/newsletter/${id}`);
    return response.data;
  },
};

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  role?: string;
}

export interface UsersResponse {
  success: boolean;
  users: User[];
  pagination: {
    page: number;
    pages: number;
    total: number;
  };
}

export const usersApi = {
  getAll: async (page: number, limit: number): Promise<UsersResponse> => {
    const response = await apiClient.get<UsersResponse>('/users', {
      params: { page, limit },
    });
    return response.data;
  },
  create: async (data: RegisterData): Promise<{ success: boolean; message: string; user: User }> => {
    const response = await apiClient.post<{ success: boolean; message: string; user: User }>('/users', data);
    return response.data;
  },
  delete: async (id: string): Promise<{ success: boolean; message: string }> => {
    const response = await apiClient.delete<{ success: boolean; message: string }>(`/users/${id}`);
    return response.data;
  },
};
