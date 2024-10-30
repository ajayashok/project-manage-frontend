import axios from 'axios';

const instance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  headers: {
    'Accept':'application/json',
    // 'Authorization': 'Bearer 2|TsuWjopNFlmCaoCYkAVYYVt9sP9qRSdqNwa4nnhC28c8d331'
  },
});

// Add an interceptor to include the token if available
instance.interceptors.request.use(
  (config) => {
    // Check for the token, e.g., stored in localStorage
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    // if (config.url != '/login' || config.url != '/register') {
    //     config.withCredentials = true;
    // }
    return config;
  },
  (error) => Promise.reject(error)
);


export default instance;