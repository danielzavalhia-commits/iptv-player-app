import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User, LoginCredentials } from '@/types';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (credentials: LoginCredentials) => Promise<boolean>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Credenciais pré-definidas (pode ser expandido para múltiplos usuários)
const PREDEFINED_USERS: { [key: string]: { password: string; user: User } } = {
  'admin': {
    password: 'admin123',
    user: {
      id: '1',
      username: 'admin',
      email: 'admin@iptvplayer.com',
    },
  },
  'demo': {
    password: 'demo123',
    user: {
      id: '2',
      username: 'demo',
      email: 'demo@iptvplayer.com',
    },
  },
};

const AUTH_STORAGE_KEY = '@iptv_player:auth';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Carregar sessão salva ao iniciar
  useEffect(() => {
    loadStoredAuth();
  }, []);

  const loadStoredAuth = async () => {
    try {
      const stored = await AsyncStorage.getItem(AUTH_STORAGE_KEY);
      if (stored) {
        const parsedUser = JSON.parse(stored) as User;
        setUser(parsedUser);
      }
    } catch (error) {
      console.error('Erro ao carregar autenticação:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (credentials: LoginCredentials): Promise<boolean> => {
    const { username, password } = credentials;
    
    // Validar credenciais
    const userEntry = PREDEFINED_USERS[username.toLowerCase()];
    if (!userEntry || userEntry.password !== password) {
      return false;
    }

    // Salvar usuário
    const authenticatedUser = userEntry.user;
    setUser(authenticatedUser);
    
    try {
      await AsyncStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(authenticatedUser));
    } catch (error) {
      console.error('Erro ao salvar autenticação:', error);
    }

    return true;
  };

  const logout = async () => {
    setUser(null);
    try {
      await AsyncStorage.removeItem(AUTH_STORAGE_KEY);
    } catch (error) {
      console.error('Erro ao limpar autenticação:', error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
}
