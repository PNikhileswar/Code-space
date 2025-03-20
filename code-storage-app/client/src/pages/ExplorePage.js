import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCodeByTitle, getCodeById } from '../services/codeService';
import './ExplorePage.css';

const ExplorePage = () => {
  const [filename, setFilename] = useState('');
  const [secretKey, setSecretKey] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [requiresKey, setRequiresKey] = useState(false);
  const [protectedCodeId, setProtectedCodeId] = useState(null);
  const navigate = useNavigate();

  const handleFileSearch = async (e) => {
    e.preventDefault();
    
    if (!filename.trim()) {
      setError('Please enter a file name');
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      // Try to fetch exact file by title
      const response = await getCodeByTitle(filename.trim());
      
      // File exists - check if it's protected
      if (response.isProtected) {
        setRequiresKey(true);
        setProtectedCodeId(response._id);
      } else {
        // If not protected, navigate to editor with this ID
        navigate(`/editor/${response._id}`);
      }
    } catch (err) {
      console.error("Error in file search:", err);
      
      if (err.response?.status === 404) {
        // File doesn't exist - create new with this name
        navigate('/editor', { 
          state: { 
            suggestedTitle: filename.trim(),
            isNewFile: true 
          } 
        });
      } else if (err.response?.status === 403 && err.response?.data?.requiresKey) {
        // File exists but requires a key
        setRequiresKey(true);
        setProtectedCodeId(err.response.data._id);
      } else {
        setError('Error finding file. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSecretSubmit = async (e) => {
    e.preventDefault();
    
    if (!secretKey.trim()) {
      setError('Please enter a secret key');
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      // Try to fetch with provided secret key
      const codeData = await getCodeById(protectedCodeId, secretKey);
      
      // If successful, navigate to editor with this ID and the secret key
      navigate(`/editor/${protectedCodeId}`, {
        state: { secretKey: secretKey }
      });
    } catch (err) {
      if (err.response?.status === 403) {
        setError('Invalid secret key. Please try again.');
      } else {
        setError('Error accessing file. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCreateNew = () => {
    navigate('/editor');
  };

  return (
    <div className="explore-container">
      <div className="explore-header">
        <h1>Open Code File</h1>
        <p>Enter a file name to open or create a code file</p>
      </div>
      
      {!requiresKey ? (
        <div className="file-search-card">
          <form onSubmit={handleFileSearch} className="file-search-form">
            <div className="search-input-group">
              <input
                type="text"
                value={filename}
                onChange={(e) => setFilename(e.target.value)}
                placeholder="Enter file name..."
                className="file-search-input"
                autoFocus
              />
              <button 
                type="submit" 
                className="file-search-button"
                disabled={loading}
              >
                {loading ? 'Opening...' : 'Open File'}
              </button>
            </div>
            
            {error && <div className="search-error">{error}</div>}
          </form>
          
          <div className="file-search-info">
            <h3>How it works:</h3>
            <ul>
              <li>Enter a file name to open it for editing</li>
              <li>If the file exists, it will open directly</li>
              <li>If the file doesn't exist, a new file will be created with that name</li>
              <li>If a file is protected, you'll need to enter the secret key</li>
              <li>File names must be unique - saving will update the existing file</li>
            </ul>
          </div>
          
          <div className="divider">
            <span>OR</span>
          </div>
          
          <button 
            onClick={handleCreateNew} 
            className="create-new-button"
          >
            Create New File
          </button>
        </div>
      ) : (
        <div className="file-search-card">
          <div className="protected-file-header">
            <h2>Protected File</h2>
            <p>This file requires a secret key to access</p>
          </div>
          
          <form onSubmit={handleSecretSubmit} className="secret-key-form">
            <div className="form-group">
              <label>Secret Key:</label>
              <input
                type="password"
                value={secretKey}
                onChange={(e) => setSecretKey(e.target.value)}
                className="form-input"
                placeholder="Enter the secret key"
                autoFocus
              />
            </div>
            
            {error && <div className="search-error">{error}</div>}
            
            <div className="form-actions">
              <button
                type="button"
                onClick={() => {
                  setRequiresKey(false);
                  setProtectedCodeId(null);
                  setSecretKey('');
                  setError(null);
                }}
                className="btn btn-secondary"
              >
                Back
              </button>
              
              <button 
                type="submit" 
                className="btn btn-primary"
                disabled={loading}
              >
                {loading ? 'Verifying...' : 'Submit'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default ExplorePage;