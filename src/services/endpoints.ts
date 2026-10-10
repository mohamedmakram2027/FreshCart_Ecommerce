export const API_ENDPOINTS = {
  AUTH: {
    SIGNUP: '/auth/signup',
    SIGNIN: '/auth/signin',
    FORGOT_PASSWORD: '/auth/forgotPasswords',
    VERIFY_RESET_CODE: '/auth/verifyResetCode',
    RESET_PASSWORD: '/auth/resetPassword',
    VERIFY_TOKEN: '/auth/verifyToken',
  },
  USERS: {
    UPDATE_DATA: '/users/updateMe/',
    CHANGE_PASSWORD: '/users/changeMyPassword',
    GET_ALL: '/users',
  },
  PRODUCTS: {
    GET_ALL: '/products',
    GET_SPECIFIC: (id: string) => `/products/${id}`,
  },
  CATEGORIES: {
    GET_ALL: '/categories',
    GET_SPECIFIC: (id: string) => `/categories/${id}`,
    GET_SUBCATEGORIES: (categoryId: string) => `/categories/${categoryId}/subcategories`,
  },
  BRANDS: {
    GET_ALL: '/brands',
    GET_SPECIFIC: (id: string) => `/brands/${id}`,
  },
  WISHLIST: {
    ADD: '/wishlist',
    REMOVE: (productId: string) => `/wishlist/${productId}`,
    GET_ALL: '/wishlist',
  },
  ADDRESSES: {
    ADD: '/addresses',
    REMOVE: (addressId: string) => `/addresses/${addressId}`,
    GET_SPECIFIC: (addressId: string) => `/addresses/${addressId}`,
    GET_ALL: '/addresses',
  },
  CART_V1: {
    ADD: '/cart',
    GET_ALL: '/cart',
    UPDATE_QTY: (productId: string) => `/cart/${productId}`,
    REMOVE_ITEM: (productId: string) => `/cart/${productId}`,
    CLEAR: '/cart',
  },
  CART_V2: {
    ADD: '/v2/cart',
    GET_ALL: '/v2/cart',
    UPDATE_QTY: (productId: string) => `/v2/cart/${productId}`,
    REMOVE_ITEM: (productId: string) => `/v2/cart/${productId}`,
    CLEAR: '/v2/cart',
    APPLY_COUPON: '/v2/cart/applyCoupon',
  },
  REVIEWS: {
    CREATE_FOR_PRODUCT: (productId: string) => `/products/${productId}/reviews`,
    GET_FOR_PRODUCT: (productId: string) => `/products/${productId}/reviews`,
    GET_ALL: '/reviews',
    GET_BY_ID: (reviewId: string) => `/reviews/${reviewId}`,
    UPDATE: (reviewId: string) => `/reviews/${reviewId}`,
    DELETE: (reviewId: string) => `/reviews/${reviewId}`,
  },
  ORDERS: {
    CREATE_CASH_V1: (cartId: string) => `/orders/${cartId}`,
    CREATE_CASH_V2: (cartId: string) => `/v2/orders/${cartId}`,
    CHECKOUT_SESSION: (cartId: string, redirectUrl: string) =>
      `/orders/checkout-session/${cartId}?url=${redirectUrl}`,
    GET_ALL: '/orders/',
    GET_USER_ORDERS: (userId: string) => `/orders/user/${userId}`,
  },
} as const;