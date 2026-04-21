'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { get, post } from '@/lib/method';
import { ENDPOINTS } from '@/constants/endpoint.const';
import ModelViewer from '@/components/common/ModelViewer';
import InteractionBuilder from '@/components/merchant/InteractionBuilder';
import ShopperAuthModal from '@/components/auth/ShopperAuthModal';
import {
  Loader2,
  ArrowLeft,
  ShoppingBag,
  Share2,
  ChevronRight,
  ShieldCheck,
  Truck,
  Box,
  Heart,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { cn, formatCurrency } from '@/lib/utils';
import Link from 'next/link';
import toast from 'react-hot-toast';

export default function StoreProductPage() {
  const params = useParams();
  const { slug, id } = params;

  const [product, setProduct] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);
  const [shopper, setShopper] = useState<any>(null);
  const [hotspots, setHotspots] = useState<any[]>([]);
  const [viewMode, setViewMode] = useState<'3d' | 'image'>('3d');

  useEffect(() => {
    // 1. Check for shopper session
    const savedShopper = localStorage.getItem('viewit_shopper_user');
    let currentShopper = null;
    if (savedShopper) {
      currentShopper = JSON.parse(savedShopper);
      setShopper(currentShopper);
    }

    const fetchPageData = async () => {
      try {
        // 2. Fetch Product Details & Hotspots
        const [prodResponse, hotRes] = await Promise.all([
          get<any>(ENDPOINTS.STORE.GET_PRODUCT(slug as string, id as string)),
          get<any>(`/hotspots/${id}`).catch(() => ({ data: { data: [] } }))
        ]);
        const prodData = prodResponse.data.data;
        setProduct(prodData);
        setHotspots(hotRes.data.data || []);

        // 3. Check if favorited (only if shopper logged in)
        if (currentShopper) {
          const favResponse = await get<any>('/buyer/favorites');
          const isFav = favResponse.data.data.some((f: any) => f.productId === id);
          setIsFavorited(isFav);
        }

        // 4. Track view (only once per session)
        const sessionKey = `viewed_${id}`;
        if (!sessionStorage.getItem(sessionKey)) {
          sessionStorage.setItem(sessionKey, 'true'); // Flag instantly
          await post<any>(ENDPOINTS.STORE.TRACK_VIEW, {
            merchantId: prodData.merchantId,
            productId: id
          });
        }
      } catch (error) {
        console.error('Failed to load store data');
      } finally {
        setIsLoading(false);
      }
    };

    if (slug && id) fetchPageData();
  }, [slug, id]);

  const handleArView = async () => {
    if (!product) return;
    
    // Only track one AR interaction per session
    const arSessionKey = `ar_viewed_${id}`;
    if (sessionStorage.getItem(arSessionKey)) return;

    try {
      sessionStorage.setItem(arSessionKey, 'true');
      await post<any>(ENDPOINTS.STORE.TRACK_AR_VIEW, {
        merchantId: product.merchantId,
        productId: product.id
      });
    } catch (error) {
      console.error('Failed to track AR view');
    }
  };

  const handleFavorite = async () => {
    if (!shopper) {
      setIsAuthModalOpen(true);
      return;
    }

    try {
      // Optimistic Update
      const previousState = isFavorited;
      setIsFavorited(!previousState);
      
      await post<any>('/buyer/favorites/toggle', { productId: id });
      toast.success(previousState ? "Removed from your collection" : "Saved to your collection!");
    } catch (error: any) {
       setIsFavorited(isFavorited); // Rollback
       toast.error("Couldn't update collection");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center">
        <Loader2 className="h-10 w-10 text-blue-500 animate-spin" />
        <p className="mt-8 text-gray-500 font-black uppercase tracking-[0.3em] text-[10px]">Preparing Gallery.</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center p-6 text-center">
        <h1 className="text-5xl font-black text-white italic tracking-tighter mb-4 uppercase">Lost Colony.</h1>
        <p className="text-gray-500 mb-12 max-w-sm font-bold text-[11px] tracking-widest uppercase">This masterpiece is no longer part of our exhibition.</p>
        <Link href={`/store/${slug}`} className="px-12 py-5 bg-white text-black font-black uppercase text-[11px] tracking-widest rounded-full">
          Back to Shop
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] text-[#e1e1e1] selection:bg-blue-600 selection:text-white pb-32">
      <ShopperAuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
        onSuccess={(token, user) => setShopper(user)}
      />

      {/* Modern Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/20 backdrop-blur-3xl border-b border-white/[0.03]">
        <div className="max-w-7xl mx-auto px-8 h-24 flex items-center justify-between">
          <Link href={`/store/${slug}`} className="flex items-center text-[10px] font-black uppercase tracking-widest text-gray-500 hover:text-white transition-colors group">
            <ArrowLeft className="h-4 w-4 mr-3 group-hover:-translate-x-2 transition-transform" />
            Collection
          </Link>

          <div className="flex-1 flex justify-center">
             <div className="flex items-center space-x-2">
                <div className="w-5 h-5 bg-blue-600 rounded-lg flex items-center justify-center">
                  <Box className="h-3 w-3 text-white" />
                </div>
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500 italic">ViewIt Spatial v2</span>
             </div>
          </div>

          <div className="flex items-center space-x-8">
            <button className="text-gray-500 hover:text-white transition-colors">
              <Share2 className="h-5 w-5" />
            </button>
            
            {shopper ? (
              <Link href="/shopper/dashboard" className="flex items-center space-x-4 group/user p-1 pr-4 hover:bg-white/5 rounded-full border border-transparent hover:border-white/10 transition-all">
                 <div className="text-right hidden sm:block">
                   <p className="text-[9px] font-bold text-gray-600 uppercase tracking-widest">Digital Vault</p>
                   <p className="text-[10px] font-black text-blue-500 uppercase italic leading-none">{shopper.name}</p>
                 </div>
                 <div className="w-11 h-11 bg-blue-600/10 border border-blue-600/20 rounded-2xl flex items-center justify-center text-blue-500 font-black italic text-sm group-hover/user:scale-110 transition-transform">
                   {shopper.name[0]}
                 </div>
              </Link>
            ) : (
              <button 
                onClick={() => setIsAuthModalOpen(true)}
                className="px-6 py-2.5 bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest text-white rounded-full hover:bg-white/10 transition-all"
              >
                Sign In
              </button>
            )}
            
            <button className="relative w-12 h-12 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center text-gray-400 group overflow-hidden">
               <ShoppingBag className="h-5 w-5 relative z-10" />
               <div className="absolute inset-0 bg-white translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
               <ShoppingBag className="h-5 w-5 absolute z-20 text-black translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-8 pt-44 grid grid-cols-1 lg:grid-cols-2 gap-24">
        {/* Visual Engine Column */}
        <div className="space-y-12">
          {product.modelUrl ? (
            <div className="aspect-square bg-[#0f0f11] border border-white/[0.05] rounded-[48px] overflow-hidden relative group shadow-2xl">
              
              <div className="absolute top-6 left-1/2 -translate-x-1/2 z-10 flex p-1 bg-black/50 backdrop-blur-md rounded-full border border-white/10 shadow-2xl">
                <button
                  onClick={() => setViewMode('3d')}
                  className={cn(
                    "px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all",
                    viewMode === '3d' ? "bg-white text-black shadow-lg" : "text-gray-400 hover:text-white"
                  )}
                >
                  Spatial 3D
                </button>
                <button
                  onClick={() => setViewMode('image')}
                  className={cn(
                    "px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all",
                    viewMode === 'image' ? "bg-white text-black shadow-lg" : "text-gray-400 hover:text-white"
                  )}
                >
                  Gallery
                </button>
              </div>

              {viewMode === '3d' ? (
                <div className="w-full h-full cursor-crosshair" onClick={handleArView}>
                  {hotspots.length > 0 ? (
                    <InteractionBuilder
                      productId={product.id}
                      merchantId={product.merchantId}
                      modelUrl={product.modelUrl}
                      hotspots={hotspots}
                      isEditMode={false}
                    />
                  ) : (
                    <ModelViewer
                      src={product.modelUrl}
                      poster={product.images[activeImage]}
                      alt={product.name}
                    />
                  )}
                  
                  <div className="absolute bottom-8 left-0 right-0 flex justify-center pointer-events-none">
                    <div className="px-5 py-2.5 bg-black/80 backdrop-blur-xl border border-white/10 rounded-full flex items-center space-x-3 text-[10px] font-black uppercase tracking-[0.2em] shadow-2xl opacity-0 group-hover:opacity-100 transition-all transform translate-y-4 group-hover:translate-y-0">
                      <Box className="h-3 w-3 text-blue-500" />
                      <span>Interact in 3D</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="w-full h-full bg-[#0a0a0c] flex items-center justify-center p-8">
                  <img src={product.images[activeImage]} className="w-full h-full object-contain drop-shadow-2xl animate-in zoom-in-95 duration-500" />
                </div>
              )}
            </div>
          ) : (
            <div className="aspect-square bg-[#0f0f11] border border-white/[0.05] rounded-[48px] overflow-hidden shadow-2xl relative">
               <img src={product.images[activeImage]} className="w-full h-full object-cover opacity-80" />
               <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-12">
                  <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest italic flex items-center">
                    <Box className="h-3 w-3 mr-2" />
                    Preview Only Interface
                  </p>
               </div>
            </div>
          )}

          {/* Gallery Strips */}
          <div className="grid grid-cols-4 gap-6 px-12">
            {product.images.map((img: string, i: number) => (
              <button 
                key={i}
                onClick={() => setActiveImage(i)}
                className={cn(
                  "aspect-square rounded-3xl overflow-hidden border-2 transition-all p-1",
                  activeImage === i ? "border-blue-600 bg-blue-600/10" : "border-transparent bg-white/5 opacity-40 hover:opacity-100 shadow-xl"
                )}
              >
                <img src={img} className="w-full h-full object-cover rounded-2xl" />
              </button>
            ))}
          </div>
        </div>

        {/* Narrative & Commerce Column */}
        <div className="flex flex-col py-0">
          <div className="space-y-12">
            <div className="space-y-6">
              <div className="flex items-center space-x-3">
                <span className="px-5 py-1.5 bg-blue-600/10 border border-blue-600/20 text-blue-500 text-[10px] font-black uppercase tracking-[0.2em] rounded-full">{product.category}</span>
                <div className="flex items-center space-x-2 text-gray-500">
                  <ShieldCheck className="h-4 w-4" />
                  <span className="text-[10px] font-bold uppercase tracking-widest italic">Encrypted Secure Store</span>
                </div>
              </div>
              <h1 className="text-7xl font-black text-white italic tracking-tighter leading-none uppercase pr-10">
                {product.name}.
              </h1>
              <div className="flex items-baseline space-x-4">
                <span className="text-5xl font-black text-white italic tracking-tighter tabular-nums">{formatCurrency(product.price)}</span>
                <span className="text-[10px] font-bold text-gray-600 uppercase tracking-widest italic pt-2">Tax Included</span>
              </div>
            </div>

            <div className="space-y-4">
               <h3 className="text-[10px] font-black text-gray-600 uppercase tracking-widest border-l-2 border-blue-600 pl-4">The Narrative</h3>
               <p className="text-gray-400 text-lg leading-relaxed font-medium">
                {product.description}
               </p>
            </div>

            {/* CTA Engine */}
            <div className="space-y-6 pt-4">
              <div className="flex items-center space-x-4">
                <button className="flex-1 py-6 bg-white text-black font-black uppercase text-sm tracking-[0.2em] rounded-[24px] shadow-2xl hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center">
                  Add to Cart.
                  <ChevronRight className="h-5 w-5 ml-2" />
                </button>
                <button 
                  onClick={handleFavorite}
                  className={cn(
                    "w-20 h-20 border-2 rounded-[32px] flex items-center justify-center transition-all group relative overflow-hidden",
                    isFavorited ? "bg-red-500 border-red-500 text-white" : "border-white/10 hover:border-white/30 text-white"
                  )}
                >
                  <Heart className={cn("h-6 w-6 relative z-10 transition-transform duration-500 group-hover:scale-125", isFavorited && "fill-current")} />
                  {isFavorited && (
                    <div className="absolute inset-0 bg-red-400/20 animate-ping opacity-20" />
                  )}
                </button>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center p-6 bg-[#0f0f11] rounded-3xl border border-white/[0.03]">
                  <Truck className="h-5 w-5 text-gray-700 mr-4" />
                  <div className="text-left">
                    <p className="text-[11px] font-black text-white uppercase italic leading-none">Fast Delivery</p>
                    <p className="text-[9px] font-bold text-gray-600 uppercase tracking-widest mt-1">3-5 Biz Days</p>
                  </div>
                </div>
                <div className="flex items-center p-6 bg-[#0f0f11] rounded-3xl border border-white/[0.03]">
                  <ShieldCheck className="h-5 w-5 text-gray-700 mr-4" />
                  <div className="text-left">
                    <p className="text-[11px] font-black text-white uppercase italic leading-none">Warranty</p>
                    <p className="text-[9px] font-bold text-gray-600 uppercase tracking-widest mt-1">1 Year Core</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Merchant Identity Card */}
            <div className="pt-20 border-t border-white/[0.03] space-y-6">
              <p className="text-[10px] font-black text-gray-600 uppercase tracking-[0.3em]">Authorized Merchandiser</p>
              <Link href={`/store/${slug}`} className="flex items-center justify-between p-8 bg-[#0b0b0d] rounded-[32px] group border border-transparent hover:border-white/10 transition-all shadow-xl">
                <div className="flex items-center space-x-6">
                  <div className="w-16 h-16 bg-white text-black rounded-2xl flex items-center justify-center font-black text-2xl italic shadow-2xl">
                    {product.merchant.businessName[0]}
                  </div>
                  <div>
                    <h4 className="text-lg font-black text-white uppercase tracking-tighter italic leading-none">{product.merchant.businessName}</h4>
                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-1">View Studio Collection</p>
                  </div>
                </div>
                <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all text-gray-600">
                  <ArrowRight className="h-5 w-5" />
                </div>
              </Link>
            </div>
          </div>
        </div>
      </main>

      <footer className="mt-40 border-t border-white/[0.03] py-20 bg-black/50">
        <div className="max-w-7xl mx-auto px-8 flex flex-col md:flex-row items-center justify-between gap-10">
          <div className="flex items-center space-x-3">
             <div className="w-6 h-6 bg-blue-600 rounded-md flex items-center justify-center">
              <Box className="h-4 w-4 text-white" />
            </div>
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-600 italic">ViewIt Spatial Web Engine 2.0</p>
          </div>
          <div className="flex items-center space-x-12 text-[10px] font-black text-gray-800 uppercase tracking-widest">
            <a href="#" className="hover:text-gray-400 transition-colors">Privacy</a>
            <a href="#" className="hover:text-gray-400 transition-colors">Safety</a>
            <a href="#" className="hover:text-gray-400 transition-colors">Terms</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
