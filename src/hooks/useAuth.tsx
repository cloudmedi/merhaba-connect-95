import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authService } from '@/services/auth';
import { User } from '@/types/auth';
import { toast } from 'sonner';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: { email: string; password: string; firstName: string; lastName: string; role: string }) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    // İlk yüklemede localStorage'dan kullanıcı bilgisini al
    return authService.getUser();
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const token = authService.getToken();
        if (token) {
          const { isValid, user: verifiedUser } = await authService.verifyToken();
          if (isValid && verifiedUser) {
            setUser(verifiedUser);
            authService.setUser(verifiedUser);
          } else {
            await authService.logout();
            setUser(null);
          }
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        await authService.logout();
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await authService.login({ email, password });
      setUser(response.user);
      authService.setUser(response.user);
      toast.success('Successfully logged in');
    } catch (error: any) {
      toast.error(error.message || 'Error logging in');
      throw error;
    }
  };

  const register = async (userData: { 
    email: string; 
    password: string; 
    firstName: string; 
    lastName: string;
    role: string;
  }) => {
    try {
      await authService.register(userData);
    } catch (error: any) {
      toast.error(error.message || 'Error during registration');
      throw error;
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
      setUser(null);
      toast.success('Successfully logged out');
    } catch (error: any) {
      toast.error(error.message || 'Error logging out');
      throw error;
    }
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export { AuthProvider, useAuth };