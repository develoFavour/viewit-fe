export const ENDPOINTS = {
  AUTH: {
    REGISTER: '/auth/register',
    LOGIN: '/auth/login',
    VERIFY: '/auth/verify',
    ME: '/auth/me',
  },
  PRODUCTS: {
    BASE: '/products',
    BY_ID: (id: string) => `/products/${id}`,
    PUBLISH: (id: string) => `/products/${id}/publish`,
  },
  UPLOAD: {
    IMAGE: '/upload/image',
    MODEL: '/upload/model',
  },
  STORE: {
    MARKETPLACE: '/store/marketplace/all',
    GET_STORE: (slug: string) => `/store/${slug}`,
    GET_PRODUCT: (slug: string, productId: string) => `/store/${slug}/products/${productId}`,
    TRACK_VIEW: '/store/track/view',
    TRACK_AR_VIEW: '/store/track/ar-view',
  },
  ANALYTICS: {
    OVERVIEW: '/analytics/overview',
    PRODUCTS: '/analytics/products',
    TRACK_EVENT: '/analytics/track',
  },
  AI: {
    HOTSPOT_GENERATE: '/ai/hotspot-generate',
    DESCRIBE_IMAGE: '/ai/describe-image',
  },
} as const;
