'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { cn } from '@/lib/utils';
import { ROUTES } from '@/constants/routes.const';
import {
  BarChart3,
  Settings,
  LogOut,
  ExternalLink,
  Box,
  LayoutGrid,
  Sparkles,
  Zap
} from 'lucide-react';

const menuItems = [
  { icon: LayoutGrid, label: 'Overview', href: ROUTES.MERCHANT.DASHBOARD },
  { icon: Box, label: 'Catalog', href: ROUTES.MERCHANT.PRODUCTS },

];

export default function Sidebar() {
  const pathname = usePathname();
  const { logout, merchant } = useAuth();

  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-[#0a0a0b] border-r border-[#1a1a1c] flex flex-col z-50">
      <div className="p-8">
        <Link href={ROUTES.MERCHANT.DASHBOARD} className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <Zap className="h-5 w-5 text-white" fill="white" />
          </div>
          <span className="text-lg font-black text-white tracking-tight uppercase">
            ViewIt <span className="text-blue-500">AR</span>
          </span>
        </Link>
      </div>

      <nav className="flex-1 px-4 space-y-1">
        <div className="px-4 mb-4">
          <span className="text-[10px] font-bold text-gray-600 uppercase tracking-widest">Main Menu</span>
        </div>
        {menuItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== ROUTES.MERCHANT.DASHBOARD && pathname.startsWith(item.href));
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium transition-all group",
                isActive
                  ? "bg-blue-600/10 text-blue-500 shadow-[inset_0_1px_rgba(255,255,255,0.05)]"
                  : "text-gray-500 hover:text-white hover:bg-white/5"
              )}
            >
              <Icon className={cn(
                "h-4 w-4 transition-colors",
                isActive ? "text-blue-500" : "text-gray-500 group-hover:text-gray-300"
              )} />
              <span className="tracking-tight">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 space-y-4">
        <div className="p-4 bg-[#111113] border border-[#1a1a1c] rounded-2xl space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Storefront</span>
            <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
          </div>
          <p className="text-[11px] text-gray-400 font-medium truncate">{merchant?.businessName}</p>
          <Link
            href={ROUTES.STORE.BASE(merchant?.slug || '')}
            target="_blank"
            className="flex items-center justify-center w-full py-2.5 bg-white text-black rounded-xl text-[10px] font-bold uppercase transition-transform active:scale-95"
          >
            <ExternalLink className="h-3 w-3 mr-2" />
            Live Preview
          </Link>
        </div>

        <div className="pt-4 border-t border-[#1a1a1c] space-y-1">
          <Link
            href={ROUTES.MERCHANT.SETTINGS}
            className="flex items-center space-x-3 px-4 py-2 text-gray-500 hover:text-white transition-colors"
          >
            <Settings className="h-4 w-4" />
            <span className="text-[11px] font-medium">Settings</span>
          </Link>
          <button
            onClick={logout}
            className="flex items-center space-x-3 px-4 py-2 text-gray-500 hover:text-red-500 transition-colors w-full"
          >
            <LogOut className="h-4 w-4" />
            <span className="text-[11px] font-medium">Log out</span>
          </button>
        </div>
      </div>
    </aside>
  );
}
