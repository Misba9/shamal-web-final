import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Admin, authApi } from '../lib/api-client';

interface AuthContextType {
  admin: Admin | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initAuth = () => {
      const storedAdmin = localStorage.getItem('admin');
      const token = localStorage.getItem('token');

      if (storedAdmin && token) {
        try {
          const adminData = JSON.parse(storedAdmin);
          setAdmin(adminData);
        } catch (error) {
          localStorage.removeItem('token');
          localStorage.removeItem('admin');
          setAdmin(null);
        }
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email: string, password: string): Promise<void> => {
    try {
      const response = await authApi.login({ email, password });
      
      if (response.success && response.token && response.admin) {
        localStorage.setItem('token', response.token);
        localStorage.setItem('admin', JSON.stringify(response.admin));
        setAdmin(response.admin);
      } else {
        throw new Error(response.message || 'Login failed');
      }
    } catch (error: unknown) {
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as { response?: { data?: { message?: string } } };
        const errorMessage = axiosError.response?.data?.message || 'Login failed. Please try again.';
        throw new Error(errorMessage);
      }
      throw new Error('Login failed. Please try again.');
    }
  };

  const logout = (): void => {
    localStorage.removeItem('token');
    localStorage.removeItem('admin');
    setAdmin(null);
  };

  return (
    <AuthContext.Provider
      value={{
        admin,
        isLoading,
        isAuthenticated: !!admin,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
