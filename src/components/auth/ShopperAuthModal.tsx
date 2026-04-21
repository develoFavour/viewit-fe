'use client';

import React, { useState } from 'react';
import { post } from '@/lib/method';
import { X, Mail, Lock, User, Loader2, Sparkles, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';

interface ShopperAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (token: string, buyer: any) => void;
}

export default function ShopperAuthModal({ isOpen, onClose, onSuccess }: ShopperAuthModalProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: ''
  });

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const endpoint = isLogin ? '/buyer/login' : '/buyer/register';
      const response = await post<any>(endpoint, formData);
      
      const { token, buyer } = response.data.data;
      
      // Store in its own shopper slot to not conflict with merchant
      localStorage.setItem('viewit_shopper_token', token);
      localStorage.setItem('viewit_shopper_user', JSON.stringify(buyer));
      
      toast.success(isLogin ? `Welcome back, ${buyer.name}!` : "Account created successfully!");
      onSuccess(token, buyer);
      onClose();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 sm:p-0">
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm" 
        onClick={onClose}
      />
      
      <div className="relative w-full max-w-md bg-[#0f0f11] border border-white/10 rounded-[32px] overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300">
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 w-10 h-10 bg-white/5 rounded-full flex items-center justify-center text-gray-500 hover:text-white transition-colors"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="p-10">
          <div className="mb-10 space-y-3">
            <div className="inline-flex items-center space-x-2 px-3 py-1 bg-blue-500/10 border border-blue-500/20 rounded-full">
               <Sparkles className="h-3 w-3 text-blue-400" />
               <span className="text-[10px] font-bold uppercase tracking-widest text-blue-400">Shopper Collection</span>
            </div>
            <h2 className="text-3xl font-black text-white italic tracking-tighter uppercase">
              {isLogin ? "Join the Studio." : "Create your Account."}
            </h2>
            <p className="text-gray-500 text-sm font-medium">
              {isLogin ? "Sign in to save your favorite 3D products." : "Sign up to start building your 3D collection."}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Full Name</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-600" />
                  <input 
                    type="text" 
                    required
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full bg-white/[0.03] border border-white/5 rounded-2xl pl-12 pr-6 py-4 text-sm font-bold focus:outline-none focus:border-blue-500/50 transition-all placeholder:text-gray-700"
                  />
                </div>
              </div>
            )}

            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-600" />
                <input 
                  type="email" 
                  required
                  placeholder="john@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full bg-white/[0.03] border border-white/5 rounded-2xl pl-12 pr-6 py-4 text-sm font-bold focus:outline-none focus:border-blue-500/50 transition-all placeholder:text-gray-700"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-600" />
                <input 
                  type="password" 
                  required
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  className="w-full bg-white/[0.03] border border-white/5 rounded-2xl pl-12 pr-6 py-4 text-sm font-bold focus:outline-none focus:border-blue-500/50 transition-all placeholder:text-gray-700"
                />
              </div>
            </div>

            <button 
              type="submit"
              disabled={isLoading}
              className="w-full py-4 bg-white text-black font-black uppercase text-[11px] tracking-widest rounded-2xl flex items-center justify-center hover:scale-[1.02] active:scale-95 transition-all shadow-xl disabled:opacity-50 mt-6"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  {isLogin ? "Enter Studio" : "Create Account"}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </button>
          </form>

          <footer className="mt-8 text-center">
            <button 
              onClick={() => setIsLogin(!isLogin)}
              className="text-[11px] font-bold text-gray-500 hover:text-white transition-colors uppercase tracking-widest"
            >
              {isLogin ? "New here? Create an account" : "Already have an account? Sign in"}
            </button>
          </footer>
        </div>
      </div>
    </div>
  );
}
