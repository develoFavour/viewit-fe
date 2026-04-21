'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { get, post, del } from '@/lib/method';
import { ENDPOINTS } from '@/constants/endpoint.const';
import { ROUTES } from '@/constants/routes.const';
import InteractionBuilder from '@/components/merchant/InteractionBuilder';
import { 
  ArrowLeft, 
  Sparkles, 
  Save, 
  Plus, 
  Loader2, 
  X,
  Type,
  Maximize2
} from 'lucide-react';
import { toast } from 'react-hot-toast';

interface Hotspot {
  id: string;
  x: number;
  y: number;
  z: number;
  title: string;
  content: string;
}

export default function ProductStoryBuilder() {
  const params = useParams();
  const productId = params.id as string;
  const router = useRouter();

  const [product, setProduct] = useState<any>(null);
  const [hotspots, setHotspots] = useState<Hotspot[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const [newHotspotPos, setNewHotspotPos] = useState<[number, number, number] | null>(null);
  const [hotspotForm, setHotspotForm] = useState({ title: '', content: '' });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [prodRes, hotRes] = await Promise.all([
          get<any>(ENDPOINTS.PRODUCTS.BY_ID(productId)),
          get<Hotspot[]>(`/hotspots/${productId}`)
        ]);
        setProduct(prodRes.data.data);
        setHotspots(hotRes.data.data);
      } catch (e) {
        toast.error('Failed to load product data');
      } finally {
        setIsLoading(false);
      }
    };
    if (productId) fetchData();
  }, [productId]);

  const handleAddHotspotClick = (pos: [number, number, number]) => {
    setNewHotspotPos(pos);
    setHotspotForm({ title: '', content: '' });
  };

  const handleAiEnhance = async () => {
    if (!hotspotForm.title) {
      toast.error('Enter a feature name first');
      return;
    }
    setIsGenerating(true);
    try {
      // Call the dedicated AI endpoint  
      const context = `Product: "${product?.name || 'Unknown'}". Hotspot feature: "${hotspotForm.title}".`;
      const aiRes = await post<any>(ENDPOINTS.AI.HOTSPOT_GENERATE, {
        label: hotspotForm.title,
        context,
      });
      const aiContent = aiRes.data.data.content;

      // Auto-fill the content field with the AI response
      setHotspotForm(prev => ({ ...prev, content: aiContent }));
      toast.success('AI content ready! Review and save.');
    } catch (e) {
      toast.error('AI generation failed');
    } finally {
      setIsGenerating(false);
    }
  };

  const saveHotspotManually = async () => {
    if (!hotspotForm.title || !hotspotForm.content) {
      toast.error('Fill all fields');
      return;
    }
    setIsSaving(true);
    try {
      const response = await post<Hotspot>(`/hotspots/${productId}`, {
        x: newHotspotPos![0],
        y: newHotspotPos![1],
        z: newHotspotPos![2],
        ...hotspotForm
      });
      setHotspots([...hotspots, response.data.data]);
      setNewHotspotPos(null);
      toast.success('Hotspot saved');
    } catch (e) {
      toast.error('Failed to save hotspot');
    } finally {
      setIsSaving(false);
    }
  };

  const deleteHotspot = async (id: string) => {
    try {
      await del(`/hotspots/${id}`);
      setHotspots(hotspots.filter(h => h.id !== id));
      toast.success('Hotspot removed');
    } catch (e) {
      toast.error('Failed to delete hotspot');
    }
  };

  if (isLoading) return (
    <div className="h-[80vh] flex items-center justify-center">
      <Loader2 className="h-10 w-10 text-blue-500 animate-spin" />
    </div>
  );

  return (
    <div className="space-y-6 h-full flex flex-col">
      <header className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button 
            onClick={() => router.back()}
            className="p-2.5 bg-[#1a1d23] border border-gray-800 rounded-xl text-gray-400 hover:text-white transition-all"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-white tracking-tight">Story Builder</h1>
            <p className="text-gray-400">Design interactive hotspots for <span className="text-white font-medium">{product?.name}</span></p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <div className="px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-xl flex items-center">
            <Maximize2 className="h-4 w-4 text-blue-500 mr-2" />
            <span className="text-xs font-bold text-blue-500 uppercase tracking-widest">{hotspots.length} Hotspots</span>
          </div>
        </div>
      </header>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-4 gap-8 min-h-0">
        {/* Main 3D Canvas */}
        <div className="lg:col-span-3 min-h-[500px] h-full">
          {product?.modelUrl ? (
            <InteractionBuilder 
              productId={productId}
              modelUrl={product.modelUrl} 
              hotspots={hotspots}
              isEditMode={true}
              onAddHotspot={handleAddHotspotClick}
              onDeleteHotspot={deleteHotspot}
            />
          ) : (
            <div className="w-full h-full bg-[#1a1d23] rounded-3xl border-2 border-dashed border-gray-800 flex flex-col items-center justify-center text-gray-500">
              <Plus className="h-12 w-12 mb-4 opacity-20" />
              <p>No 3D model uploaded for this product.</p>
            </div>
          )}
        </div>

        {/* Sidebar Controls */}
        <div className="space-y-6 overflow-y-auto pr-2">
          {newHotspotPos ? (
            <div className="bg-[#1a1d23] border border-blue-500/30 p-6 rounded-3xl space-y-6 animate-in slide-in-from-right-4 duration-300">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-white flex items-center">
                  <Plus className="h-4 w-4 mr-2 text-blue-500" />
                  New Hotspot
                </h3>
                <button onClick={() => setNewHotspotPos(null)} className="text-gray-500 hover:text-white">
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2">Feature Name</label>
                  <input 
                    type="text"
                    placeholder="e.g. Ergonomic Grip"
                    className="w-full bg-[#0f1115] border border-gray-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all"
                    value={hotspotForm.title}
                    onChange={(e) => setHotspotForm({ ...hotspotForm, title: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2">Manual Description</label>
                  <textarea 
                    rows={3}
                    placeholder="Describe this part..."
                    className="w-full bg-[#0f1115] border border-gray-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all resize-none"
                    value={hotspotForm.content}
                    onChange={(e) => setHotspotForm({ ...hotspotForm, content: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-1 gap-3">
                  <button
                    onClick={handleAiEnhance}
                    disabled={isGenerating || !hotspotForm.title}
                    className="w-full flex items-center justify-center space-x-2 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 disabled:opacity-50 text-white rounded-xl text-xs font-black uppercase tracking-widest transition-all shadow-xl shadow-blue-900/20"
                  >
                    {isGenerating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                    <span>Enhance with AI</span>
                  </button>
                  
                  <button
                    onClick={saveHotspotManually}
                    disabled={isSaving || !hotspotForm.content}
                    className="w-full py-3 bg-gray-800 hover:bg-gray-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition-all"
                  >
                    {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Save Manually'}
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-[#1a1d23] border border-gray-800 p-6 rounded-3xl">
              <h3 className="font-bold text-white mb-4 flex items-center">
                <Type className="h-4 w-4 mr-2 text-gray-500" />
                Active Stories
              </h3>
              
              <div className="space-y-3">
                {hotspots.length > 0 ? hotspots.map((h) => (
                  <div key={h.id} className="p-3 bg-[#0f1115] border border-gray-800 rounded-xl group transition-all hover:border-gray-700">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-sm font-bold text-gray-200">{h.title}</p>
                      <button onClick={() => deleteHotspot(h.id)} className="opacity-0 group-hover:opacity-100 p-1 text-gray-600 hover:text-red-500 transition-all">
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                    <p className="text-[10px] text-gray-500 line-clamp-2 leading-relaxed">{h.content}</p>
                  </div>
                )) : (
                  <div className="py-12 text-center flex flex-col items-center border border-dashed border-gray-800 rounded-2xl">
                    <div className="p-3 bg-gray-800/30 rounded-full mb-3 text-gray-600">
                      <Sparkles className="h-6 w-6" />
                    </div>
                    <p className="text-[10px] text-gray-500 uppercase tracking-widest font-black">No hotspots yet</p>
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="bg-[#1a1d23] border border-gray-800 p-6 rounded-3xl">
            <h3 className="font-bold text-white mb-2 text-sm flex items-center">
              <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2"></span>
              Pro Tip
            </h3>
            <p className="text-xs text-gray-500 leading-relaxed">
              Use the **AI Enhancer** to turn simple feature names like "Leather Strap" into high-converting marketing copy automatically.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
