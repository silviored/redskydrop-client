export const ROUTES = {
  SIGN_IN: '/',
  DASHBOARD: '/dashboard',
  PRIVACY_POLICY: '/',
  PRODUCTS_CATALOG: {
    LIST: `/dashboard/products`,
    PAYMENT: `/dashboard/products`,
    MY_PRODUCTS: `/dashboard/my-products`,
    VIEW: (id: string | number) => `/dashboard/products/${id}`,
  },
  CART: {
    ROOT: `/dashboard/cart`,
    PAYMENT: (id: string | number ) => `/dashboard/cart/payment/${id}`,
  },
  INTEGRATIONS: {
    ROOT: `/dashboard/integrations`,
    PAYMENT: (id: string | number ) => `/dashboard/cart/payment/${id}`,
  },
  SALE: {
    ROOT: `/dashboard/sales`,
    PAYMENT: (id: string | number ) => `/dashboard/cart/payment/${id}`,
  },
  MY_PROFILE: {
    ROOT: (params: string) => `/dashboard/my-profile?${params}`,
  },
  QUERY_CEP: {
    ROOT: `/dashboard/query-cep`,
  },
  SUBSCRIPTION: {
    ROOT: `/dashboard/subscription`,
  },
  TUTORIALS: {
    LIST: `/dashboard/tutorials`,
    CREATE: `/dashboard/tutorials/create`,
    EDIT: (id: string | number) =>  `/dashboard/tutorials/update/${id}`,
    VIEW: (id: string | number) => `/dashboard/tutorials/view/${id}`,
  },
  ABOUT_US: {
    ROOT: `/dashboard/about-us`
  },
  TERMS_CONDITIONS: {
    ROOT: `/dashboard/terms-conditions`
  },
};

export const RAW_ROUTES = {
  ACTIVITY: '/a/[pid]',
};
