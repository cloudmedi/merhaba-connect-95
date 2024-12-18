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
  console.log('AuthProvider rendering');
  
  const [user, setUser] = useState<User | null>(() => {
    console.log('Initial user state setup');
    return authService.getUser();
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('Auth initialization effect running');
    
    const initializeAuth = async () => {
      try {
        console.log('Starting auth initialization');
        const token = authService.getToken();
        console.log('Current token status:', { hasToken: !!token });
        
        if (token) {
          console.log('Token found, verifying...');
          const { isValid, user: verifiedUser } = await authService.verifyToken();
          console.log('Token verification result:', { isValid, hasUser: !!verifiedUser });
          
          if (isValid && verifiedUser) {
            console.log('Setting verified user in state');
            setUser(verifiedUser);
            authService.setUser(verifiedUser);
          } else {
            console.log('Token invalid or no user data, logging out');
            await authService.logout();
            setUser(null);
          }
        } else {
          console.log('No token found during initialization');
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        await authService.logout();
        setUser(null);
      } finally {
        console.log('Auth initialization completed');
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      console.log('Login attempt started');
      const response = await authService.login({ email, password });
      console.log('Login successful:', { hasUser: !!response.user });
      setUser(response.user);
      authService.setUser(response.user);
      toast.success('Successfully logged in');
    } catch (error: any) {
      console.error('Login error:', error);
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
      console.log('Registration started');
      await authService.register(userData);
    } catch (error: any) {
      console.error('Registration error:', error);
      toast.error(error.message || 'Error during registration');
      throw error;
    }
  };

  const logout = async () => {
    try {
      console.log('Logout started');
      await authService.logout();
      setUser(null);
      toast.success('Successfully logged out');
    } catch (error: any) {
      console.error('Logout error:', error);
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