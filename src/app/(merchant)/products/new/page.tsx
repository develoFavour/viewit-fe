'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { post } from '@/lib/method';
import { ENDPOINTS } from '@/constants/endpoint.const';
import { ROUTES } from '@/constants/routes.const';
import { toast } from 'react-hot-toast';
import {
  ArrowLeft,
  Upload,
  Loader2,
  X,
  Box,
  Image as ImageIcon,
  DollarSign,
  Sparkles,
  Command,
  Zap
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function NewProductPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    images: [] as string[],
    modelUrl: '',
    isPublished: false,
  });

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const formDataUpload = new FormData();
    formDataUpload.append('image', file);

    try {
      const response = await post<any>(ENDPOINTS.UPLOAD.IMAGE, formDataUpload, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, response.data.data.url]
      }));
      toast.success('Image uploaded successfully');
    } catch (error) {
      toast.error('Failed to upload image');
    } finally {
      setIsUploading(false);
    }
  };

  const handleModelUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.glb')) {
      toast.error('Please upload a .glb file');
      return;
    }

    setIsUploading(true);
    const formDataUpload = new FormData();
    formDataUpload.append('model', file);

    try {
      const response = await post<any>(ENDPOINTS.UPLOAD.MODEL, formDataUpload, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setFormData(prev => ({ ...prev, modelUrl: response.data.data.url }));
      toast.success('3D model uploaded');
    } catch (error) {
      toast.error('Failed to upload 3D model');
    } finally {
      setIsUploading(false);
    }
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.images.length === 0) {
      toast.error('Please upload at least one image');
      return;
    }

    setIsLoading(true);
    try {
      await post(ENDPOINTS.PRODUCTS.BASE, {
        ...formData,
        price: parseFloat(formData.price)
      });
      toast.success('Product created successfully!');
      router.push(ROUTES.MERCHANT.PRODUCTS);
    } catch (error) {
      toast.error('Failed to create product');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-12 pb-20 animate-in fade-in duration-700">
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-8">
        <div className="flex items-center space-x-6">
          <button
            onClick={() => router.back()}
            className="w-12 h-12 bg-[#0f0f11] border border-[#1a1a1c] rounded-2xl flex items-center justify-center text-gray-500 hover:text-white transition-all hover:border-gray-700 active:scale-95"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div className="space-y-1">
            <h1 className="text-4xl font-black text-white tracking-tighter">Add Product.</h1>
            <p className="text-gray-500 text-sm font-medium">
              Add a new product to your AR-enabled store
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-6">
          <button
            type="button"
            onClick={() => router.back()}
            className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-500 hover:text-white transition-colors"
          >
            Cancel
          </button>
          <button
            form="product-form"
            type="submit"
            disabled={isLoading || isUploading}
            className="px-10 py-4 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-black rounded-2xl transition-all shadow-2xl shadow-blue-900/40 active:scale-[0.98] flex items-center"
          >
            {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : (
              <>
                <Sparkles className="mr-2 h-4 w-4" fill="white" />
                Save Product
              </>
            )}
          </button>
        </div>
      </header>

      <form id="product-form" onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-8">

          {/* General Information */}
          <div className="bg-[#0f0f11] border border-[#1a1a1c] rounded-[32px] p-10 space-y-8">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-blue-500/10 rounded-xl flex items-center justify-center">
                <Command className="h-5 w-5 text-blue-500" />
              </div>
              <h2 className="text-xl font-bold text-white tracking-tight">General Info</h2>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest px-1">
                  Product Name
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-6 py-4 bg-white/5 border border-transparent rounded-2xl text-white placeholder-gray-700 focus:outline-none focus:border-blue-500/50 transition-all text-xl font-bold"
                  placeholder="e.g. Minimalist Lounge Chair"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest px-1">
                  Description
                </label>
                <textarea
                  required
                  rows={5}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-6 py-4 bg-white/5 border border-transparent rounded-2xl text-white placeholder-gray-700 focus:outline-none focus:border-blue-500/50 transition-all resize-none font-medium leading-relaxed"
                  placeholder="Describe what makes this product special — materials, dimensions, style..."
                />
              </div>
            </div>
          </div>

          {/* Media Upload */}
          <div className="bg-[#0f0f11] border border-[#1a1a1c] rounded-[32px] p-10 space-y-8">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-orange-500/10 rounded-xl flex items-center justify-center">
                <ImageIcon className="h-5 w-5 text-orange-500" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white tracking-tight">Product Photos</h2>
                <p className="text-[10px] text-gray-600 font-bold uppercase tracking-widest mt-0.5">
                  First photo becomes the cover
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {formData.images.map((url, i) => (
                <div key={i} className="relative aspect-square rounded-[20px] overflow-hidden border border-[#1a1a1c] group">
                  <img src={url} alt="Product" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  {i === 0 && (
                    <div className="absolute top-2 left-2 px-2 py-0.5 bg-blue-600 rounded-full text-[8px] font-black text-white uppercase tracking-widest">
                      Cover
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={() => removeImage(i)}
                    className="absolute inset-0 bg-red-600/70 backdrop-blur-sm text-white opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>
              ))}

              {formData.images.length < 8 && (
                <label className="aspect-square rounded-[20px] border-2 border-dashed border-[#1a1a1c] hover:border-gray-700 hover:bg-white/5 flex flex-col items-center justify-center cursor-pointer transition-all group">
                  <Upload className="h-6 w-6 text-gray-700 group-hover:text-blue-500 transition-colors mb-2" />
                  <span className="text-[10px] font-black text-gray-600 uppercase tracking-widest">
                    {isUploading ? 'Uploading...' : 'Add Photo'}
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageUpload}
                    disabled={isUploading}
                  />
                </label>
              )}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-8">

          {/* 3D Model Upload */}
          <div className="bg-[#0f0f11] border border-[#1a1a1c] rounded-[32px] p-10 space-y-8">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-purple-500/10 rounded-xl flex items-center justify-center">
                <Box className="h-5 w-5 text-purple-500" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white tracking-tight">3D Model</h2>
                <p className="text-[10px] text-gray-600 font-bold uppercase tracking-widest mt-0.5">Optional · GLB format</p>
              </div>
            </div>

            {formData.modelUrl ? (
              <div className="p-6 bg-purple-500/5 rounded-2xl border border-purple-500/20 flex items-center justify-between">
                <div className="flex items-center space-x-4 overflow-hidden">
                  <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Box className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <span className="text-[11px] font-black text-purple-400 uppercase tracking-widest block">3D Model Ready</span>
                    <span className="text-[9px] text-gray-600 font-bold uppercase tracking-widest">AR-enabled product</span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, modelUrl: '' }))}
                  className="w-8 h-8 bg-white/5 hover:bg-red-500/10 hover:text-red-500 rounded-lg flex items-center justify-center transition-colors text-gray-500"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <label className="block w-full py-10 bg-white/[0.02] border-2 border-dashed border-[#1a1a1c] rounded-3xl cursor-pointer hover:border-purple-500/50 hover:bg-purple-500/5 transition-all text-center">
                <div className="inline-flex p-4 bg-purple-600/10 rounded-2xl mb-4 border border-purple-600/20">
                  <Upload className="h-6 w-6 text-purple-400" />
                </div>
                <p className="text-sm font-black text-white px-6">Upload .glb file</p>
                <p className="text-xs text-gray-600 mt-2 px-8 font-medium">Enables buyers to view in AR</p>
                <input type="file" accept=".glb" className="hidden" onChange={handleModelUpload} disabled={isUploading} />
              </label>
            )}
          </div>

          {/* Pricing & Status */}
          <div className="bg-[#0f0f11] border border-[#1a1a1c] rounded-[32px] p-10 space-y-8">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-emerald-500/10 rounded-xl flex items-center justify-center">
                <DollarSign className="h-5 w-5 text-emerald-500" />
              </div>
              <h2 className="text-xl font-bold text-white tracking-tight">Pricing & Status</h2>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest px-1">Price (£)</label>
                <input
                  type="number"
                  required
                  step="0.01"
                  min="0"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  className="w-full px-6 py-4 bg-white/5 border border-transparent rounded-2xl text-white font-black text-2xl focus:outline-none focus:border-emerald-500/50 transition-all tabular-nums"
                  placeholder="0.00"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest px-1">Category</label>
                <select
                  required
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-6 py-4 bg-white/5 border border-transparent rounded-2xl text-white font-bold focus:outline-none focus:border-blue-500/50 transition-all appearance-none cursor-pointer"
                >
                  <option value="" disabled className="bg-[#0f0f11]">Select a category</option>
                  <option value="Furniture" className="bg-[#0f0f11]">Furniture</option>
                  <option value="Electronics" className="bg-[#0f0f11]">Electronics</option>
                  <option value="Decor" className="bg-[#0f0f11]">Decor</option>
                  <option value="Fashion" className="bg-[#0f0f11]">Fashion</option>
                  <option value="Luxury" className="bg-[#0f0f11]">Luxury</option>
                  <option value="Other" className="bg-[#0f0f11]">Other</option>
                </select>
              </div>

              <div className="flex items-center justify-between p-5 bg-white/5 rounded-2xl border border-transparent hover:border-[#1a1a1c] transition-all">
                <div className="space-y-0.5">
                  <p className="text-[11px] font-black text-white uppercase tracking-tighter">Publish Now</p>
                  <p className="text-[10px] font-bold text-gray-600 uppercase">Visible to shoppers</p>
                </div>
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, isPublished: !prev.isPublished }))}
                  className={cn(
                    "relative inline-flex h-7 w-12 items-center rounded-full transition-all focus:outline-none",
                    formData.isPublished ? "bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.3)]" : "bg-gray-800"
                  )}
                >
                  <span
                    className={cn(
                      "inline-block h-5 w-5 transform rounded-full bg-white transition-transform shadow-sm",
                      formData.isPublished ? "translate-x-6" : "translate-x-1"
                    )}
                  />
                </button>
              </div>
            </div>
          </div>

          {/* Tip Card */}
          <div className="p-6 bg-blue-600/5 border border-blue-600/10 rounded-3xl">
            <p className="text-[9px] font-black text-blue-500 uppercase tracking-widest mb-2">Pro Tip</p>
            <p className="text-xs text-gray-500 leading-relaxed">
              Upload a <span className="text-white font-bold">.glb 3D model</span> to unlock the AR viewer. Once saved, use the <span className="text-blue-400 font-bold">✦ Story Builder</span> from your products list to add interactive hotspots.
            </p>
          </div>
        </div>
      </form>

      {/* Upload Overlay */}
      {isUploading && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[100] flex items-center justify-center">
          <div className="flex flex-col items-center space-y-6">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-blue-500/20 border-t-blue-600 rounded-full animate-spin" />
              <Zap className="absolute inset-x-0 inset-y-0 m-auto h-6 w-6 text-blue-500 animate-pulse" />
            </div>
            <div className="text-center">
              <p className="text-white font-black text-xl tracking-tight">Uploading...</p>
              <p className="text-gray-500 text-sm mt-1 uppercase font-bold tracking-[0.2em]">Syncing to Studio Cloud</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
