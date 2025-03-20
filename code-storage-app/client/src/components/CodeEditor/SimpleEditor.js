import React, { useState, useEffect } from 'react';
import './SimpleEditor.css';

const SimpleEditor = ({ initialCode = '', onSave, readOnly = false }) => {
  const [code, setCode] = useState(initialCode);
  const [title, setTitle] = useState('Untitled Code');
  const [language, setLanguage] = useState('javascript');
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    // Reset code if initialCode changes (like when loading a saved snippet)
    setCode(initialCode);
  }, [initialCode]);

  const handleSave = async () => {
    if (!code.trim()) {
      setMessage({ type: 'error', text: 'Code cannot be empty' });
      return;
    }

    setIsSaving(true);
    setMessage(null);

    try {
      await onSave({ code, title, language });
      setMessage({ type: 'success', text: 'Code saved successfully!' });
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to save code. Please try again.' });
      console.error('Error saving code:', error);
    } finally {
      setIsSaving(false);
      
      // Clear success message after 3 seconds
      if (message?.type === 'success') {
        setTimeout(() => setMessage(null), 3000);
      }
    }
  };

  const languageOptions = [
    { value: 'javascript', label: 'JavaScript' },
    { value: 'python', label: 'Python' },
    { value: 'html', label: 'HTML' },
    { value: 'css', label: 'CSS' },
    { value: 'java', label: 'Java' },
    { value: 'csharp', label: 'C#' },
  ];

  return (
    <div className="editor-container">
      <div className="editor-header">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter code title..."
          className="editor-title"
          disabled={readOnly}
        />
        
        <div className="editor-actions">
          <select 
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="language-selector"
            disabled={readOnly}
          >
            {languageOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          
          {!readOnly && (
            <button 
              className={`save-button ${isSaving ? 'saving' : ''}`}
              onClick={handleSave}
              disabled={isSaving}
            >
              {isSaving ? 'Saving...' : 'Save Code'}
            </button>
          )}
        </div>
      </div>

      {message && (
        <div className={`editor-message ${message.type}`}>
          {message.text}
        </div>
      )}

      <div className="editor-wrapper">
        <textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="Write your code here..."
          className="code-editor"
          spellCheck="false"
          readOnly={readOnly}
        />
      </div>
    </div>
  );
};

export default SimpleEditor;