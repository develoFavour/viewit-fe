'use client';

import React, { Suspense, useRef, useState, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { 
  useGLTF, 
  OrbitControls, 
  PerspectiveCamera, 
  Html, 
  Environment, 
  ContactShadows,
  Float
} from '@react-three/drei';
import { Box, Loader2, X, Plus, Sparkles, Trash2, MousePointer2, Wand2, Clock } from 'lucide-react';
import * as THREE from 'three';
import { post } from '@/lib/method';
import { ENDPOINTS } from '@/constants/endpoint.const';
import toast from 'react-hot-toast';
import { cn } from '@/lib/utils';

interface Hotspot {
  id?: string;
  x: number;
  y: number;
  z: number;
  title: string;
  content: string;
}

interface InteractionBuilderProps {
  productId: string;
  merchantId?: string;
  modelUrl: string;
  hotspots: Hotspot[];
  onAddHotspot?: (pos: [number, number, number]) => void;
  onDeleteHotspot?: (id: string) => void;
  isEditMode?: boolean;
}

function Model({ url }: { url: string }) {
  const { scene } = useGLTF(url);
  return <primitive object={scene} castShadow receiveShadow />;
}

// Dwell-Time Tracker: measures total time user spends interacting with the model
function DwellTimeTracker({ productId, merchantId }: { productId: string; merchantId?: string }) {
  const startTime = useRef(Date.now());
  const lastX = useRef(0);
  const totalRotation = useRef(0);
  const hasSentDwell = useRef(false);
  const { camera } = useThree();

  useFrame(() => {
    const currentX = camera.position.x;
    const diff = Math.abs(currentX - lastX.current);
    if (diff > 0.01) {
      totalRotation.current += diff;
      lastX.current = currentX;
    }
  });

  useEffect(() => {
    const interval = setInterval(() => {
      if (!merchantId) return;

      const dwellSeconds = Math.round((Date.now() - startTime.current) / 1000);

      // Track rotation engagement every 10s if the user is actively rotating
      if (totalRotation.current > 5) {
        post(ENDPOINTS.ANALYTICS.TRACK_EVENT, {
          type: 'MODEL_ROTATE',
          productId,
          merchantId,
          metadata: { totalRotation: totalRotation.current }
        }).catch(() => {});
        totalRotation.current = 0;
      }

      // Send dwell-time once after 30 seconds of presence
      if (dwellSeconds >= 30 && !hasSentDwell.current) {
        hasSentDwell.current = true;
        post(ENDPOINTS.ANALYTICS.TRACK_EVENT, {
          type: 'DWELL_30S',
          productId,
          merchantId,
          metadata: { dwellSeconds }
        }).catch(() => {});
      }
    }, 10000);

    return () => clearInterval(interval);
  }, [productId, merchantId]);

  return null;
}

export default function InteractionBuilder({ 
  productId,
  merchantId,
  modelUrl, 
  hotspots, 
  onAddHotspot, 
  onDeleteHotspot,
  isEditMode = false 
}: InteractionBuilderProps) {
  const [selectedHotspot, setSelectedHotspot] = useState<Hotspot | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState('');
  const [dwellSeconds, setDwellSeconds] = useState(0);

  // Live dwell-time counter (shown in shopper view)
  useEffect(() => {
    if (isEditMode) return;
    const timer = setInterval(() => setDwellSeconds(s => s + 1), 1000);
    return () => clearInterval(timer);
  }, [isEditMode]);

  const handlePointerDown = (e: any) => {
    if (!isEditMode || !onAddHotspot) return;
    if (e.intersections.length > 0) {
      const point = e.intersections[0].point;
      onAddHotspot([point.x, point.y, point.z]);
    }
  };

  const handleHotspotClick = (h: Hotspot) => {
    setSelectedHotspot(h);
    setGeneratedContent('');
    if (!isEditMode && merchantId) {
      post(ENDPOINTS.ANALYTICS.TRACK_EVENT, {
        type: 'HOTSPOT_CLICK',
        productId,
        merchantId,
        metadata: { hotspotId: h.id, title: h.title }
      }).catch(() => {});
    }
  };

  const handleAiGenerate = async () => {
    if (!selectedHotspot) return;
    setIsGenerating(true);
    try {
      // Build a context string from what we know about the hotspot
      const context = `Product hotspot titled "${selectedHotspot.title}". This is a 3D interactive spatial product showcase.`;
      const response = await post<any>(ENDPOINTS.AI.HOTSPOT_GENERATE, {
        label: selectedHotspot.title,
        context
      });
      setGeneratedContent(response.data.data.content);
      toast.success('AI marketing copy generated!');
    } catch (error) {
      toast.error('AI generation failed. Try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="w-full h-full relative bg-[#050608] rounded-3xl overflow-hidden border border-gray-800">
      <Canvas shadows dpr={[1, 2]}>
        <PerspectiveCamera makeDefault position={[0, 0, 5]} fov={50} />
        <ambientLight intensity={0.5} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} shadow-mapSize={2048} castShadow />
        
        <Suspense fallback={<Html center><Loader2 className="h-10 w-10 text-blue-500 animate-spin" /></Html>}>
          <Float speed={1.5} rotationIntensity={0.5} floatIntensity={0.5}>
            <group onPointerDown={handlePointerDown}>
              <Model url={modelUrl} />
            </group>
          </Float>

          {hotspots.map((h, i) => (
            <Html key={h.id || i} position={[h.x, h.y, h.z]}>
              <div className="relative group">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleHotspotClick(h);
                  }}
                  className="hotspot-trigger w-7 h-7 bg-blue-600 rounded-full border-2 border-white shadow-lg flex items-center justify-center hover:scale-125 transition-transform animate-pulse"
                >
                  <Plus className="h-3 w-3 text-white" />
                </button>
                {/* Tooltip label on hover */}
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                  <div className="px-3 py-1 bg-black/80 backdrop-blur-md border border-white/10 rounded-full text-[10px] font-bold text-white whitespace-nowrap">
                    {h.title}
                  </div>
                </div>
              </div>
            </Html>
          ))}
          
          {!isEditMode && <DwellTimeTracker productId={productId} merchantId={merchantId} />}
          
          <ContactShadows position={[0, -1.5, 0]} opacity={0.4} scale={20} blur={2.5} far={4.5} />
          <Environment preset="city" />
        </Suspense>

        <OrbitControls 
          enablePan={false} 
          minDistance={1.5} 
          maxDistance={10} 
          makeDefault 
        />
      </Canvas>

      {/* Hotspot Detail Panel */}
      {selectedHotspot && (
        <div className="absolute inset-0 z-40 flex items-center justify-center bg-black/50 backdrop-blur-sm p-6">
          <div className="bg-[#0f0f11] border border-white/10 w-full max-w-sm rounded-[32px] p-8 shadow-2xl relative animate-in zoom-in-95 duration-300">
            <button 
              onClick={() => { setSelectedHotspot(null); setGeneratedContent(''); }}
              className="absolute top-4 right-4 p-2 text-gray-500 hover:text-white transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
            
            <div className="flex items-center space-x-3 mb-5">
              <div className="w-10 h-10 bg-blue-500/10 rounded-xl flex items-center justify-center">
                <Sparkles className="h-5 w-5 text-blue-500" />
              </div>
              <h4 className="text-xl font-bold text-white tracking-tight">{selectedHotspot.title}</h4>
            </div>

            {/* Original content */}
            <p className="text-gray-400 leading-relaxed text-sm mb-5">
              {selectedHotspot.content}
            </p>

            {/* AI Generated Content */}
            {generatedContent && (
              <div className="mb-5 p-4 bg-blue-600/10 border border-blue-600/20 rounded-2xl animate-in slide-in-from-bottom-2 duration-300">
                <p className="text-[9px] font-black text-blue-500 uppercase tracking-widest mb-2 flex items-center">
                  <Wand2 className="h-3 w-3 mr-1.5" /> AI Marketing Copy
                </p>
                <p className="text-gray-300 text-sm leading-relaxed italic">{generatedContent}</p>
              </div>
            )}

            {/* AI Generate Button (only for merchants) */}
            {isEditMode && (
              <button
                onClick={handleAiGenerate}
                disabled={isGenerating}
                className={cn(
                  "w-full flex items-center justify-center space-x-2 py-3 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all",
                  isGenerating
                    ? "bg-blue-600/20 text-blue-400 cursor-not-allowed"
                    : "bg-blue-600/10 border border-blue-600/20 text-blue-500 hover:bg-blue-600/20"
                )}
              >
                {isGenerating ? (
                  <><Loader2 className="h-4 w-4 animate-spin" /><span>Generating Copy...</span></>
                ) : (
                  <><Wand2 className="h-4 w-4" /><span>Generate AI Marketing Copy</span></>
                )}
              </button>
            )}

            {isEditMode && selectedHotspot.id && (
              <button
                onClick={() => {
                  onDeleteHotspot?.(selectedHotspot.id!);
                  setSelectedHotspot(null);
                }}
                className="mt-3 w-full flex items-center justify-center space-x-2 py-3 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-2xl text-xs font-bold transition-all"
              >
                <Trash2 className="h-4 w-4" />
                <span>Delete Hotspot</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* Edit Mode Indicator */}
      {isEditMode && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 px-6 py-3 bg-blue-600/10 backdrop-blur-xl border border-blue-500/20 rounded-full flex items-center space-x-3">
          <MousePointer2 className="h-4 w-4 text-blue-500" />
          <span className="text-xs font-bold text-blue-500 uppercase tracking-widest">
            Click model to add interactive hotspot
          </span>
        </div>
      )}

      {/* Shopper Dwell-Time HUD */}
      {!isEditMode && dwellSeconds > 3 && (
        <div className="absolute top-4 right-4 flex items-center space-x-2 px-4 py-2 bg-black/50 backdrop-blur-xl border border-white/[0.05] rounded-full">
          <Clock className="h-3 w-3 text-blue-500" />
          <span className="text-[10px] font-black text-gray-400 tabular-nums">
            {Math.floor(dwellSeconds / 60)}:{String(dwellSeconds % 60).padStart(2, '0')} in 3D
          </span>
        </div>
      )}
    </div>
  );
}
