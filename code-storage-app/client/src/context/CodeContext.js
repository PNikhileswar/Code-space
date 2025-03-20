import React, { createContext, useState, useContext } from 'react';
import { saveCode } from '../services/codeService';

const CodeContext = createContext();

export const useCode = () => useContext(CodeContext);

export const CodeProvider = ({ children }) => {
  const [codes, setCodes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // No automatic fetching until getPublicCodes is implemented
  
  const fetchCodes = async () => {
    try {
      setLoading(true);
      setError(null);
      // Will be implemented when getPublicCodes is ready
      //const data = await getPublicCodes();
      //setCodes(data);
      setCodes([]);
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