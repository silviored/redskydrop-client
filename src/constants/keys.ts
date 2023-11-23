export const USER_SESSION_STORAGE_KEY = '@SkyDrop-client/user';
export const USER_COOKIES_STORAGE_KEY = '@SkyDrop-client/user';
export const USER_PRODUCTS_STORAGE_KEY = '@SkyDrop-client/products';
export const USER_REMEMBER_ME_STORAGE_KEY = '@SkyDrop-client/remember-me';
export const PUBLIC_TOKEN_SESSION_STORAGE_KEY = 'public-token';
export const JWT_EXPIRATION_DATE = '@user/token_validity';
export const ACCEPTED_THE_USE_COOKIES = '@user/acceptedTheUseCookies';
export const USER_DISMISS_NOTICE = '@user/dismissNotice';
export const USER_TYPE = '@user/type';
export const USER_UPDATED_TOAST_ID = '@user/toastErrorUpdated';
export const PAYMENT_EXPIRED_MINUTES = 9

export const TOAST_CONTAINER_IDS = {
  NOTICE: 'notice',
};

export const TOAST_IDS = {
  IS_MINOR: 'IS_MINOR',
  NO_ACCEPTED_ENROLLMENT: 'NO_ACCEPTED_ENROLLMENT',
  HAS_RESERVATION: 'HAS_RESERVATION',
};

export const CLOSE_MODAL_EVENT = {
  CLOSE_ICON: 'close-icon',
};

export const STORAGE_KEYS = {
  LAST_USER: '@lastLogin',
};

export const QUERY_KEYS = {
  TOKEN: {
    GET: ['token'],
  },
  REPORT: {
    DASHBOARD: ['report-dashboard'],
  },
  LOGIN: {
    REFRESH_DATA: ['login-refresh-data'],
  },
  PLANS: {
    LIST: ['plans'],
    GET: (id: string) => ['plans', id],
  },
  USERS: {
    LIST: ['plans'],
    GET: (id: string | number) => ['user', id],
  },
  API_USER: {
    LIST: ['plans'],
    GET_BY_USER: (id: string | number) => ['api-user', id],
  },
  SUBSCRIPTIONS: {
    LIST: ['plans'],
    GET: (id: string) => ['plans', id],
    MY_SUBSCRIPTION: ['subscription-my-subscription'],
  },
  CATEGORIES: {
    LIST: ['categories'],
    LIST_BY_PARENT: (id: string) => ['categories-list-by-parent', id],
    GET: (id: string) => ['categories-get', id],
    UPDATE: (id: string) => ['categories-update', id],
  },
  PRODUCTS: {
    LIST: ['products'],
    LIST_ALL: ['products-list-all'],
    GET: (id: string) => ['products', id],
  },
  PRODUCTS_VARIANTS: {
    LIST: ['variants'],
    GET: (id: string) => ['variants', id],
  },
  TUTORIALS: {
    LIST: ['tutorials'],
    GET: (id: string) => ['tutorials-get', id],
    UPDATE: (id: string) => ['tutorials-update', id],
  },
};
