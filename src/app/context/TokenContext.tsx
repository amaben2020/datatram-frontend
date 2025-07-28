'use client';
import { useAuth } from '@clerk/nextjs';
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from 'react';

type TokenContextType = {
  token: string | null;
  isLoading: boolean;
};

const TokenContext = createContext<TokenContextType>({
  token: null,
  isLoading: true,
});

export const TokenProvider = ({ children }: { children: ReactNode }) => {
  const { getToken } = useAuth();
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    getToken()
      .then((t) => setToken(t || null))
      .finally(() => setLoading(false));
  }, [getToken]);

  return (
    <TokenContext.Provider value={{ token, isLoading }}>
      {children}
    </TokenContext.Provider>
  );
};

export const useClerkToken = () => useContext(TokenContext);
