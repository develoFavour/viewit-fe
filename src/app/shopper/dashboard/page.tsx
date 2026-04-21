'use client';

import React, { useEffect, useState } from 'react';
import { get, post } from '@/lib/method';
import { 
  Heart, 
  Box, 
  ArrowRight, 
  Grid2X2, 
  Trash2, 
  Loader2,
  Sparkles,
  ShoppingBag
} from 'lucide-react';
import { cn, formatCurrency } from '@/lib/utils';
import Link from 'next/link';
import toast from 'react-hot-toast';

export default function ShopperDashboard() {
  const [favorites, setFavorites] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const response = await get<any>('/buyer/favorites');
        setFavorites(response.data.data);
      } catch (error) {
        console.error("Failed to load collection");
      } finally {
        setIsLoading(false);
      }
    };
    fetchFavorites();
  }, []);

  const handleRemoveFavorite = async (productId: string) => {
    try {
      await post<any>('/buyer/favorites/toggle', { productId });
      setFavorites(favorites.filter(f => f.productId !== productId));
      toast.success("Removed from your collection.");
    } catch (error) {
      toast.error("Failed to update collection.");
    }
  };

  if (isLoading) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center">
        <Loader2 className="h-8 w-8 text-blue-500 animate-spin" />
        <p className="mt-8 text-[10px] font-black uppercase tracking-[0.3em] text-gray-500 italic">Syncing Collection.</p>
      </div>
    );
  }

  return (
    <div className="space-y-12 animate-in fade-in duration-1000">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-8 pb-4">
        <div className="space-y-3">
          <div className="inline-flex items-center space-x-2 px-3 py-1 bg-blue-500/10 border border-blue-500/20 rounded-full">
            <Sparkles className="h-3 w-3 text-blue-400" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-blue-400">Personal Gallery</span>
          </div>
          <h1 className="text-5xl font-black text-white tracking-tighter italic uppercase">
            My <span className="text-gray-500">Collection.</span>
          </h1>
          <p className="text-gray-500 text-sm font-bold uppercase tracking-widest pt-2">
            Managing {favorites.length} saved spatial exhibits
          </p>
        </div>

        <Link 
          href="/marketplace"
          className="px-8 py-4 bg-white text-black font-black uppercase text-[11px] tracking-widest rounded-full flex items-center hover:scale-105 transition-all shadow-2xl"
        >
          <ShoppingBag className="mr-3 h-4 w-4" />
          Browse Marketplace
        </Link>
      </header>

      {favorites.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {favorites.map((fav) => (
            <div 
              key={fav.id}
              className="bg-[#0f0f11] border border-white/[0.03] rounded-[40px] overflow-hidden group hover:border-white/10 transition-all shadow-xl"
            >
              <div className="aspect-[4/5] relative">
                <img 
                  src={fav.product.images[0]} 
                  alt={fav.product.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-70 group-hover:opacity-100"
                />
                <div className="absolute top-6 left-6 flex space-x-2">
                   <div className="px-4 py-1.5 bg-black/60 backdrop-blur-md border border-white/10 rounded-full text-[9px] font-black uppercase tracking-widest text-white">
                      {fav.product.category}
                   </div>
                </div>
                <button 
                  onClick={() => handleRemoveFavorite(fav.product.id)}
                  className="absolute top-6 right-6 w-10 h-10 bg-red-500/20 backdrop-blur-md border border-red-500/30 text-red-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:bg-red-500 hover:text-white"
                >
                  <Trash2 className="h-4 w-4" />
                </button>

                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                   <Link 
                    href={`/store/${fav.product.merchant.slug}/${fav.product.id}`}
                    className="w-16 h-16 bg-white text-black rounded-full flex items-center justify-center shadow-2xl scale-75 group-hover:scale-100 transition-transform duration-500 hover:bg-blue-600 hover:text-white"
                   >
                      <Box className="h-6 w-6" />
                   </Link>
                </div>
              </div>

              <div className="p-8 space-y-4">
                <div>
                  <h3 className="text-xl font-black text-white italic tracking-tighter uppercase leading-none">{fav.product.name}</h3>
                  <p className="text-[10px] font-bold text-gray-600 uppercase tracking-widest mt-2">by {fav.product.merchant.businessName}</p>
                </div>
                
                <div className="flex items-center justify-between pt-4 border-t border-white/[0.03]">
                   <span className="text-xl font-black italic tabular-nums">{formatCurrency(fav.product.price)}</span>
                   <Link 
                    href={`/store/${fav.product.merchant.slug}/${fav.product.id}`}
                    className="text-[10px] font-black text-blue-500 uppercase tracking-widest flex items-center group-hover:translate-x-2 transition-transform"
                   >
                     Inspect 3D <ArrowRight className="ml-2 h-3 w-3" />
                   </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="py-40 flex flex-col items-center justify-center border border-dashed border-white/5 rounded-[48px]">
           <Heart className="h-16 w-16 text-white/5 mb-8" />
           <p className="text-[10px] font-black text-gray-700 uppercase tracking-[0.3em] italic">Your vault is currently empty.</p>
           <p className="text-gray-500 text-[11px] font-medium mt-2">Heart your favorite products in the marketplace to see them here.</p>
           <Link href="/marketplace" className="mt-10 px-8 py-3 bg-blue-600/10 border border-blue-600/20 text-blue-500 text-[10px] font-black rounded-xl uppercase tracking-widest hover:bg-blue-600/20 transition-all">
             Start Exploring
           </Link>
        </div>
      )}
    </div>
  );
}
