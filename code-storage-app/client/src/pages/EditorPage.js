import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation, Link } from 'react-router-dom';
import { getCodeById, saveCode, checkTitleExists } from '../services/codeService';
import { isAuthenticated } from '../services/authService';
import './EditorPage.css';

const EditorPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [currentCode, setCurrentCode] = useState({
    title: 'Untitled Code',
    code: '',
    language: 'javascript',
    isProtected: false,
    secretKey: '',
    public: true
  });
  const [loading, setLoading] = useState(id ? true : false);
  const [saveModal, setSaveModal] = useState(false);
  const [saveStatus, setSaveStatus] = useState(null);
  const [secretKeyFromState, setSecretKeyFromState] = useState(
    location.state?.secretKey || ''
  );
  const [showKeyModal, setShowKeyModal] = useState(false);
  const [keyInputValue, setKeyInputValue] = useState('');
  const [protectedFileId, setProtectedFileId] = useState(null);
  const [checking, setChecking] = useState(false);
  const [originalTitle, setOriginalTitle] = useState('');

  useEffect(() => {
    if (id) {
      fetchCode(id, secretKeyFromState);
    }
  }, [id, secretKeyFromState]);

  const fetchCode = async (codeId, secretKey = null) => {
    try {
      setLoading(true);
      const data = await getCodeById(codeId, secretKey);
      setCurrentCode({
        ...data,
        secretKey: secretKey || ''
      });
      setOriginalTitle(data.title);
    } catch (error) {
      console.error('Error fetching code:', error);
      if (error.response?.status === 403 && error.response?.data?.requiresKey) {
        setProtectedFileId(codeId);
        setShowKeyModal(true);
      } else {
        setSaveStatus({
          type: 'error',
          message: 'Could not load the requested code snippet.'
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setCurrentCode({
      ...currentCode,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleCodeChange = (code) => {
    setCurrentCode({
      ...currentCode,
      code
    });
  };

  const handleSaveClick = async () => {
    if (!currentCode.code.trim()) {
      setSaveStatus({
        type: 'error',
        message: 'Code cannot be empty'
      });
      return;
    }
    
    if (!isAuthenticated() && currentCode.public === false) {
      setCurrentCode({...currentCode, public: true});
      setSaveStatus({
        type: 'warning',
        message: 'You need to be logged in to save private code. Switching to public.'
      });
      setTimeout(() => setSaveModal(true), 1500);
      return;
    }
    
    if (!currentCode.title.trim()) {
      setSaveStatus({
        type: 'error',
        message: 'Title cannot be empty'
      });
      return;
    }
    
    try {
      setChecking(true);
      
      if (!id || (id && currentCode.title !== originalTitle)) {
        const titleExists = await checkTitleExists(currentCode.title);
        if (titleExists) {
          setSaveStatus({
            type: 'error',
            message: 'A code snippet with this title already exists. Please choose a different title.'
          });
          setChecking(false);
          return;
        }
      }
      
      setChecking(false);
      setSaveModal(true);
    } catch (error) {
      console.error('Error checking title:', error);
      setChecking(false);
      setSaveModal(true);
    }
  };

  const handleSaveConfirm = async () => {
    try {
      const hasToken = !!localStorage.getItem('token');
      console.log("Token available before save:", hasToken);
      
      const codeToSave = {
        ...currentCode,
        title: currentCode.title || 'Untitled Code',
        code: currentCode.code || '',
        language: currentCode.language || 'javascript',
        public: !isAuthenticated() ? true : (currentCode.public === false ? false : true)
      };
      
      if (!codeToSave.isProtected) {
        delete codeToSave.secretKey;
      }
      
      console.log("Saving code with:", codeToSave);
      
      const response = await saveCode(codeToSave);
      console.log("Save response:", response);
      
      setSaveStatus({
        type: 'success',
        message: id ? 'Code updated successfully!' : 'New code created successfully!',
        id: response.id || id
      });
      
      if (!id && response.id) {
        navigate(`/editor/${response.id}`, { replace: true });
      }
      
      setSaveModal(false);
    } catch (error) {
      console.error('Error in save process:', error);
      console.error('Response status:', error.response?.status);
      console.error('Response data:', error.response?.data);
      
      if (error.response?.status === 401) {
        setSaveStatus({
          type: 'error',
          message: 'Authentication required. Please log in to save private codes.'
        });
      } else if (error.response?.data?.error === 'DuplicateTitle') {
        setSaveStatus({
          type: 'error',
          message: 'A code snippet with this title already exists. Please choose a different title.'
        });
      } else {
        setSaveStatus({
          type: 'error',
          message: 'Failed to save code. Please try again.'
        });
      }
    }
  };

  const handleCancelSave = () => {
    setSaveModal(false);
  };

  const handleKeySubmit = async (e) => {
    e.preventDefault();
    
    if (!keyInputValue.trim()) {
      return;
    }
    
    try {
      await fetchCode(protectedFileId, keyInputValue);
      setShowKeyModal(false);
    } catch (error) {
      console.error('Error submitting key:', error);
    }
  };

  if (loading) {
    return (
      <div className="editor-loading">
        <div className="spinner"></div>
        <p>Loading editor...</p>
      </div>
    );
  }

  return (
    <div className="editor-page">
      <div className="editor-header">
        <h1>{id ? 'Edit Code' : 'Create New Code'}</h1>
        {!isAuthenticated() && (
          <div className="login-prompt">
            <p>Want to save private snippets? <a href="/login">Log in</a> or <a href="/register">create an account</a></p>
          </div>
        )}
      </div>

      {saveStatus && (
        <div className={`status-message ${saveStatus.type}`}>
          <div className="status-content">
            {saveStatus.type === 'error' && <span className="status-icon">❌</span>}
            {saveStatus.type === 'success' && <span className="status-icon">✅</span>}
            {saveStatus.type === 'info' && <span className="status-icon">ℹ️</span>}
            <span>{saveStatus.message}</span>
            {saveStatus.type === 'success' && saveStatus.id && (
              <div className="success-actions">
                <button 
                  onClick={() => {
                    const link = `${window.location.origin}/view/${saveStatus.id}`;
                    navigator.clipboard.writeText(link);
                    setSaveStatus({ 
                      ...saveStatus,
                      message: 'Link copied to clipboard!' 
                    });
                  }} 
                  className="copy-link-btn"
                >
                  Copy Link
                </button>
                
                <Link to={`/view/${saveStatus.id}`} className="view-btn">
                  View Code
                </Link>
              </div>
            )}
          </div>
          
          <button 
            onClick={() => setSaveStatus(null)} 
            className="close-status"
          >
            ×
          </button>
        </div>
      )}

      <div className="editor-container">
        <div className="editor-toolbar">
          <input
            type="text"
            name="title"
            value={currentCode.title}
            onChange={handleInputChange}
            placeholder="Enter title..."
            className="editor-title-input"
          />
          
          <select
            name="language"
            value={currentCode.language}
            onChange={handleInputChange}
            className="language-selector"
          >
            <option value="javascript">JavaScript</option>
            <option value="python">Python</option>
            <option value="html">HTML</option>
            <option value="css">CSS</option>
            <option value="java">Java</option>
            <option value="csharp">C#</option>
          </select>
          
          <button
            onClick={handleSaveClick}
            className="save-button"
            disabled={checking}
          >
            {checking ? 'Checking...' : 'Save Code'}
          </button>
        </div>

        <div className="editor-main">
          <textarea
            value={currentCode.code}
            onChange={(e) => handleCodeChange(e.target.value)}
            className="code-editor"
            placeholder="Write your code here..."
            spellCheck="false"
          />
        </div>
      </div>

      {saveModal && (
        <div className="save-modal-overlay">
          <div className="save-modal">
            <h3>Save Code Snippet</h3>
            
            <div className="form-group">
              <label>Visibility</label>
              <div className="radio-group">
                <label className="radio-label">
                  <input
                    type="radio"
                    name="public"
                    checked={currentCode.public}
                    onChange={() => setCurrentCode({...currentCode, public: true})}
                  />
                  <span className="radio-text">Public</span>
                  <span className="radio-description">Anyone can access this code with the link</span>
                </label>
                
                <label className={`radio-label ${!isAuthenticated() ? 'disabled' : ''}`}>
                  <input
                    type="radio"
                    name="public"
                    checked={!currentCode.public}
                    onChange={() => setCurrentCode({...currentCode, public: false})}
                    disabled={!isAuthenticated()}
                  />
                  <span className="radio-text">Private</span>
                  <span className="radio-description">
                    {isAuthenticated() 
                      ? 'Only you can access this code' 
                      : 'Sign in to create private codes'}
                  </span>
                </label>
              </div>
            </div>
            
            {currentCode.public && (
              <div className="form-group protection-toggle">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    name="isProtected"
                    checked={currentCode.isProtected}
                    onChange={(e) => setCurrentCode({...currentCode, isProtected: e.target.checked})}
                  />
                  <span>Protect with Secret Key</span>
                </label>
                <p className="helper-text">
                  Optional: Add a password to restrict access to your code
                </p>
              </div>
            )}
            
            {currentCode.public && currentCode.isProtected && (
              <div className="form-group">
                <label>Secret Key</label>
                <input
                  type="password"
                  name="secretKey"
                  value={currentCode.secretKey}
                  onChange={handleInputChange}
                  className="form-input"
                  placeholder="Enter a secret key"
                />
                <p className="helper-text">
                  Anyone with this key will be able to view your code
                </p>
              </div>
            )}
            
            <div className="modal-actions">
              <button 
                onClick={handleCancelSave} 
                className="btn btn-secondary"
              >
                Cancel
              </button>
              <button 
                onClick={handleSaveConfirm} 
                className="btn btn-primary"
              >
                Save Code
              </button>
            </div>
          </div>
        </div>
      )}

      {showKeyModal && (
        <div className="modal-overlay">
          <div className="save-modal key-modal">
            <h3>Protected File</h3>
            <p>This file requires a secret key to access</p>
            
            <form onSubmit={handleKeySubmit}>
              <div className="form-group">
                <label>Secret Key</label>
                <input
                  type="password"
                  value={keyInputValue}
                  onChange={(e) => setKeyInputValue(e.target.value)}
                  className="form-input"
                  placeholder="Enter the secret key"
                  autoFocus
                />
              </div>
              
              <div className="modal-actions">
                <button 
                  type="button"
                  onClick={() => navigate(-1)}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="btn btn-primary"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditorPage;