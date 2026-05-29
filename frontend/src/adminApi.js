import axios from 'axios';

const adminApi = axios.create({
  baseURL: 'http://localhost:5000/api/admin',
  headers: { 'Content-Type': 'application/json' },
});

// Attach JWT to every request if present
adminApi.interceptors.request.use((config) => {
  const token = localStorage.getItem('admin_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Auto-logout on 401
adminApi.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('admin_token');
      window.location.href = '/admin';
    }
    return Promise.reject(err);
  }
);

export default adminApi;
