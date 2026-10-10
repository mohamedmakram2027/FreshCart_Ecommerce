import axios from 'axios';
import Cookies from 'js-cookie';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://ecommerce.routemisr.com/api/v1';

export const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: لإرفاق التوكن تلقائياً من الـ Cookies مع كل Request
apiClient.interceptors.request.use(
  (config) => {
    const token = Cookies.get('freshcart_token');
    if (token) {
      config.headers.token = token;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: لمعالجة انتهاء جلسة المستخدم أو أخطاء السيرفر
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      Cookies.remove('freshcart_token');
    }
    return Promise.reject(error.response?.data?.message || 'حدث خطأ غير متوقع في الاتصال بالسيرفر');
  }
);