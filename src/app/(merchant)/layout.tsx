'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Sidebar from '@/components/merchant/Sidebar';
import { Loader2 } from 'lucide-react';

export default function MerchantLayout({ children }: { children: React.ReactNode }) {
  const { merchant, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !merchant) {
      router.push('/login');
    }
  }, [merchant, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center">
        <Loader2 className="h-6 w-6 text-blue-500 animate-spin" />
        <p className="mt-4 text-gray-500 font-medium tracking-widest text-[10px] uppercase">Authenticating Studio</p>
      </div>
    );
  }

  if (!merchant) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#050505] text-[#e1e1e1]">
      <Sidebar />
      <main className="pl-64 min-h-screen">
        <div className="max-w-7xl mx-auto p-10">
          {children}
        </div>
      </main>
    </div>
  );
}
