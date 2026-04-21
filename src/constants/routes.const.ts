export const ROUTES = {
  HOME: '/',
  AUTH: {
    LOGIN: '/login',
    REGISTER: '/register',
    REGISTER_SUCCESS: '/register/success',
    VERIFY: '/verify',
  },
  MERCHANT: {
    DASHBOARD: '/dashboard',
    PRODUCTS: '/products',
    NEW_PRODUCT: '/products/new',
    EDIT_PRODUCT: (id: string) => `/products/${id}/edit`,
    ANALYTICS: '/analytics',
    SETTINGS: '/settings',
  },
  STORE: {
    BASE: (slug: string) => `/store/${slug}`,
    PRODUCT: (slug: string, id: string) => `/store/${slug}/${id}`,
  },
} as const;
