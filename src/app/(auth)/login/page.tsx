'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { post } from '@/lib/method';
import { ROUTES } from '@/constants/routes.const';
import { ENDPOINTS } from '@/constants/endpoint.const';
import { toast } from 'react-hot-toast';
import { Loader2, Mail, Lock, ArrowRight, Box } from 'lucide-react';

import { useSearchParams } from 'next/navigation';

function LoginForm() {
  const searchParams = useSearchParams();
  const redirectPath = searchParams.get('from') || ROUTES.MERCHANT.DASHBOARD;

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await post<any>(ENDPOINTS.AUTH.LOGIN, { email, password });
      const { accessToken, merchant } = response.data.data;
      login(accessToken, merchant, redirectPath);
      toast.success(response.data.message || 'Logged in successfully!');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to login');
    } finally {
      setIsLoading(false);
    }
  };

  return (
      <div className="w-full max-w-sm relative z-10">
        <header className="text-center mb-10 space-y-3">
          <Link href="/" className="inline-flex items-center justify-center w-12 h-12 bg-white/[0.02] border border-white/[0.05] rounded-2xl mb-4 group hover:bg-white/5 transition-colors">
             <Box className="h-6 w-6 text-white group-hover:scale-110 transition-transform" />
          </Link>
          <h1 className="text-4xl md:text-5xl font-medium text-white tracking-tight leading-[1.1] text-center">
            Welcome back.
          </h1>
          <p className="text-gray-400 text-sm">Continue building your spatial studio.</p>
        </header>

        <div className="bg-white/[0.01] backdrop-blur-3xl border border-white/[0.05] rounded-[32px] p-8 shadow-[0_0_80px_rgba(0,0,0,0.8)] relative overflow-hidden">
          {/* Subtle top border highlight */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent" />

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest px-1 flex items-center">
                 Email Address
              </label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-600 group-focus-within:text-white transition-colors" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-white/[0.02] border border-white/[0.05] rounded-2xl text-white font-medium placeholder-gray-700 focus:outline-none focus:border-white/20 focus:bg-white/[0.04] transition-all"
                  placeholder="name@email.com"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between px-1">
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest flex items-center">
                  Password
                </label>
                <Link href="#" className="text-[10px] font-bold text-white/50 uppercase tracking-widest hover:text-white transition-colors">Forgot?</Link>
              </div>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-600 group-focus-within:text-white transition-colors" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-white/[0.02] border border-white/[0.05] rounded-2xl text-white font-medium placeholder-gray-700 focus:outline-none focus:border-white/20 focus:bg-white/[0.04] transition-all"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center py-4 bg-white hover:bg-gray-200 disabled:opacity-50 text-black font-bold uppercase tracking-widest text-[11px] rounded-full transition-all active:scale-[0.98]"
            >
              {isLoading ? (
                <Loader2 className="animate-spin h-5 w-5" />
              ) : (
                <>
                  Enter Studio
                  <ArrowRight className="ml-3 h-5 w-5" />
                </>
              )}
            </button>
          </form>

          <footer className="mt-8 pt-6 text-center">
            <p className="text-[11px] font-bold text-gray-500 tracking-widest">
              NEW TO VIEWIT?{' '}
              <Link href={ROUTES.AUTH.REGISTER} className="text-white hover:text-gray-300 transition-colors ml-2 border-b border-white/20 pb-[1px]">
                CREATE STUDIO
              </Link>
            </p>
          </footer>
        </div>
      </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-[#000000] flex flex-col items-center justify-center p-6 selection:bg-white selection:text-black relative overflow-hidden z-0 font-sans">
      <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full bg-white/[0.03] blur-[140px] pointer-events-none -z-10" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] rounded-full bg-white/[0.02] blur-[140px] pointer-events-none -z-10" />

      <Suspense fallback={<div className="animate-pulse w-8 h-8 rounded-full border-2 border-white/20 border-t-white relative z-10" />}>
        <LoginForm />
      </Suspense>
    </div>
  );
}
