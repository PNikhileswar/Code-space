import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api/codes'
});

// Add token to requests if available
api.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token');
    if (token) {
      // Make sure the token format is correct (Bearer token)
      config.headers.Authorization = `Bearer ${token}`;
      console.log("Adding auth header to request with token prefix:", 
                token.substring(0, 10) + "...");
    }
    return config;
  },
  error => Promise.reject(error)
);

export default api;