import axios from 'axios';

const API_URL = 'http://localhost:5000/api/auth';

// Create axios instance with default headers and correct base URL
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests if available
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Register new user (use correct endpoint)
export const register = async (userData) => {
  const response = await api.post('/register', userData);
  return response.data;
};

// Verify OTP and complete registration
export const verifyOTP = async (verificationData) => {
  const response = await api.post('/verify-otp', verificationData);
  return response.data;
};

// Login user (fix the path)
export const login = async (credentials) => {
  try {
    const response = await api.post('/login', credentials);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
    }
    return response.data;
  } catch (error) {
    const message = error.response?.data?.message || 'Login failed';
    console.error('Login error:', message);
    throw error;
  }
};

// Logout user
export const logout = () => {
  localStorage.removeItem('token');
};

// Check if user is authenticated
export const isAuthenticated = () => {
  return !!localStorage.getItem('token');
};

// Resend OTP (fix the path)
export const resendOTP = async (data) => {
  const response = await api.post('/resend-otp', data);
  return response.data;
};