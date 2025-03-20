import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getUserCodes, deleteCode } from '../services/codeService';
import { isAuthenticated } from '../services/authService';
import './MyCodesPage.css';

const MyCodesPage = () => {
  const [codes, setCodes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');
  const [deleteStatus, setDeleteStatus] = useState(null);

  useEffect(() => {
    if (!isAuthenticated()) {
      setError('You need to be logged in to view your codes');
      setLoading(false);
    } else {
      fetchUserCodes();
    }
  }, []);

  const fetchUserCodes = async () => {
    try {
      setLoading(true);
      
      // Check if token exists and log it
      const token = localStorage.getItem('token');
      console.log("Token exists:", !!token);
      
      if (!token) {
        setError('You need to be logged in to view your codes');
        return;
      }
      
      const data = await getUserCodes();
      console.log("User codes received:", data);
      setCodes(data);
      setError(null);
    } catch (err) {
      console.error("Error details:", err);
      
      if (err.response?.status === 401) {
        setError('You need to be logged in to view your codes. Your session may have expired.');
        // Clear token if it's invalid
        localStorage.removeItem('token');
      } else {
        setError('Failed to load your codes. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const filteredCodes = filter === 'all' 
    ? codes 
    : codes.filter(code => code.language === filter);

  const handleFilterChange = (e) => {
    setFilter(e.target.value);
  };

  const handleDeleteCode = async (id, title) => {
    // Show confirmation dialog
    const confirmDelete = window.confirm(
      `Are you sure you want to delete "${title || 'Untitled Code'}"? This action cannot be undone.`
    );
    
    if (!confirmDelete) return;
    
    try {
      setDeleteStatus({ id, status: 'deleting' });
      await deleteCode(id);
      
      // Remove the deleted code from state
      setCodes(prevCodes => prevCodes.filter(code => code._id !== id));
      
      setDeleteStatus({ id, status: 'success' });
      
      // Clear status after 3 seconds
      setTimeout(() => {
        setDeleteStatus(null);
      }, 3000);
      
    } catch (err) {
      console.error('Failed to delete code:', err);
      setDeleteStatus({ id, status: 'error' });
      
      // Clear error status after 3 seconds
      setTimeout(() => {
        setDeleteStatus(null);
      }, 3000);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading your code snippets...</p>
      </div>
    );
  }

  return (
    <div className="mycodes-container">
      <div className="mycodes-header">
        <div>
          <h1>My Code Snippets</h1>
          <p>Manage and access all your saved code snippets</p>
        </div>
        
        <Link to="/editor" className="btn btn-primary">
          Create New Snippet
        </Link>
      </div>
      
      {deleteStatus?.status === 'success' && (
        <div className="status-message success">
          Code snippet deleted successfully!
        </div>
      )}
      
      {deleteStatus?.status === 'error' && (
        <div className="status-message error">
          Failed to delete code snippet. Please try again.
        </div>
      )}
      
      <div className="mycodes-toolbar">
        <div className="filter-group">
          <label>Filter by language:</label>
          <select 
            value={filter} 
            onChange={handleFilterChange}
            className="filter-select dark"
          >
            <option value="all">All Languages</option>
            <option value="javascript">JavaScript</option>
            <option value="python">Python</option>
            <option value="html">HTML</option>
            <option value="css">CSS</option>
            <option value="java">Java</option>
            <option value="csharp">C#</option>
          </select>
        </div>
        
        <div className="code-count">
          {filteredCodes.length} {filteredCodes.length === 1 ? 'snippet' : 'snippets'}
        </div>
      </div>
      
      {error && (
        <div className="error-message">
          <p>{error}</p>
          {error.includes('logged in') && (
            <Link to="/login" className="btn btn-primary">
              Log In
            </Link>
          )}
          {!error.includes('logged in') && (
            <button 
              onClick={() => fetchUserCodes()}
              className="btn btn-primary"
            >
              Try Again
            </button>
          )}
        </div>
      )}
      
      <div className="code-list">
        {filteredCodes.length === 0 ? (
          <div className="no-codes">
            <p>You haven't created any code snippets yet.</p>
            <Link to="/editor" className="btn btn-primary">
              Create Your First Snippet
            </Link>
          </div>
        ) : (
          filteredCodes.map(code => (
            <div 
              key={code._id} 
              className={`code-item ${deleteStatus?.id === code._id && deleteStatus?.status === 'deleting' ? 'deleting' : ''}`}
            >
              <div className="code-item-main">
                <div className="code-item-header">
                  <h2>{code.title || 'Untitled Code'}</h2>
                  <span className="code-badge">{code.language}</span>
                </div>
                
                <div className="code-item-preview">
                  <pre>{code.code.length > 100 ? code.code.substring(0, 100) + '...' : code.code}</pre>
                </div>
              </div>
              
              <div className="code-item-meta">
                <div className="code-info">
                  <span className="code-date">{new Date(code.createdAt).toLocaleDateString()}</span>
                  <span className={`code-visibility ${code.public ? 'public' : 'private'}`}>
                    {code.public ? 'Public' : 'Private'}
                  </span>
                  {code.isProtected && <span className="code-protected">🔒 Protected</span>}
                </div>
                
                <div className="code-actions">
                  <Link to={`/view/${code._id}`} className="btn btn-icon" title="View">
                    <span>👁️</span>
                  </Link>
                  <Link to={`/editor/${code._id}`} className="btn btn-icon" title="Edit">
                    <span>✏️</span>
                  </Link>
                  <button 
                    className="btn btn-icon delete-btn" 
                    title="Delete"
                    onClick={() => handleDeleteCode(code._id, code.title)}
                    disabled={deleteStatus?.id === code._id && deleteStatus?.status === 'deleting'}
                  >
                    {deleteStatus?.id === code._id && deleteStatus?.status === 'deleting' ? (
                      <span className="status-icon-delete">⌛</span>
                    ) : (
                      <span>🗑️</span>
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default MyCodesPage;