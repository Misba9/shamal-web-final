import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import { AuthProvider } from './contexts/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { LoginPage } from './pages/Login';
import { DashboardPage } from './pages/Dashboard';
import { ProjectsPage } from './pages/Projects';
import { ProjectFormPage } from './pages/ProjectForm';
import { BlogsPage } from './pages/Blogs';
import { BlogFormPage } from './pages/BlogForm';
import { ContactsPage } from './pages/Contacts';
import { NewsletterPage } from './pages/Newsletter';
import { CategoriesPage } from './pages/Categories';
import { ProductsPage } from './pages/Products';
import { ProductFormPage } from './pages/ProductForm';
import { ServicesPage } from './pages/Services';
import { ServiceFormPage } from './pages/ServiceForm';
import { JobsPage } from './pages/Jobs';
import { JobFormPage } from './pages/JobForm';
import { ApplicationsPage } from './pages/Applications';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster position="top-right" richColors closeButton />
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/projects" element={<ProjectsPage />} />
            <Route path="/projects/new" element={<ProjectFormPage />} />
            <Route path="/projects/:id/edit" element={<ProjectFormPage />} />
            <Route path="/projects/categories" element={<CategoriesPage />} />
            <Route path="/blogs" element={<BlogsPage />} />
            <Route path="/blogs/new" element={<BlogFormPage />} />
            <Route path="/blogs/:id/edit" element={<BlogFormPage />} />
            <Route path="/products" element={<ProductsPage />} />
            <Route path="/products/new" element={<ProductFormPage />} />
            <Route path="/products/:id/edit" element={<ProductFormPage />} />
            <Route path="/services" element={<ServicesPage />} />
            <Route path="/services/new" element={<ServiceFormPage />} />
            <Route path="/services/:id/edit" element={<ServiceFormPage />} />
            <Route path="/jobs" element={<JobsPage />} />
            <Route path="/jobs/new" element={<JobFormPage />} />
            <Route path="/jobs/:id/edit" element={<JobFormPage />} />
            <Route path="/applications" element={<ApplicationsPage />} />
            <Route path="/contacts" element={<ContactsPage />} />
            <Route path="/newsletter" element={<NewsletterPage />} />
          </Route>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
