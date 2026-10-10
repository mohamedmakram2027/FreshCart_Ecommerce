import axios from 'axios';

const BASE_URL = 'https://ecommerce.routemisr.com/api/v1';

// جلب المنتجات
export async function getProducts() {
  const response = await axios.get(`${BASE_URL}/products`);
  return response.data.data; // الـ API يرجع المنتجات داخل data.data
}

// جلب الفئات
export async function getCategories() {
  const response = await axios.get(`${BASE_URL}/categories`);
  return response.data.data;
}