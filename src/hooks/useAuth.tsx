import { createContext, useContext, ReactNode } from 'react';
import { AuthContextType } from './auth/types';
import { useAuthState } from './auth/useAuthState';
import { useAuthActions } from './auth/useAuthActions';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const { user, isLoading, setUser } = useAuthState();
  const { login, logout } = useAuthActions(setUser);

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
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