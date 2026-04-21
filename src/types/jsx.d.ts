import * as React from 'react';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'model-viewer': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement> & {
        src?: string;
        poster?: string;
        alt?: string;
        'shadow-intensity'?: string;
        'camera-controls'?: string | boolean;
        'auto-rotate'?: string | boolean;
        ar?: string | boolean;
        'ar-modes'?: string;
        'interaction-prompt'?: string;
        'touch-action'?: string;
        loading?: string;
        reveal?: string;
        'exposure'?: string;
        'environment-image'?: string;
      }, HTMLElement>;
    }
  }
}
