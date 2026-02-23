import axios from 'axios';

export const API_BASE = 'http://localhost:5000/api';

const api = axios.create({
    baseURL: API_BASE,
    timeout: 8000,
    headers: { 'Content-Type': 'application/json' },
});


api.interceptors.request.use((config) => {
    const token = localStorage.getItem('fleet_token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});


api.interceptors.response.use(
    (res) => res,
    (err) => {
        if (err.response?.status === 401) {
            localStorage.removeItem('fleet_token');
            localStorage.removeItem('fleet_user');
        }
        return Promise.reject(err);
    }
);

export default api;