import axios from './axios';

export const fetchProducts = async (currentPage) => {
    return axios.get('/get-products?page='+currentPage);
};

export const fetchAnalytics = async () => {
    return axios.get('/dashboard-analytics');
};

export const importProducts = async (formData) => {
  return axios.post('/product-import', formData);
};