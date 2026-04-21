'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { get, patch, del } from '@/lib/method';
import { ENDPOINTS } from '@/constants/endpoint.const';
import { ROUTES } from '@/constants/routes.const';
import { 
  Package, 
  Plus, 
  Search, 
  Eye, 
  Box, 
  Trash2, 
  Edit,
  Globe,
  Sparkles
} from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { toast } from 'react-hot-toast';
import { useAuth } from '@/context/AuthContext';

interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  isPublished: boolean;
  viewCount: number;
  arViewCount: number;
  createdAt: string;
  images: string[];
}

export default function ProductsPage() {
  const { merchant } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchProducts = async () => {
    try {
      const response = await get<Product[]>(ENDPOINTS.PRODUCTS.BASE);
      setProducts(response.data.data);
    } catch (error) {
      toast.error('Failed to load products');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const togglePublish = async (id: string) => {
    try {
      const response = await patch<Product>(ENDPOINTS.PRODUCTS.PUBLISH(id));
      setProducts(products.map(p => p.id === id ? response.data.data : p));
      toast.success(response.data.data.isPublished ? 'Product published' : 'Product unpublished');
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const deleteProduct = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    
    try {
      await del(ENDPOINTS.PRODUCTS.BY_ID(id));
      setProducts(products.filter(p => p.id !== id));
      toast.success('Product deleted');
    } catch (error) {
      toast.error('Failed to delete product');
    }
  };

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Products</h1>
          <p className="text-gray-400">Manage your AR-enabled catalog</p>
        </div>
        <Link 
          href={ROUTES.MERCHANT.NEW_PRODUCT}
          className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition-all shadow-lg shadow-blue-900/20"
        >
          <Plus className="h-5 w-5 mr-2" />
          Add Product
        </Link>
      </header>

      {/* Search and Filters */}
      <div className="flex items-center space-x-4 bg-[#1a1d23] border border-gray-800 p-2 rounded-2xl">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-500" />
          </div>
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="block w-full pl-10 pr-3 py-2 bg-transparent border-none text-white focus:ring-0 placeholder-gray-600"
          />
        </div>
      </div>

      {/* Products List */}
      <div className="bg-[#1a1d23] border border-gray-800 rounded-2xl overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center text-gray-500">
            <div className="animate-spin h-8 w-8 border-2 border-blue-500 border-t-transparent rounded-full mx-auto mb-4" />
            Loading products...
          </div>
        ) : filteredProducts.length > 0 ? (
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-800">
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Product</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Stats</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Category</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {filteredProducts.map((product) => (
                <tr key={product.id} className="hover:bg-white/5 transition-colors group">
                  <td className="px-6 py-5">
                    <div className="flex items-center space-x-4">
                      {product.images[0] ? (
                        <img 
                          src={product.images[0]} 
                          alt={product.name} 
                          className="w-12 h-12 rounded-lg object-cover border border-gray-800"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-lg bg-gray-800 flex items-center justify-center">
                          <Package className="h-6 w-6 text-gray-600" />
                        </div>
                      )}
                      <div>
                        <p className="font-bold text-white">{product.name}</p>
                        <p className="text-sm text-gray-500">{formatCurrency(product.price)}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex flex-col space-y-1">
                      <div className="flex items-center text-xs text-blue-400">
                        <Eye className="h-3 w-3 mr-1" />
                        {product.viewCount} views
                      </div>
                      <div className="flex items-center text-xs text-purple-400">
                        <Box className="h-3 w-3 mr-1" />
                        {product.arViewCount} AR launches
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-800 text-gray-300 capitalize border border-gray-700">
                      {product.category}
                    </span>
                  </td>
                  <td className="px-6 py-5">
                    <button
                      onClick={() => togglePublish(product.id)}
                      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold transition-all ${
                        product.isPublished 
                          ? "bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 border border-emerald-500/20" 
                          : "bg-red-500/10 text-red-500 hover:bg-red-500/20 border border-red-500/20"
                      }`}
                    >
                      {product.isPublished ? "Live" : "Draft"}
                    </button>
                  </td>
                  <td className="px-6 py-5 text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <Link
                        href={`/products/${product.id}/story`}
                        className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-500/10 rounded-lg transition-all"
                        title="3D Story Builder"
                      >
                        <Sparkles className="h-5 w-5" />
                      </Link>
                      <Link
                        href={ROUTES.MERCHANT.EDIT_PRODUCT(product.id)}
                        className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-all"
                        title="Edit"
                      >
                        <Edit className="h-5 w-5" />
                      </Link>
                      <Link
                        href={ROUTES.STORE.PRODUCT(merchant?.slug || '', product.id)}
                        target="_blank"
                        className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-500/10 rounded-lg transition-all"
                        title="Preview"
                      >
                        <Globe className="h-5 w-5" />
                      </Link>
                      <button
                        onClick={() => deleteProduct(product.id)}
                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all"
                        title="Delete"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="p-20 text-center flex flex-col items-center">
            <div className="bg-[#0f1115] p-6 rounded-full mb-4">
              <Package className="h-12 w-12 text-gray-600" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">No products found</h3>
            <p className="text-gray-500 max-w-xs mx-auto mb-8">
              Start by adding your first product to showcase in immersive AR.
            </p>
            <Link 
              href={ROUTES.MERCHANT.NEW_PRODUCT}
              className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition-all"
            >
              <Plus className="h-5 w-5 mr-2" />
              Add Product
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
