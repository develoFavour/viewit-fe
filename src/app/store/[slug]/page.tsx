'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { get } from '@/lib/method';
import { ENDPOINTS } from '@/constants/endpoint.const';
import { 
  Loader2, 
  ShoppingBag, 
  Filter,
  Grid2X2,
  List as ListIcon,
  Search,
  ChevronRight,
  Box,
  Sparkles,
  ArrowRight,
  ArrowLeft
} from 'lucide-react';
import { cn, formatCurrency } from '@/lib/utils';
import Link from 'next/link';

export default function StoreCatalogPage() {
  const params = useParams();
  const { slug } = params;
  
  const [storeData, setStoreData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [shopper, setShopper] = useState<any>(null);

  useEffect(() => {
    // Check for shopper session
    const savedShopper = localStorage.getItem('viewit_shopper_user');
    if (savedShopper) setShopper(JSON.parse(savedShopper));

    const fetchStore = async () => {
      try {
        const response = await get<any>(ENDPOINTS.STORE.GET_STORE(slug as string));
        setStoreData(response.data.data);
      } catch (error) {
        console.error('Failed to load store');
      } finally {
        setIsLoading(false);
      }
    };

    if (slug) fetchStore();
  }, [slug]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center">
        <Loader2 className="h-10 w-10 text-blue-500 animate-spin" />
        <p className="mt-6 text-gray-500 font-black uppercase tracking-[0.3em] text-[10px]">Loading Collection.</p>
      </div>
    );
  }

  if (!storeData) {
    return (
      <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center p-6 text-center">
        <h1 className="text-4xl font-black text-white italic tracking-tighter mb-4 uppercase text-center">Studio Not Found.</h1>
        <p className="text-gray-500 mb-10 max-w-sm uppercase font-bold text-[11px] tracking-widest text-center">The merchant studio you are looking for does not exist.</p>
        <Link href="/marketplace" className="px-10 py-4 bg-white text-black font-black uppercase text-[10px] tracking-widest rounded-full">
          Explore Marketplace
        </Link>
      </div>
    );
  }

  const filteredProducts = storeData.products.filter((p: any) => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#050505] text-[#e1e1e1] selection:bg-blue-600 selection:text-white">
      {/* Dynamic Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/20 backdrop-blur-3xl border-b border-white/[0.03]">
        <div className="max-w-7xl mx-auto px-8 h-24 flex items-center justify-between">
          <Link href="/marketplace" className="flex items-center text-[10px] font-black uppercase tracking-widest text-gray-500 hover:text-white transition-colors group">
            <ArrowLeft className="h-4 w-4 mr-3 group-hover:-translate-x-2 transition-transform" />
            Marketplace
          </Link>
          
          <div className="flex items-center space-x-8">
            {shopper ? (
              <Link href="/shopper/dashboard" className="flex items-center space-x-4 group/user p-1 pr-4 hover:bg-white/5 rounded-full border border-transparent hover:border-white/10 transition-all">
                 <div className="text-right hidden sm:block">
                   <p className="text-[9px] font-black text-gray-600 uppercase tracking-widest leading-none mb-1">My Dashboard</p>
                   <p className="text-[10px] font-black text-blue-500 uppercase italic leading-none">{shopper.name}</p>
                 </div>
                 <div className="w-11 h-11 bg-blue-600/10 border border-blue-600/20 rounded-2xl flex items-center justify-center text-blue-500 font-black italic text-sm group-hover/user:scale-110 transition-transform">
                   {shopper.name[0]}
                 </div>
              </Link>
            ) : (
              <Link 
                href="/login"
                className="px-6 py-2.5 bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest text-white rounded-full hover:bg-white/10 transition-all"
              >
                Sign In
              </Link>
            )}
            <button className="relative w-12 h-12 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center text-gray-400 group overflow-hidden">
               <ShoppingBag className="h-5 w-5 relative z-10" />
               <div className="absolute inset-0 bg-white translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
               <ShoppingBag className="h-5 w-5 absolute z-20 text-black translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
            </button>
          </div>
        </div>
      </nav>

      {/* High-End Hero Section */}
      <header className="relative pt-44 pb-24 px-8 border-b border-white/[0.03] overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-gradient-to-b from-blue-600/5 to-transparent blur-3xl -z-10" />
        
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-end justify-between gap-12">
          <div className="space-y-8">
            <div className="flex items-center space-x-6">
              <div className="w-24 h-24 bg-white text-black rounded-[32px] flex items-center justify-center text-4xl font-black shadow-2xl uppercase italic">
                {storeData.businessName[0]}
              </div>
              <div className="space-y-1">
                <div className="inline-flex items-center space-x-2 px-3 py-1 bg-white/5 border border-white/10 rounded-full">
                  <Sparkles className="h-3 w-3 text-blue-400" />
                  <span className="text-[10px] font-bold uppercase tracking-widest text-blue-400 font-black italic">Verified Studio</span>
                </div>
                <h1 className="text-6xl md:text-7xl lg:text-8xl font-black tracking-tighter italic leading-none uppercase text-white mt-2">
                  {storeData.businessName}.
                </h1>
              </div>
            </div>
            <p className="text-gray-500 text-xl font-medium max-w-2xl leading-relaxed">
              Discover the elite collection of 3D-integrated products by <span className="text-white font-bold">{storeData.businessName}</span>. Immersive shopping starts here.
            </p>
          </div>
          
          <div className="flex flex-col items-end pb-4">
            <div className="flex items-center space-x-8">
              <div className="text-right">
                <p className="text-4xl font-black tracking-tighter italic text-white">{storeData.products.length}</p>
                <p className="text-[10px] font-black text-gray-600 uppercase tracking-widest mt-1">Total Products</p>
              </div>
              <div className="w-12 h-12 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center">
                <ShoppingBag className="h-5 w-5 text-gray-400" />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Modern Filter Engine */}
      <section className="sticky top-24 z-40 bg-black/60 backdrop-blur-2xl border-b border-white/[0.03]">
        <div className="max-w-7xl mx-auto px-8 h-24 flex items-center justify-between">
          <div className="flex-1 max-w-xl relative group">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-600 group-focus-within:text-blue-500 transition-colors" />
            <input 
              type="text" 
              placeholder="Search collection..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white/[0.03] border border-transparent rounded-[20px] pl-14 pr-6 py-4 text-sm font-bold focus:outline-none focus:border-white/10 transition-all placeholder:text-gray-700"
            />
          </div>
          
          <div className="flex items-center space-x-4 ml-8">
            <button className="w-12 h-12 bg-white/[0.03] border border-white/10 rounded-[18px] flex items-center justify-center text-gray-500 hover:text-white transition-all">
              <Filter className="h-4 w-4" />
            </button>
            <div className="flex bg-white/[0.03] border border-white/10 rounded-[20px] p-1.5">
              <button className="w-9 h-9 bg-white text-black rounded-[14px] flex items-center justify-center shadow-lg">
                <Grid2X2 className="h-4 w-4" />
              </button>
              <button className="w-9 h-9 text-gray-500 hover:text-white transition-all flex items-center justify-center">
                <ListIcon className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Catalogue Grid */}
      <main className="max-w-7xl mx-auto px-8 py-20 pb-40">
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-12 lg:gap-10">
            {filteredProducts.map((product: any) => (
              <Link 
                key={product.id}
                href={`/store/${slug}/${product.id}`}
                className="group relative"
              >
                <div className="aspect-[4/5] bg-[#0f0f11] border border-white/[0.03] rounded-[40px] overflow-hidden transition-all group-hover:border-white/[0.08] group-hover:shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
                  {/* Image */}
                  <img 
                    src={product.images[0]} 
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-70 group-hover:opacity-100"
                  />
                  
                  {/* AR Presence Tag */}
                  {product.modelUrl && (
                    <div className="absolute top-6 right-6 px-4 py-1.5 bg-black/60 backdrop-blur-md border border-white/10 rounded-full text-[10px] font-black uppercase tracking-[0.2em] flex items-center text-white">
                      <Box className="h-3 w-3 mr-2 text-blue-500" fill="currentColor" />
                      View in 3D
                    </div>
                  )}

                  {/* Information Overlay */}
                  <div className="absolute bottom-0 left-0 right-0 p-8 pt-20 bg-gradient-to-t from-black via-black/80 to-transparent">
                    <div className="space-y-4">
                      <div>
                        <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest mb-1">{product.category}</p>
                        <h3 className="text-xl font-bold text-white tracking-tighter leading-tight uppercase italic group-hover:text-blue-400 transition-colors">{product.name}</h3>
                      </div>
                      
                      <div className="flex items-center justify-between items-end">
                        <span className="text-2xl font-black tracking-tighter tabular-nums italic text-white">£{product.price}</span>
                        <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-black group-hover:scale-110 transition-transform shadow-2xl">
                          <ArrowRight className="h-5 w-5" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="py-40 text-center flex flex-col items-center">
            <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-10 opacity-20">
              <ShoppingBag className="h-10 w-10 text-gray-500" />
            </div>
            <h2 className="text-2xl font-black italic tracking-tighter text-white uppercase">Our shop is currently empty.</h2>
            <p className="text-gray-500 max-w-sm mx-auto font-bold text-[10px] tracking-widest mt-2">Check back soon for new 3D products!</p>
            <button 
              onClick={() => setSearchTerm('')}
              className="mt-10 text-[10px] font-black text-blue-500 uppercase tracking-widest bg-blue-500/5 px-6 py-2.5 rounded-xl border border-blue-500/10 hover:bg-blue-500/10 transition-all"
            >
              Show all products
            </button>
          </div>
        )}
      </main>

      {/* High-End Footer */}
      <footer className="border-t border-white/[0.03] py-24 bg-[#030303] flex flex-col items-center text-center">
        <div className="text-2xl font-black italic tracking-tighter uppercase mb-10">
          STUDIO <span className="text-blue-500">CORE.</span>
        </div>
        <p className="text-gray-500 max-w-md leading-relaxed text-sm font-medium">
          Official spatial storefront powered by the ViewIt AR Engine. Real-world visualization at the speed of light.
        </p>
        <div className="mt-16 flex items-center space-x-12 text-[10px] font-black text-gray-600 uppercase tracking-[0.2em]">
          <a href="#" className="hover:text-white transition-colors">Digital Gallery</a>
          <a href="#" className="hover:text-white transition-colors">Privacy Core</a>
          <a href="#" className="hover:text-white transition-colors">Logistics</a>
        </div>
        <p className="mt-20 text-[9px] font-bold text-gray-800 uppercase tracking-widest italic">
          © 2026 Developed for Fuzcore Technical Assessment Phase.
        </p>
      </footer>
    </div>
  );
}
