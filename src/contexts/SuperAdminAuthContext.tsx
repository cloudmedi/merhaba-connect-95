import { createContext, useContext, useState, ReactNode } from 'react';
import { User } from '@/types/auth';
import { useAuthState } from '@/hooks/auth/useAuthState';
import { useAuthActions } from '@/hooks/auth/useAuthActions';
import { AuthContextType } from '@/hooks/auth/types';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function SuperAdminAuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const { user: authUser, isLoading } = useAuthState();
  const { login, logout } = useAuthActions(setUser);

  // Sync user state with auth state
  if (user !== authUser) {
    setUser(authUser);
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within a SuperAdminAuthProvider');
  }
  return context;
}