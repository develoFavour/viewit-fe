'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { get } from '@/lib/method';
import { ENDPOINTS } from '@/constants/endpoint.const';
import { ROUTES } from '@/constants/routes.const';
import { 
  Eye, 
  Box, 
  TrendingUp, 
  Package, 
  Clock, 
  Zap, 
  ArrowRight, 
  Sparkles,
  ArrowUpRight,
  ShieldCheck,
  MousePointer2,
  Calendar,
  Plus,
  Target
} from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

interface Stats {
  stats: {
    totalProducts: number;
    totalViews: number;
    totalArViews: number;
    arEngagementRate: number;
  };
  chartData: any[];
  topProducts: any[];
  topFeatures: any[];
}

export default function DashboardPage() {
  const { merchant } = useAuth();
  const [stats, setStats] = useState<Stats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await get<Stats>(ENDPOINTS.ANALYTICS.OVERVIEW);
        setStats(response.data.data);
      } catch (error) {
        console.error('Failed to fetch stats');
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  const statCards = [
    { 
      label: 'Total Visitors', 
      value: stats?.stats?.totalViews || 0, 
      icon: Eye, 
      color: 'text-blue-500', 
      bg: 'bg-blue-500/5',
      trend: '+12% this week'
    },
    { 
      label: 'AR Experiences', 
      value: stats?.stats?.totalArViews || 0, 
      icon: Sparkles, 
      color: 'text-emerald-500', 
      bg: 'bg-emerald-500/5',
      trend: 'Highly engaging'
    },
    { 
      label: 'My Products', 
      value: stats?.stats?.totalProducts || 0, 
      icon: Box, 
      color: 'text-purple-500', 
      bg: 'bg-purple-500/5',
      trend: 'Ready to sell'
    },
    {
      label: 'Visitor Interest',
      value: `${stats?.stats?.arEngagementRate || 0}%`,
      icon: TrendingUp,
      color: 'text-blue-400',
      bg: 'bg-blue-400/5',
      trend: 'Above average'
    },
  ];

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      {/* Friendly Header Area */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-8 pb-4">
        <div className="space-y-3">
          <div className="inline-flex items-center space-x-2 px-3 py-1 bg-white/5 border border-white/10 rounded-full">
            <Zap className="h-3 w-3 text-blue-400" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-blue-400">Live Analytics</span>
          </div>
          <h1 className="text-5xl font-black text-white tracking-tighter uppercase italic">
            Welcome back, <span className="text-blue-500">{merchant?.businessName.split(' ')[0]}.</span>
          </h1>
          <p className="text-gray-500 text-sm font-medium pt-2">
            Here is a quick look at how your products are performing today.
          </p>
        </div>

        <Link
          href={ROUTES.MERCHANT.NEW_PRODUCT}
          className="px-8 py-4 bg-blue-600 text-white font-black uppercase text-[11px] tracking-widest rounded-full flex items-center hover:bg-blue-700 transition-all shadow-xl shadow-blue-900/20 active:scale-95"
        >
          <Plus className="mr-3 h-4 w-4" />
          Add a Product
        </Link>
      </header>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div
              key={i}
              className="bg-[#0f0f11] border border-white/[0.03] p-8 rounded-[32px] hover:border-blue-500/20 transition-all"
            >
              <div className="flex items-center justify-between mb-6">
                <div className={cn("p-3 rounded-2xl", stat.bg)}>
                  <Icon className={cn("h-5 w-5", stat.color)} />
                </div>
                <div className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">
                   {stat.trend}
                </div>
              </div>
              <p className="text-[10px] font-bold text-gray-600 uppercase tracking-[0.2em] mb-2">{stat.label}</p>
              <h3 className="text-4xl font-black text-white tracking-tighter italic">
                {isLoading ? (
                  <div className="h-10 w-20 bg-white/5 animate-pulse rounded-lg" />
                ) : (
                  stat.value
                )}
              </h3>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Simplified Engagement Chart */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-[#0f0f11] border border-white/[0.03] rounded-[40px] p-10">
             <div className="flex items-center justify-between mb-12">
               <div className="space-y-1">
                 <h2 className="text-2xl font-black text-white italic tracking-tighter uppercase">
                   Store Activity.
                 </h2>
                 <p className="text-[10px] font-bold text-gray-600 uppercase tracking-widest flex items-center">
                    <Calendar className="h-3 w-3 mr-2" />
                    Activity last 7 days
                 </p>
               </div>
               
               <div className="flex items-center space-x-6 text-[10px] font-bold uppercase tracking-widest">
                  <div className="flex items-center">
                    <div className="w-2 h-2 rounded-full bg-blue-600 mr-2" />
                    <span className="text-gray-400">Total Views</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 mr-2" />
                    <span className="text-gray-400">AR Views</span>
                  </div>
               </div>
             </div>

             <div className="h-[300px] w-full mt-4">
                {isLoading ? (
                  <div className="w-full h-full bg-white/5 animate-pulse rounded-3xl" />
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={stats?.chartData || []}>
                      <defs>
                        <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#2563eb" stopOpacity={0.2}/>
                          <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                        </linearGradient>
                        <linearGradient id="colorAr" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
                          <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ffffff05" />
                      <XAxis 
                        dataKey="date" 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fill: '#4b5563', fontSize: 10, fontWeight: 700 }}
                        dy={20}
                      />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#0f0f11', 
                          border: 'None',
                          borderRadius: '16px',
                          fontSize: '10px',
                          fontWeight: 'bold'
                        }}
                      />
                      <Area type="monotone" dataKey="views" stroke="#2563eb" strokeWidth={3} fillOpacity={1} fill="url(#colorViews)" />
                      <Area type="monotone" dataKey="arViews" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorAr)" />
                    </AreaChart>
                  </ResponsiveContainer>
                )}
             </div>
          </div>

          {/* Simple Leaderboard */}
          <div className="bg-[#0f0f11] border border-white/[0.03] rounded-[40px] p-10">
             <div className="flex items-center justify-between mb-8">
               <h2 className="text-xl font-black text-white italic tracking-tighter uppercase">Most Popular Products.</h2>
               <Link href={ROUTES.MERCHANT.PRODUCTS} className="text-[10px] font-bold text-gray-500 hover:text-white uppercase tracking-widest transition-colors flex items-center">
                  See All Products <ArrowUpRight className="ml-2 h-3 w-3" />
               </Link>
             </div>

             <div className="space-y-4">
                {isLoading ? (
                  [...Array(3)].map((_, i) => (
                    <div key={i} className="h-20 w-full bg-white/5 animate-pulse rounded-2xl" />
                  ))
                ) : stats?.topProducts && stats.topProducts.length > 0 ? (
                  stats.topProducts.map((product, i) => (
                    <div key={i} className="flex items-center justify-between p-6 hover:bg-white/[0.01] rounded-[32px] border border-white/[0.02] transition-all">
                       <div className="flex items-center space-x-6">
                          <div className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center text-xs font-bold text-gray-500">
                             {i + 1}
                          </div>
                          <div>
                             <h4 className="text-sm font-bold text-white italic">{product.name}</h4>
                             <p className="text-[10px] font-bold text-gray-600 uppercase tracking-widest">
                               {product.hasModel ? 'AR Enabled' : 'Standard View'}
                             </p>
                          </div>
                       </div>
                       <div className="flex items-center space-x-12">
                          <div className="text-right">
                             <p className="text-sm font-black text-white italic">{product.totalViewCount}</p>
                             <p className="text-[9px] font-bold text-gray-700 uppercase tracking-widest">Views</p>
                          </div>
                          <div className="text-right">
                             <p className="text-sm font-black text-emerald-500 italic">{product.totalArViewCount}</p>
                             <p className="text-[9px] font-bold text-gray-700 uppercase tracking-widest">AR Interactions</p>
                          </div>
                       </div>
                    </div>
                  ))
                ) : (
                  <div className="h-44 flex flex-col items-center justify-center border border-dashed border-white/5 rounded-[32px]">
                     <p className="text-[10px] font-bold text-gray-700 uppercase tracking-widest uppercase italic">Your products will appear here soon.</p>
                  </div>
                )}
             </div>
          </div>
        </div>

        {/* Helpful Sidebar */}
        <div className="space-y-8">
           <div className="bg-blue-600 rounded-[40px] p-10 text-white relative overflow-hidden group">
              <Sparkles className="absolute -right-8 -bottom-8 h-48 w-48 text-white/5 group-hover:scale-110 transition-all duration-1000" />
              <div className="relative z-10 space-y-8">
                <div className="space-y-3">
                  <h3 className="text-2xl font-black italic tracking-tighter uppercase leading-tight">Grow Your Store.</h3>
                  <p className="text-blue-100 text-[11px] font-bold leading-relaxed uppercase tracking-widest">Get more storage, better analytics, and custom 3D effects.</p>
                </div>
                <button className="w-full py-5 bg-white text-blue-600 font-black uppercase text-[10px] tracking-widest rounded-2xl flex items-center justify-center hover:bg-gray-50 transition-all">
                  See Pro Features
                  <ArrowRight className="ml-3 h-4 w-4" />
                </button>
              </div>
           </div>

           {/* Feature Interest Analytics (The Standout) */}
           <div className="bg-[#0f0f11] border border-blue-500/10 rounded-[40px] p-10 space-y-8">
              <div className="space-y-1">
                <h3 className="text-xl font-black text-white italic tracking-tighter uppercase">Feature Interest.</h3>
                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest flex items-center">
                   <Target className="h-3 w-3 mr-2" /> What buyers look at
                </p>
              </div>

              <div className="space-y-3">
                 {isLoading ? (
                    [...Array(3)].map((_, i) => <div key={i} className="h-12 w-full bg-white/5 animate-pulse rounded-2xl" />)
                 ) : stats?.topFeatures && stats.topFeatures.length > 0 ? (
                    stats.topFeatures.map((feature, i) => (
                      <div key={i} className="flex flex-col p-4 bg-blue-600/5 rounded-[20px] border border-blue-500/10 hover:border-blue-500/30 transition-all group">
                         <div className="flex items-center justify-between mb-1">
                            <span className="text-xs font-black text-white">{feature.feature}</span>
                            <span className="text-[10px] font-black text-blue-500 tabular-nums">{feature.clicks} Clicks</span>
                         </div>
                         <span className="text-[9px] font-bold text-gray-600 uppercase tracking-widest">{feature.productName}</span>
                      </div>
                    ))
                 ) : (
                    <div className="py-6 flex flex-col items-center justify-center border border-dashed border-white/5 rounded-[24px]">
                       <p className="text-[9px] font-bold text-gray-600 uppercase tracking-widest italic px-6 text-center">
                         Create hotspots to see what features shoppers engage with.
                       </p>
                    </div>
                 )}
              </div>
              
              <div className="p-5 bg-white/[0.02] rounded-[24px] border border-white/[0.03]">
                  <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest italic line-clamp-3 leading-relaxed">
                    "Track which specific components of your 3D models drive the most engagement, allowing you to optimize your marketing copy in real-time."
                  </p>
               </div>
           </div>
        </div>
      </div>
    </div>
  );
}
