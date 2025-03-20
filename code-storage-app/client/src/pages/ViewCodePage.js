import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { getCodeById } from '../services/codeService';
import SimpleEditor from '../components/CodeEditor/SimpleEditor';
import './ViewCodePage.css';

const ViewCodePage = () => {
  const { id } = useParams();
  const [code, setCode] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [requiresKey, setRequiresKey] = useState(false);
  const [secretKey, setSecretKey] = useState('');

  // Use useCallback to memoize the fetchCode function
  const fetchCode = useCallback(async (key = null) => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await getCodeById(id, key);
      setCode(data);
      setRequiresKey(false);
      
    } catch (err) {
      console.error('Error fetching code:', err);
      
      if (err.response?.status === 403 && err.response?.data?.requiresKey) {
        setRequiresKey(true);
        setError('This code is protected with a secret key');
      } else {
        setError(err.response?.data?.message || 'Failed to load code');
      }
    } finally {
      setLoading(false);
    }
  }, [id]); // Add id to dependencies

  useEffect(() => {
    fetchCode();
  }, [fetchCode]); // Now fetchCode is in dependencies

  const handleKeySubmit = (e) => {
    e.preventDefault();
    fetchCode(secretKey);
  };

  // Rest of component remains the same
  if (loading) {
    return (
      <div className="view-code-loading">
        <div className="spinner"></div>
        <p>Loading code...</p>
      </div>
    );
  }

  if (requiresKey) {
    return (
      <div className="view-code-container">
        <div className="protected-code-card">
          <h2>Protected Code</h2>
          <p>This code snippet is protected with a secret key.</p>
          
          <form onSubmit={handleKeySubmit} className="key-form">
            <div className="form-group">
              <label htmlFor="secretKey">Enter Secret Key</label>
              <input
                id="secretKey"
                type="password"
                value={secretKey}
                onChange={(e) => setSecretKey(e.target.value)}
                className="form-input"
                placeholder="Enter the secret key"
                required
              />
            </div>
            
            {error && <div className="error-message">{error}</div>}
            
            <button type="submit" className="btn btn-primary">
              Unlock Code
            </button>
          </form>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="view-code-container">
        <div className="error-card">
          <h2>Error</h2>
          <p>{error}</p>
          <button 
            onClick={() => window.location.href = '/editor'}
            className="btn btn-primary"
          >
            Create New Code
          </button>
        </div>
      </div>
    );
  }

  if (!code) {
    return (
      <div className="view-code-container">
        <div className="error-card">
          <h2>Code Not Found</h2>
          <p>The code snippet you're looking for doesn't exist or has been removed.</p>
          <button 
            onClick={() => window.location.href = '/editor'}
            className="btn btn-primary"
          >
            Create New Code
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="view-code-container">
      <div className="view-code-header">
        <h1>{code.title || 'Untitled Code'}</h1>
        <div className="view-code-meta">
          <span className="language-badge">{code.language}</span>
          <span className="date-info">
            Created: {new Date(code.createdAt).toLocaleDateString()}
          </span>
        </div>
      </div>
      
      <SimpleEditor
        initialCode={code.code}
        readOnly={true}
        title={code.title}
        language={code.language}
      />
    </div>
  );
};

export default ViewCodePage;