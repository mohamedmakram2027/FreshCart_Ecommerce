import { create } from 'zustand';
import Cookies from 'js-cookie';

export interface User {
  name: string;
  email: string;
  role?: string;
  [key: string]: unknown;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  setAuth: (userData: User, token: string) => void;
  login: (userData: User, token: string) => void;
  logout: () => void;
  initializeAuth: () => void;
}

const getUserFromStorage = (): User | null => {
  if (typeof window === 'undefined') return null;
  try {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  } catch {
    return null;
  }
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,

  setAuth: (userData: User, token: string) => {
    Cookies.set('token', token, { expires: 7, secure: true, sameSite: 'strict' });
    if (typeof window !== 'undefined') {
      localStorage.setItem('user', JSON.stringify(userData));
    }
    set({ user: userData, token, isAuthenticated: true });
  },

  // Alias for setAuth
  login: (userData: User, token: string) => {
    Cookies.set('token', token, { expires: 7, secure: true, sameSite: 'strict' });
    if (typeof window !== 'undefined') {
      localStorage.setItem('user', JSON.stringify(userData));
    }
    set({ user: userData, token, isAuthenticated: true });
  },

  logout: () => {
    Cookies.remove('token');
    if (typeof window !== 'undefined') {
      localStorage.removeItem('user');
    }
    set({ user: null, token: null, isAuthenticated: false });
  },

  initializeAuth: () => {
    const token = Cookies.get('token') || null;
    const user = getUserFromStorage();
    set({
      token,
      user,
      isAuthenticated: !!token,
    });
  },
}));