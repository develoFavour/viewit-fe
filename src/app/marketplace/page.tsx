'use client';

import React, { useEffect, useState } from 'react';
import { get } from '@/lib/method';
import { ENDPOINTS } from '@/constants/endpoint.const';
import { ROUTES } from '@/constants/routes.const';
import { Box, Eye, Heart, Search, Filter, Sparkles, ArrowUpRight } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  images: string[];
  merchant: {
    businessName: string;
    slug: string;
  };
}

export default function MarketplacePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [shopper, setShopper] = useState<any>(null);

  useEffect(() => {
    // Check for shopper session
    const savedShopper = localStorage.getItem('viewit_shopper_user');
    if (savedShopper) setShopper(JSON.parse(savedShopper));

    const fetchProducts = async () => {
      try {
        const response = await get<any>(ENDPOINTS.STORE.MARKETPLACE);
        const { products } = response.data.data;
        setProducts(products);
      } catch (error) {
        console.error('Failed to fetch marketplace products');
      } finally {
        setIsLoading(false);
      }
    };
    fetchProducts();
  }, []);

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-blue-500 selection:text-white">
      {/* Dynamic Navigation */}
      <nav className="border-b border-white/[0.05] bg-black/50 backdrop-blur-3xl fixed top-0 left-0 right-0 z-[100]">
        <div className="max-w-7xl mx-auto px-8 h-24 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Box className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-black tracking-tighter uppercase italic">
              ViewIt <span className="text-blue-500">Market</span>
            </span>
          </Link>

          <div className="hidden md:flex items-center space-x-12 text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">
            <Link href="/marketplace" className="text-white">Explore</Link>
            <Link href="#" className="hover:text-white transition-colors">Digital Art</Link>
            <Link href="#" className="hover:text-white transition-colors">Studios</Link>
          </div>

          <div className="flex items-center space-x-6">
            {shopper ? (
              <Link href="/shopper/dashboard" className="flex items-center space-x-4 group p-1 pr-6 hover:bg-white/5 rounded-full transition-all border border-transparent hover:border-white/10">
                 <div className="w-10 h-10 bg-blue-600 rounded-2xl flex items-center justify-center text-white font-black italic text-sm shadow-xl group-hover:scale-110 transition-transform">
                   {shopper.name[0]}
                 </div>
                 <div className="text-left hidden lg:block">
                   <p className="text-[9px] font-black text-gray-600 uppercase tracking-widest leading-none mb-1">My Dashboard</p>
                   <p className="text-[10px] font-black text-blue-500 uppercase italic leading-none">{shopper.name}</p>
                 </div>
              </Link>
            ) : (
              <Link 
                href={ROUTES.AUTH.LOGIN}
                className="text-[11px] font-black uppercase tracking-widest px-8 py-3 bg-white text-black rounded-full hover:scale-105 transition-all shadow-xl"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-60 pb-20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/10 blur-[150px] -z-10 rounded-full" />
        <div className="max-w-7xl mx-auto px-6">
          <div className="space-y-4 max-w-2xl">
            <div className="inline-flex items-center space-x-2 px-3 py-1 bg-white/5 border border-white/10 rounded-full">
              <Sparkles className="h-3 w-3 text-blue-400" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-blue-400">Handpicked Collection</span>
            </div>
            <h1 className="text-7xl font-black tracking-tighter leading-none italic">
              Experience <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-100 to-gray-500">Shopping in 3D.</span>
            </h1>
            <p className="text-gray-400 text-lg font-medium max-w-md">Discover top-tier products and see how they look in your room using augmented reality.</p>
          </div>
        </div>
      </section>

      {/* Product Feed */}
      <main className="max-w-7xl mx-auto px-6 pb-40">
        <div className="flex items-center justify-between mb-12">
          <div className="flex items-center space-x-4">
            <h2 className="text-2xl font-black tracking-tight">Recent Arrivals.</h2>
            <span className="px-2 py-1 bg-white/5 rounded text-[10px] font-bold text-gray-500 uppercase tracking-widest">{products.length} Items</span>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
              <input 
                type="text" 
                placeholder="Search products..."
                className="pl-12 pr-6 py-3 bg-white/5 border border-white/5 rounded-full text-sm font-medium focus:outline-none focus:border-blue-500/50 transition-all w-64"
              />
            </div>
            <button className="p-3 bg-white/5 border border-white/5 rounded-full hover:bg-white/10 transition-all text-gray-400">
              <Filter className="h-4 w-4" />
            </button>
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="aspect-[4/5] bg-white/5 rounded-[32px] animate-pulse" />
            ))}
          </div>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {products.map((product) => (
              <Link 
                key={product.id}
                href={ROUTES.STORE.PRODUCT(product.merchant.slug, product.id)}
                className="group relative"
              >
                <div className="aspect-[4/5] bg-[#0f0f11] border border-white/[0.03] rounded-[32px] overflow-hidden transition-all group-hover:border-white/[0.08] group-hover:shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
                  {/* Image */}
                  <img 
                    src={product.images[0]} 
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-70 group-hover:opacity-100"
                  />
                  
                  {/* Overlay Tags */}
                  <div className="absolute top-6 left-6 right-6 flex justify-between">
                    <div className="px-3 py-1 bg-black/60 backdrop-blur-md border border-white/10 rounded-full text-[10px] font-black uppercase tracking-widest">
                      3D READY
                    </div>
                    <button className="w-8 h-8 bg-black/60 backdrop-blur-md border border-white/10 rounded-full flex items-center justify-center hover:bg-red-500/20 hover:border-red-500/40 transition-all group/heart">
                      <Heart className="h-4 w-4 text-white group-hover/heart:text-red-500 transition-colors" />
                    </button>
                  </div>

                  {/* Bottom Info */}
                  <div className="absolute bottom-0 left-0 right-0 p-8 pt-20 bg-gradient-to-t from-black via-black/80 to-transparent">
                    <div className="space-y-3">
                      <div>
                        <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest mb-1">{product.category}</p>
                        <h3 className="text-xl font-bold text-white tracking-tight leading-tight uppercase italic">{product.name}</h3>
                        <p className="text-[10px] font-bold text-gray-500 uppercase tracking-tighter mt-0.5">by {product.merchant.businessName}</p>
                      </div>
                      
                      <div className="flex items-center justify-between items-end">
                        <span className="text-2xl font-black tracking-tighter tabular-nums italic">£{product.price}</span>
                        <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-black group-hover:scale-110 transition-transform shadow-2xl">
                          <ArrowUpRight className="h-5 w-5" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="py-40 text-center space-y-6 flex flex-col items-center">
            <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center">
              <Box className="h-10 w-10 text-gray-500 opacity-20" />
            </div>
            <div className="space-y-1">
              <h3 className="text-xl font-bold text-gray-300">Catalogue Empty</h3>
              <p className="text-gray-500 max-w-xs mx-auto">Be the first merchant to list a 3D product on the ViewIt Marketplace.</p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
