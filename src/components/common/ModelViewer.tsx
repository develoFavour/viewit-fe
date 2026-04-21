'use client';

import React, { useRef } from 'react';

interface ModelViewerProps {
  src: string;
  poster?: string;
  alt?: string;
}


export default function ModelViewer({
  src,
  poster,
  alt = "3D Model"
}: ModelViewerProps) {
  const viewerRef = useRef<any>(null);

  // We rely on the global script in layout.tsx for the custom element registration

  return (
    <div className="w-full h-full min-h-[400px] relative">
      {React.createElement('model-viewer', {
        ref: viewerRef,
        src: src,
        poster: poster,
        alt: alt,
        'shadow-intensity': "1",
        'camera-controls': true,
        'auto-rotate': true,
        ar: true,
        'ar-modes': "webxr scene-viewer quick-look",
        'interaction-prompt': "auto",
        'touch-action': "pan-y",
        'environment-image': "neutral",
        exposure: "1.5",
        'shadow-softness': "1",
        loading: "eager",
        reveal: "auto",
        'interpolation-decay': "200",
        bounds: "tight",
        style: { width: '100%', height: '100%', backgroundColor: 'transparent' }
      },
        <div slot="poster" className="absolute inset-0 flex items-center justify-center bg-[#0a0a0b]">
          <div className="w-10 h-10 border-4 border-blue-600/20 border-t-blue-600 rounded-full animate-spin" />
        </div>
      )}
    </div>
  );
}
