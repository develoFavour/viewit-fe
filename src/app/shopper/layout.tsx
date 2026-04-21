'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Heart,
  ShoppingBag,
  Box,
  LogOut,
  User,
  LayoutDashboard,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import toast from 'react-hot-toast';

export default function ShopperLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [shopper, setShopper] = useState<any>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const savedShopper = localStorage.getItem('viewit_shopper_user');
    if (!savedShopper) {
      toast.error("Please sign in to access your vault.");
      router.push('/marketplace');
      return;
    }
    setShopper(JSON.parse(savedShopper));
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('viewit_shopper_token');
    localStorage.removeItem('viewit_shopper_user');
    toast.success("Signed out of your vault.");
    router.push('/marketplace');
  };

  if (!shopper) return null;

  return (
    <div className="min-h-screen bg-[#050505] text-[#e1e1e1] flex">
      {/* Shopper Sidebar */}
      <aside className="w-80 border-r border-white/[0.03] flex flex-col p-8 fixed h-full bg-[#08080a]">
        <div className="mb-16 flex items-center space-x-3">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <Box className="h-5 w-5 text-white" />
          </div>
          <span className="text-sm font-black italic tracking-tighter uppercase">Shopper <span className="text-blue-500">Vault.</span></span>
        </div>

        <nav className="flex-1 space-y-2">
          {[
            { label: 'My Collection', icon: Heart, href: '/shopper/dashboard' },
            // { label: 'Order History', icon: ShoppingBag, href: '/shopper/orders' },
            // { label: '3D Preferences', icon: Sparkles, href: '/shopper/settings' },
          ].map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="flex items-center space-x-4 p-4 rounded-2xl text-gray-500 hover:bg-white/5 hover:text-white transition-all group"
            >
              <item.icon className="h-5 w-5 group-hover:text-blue-500 transition-colors" />
              <span className="text-[11px] font-black uppercase tracking-widest">{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="pt-8 border-t border-white/[0.03]">
          <div className="flex items-center space-x-4 p-4 bg-white/5 rounded-2xl mb-4">
            <div className="w-10 h-10 bg-blue-600/10 rounded-xl flex items-center justify-center text-blue-500 font-black italic">
              {shopper.name[0]}
            </div>
            <div>
              <p className="text-[11px] font-black text-white italic truncate w-32">{shopper.name}</p>
              <p className="text-[9px] font-bold text-gray-600 uppercase tracking-widest">Premium Member</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center space-x-4 p-4 w-full text-gray-600 hover:text-red-500 transition-all font-black uppercase text-[10px] tracking-widest"
          >
            <LogOut className="h-4 w-4" />
            <span>Close Vault</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 ml-80 p-12">
        {children}
      </main>
    </div>
  );
}
