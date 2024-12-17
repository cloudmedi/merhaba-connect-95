import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '@/types/auth';
import { authService } from '@/services/auth';
import { toast } from 'sonner';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          const response = await fetch('/api/auth/me', {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          if (response.ok) {
            const userData = await response.json();
            setUser(userData);
          } else {
            await logout();
          }
        }
      } catch (error) {
        console.error('Auth check failed:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await authService.login({ email, password });
      
      if (response.user) {
        setUser(response.user);
        toast.success('Giriş başarılı');
        
        if (response.user.role === 'super_admin') {
          window.location.href = '/super-admin';
        } else {
          window.location.href = '/manager';
        }
      }
    } catch (error: any) {
      toast.error('Giriş başarısız: ' + error.message);
      throw error;
    }
  };

  const logout = async () => {
    try {
      localStorage.removeItem('token');
      setUser(null);
      
      const isManagerPath = window.location.pathname.startsWith('/manager');
      if (isManagerPath) {
        window.location.href = '/manager/login';
      } else {
        window.location.href = '/super-admin/login';
      }
      
      toast.success('Çıkış yapıldı');
    } catch (error: any) {
      console.error('Çıkış hatası:', error);
      toast.error('Çıkış yapılamadı');
    }
  };

  const value = {
    user,
    login,
    logout,
    isLoading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}