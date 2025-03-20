import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getPublicCodes } from '../services/codeService';
import './BrowsePage.css';

const BrowsePage = () => {
  const [codes, setCodes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchCodes = async () => {
      try {
        setLoading(true);
        const data = await getPublicCodes();
        setCodes(data);
        setError(null);
      } catch (err) {
        setError('Failed to load public codes');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCodes();
  }, []);

  // Filter and sort codes
  const filteredCodes = codes
    .filter(code => {
      // Apply language filter
      if (filter !== 'all' && code.language !== filter) {
        return false;
      }
      
      // Apply search
      if (searchTerm.trim() !== '') {
        const search = searchTerm.toLowerCase();
        return (
          code.title?.toLowerCase().includes(search) ||
          code.code?.toLowerCase().includes(search) ||
          code.language?.toLowerCase().includes(search)
        );
      }
      
      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'newest') {
        return new Date(b.createdAt) - new Date(a.createdAt);
      } else if (sortBy === 'oldest') {
        return new Date(a.createdAt) - new Date(b.createdAt);
      } else if (sortBy === 'title') {
        return (a.title || '').localeCompare(b.title || '');
      }
      return 0;
    });

  return (
    <div className="browse-container">
      <div className="browse-header">
        <h1>Browse Code Snippets</h1>
        <p>Explore all public code snippets shared by the community</p>
        
        <div className="search-bar">
          <input 
            type="text" 
            placeholder="Search snippets..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <svg className="search-icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
        </div>
      </div>
      
      <div className="browse-toolbar">
        <div className="filter-group">
          <label>Language:</label>
          <select 
            value={filter} 
            onChange={(e) => setFilter(e.target.value)}
            className="filter-select"
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
        
        <div className="sort-group">
          <label>Sort by:</label>
          <select 
            value={sortBy} 
            onChange={(e) => setSortBy(e.target.value)}
            className="filter-select"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="title">Title (A-Z)</option>
          </select>
        </div>
        
        <div className="browse-count">
          {filteredCodes.length} {filteredCodes.length === 1 ? 'snippet' : 'snippets'}
        </div>
      </div>
      
      {loading && (
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading snippets...</p>
        </div>
      )}
      
      {error && !loading && (
        <div className="error-card">
          <p>{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="btn btn-primary"
          >
            Try Again
          </button>
        </div>
      )}
      
      {!loading && !error && filteredCodes.length === 0 && (
        <div className="empty-state">
          <div className="empty-icon">📝</div>
          <h2>No snippets found</h2>
          <p>No code snippets match your current filters</p>
          {searchTerm && (
            <button 
              onClick={() => setSearchTerm('')}
              className="btn btn-secondary"
            >
              Clear Search
            </button>
          )}
        </div>
      )}
      
      <div className="snippet-grid">
        {filteredCodes.map(code => (
          <div key={code._id} className="snippet-card">
            <div className="snippet-header">
              <h2 className="snippet-title">{code.title || 'Untitled Code'}</h2>
              <div className="snippet-language">{code.language}</div>
            </div>
            
            <div className="snippet-preview">
              <pre>{code.code.length > 200 ? code.code.substring(0, 200) + '...' : code.code}</pre>
            </div>
            
            <div className="snippet-footer">
              <div className="snippet-meta">
                <span className="snippet-date">
                  {new Date(code.createdAt).toLocaleDateString()}
                </span>
                {code.isProtected && (
                  <span className="snippet-protected">🔒 Protected</span>
                )}
              </div>
              <Link to={`/view/${code._id}`} className="btn btn-sm">
                View Code
              </Link>
            </div>
          </div>
        ))}
      </div>
      
      <div className="browse-actions">
        <Link to="/editor/public" className="btn btn-lg">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
          Create New Snippet
        </Link>
      </div>
    </div>
  );
};

export default BrowsePage;