'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { get } from '@/lib/method';
import { ENDPOINTS } from '@/constants/endpoint.const';
import { ROUTES } from '@/constants/routes.const';

interface Merchant {
  id: string;
  email: string;
  name: string;
  businessName: string;
  slug: string;
  _count?: {
    products: number;
  };
}

interface AuthContextType {
  merchant: Merchant | null;
  loading: boolean;
  login: (token: string, merchantData: Merchant, redirectPath?: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [merchant, setMerchant] = useState<Merchant | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('viewit_token');
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await get<Merchant>(ENDPOINTS.AUTH.ME);
        setMerchant(response.data.data);
      } catch (error) {
        localStorage.removeItem('viewit_token');
        document.cookie = 'viewit_token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
        setMerchant(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = (token: string, merchantData: Merchant, redirectPath: string = ROUTES.MERCHANT.DASHBOARD) => {
    localStorage.setItem('viewit_token', token);
    // Sync with cookie for middleware (Server Side)
    document.cookie = `viewit_token=${token}; path=/; max-age=86400; SameSite=Lax`;
    
    setMerchant(merchantData);
    router.push(redirectPath);
  };

  const logout = () => {
    localStorage.removeItem('viewit_token');
    document.cookie = 'viewit_token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    setMerchant(null);
    router.push(ROUTES.AUTH.LOGIN);
  };

  return (
    <AuthContext.Provider value={{ merchant, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
