import axios from 'axios';

const API_URL = 'http://localhost:5000/api/codes';

// Create axios instance
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
    // Make sure the token format is correct
    config.headers.Authorization = `Bearer ${token}`;
    console.log("Adding auth header with token");
  } else {
    console.log("No token available for request");
  }
  return config;
});

// Function to save a new code (works for both public and private)
export const saveCode = async (codeData) => {
  try {
    // Normalize boolean values
    const normalizedData = {
      ...codeData,
      public: codeData.public === false ? false : true,
      isProtected: codeData.isProtected === true
    };
    
    console.log("🔄 Sending normalized save data:", {
      title: normalizedData.title,
      public: normalizedData.public,
      isProtected: normalizedData.isProtected,
      hasToken: !!localStorage.getItem('token')
    });
    
    const response = await api.post('/save', normalizedData);
    return response.data;
  } catch (error) {
    console.error('❌ Error saving code:', error);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
      
      // Specific error handling based on status codes
      if (error.response.status === 401) {
        console.error('Authentication error - user not logged in or token expired');
      } else if (error.response.status === 500) {
        console.error('Server error - check backend logs');
      }
    }
    throw error;
  }
};

// Function to get public codes
export const getPublicCodes = async () => {
  try {
    const response = await api.get('/public');
    return response.data;
  } catch (error) {
    console.error('Error fetching public codes:', error);
    throw error;
  }
};

// Function to get a code by ID
export const getCodeById = async (id, secretKey = null) => {
  try {
    const data = secretKey ? { secretKey } : {};
    const response = await api.post(`/${id}`, data);
    return response.data;
  } catch (error) {
    console.error(`Error fetching code with ID ${id}:`, error);
    throw error;
  }
};

// Function to get codes by title
export const getCodeByTitle = async (title) => {
  try {
    const response = await api.get(`/by-title/${encodeURIComponent(title)}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching code with title ${title}:`, error);
    throw error;
  }
};

// Function to get user's private codes
export const getUserCodes = async () => {
  try {
    console.log("Auth token present:", !!localStorage.getItem('token'));
    const response = await api.get('/user');
    return response.data;
  } catch (error) {
    console.error('Error fetching user codes:', error);
    throw error;
  }
};

// Function to delete a code
export const deleteCode = async (id) => {
  try {
    const response = await api.delete(`/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting code with ID ${id}:`, error);
    throw error;
  }
};