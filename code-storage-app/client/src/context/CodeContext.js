import React, { createContext, useState, useContext, useEffect } from 'react';
import { getPublicCodes, saveCode } from '../services/codeService';

const CodeContext = createContext();

export const useCode = () => useContext(CodeContext);

export const CodeProvider = ({ children }) => {
  const [codes, setCodes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Fetch all codes on component mount
  useEffect(() => {
    fetchCodes();
  }, []);
  
  const fetchCodes = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getPublicCodes(); // Changed from getAllCodes to getPublicCodes
      setCodes(data);
    } catch (error) {
      setError('Failed to fetch codes. Please try again later.');
      console.error('Error fetching codes:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const addCode = async (codeData) => {
    try {
      setError(null);
      const savedCode = await saveCode(codeData);
      setCodes([savedCode, ...codes]);
      return savedCode;
    } catch (error) {
      setError('Failed to save code. Please try again later.');
      console.error('Error saving code:', error);
      throw error;
    }
  };
  
  const value = {
    codes,
    loading,
    error,
    fetchCodes,
    addCode
  };
  
  return (
    <CodeContext.Provider value={value}>
      {children}
    </CodeContext.Provider>
  );
};