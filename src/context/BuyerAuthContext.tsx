'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { post, get } from '@/lib/method';
import { ENDPOINTS } from '@/constants/endpoint.const';

interface Buyer {
  id: string;
  email: string;
  name: string;
}

interface BuyerAuthContextType {
  buyer: Buyer | null;
  loading: boolean;
  login: (token: string, buyerData: Buyer) => void;
  logout: () => void;
}

const BuyerAuthContext = createContext<BuyerAuthContextType | undefined>(undefined);

export const BuyerAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [buyer, setBuyer] = useState<Buyer | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('viewit_buyer_token');
      const savedBuyer = localStorage.getItem('viewit_buyer_data');
      if (token && savedBuyer) {
        setBuyer(JSON.parse(savedBuyer));
      }
      setLoading(false);
    };
    checkAuth();
  }, []);

  const login = (token: string, buyerData: Buyer) => {
    localStorage.setItem('viewit_buyer_token', token);
    localStorage.setItem('viewit_buyer_data', JSON.stringify(buyerData));
    setBuyer(buyerData);
  };

  const logout = () => {
    localStorage.removeItem('viewit_buyer_token');
    localStorage.removeItem('viewit_buyer_data');
    setBuyer(null);
  };

  return (
    <BuyerAuthContext.Provider value={{ buyer, loading, login, logout }}>
      {children}
    </BuyerAuthContext.Provider>
  );
};

export const useBuyerAuth = () => {
  const context = useContext(BuyerAuthContext);
  if (context === undefined) {
    throw new Error('useBuyerAuth must be used within a BuyerAuthProvider');
  }
  return context;
};
