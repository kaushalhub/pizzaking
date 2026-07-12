import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || 'http://pizzaking-be.demos.jo3.org/api';

export const db = {
  // Products
  getProducts: async () => {
    const res = await axios.get(`${API_BASE}/products`);
    return res.data;
  },
  addProduct: async (product) => {
    const res = await axios.post(`${API_BASE}/products`, product);
    return res.data;
  },
  updateProduct: async (updatedProduct) => {
    const res = await axios.put(`${API_BASE}/products/${updatedProduct.id}`, updatedProduct);
    return res.data;
  },
  deleteProduct: async (id) => {
    const res = await axios.delete(`${API_BASE}/products/${id}`);
    return res.data;
  },

  // Categories
  getCategories: async () => {
    const res = await axios.get(`${API_BASE}/categories`);
    return res.data;
  },
  addCategory: async (categoryName) => {
    const res = await axios.post(`${API_BASE}/categories`, { name: categoryName });
    return res.data;
  },
  deleteCategory: async (categoryName) => {
    const res = await axios.delete(`${API_BASE}/categories/${categoryName}`);
    return res.data;
  },

  // Coupons
  getCoupons: async () => {
    const res = await axios.get(`${API_BASE}/coupons`);
    return res.data;
  },
  addCoupon: async (coupon) => {
    const res = await axios.post(`${API_BASE}/coupons`, coupon);
    return res.data;
  },
  updateCoupon: async (updatedCoupon) => {
    const res = await axios.put(`${API_BASE}/coupons/${updatedCoupon.code}`, updatedCoupon);
    return res.data;
  },
  deleteCoupon: async (code) => {
    const res = await axios.delete(`${API_BASE}/coupons/${code}`);
    return res.data;
  },

  // Reviews
  getReviews: async () => {
    const res = await axios.get(`${API_BASE}/reviews`);
    return res.data;
  },
  addReview: async (review) => {
    const res = await axios.post(`${API_BASE}/reviews`, review);
    return res.data;
  },
  updateReviewStatus: async (id, status) => {
    const res = await axios.put(`${API_BASE}/reviews/${id}/status`, { status });
    return res.data;
  },
  deleteReview: async (id) => {
    const res = await axios.delete(`${API_BASE}/reviews/${id}`);
    return res.data;
  },

  // Banners
  getBanners: async () => {
    const res = await axios.get(`${API_BASE}/banners`);
    return res.data;
  },
  addBanner: async (banner) => {
    const res = await axios.post(`${API_BASE}/banners`, banner);
    return res.data;
  },
  deleteBanner: async (id) => {
    const res = await axios.delete(`${API_BASE}/banners/${id}`);
    return res.data;
  },

  // Settings
  getSettings: async () => {
    const res = await axios.get(`${API_BASE}/settings`);
    return res.data;
  },
  saveSettings: async (settings) => {
    const res = await axios.put(`${API_BASE}/settings`, settings);
    return res.data;
  },

  // Orders
  getOrders: async () => {
    const res = await axios.get(`${API_BASE}/orders`);
    return res.data;
  },
  addOrder: async (order) => {
    const res = await axios.post(`${API_BASE}/orders`, order);
    return res.data;
  },
  updateOrderStatus: async (id, status) => {
    const res = await axios.put(`${API_BASE}/orders/${id}/status`, { status });
    return res.data;
  }
};
