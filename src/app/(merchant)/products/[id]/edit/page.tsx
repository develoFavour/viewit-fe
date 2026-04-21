'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { get, post, put } from '@/lib/method';
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
  Tag,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const productId = params.id as string;
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
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

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await get<any>(ENDPOINTS.PRODUCTS.BY_ID(productId));
        const product = response.data.data;
        setFormData({
          name: product.name,
          description: product.description,
          price: product.price.toString(),
          category: product.category,
          images: product.images,
          modelUrl: product.modelUrl || '',
          isPublished: product.isPublished,
        });
      } catch (error) {
        toast.error('Failed to load product');
        router.push(ROUTES.MERCHANT.PRODUCTS);
      } finally {
        setIsLoading(false);
      }
    };

    if (productId) fetchProduct();
  }, [productId, router]);

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
      toast.success('Image uploaded');
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

    setIsSaving(true);
    try {
      await put(ENDPOINTS.PRODUCTS.BY_ID(productId), {
        ...formData,
        price: parseFloat(formData.price)
      });
      toast.success('Product updated successfully');
      router.push(ROUTES.MERCHANT.PRODUCTS);
    } catch (error) {
      toast.error('Failed to update product');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-10 w-10 text-blue-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      <header className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button 
            onClick={() => router.back()}
            className="p-2.5 bg-[#1a1d23] border border-gray-800 rounded-xl text-gray-400 hover:text-white transition-all"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-white tracking-tight">Edit Product</h1>
            <p className="text-gray-400">Update your AR product entry</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-6 py-2.5 text-sm font-bold text-gray-400 hover:text-white transition-colors"
          >
            Cancel
          </button>
          <button
            form="product-form"
            type="submit"
            disabled={isSaving || isUploading}
            className="inline-flex items-center justify-center px-8 py-2.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold rounded-xl transition-all shadow-lg shadow-blue-900/20"
          >
            {isSaving ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Update Product'}
          </button>
        </div>
      </header>

      <form id="product-form" onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {/* General Information */}
          <div className="bg-[#1a1d23] border border-gray-800 rounded-2xl p-8 space-y-6">
            <h2 className="text-lg font-bold text-white flex items-center">
              <span className="w-8 h-8 bg-blue-500/10 rounded-lg flex items-center justify-center mr-3">
                <Tag className="h-4 w-4 text-blue-500" />
              </span>
              General Info
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Product Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="block w-full px-4 py-3 bg-[#0f1115] border border-gray-800 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all text-lg font-medium"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Description</label>
                <textarea
                  required
                  rows={4}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="block w-full px-4 py-3 bg-[#0f1115] border border-gray-800 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all resize-none"
                />
              </div>
            </div>
          </div>

          {/* Media Upload */}
          <div className="bg-[#1a1d23] border border-gray-800 rounded-2xl p-8 space-y-6">
            <h2 className="text-lg font-bold text-white flex items-center">
              <span className="w-8 h-8 bg-orange-500/10 rounded-lg flex items-center justify-center mr-3">
                <ImageIcon className="h-4 w-4 text-orange-500" />
              </span>
              Product Media
            </h2>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {formData.images.map((url, i) => (
                <div key={i} className="relative aspect-square rounded-xl overflow-hidden border border-gray-800 group">
                  <img src={url} alt="Uploaded" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => removeImage(i)}
                    className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
              
              <label className="aspect-square rounded-xl border-2 border-dashed border-gray-800 hover:border-gray-700 hover:bg-white/5 flex flex-col items-center justify-center cursor-pointer transition-all group">
                <Upload className="h-6 w-6 text-gray-600 group-hover:text-gray-400 mb-2" />
                <span className="text-xs text-gray-500">Upload Image</span>
                <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} disabled={isUploading} />
              </label>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* AR Model */}
          <div className="bg-[#1a1d23] border border-gray-800 rounded-2xl p-8 space-y-6">
            <h2 className="text-lg font-bold text-white flex items-center">
              <span className="w-8 h-8 bg-purple-500/10 rounded-lg flex items-center justify-center mr-3">
                <Box className="h-4 w-4 text-purple-500" />
              </span>
              AR Model (GLB)
            </h2>

            {formData.modelUrl ? (
              <div className="p-4 bg-[#0f1115] rounded-xl border border-blue-500/20 flex items-center justify-between">
                <div className="flex items-center space-x-3 overflow-hidden">
                  <Box className="h-5 w-5 text-blue-500 flex-shrink-0" />
                  <span className="text-sm text-gray-300 truncate">3D Model Ready</span>
                </div>
                <button 
                  type="button" 
                  onClick={() => setFormData(prev => ({ ...prev, modelUrl: '' }))}
                  className="p-1 text-gray-500 hover:text-red-500"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <label className="block w-full py-6 bg-[#0f1115] border-2 border-dashed border-gray-800 rounded-2xl cursor-pointer hover:border-blue-500/50 hover:bg-blue-500/5 transition-all text-center">
                <div className="inline-flex p-3 bg-blue-600/10 rounded-xl mb-3">
                  <Upload className="h-6 w-6 text-blue-500" />
                </div>
                <p className="text-sm font-bold text-white">Upload .glb file</p>
                <input type="file" accept=".glb" className="hidden" onChange={handleModelUpload} disabled={isUploading} />
              </label>
            )}
          </div>

          {/* Pricing & Category */}
          <div className="bg-[#1a1d23] border border-gray-800 rounded-2xl p-8 space-y-6">
            <h2 className="text-lg font-bold text-white flex items-center">
              <span className="w-8 h-8 bg-emerald-500/10 rounded-lg flex items-center justify-center mr-3">
                <DollarSign className="h-4 w-4 text-emerald-500" />
              </span>
              Status & Pricing
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Price (GBP)</label>
                <input
                  type="number"
                  required
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  className="block w-full px-4 py-3 bg-[#0f1115] border border-gray-800 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all font-bold"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Category</label>
                <select
                  required
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="block w-full px-4 py-3 bg-[#0f1115] border border-gray-800 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all appearance-none"
                >
                  <option value="Furniture">Furniture</option>
                  <option value="Electronics">Electronics</option>
                  <option value="Decor">Decor</option>
                  <option value="Fashion">Fashion</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="flex items-center justify-between p-4 bg-[#0f1115] rounded-xl border border-gray-800">
                <div>
                  <p className="text-sm font-bold text-white">Publish Product</p>
                  <p className="text-xs text-gray-500">Make it visible to everyone</p>
                </div>
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, isPublished: !prev.isPublished }))}
                  className={cn(
                    "relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none",
                    formData.isPublished ? "bg-blue-600" : "bg-gray-700"
                  )}
                >
                  <span
                    className={cn(
                      "inline-block h-4 w-4 transform rounded-full bg-white transition-transform",
                      formData.isPublished ? "translate-x-6" : "translate-x-1"
                    )}
                  />
                </button>
              </div>
            </div>
          </div>
        </div>
      </form>

      {isUploading && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-[#1a1d23] border border-gray-800 p-8 rounded-2xl flex flex-col items-center">
            <Loader2 className="h-10 w-10 text-blue-500 animate-spin mb-4" />
            <p className="text-white font-bold">Uploading content...</p>
          </div>
        </div>
      )}
    </div>
  );
}
