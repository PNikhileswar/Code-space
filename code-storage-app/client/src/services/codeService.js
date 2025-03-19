import axios from 'axios';

const API_URL = 'http://localhost:5000/api/codes';

// Function to save a new code
export const saveCode = async (codeData) => {
    try {
        const response = await axios.post(`${API_URL}/save`, codeData);
        return response.data;
    } catch (error) {
        throw new Error('Error saving code: ' + error.message);
    }
};

// Function to retrieve all codes
export const getAllCodes = async () => {
    try {
        const response = await axios.get(`${API_URL}/all`);
        return response.data;
    } catch (error) {
        throw new Error('Error retrieving codes: ' + error.message);
    }
};

// Function to retrieve a specific code by ID
export const getCodeById = async (id) => {
    try {
        const response = await axios.get(`${API_URL}/${id}`);
        return response.data;
    } catch (error) {
        throw new Error('Error retrieving code: ' + error.message);
    }
};