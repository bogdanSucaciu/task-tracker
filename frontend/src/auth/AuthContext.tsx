import { createContext, useContext, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import type { AuthResponse } from '../api/authApi';

type AuthState = {
  token: string;
  email: string;
  displayName: string;
};

type AuthContextValue = {
  user: AuthState | null;
  isAuthenticated: boolean;
  setSession: (response: AuthResponse) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

function readInitialSession(): AuthState | null {
  const token = localStorage.getItem('taskTrackerToken');
  const email = localStorage.getItem('taskTrackerEmail');
  const displayName = localStorage.getItem('taskTrackerDisplayName');
  if (!token || !email || !displayName) {
    return null;
  }
  return { token, email, displayName };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthState | null>(readInitialSession);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      setSession(response) {
        localStorage.setItem('taskTrackerToken', response.token);
        localStorage.setItem('taskTrackerEmail', response.email);
        localStorage.setItem('taskTrackerDisplayName', response.displayName);
        setUser({
          token: response.token,
          email: response.email,
          displayName: response.displayName,
        });
      },
      logout() {
        localStorage.removeItem('taskTrackerToken');
        localStorage.removeItem('taskTrackerEmail');
        localStorage.removeItem('taskTrackerDisplayName');
        setUser(null);
      },
    }),
    [user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
