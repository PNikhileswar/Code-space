import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { saveCode } from '../../services/codeService';
import SimpleEditor from './SimpleEditor';
import './PublicEditor.css';

const PublicEditor = () => {
  const [code, setCode] = useState('');
  const [title, setTitle] = useState('Untitled Code');
  const [language, setLanguage] = useState('javascript');
  const [saveModal, setSaveModal] = useState(false);
  const [isProtected, setIsProtected] = useState(false);
  const [secretKey, setSecretKey] = useState('');
  const [isPublic, setIsPublic] = useState(true);
  const [saveStatus, setSaveStatus] = useState({ message: '', type: '' });
  const [savedCodeId, setSavedCodeId] = useState(null);

  // Clear default code when component mounts
  useEffect(() => {
    setCode('');  // Start with empty code instead of default message
  }, []);

  const handleSave = async () => {
    if (!code.trim()) {
      setSaveStatus({ 
        message: 'Code cannot be empty', 
        type: 'error' 
      });
      return;
    }
    
    setSaveModal(true);
  };

  const handleCancelSave = () => {
    setSaveModal(false);
    setIsProtected(false);
    setSecretKey('');
  };

  const handleConfirmSave = async () => {
    try {
      setSaveStatus({ message: 'Saving...', type: 'info' });
      
      if (isProtected && !secretKey.trim()) {
        setSaveStatus({ 
          message: 'Please provide a secret key or disable protection', 
          type: 'error' 
        });
        return;
      }

      const codeData = {
        title,
        code,  // This will be the user's actual code
        language,
        isProtected,
        secretKey: isProtected ? secretKey : undefined,
        public: isPublic
      };

      const response = await saveCode(codeData);
      setSavedCodeId(response.id);
      setSaveStatus({ 
        message: `Code saved successfully! ${isPublic ? 'Anyone can view it with the link.' : 'Only you can access it.'}`, 
        type: 'success' 
      });
      setSaveModal(false);
      
    } catch (error) {
      setSaveStatus({ 
        message: 'Failed to save code. Please try again.', 
        type: 'error' 
      });
    }
  };

  const handleCopyLink = () => {
    if (savedCodeId) {
      const link = `${window.location.origin}/view/${savedCodeId}`;
      navigator.clipboard.writeText(link);
      setSaveStatus({ 
        message: 'Link copied to clipboard!', 
        type: 'success' 
      });
    }
  };

  return (
    <div className="public-editor-container">
      {saveStatus.message && (
        <div className={`status-message ${saveStatus.type}`}>
          <div>
            {saveStatus.message}
            {saveStatus.type === 'success' && (
              <div className="navigation-links">
                <Link to="/explore" className="nav-link">Browse all public codes</Link>
                {localStorage.getItem('token') && 
                  <Link to="/codes" className="nav-link">View my saved codes</Link>
                }
              </div>
            )}
          </div>
          {saveStatus.type === 'success' && savedCodeId && (
            <button onClick={handleCopyLink} className="copy-link-btn">
              Copy Link
            </button>
          )}
        </div>
      )}

      <SimpleEditor
        initialCode={code}
        onChange={setCode}
        onSave={handleSave}
        title={title}
        onTitleChange={setTitle}
        language={language}
        onLanguageChange={setLanguage}
      />

      {saveModal && (
        <div className="save-modal-overlay">
          <div className="save-modal">
            <h3>Save Code Snippet</h3>
            
            <div className="form-group">
              <label>Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="form-input"
                placeholder="Enter a title for your code"
              />
            </div>
            
            <div className="form-group">
              <label>Visibility</label>
              <div className="radio-group">
                <label className="radio-label">
                  <input
                    type="radio"
                    checked={isPublic}
                    onChange={() => setIsPublic(true)}
                    name="visibility"
                  />
                  <span className="radio-text">Public</span>
                  <span className="radio-description">Anyone can access this code with the link</span>
                </label>
                
                <label className="radio-label">
                  <input
                    type="radio"
                    checked={!isPublic}
                    onChange={() => setIsPublic(false)}
                    name="visibility"
                    disabled={!localStorage.getItem('token')}
                  />
                  <span className="radio-text">Private</span>
                  <span className="radio-description">
                    {localStorage.getItem('token') 
                      ? 'Only you can access this code' 
                      : 'Sign in to create private codes'}
                  </span>
                </label>
              </div>
            </div>
            
            {isPublic && (
              <div className="form-group protection-toggle">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={isProtected}
                    onChange={(e) => setIsProtected(e.target.checked)}
                  />
                  <span>Protect with Secret Key</span>
                </label>
                <p className="helper-text">
                  Optional: Add a password to restrict access to your public code
                </p>
              </div>
            )}
            
            {isPublic && isProtected && (
              <div className="form-group">
                <label>Secret Key</label>
                <input
                  type="password"
                  value={secretKey}
                  onChange={(e) => setSecretKey(e.target.value)}
                  className="form-input"
                  placeholder="Enter a secret key"
                />
                <p className="helper-text">
                  Anyone with this key will be able to view your code.
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
                onClick={handleConfirmSave} 
                className="btn btn-primary"
              >
                Save Code
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PublicEditor;