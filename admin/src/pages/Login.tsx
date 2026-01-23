import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { BackendStatus } from '@/components/BackendStatus';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      setError('');
      setIsLoading(true);
      await login(data.email, data.password);
      navigate('/dashboard');
    } catch {
      setError('Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
      <div style={{ maxWidth: '400px', width: '100%', padding: '2rem', background: 'white', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
        <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>Admin Login</h2>
          <p style={{ color: '#666', fontSize: '0.875rem' }}>Sign in to access the admin panel</p>
        </div>
        
        <form onSubmit={handleSubmit(onSubmit)}>
          {error && (
            <div style={{ padding: '0.75rem', marginBottom: '1rem', background: '#fee', border: '1px solid #fcc', borderRadius: '4px', color: '#c33' }}>
              {error}
            </div>
          )}
          
          <div style={{ marginBottom: '1rem' }}>
            <Label htmlFor="email">Email address</Label>
            <Input
              id="email"
              type="email"
              {...register('email')}
              style={{ marginTop: '0.5rem', width: '100%' }}
            />
            {errors.email && (
              <p style={{ marginTop: '0.25rem', fontSize: '0.875rem', color: '#c33' }}>{errors.email.message}</p>
            )}
          </div>
          
          <div style={{ marginBottom: '1.5rem' }}>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              {...register('password')}
              style={{ marginTop: '0.5rem', width: '100%' }}
            />
            {errors.password && (
              <p style={{ marginTop: '0.25rem', fontSize: '0.875rem', color: '#c33' }}>{errors.password.message}</p>
            )}
          </div>

          <Button type="submit" style={{ width: '100%' }} disabled={isLoading}>
            {isLoading ? 'Signing in...' : 'Sign in'}
          </Button>

          <BackendStatus />
        </form>
      </div>
    </div>
  );
};
