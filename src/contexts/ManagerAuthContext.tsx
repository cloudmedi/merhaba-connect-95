import { createContext, useContext, useState, ReactNode } from 'react';
import { User } from '@/types/auth';
import { useAuthState } from '@/hooks/auth/useAuthState';
import { useAuthActions } from '@/hooks/auth/useAuthActions';
import { AuthContextType } from '@/hooks/auth/types';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

const ManagerAuthContext = createContext<AuthContextType | undefined>(undefined);

export function ManagerAuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const { user: authUser, isLoading } = useAuthState();
  const { login: baseLogin, logout: baseLogout } = useAuthActions(setUser);
  const navigate = useNavigate();

  // Sync user state with auth state
  if (user !== authUser) {
    setUser(authUser);
  }

  const login = async (email: string, password: string) => {
    try {
      await baseLogin(email, password, 'manager');
      navigate('/manager');
      toast.success('Login successful');
    } catch (error: any) {
      console.error('Login error:', error);
      toast.error(error.message || 'Login failed');
      throw error;
    }
  };

  const logout = async () => {
    try {
      await baseLogout();
      navigate('/manager/login');
      toast.success('Logged out successfully');
    } catch (error: any) {
      console.error('Logout error:', error);
      toast.error('Failed to log out');
    }
  };

  return (
    <ManagerAuthContext.Provider value={{ user, isLoading, login, logout }}>
      {children}
    </ManagerAuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(ManagerAuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within a ManagerAuthProvider');
  }
  return context;
}