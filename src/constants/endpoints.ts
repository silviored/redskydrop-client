const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_MOCKING === 'enabled'
    ? 'http://localhost:3000'
    : process.env.NEXT_PUBLIC_API_BASE_URL;

export const ENDPOINTS = {
  TOKEN: `/sessions/token`,

  VIDEOS: '/commercial/public/videos',

  PAGE_CONTENT: (link: string) => `/commercial/public/pages/view/link/${link}`,

  PLANS: {
    GET_ALL: `/planos`,
    GET: (id: string) => `/planos/${id}`,
  },
  
  CATEGORIES: {
    CREATE: `/categorias`,
    GET_ALL: `/categorias`,
    GET: (id: string) => `/categorias/${id}`,
    UPDATE: (id: string) => `/categorias/${id}`,
  },

  BLING: {
    GET_ALL: `https://www.bling.com.br/Api/v3/oauth/token`,
    GET: (id: string) => `/planos/${id}`,
  },

  PRODUCT_BLING: {
    CREATE: `/produtosBling`,
    CHECK_IF_EXIST: (id: string | number ) => `/produtosBling/verificaSeExiste/${id}`,
  },

  
  TUTORIALS: {
    CREATE: `/tutoriais`,
    GET_ALL: `/tutoriais`,
    GET: (id: string) => `/tutoriais/${id}`,
    UPDATE: (id: string) => `/tutoriais/${id}`,
  },

  API_USERS: {
    CREATE: `/apiUsers`,
    GET_BY_USER: `/apiUsers/getByUser`,
    CREATE_BLING: `/apiUsers/bling`,
    GET_ALL: `/planos`,
    GET: (id: string) => `/planos/${id}`,
  },

  USERS: {
    CREATE: `/user`,
    UPDATE: (id: string | number) => `/user/${id}`,
    GET: (id: string | number) => `/user/${id}`,
  },

  SALES: {
    CREATE: `/vendas`,
    REPORT_DASHBOARD: `/vendas/relatorio/painel`,
    GET_ALL: `/vendas`,
    GET: (id: string) => `/vendas/${id}`,
    VERIFY_STOCK: (id: string) => `/vendas/verifyStock/${id}`,
  },

  PRODUCTS: {
    GET_ALL: `/produtos`,
    GET: (id: string) => `/produtos/${id}`,
  },

  PRODUCT_VARIANTS: {
    GET_ALL: `/variacoes`,
    GET: (id: string) => `/variacoes/${id}`,
  },
  REPORTS: {
    DASHBOARD: `/reports`,
    GET: (id: string) => `/produtos/${id}`,
  },

  SUBSCRIPTIONS: {
    CREATE: `/assinaturas`,
    GET_ALL: `/assinaturas`,
    GET_MY_PLAN: `/assinaturas/meu-plano`,
    GET: (id: string) => `/assinaturas/${id}`,
  },


  LOGIN: {
    LOGIN: `/auth`,
    REFRESH_DATA: `/auth/refreshData`,
    UPDATE_PASSWORD: (userId: string) =>
      `/commercial/public/clients/update/${userId}`,
    SEND_FORGOT_PASSWORD_MAIL: '/auth/sendForgotPasswordMail',
    UPDATE_PASSWORD_FORGOT: '/auth/forgotPassword',
    RESET_PASSWORD: '/commercial/public/clients/password/reset',
  },

  AFFILIATES: {
    GET: (code: string) => `/commercial/public/affiliates/view/code/${code}`,
  },

  ACTIVITIES: {
    GET_ALL: '/commercial/activities',
    GET: (code: string) =>
      `${API_BASE_URL}/commercial/public/activities/view/code/${code}`,
    GET_REPORT_ACTIVITY_RESERVATION: (code: string) =>
      `/commercial/public/activities/reportActivityReservations/${code}`,
    CREATE: '/commercial/activities/create',
    UPDATE: (id: string) => `/commercial/activities/update/${id}`,
    DELETE: (id: string) => `/commercial/activities/delete/${id}`,
  },

  CLIENTS: {
    GET_ALL: '/commercial/public/clients',
    GET: (id: string) => `/commercial/public/clients/view/${id}`,
    GET_BY_DOCUMENT: (document: string, parent_id?: number) =>
      `/commercial/public/clients/view/document/${document}/${parent_id}`,
    GET_BY_EMAIL: (email: string) =>
      `/commercial/public/clients/view/email/${email}`,
    CREATE: '/commercial/public/clients/create',
    REFRESH: '/commercial/public/clients/refresh',
    REFRESH_TOKEN: '/commercial/public/clients/refreshToken',
    UPDATE: (id: string) => `/commercial/public/clients/update/${id}`,
    DELETE: (id: string) => `/commercial/public/clients/delete/${id}`,
  },

  TEACHERS: {
    GET_ALL: '/commercial/public/teachers',
    GET: (id: string) => `/commercial/public/teachers/view/${id}`,
    GET_BY_DOCUMENT: (document: string) =>
      `/commercial/public/teachers/view/document/${document}`,
    GET_BY_EMAIL: (document: string) =>
      `/commercial/public/teachers/view/document/${document}`,
    LIST_ALL_BY_TEACHERS: (email: string) =>
      `/commercial/public/teachers/view/email/${email}`,
    CREATE: '/commercial/public/teachers/create',
    REFRESH: '/commercial/public/teachers/refresh',
    REFRESH_TOKEN: '/commercial/public/teachers/refreshToken',
    UPDATE: (id: string) => `/commercial/public/teachers/update/${id}`,
    DELETE: (id: string) => `/commercial/public/teachers/delete/${id}`,
  },

  RESERVATIONS: {
    GET_ALL: '/commercial/reservations',
    GET: (id: string) => `/commercial/public/reservations/view/${id}`,
    GET_BY_CODE: (id: string) => `/commercial/public/reservations/code/${id}`,
    CREATE: '/commercial/public/reservations/create',
    UPDATE: (id: string) => `/commercial/reservations/update/${id}`,
    DELETE: (id: string) => `/commercial/reservations/delete/${id}`,
    GET_CERT_PDF: (id: string) => `/commercial/reservations/getCertPdf/${id}`,
  },

  PAGSEGURO_RESERVATION: {
    GET_SESSION: '/pagamento/sessao',
    CREATE_BANK_SLIP: '/financial/pagseguro/reservation/createBankSlip',
    CREATE_CREDIT_CARD: '/financial/pagseguro/reservation/createCreditCard',
    CREATE_CREDIT_PIX: '/pagamento/criarPix',
    CANCEL_TRANSACTION: '/financial/pagseguro/reservation/cancelTransaction',
  },

  INTER_RESERVATION: {
    CREATE_CREDIT_PIX: '/financial/inter/reservation/createPix',
  },
};
