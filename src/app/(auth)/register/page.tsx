'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { post } from '@/lib/method';
import { ROUTES } from '@/constants/routes.const';
import { ENDPOINTS } from '@/constants/endpoint.const';
import { toast } from 'react-hot-toast';
import { Loader2, Mail, Lock, User, Briefcase, Globe, ArrowRight, Box } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    businessName: '',
    slug: '',
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-');
    setFormData({ ...formData, slug: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await post<any>(ENDPOINTS.AUTH.REGISTER, formData);
      toast.success('Verification email sent!');
      router.push(ROUTES.AUTH.REGISTER_SUCCESS);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to create account');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#000000] flex flex-col items-center justify-center p-6 py-20 selection:bg-white selection:text-black relative overflow-hidden z-0 font-sans">
      <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full bg-white/[0.03] blur-[140px] pointer-events-none -z-10" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] rounded-full bg-white/[0.02] blur-[140px] pointer-events-none -z-10" />

      <div className="w-full max-w-lg relative z-10">
        <header className="text-center mb-12 space-y-2">
          <Link href="/" className="inline-flex items-center justify-center w-12 h-12 bg-white/[0.02] border border-white/[0.05] rounded-2xl mb-4 group hover:bg-white/5 transition-colors">
            <Box className="h-6 w-6 text-white group-hover:scale-110 transition-transform" />
          </Link>
          <h1 className="text-4xl md:text-5xl font-medium text-white tracking-tight leading-[1.1] mb-4">
            Build your Studio.
          </h1>
          <p className="text-gray-400 text-sm">Join 500+ merchants creating interactive 3D stories.</p>
        </header>

        <div className="bg-white/[0.01] backdrop-blur-3xl border border-white/[0.05] rounded-[32px] p-10 shadow-[0_0_80px_rgba(0,0,0,0.8)] relative overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent" />

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest px-1 flex items-center">Full Name</label>
                <div className="relative group">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-600 group-focus-within:text-white transition-colors" />
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full pl-12 pr-4 py-4 bg-white/[0.02] border border-white/[0.05] rounded-2xl text-white font-medium placeholder-gray-700 focus:outline-none focus:border-white/20 focus:bg-white/[0.04] transition-all"
                    placeholder="Enter name"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest px-1 flex items-center">Email</label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-600 group-focus-within:text-white transition-colors" />
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full pl-12 pr-4 py-4 bg-white/[0.02] border border-white/[0.05] rounded-2xl text-white font-medium placeholder-gray-700 focus:outline-none focus:border-white/20 focus:bg-white/[0.04] transition-all"
                    placeholder="name@email.com"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest px-1 flex items-center">Business</label>
                <div className="relative group">
                  <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-600 group-focus-within:text-white transition-colors" />
                  <input
                    type="text"
                    required
                    value={formData.businessName}
                    onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                    className="w-full pl-12 pr-4 py-4 bg-white/[0.02] border border-white/[0.05] rounded-2xl text-white font-medium placeholder-gray-700 focus:outline-none focus:border-white/20 focus:bg-white/[0.04] transition-all"
                    placeholder="Acme Corp"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest px-1 flex items-center">Store Slug</label>
                <div className="relative group">
                  <Globe className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-600 group-focus-within:text-white transition-colors" />
                  <input
                    type="text"
                    required
                    value={formData.slug}
                    onChange={handleSlugChange}
                    className="w-full pl-12 pr-4 py-4 bg-white/[0.02] border border-white/[0.05] rounded-2xl text-white font-medium placeholder-gray-700 focus:outline-none focus:border-white/20 focus:bg-white/[0.04] transition-all"
                    placeholder="your-brand"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest px-1 flex items-center">Master Password</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-600 group-focus-within:text-white transition-colors" />
                <input
                  type="password"
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
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
                  Sign Up
                  <ArrowRight className="ml-3 h-5 w-5" />
                </>
              )}
            </button>
          </form>

          <footer className="mt-10 pt-8 text-center border-t border-white/5">
            <p className="text-[11px] font-bold text-gray-500 tracking-widest uppercase">
              Already using ViewIt?{' '}
              <Link href={ROUTES.AUTH.LOGIN} className="text-white hover:text-gray-300 transition-colors ml-2 border-b border-white/20 pb-[1px]">
                Sign in to Studio
              </Link>
            </p>
          </footer>
        </div>
      </div>
    </div>
  );
}
