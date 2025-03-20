import React from 'react';
import { Link } from 'react-router-dom';
import './HomePage.css';

const HomePage = () => {
  return (
    <div className="home-container">
      <section className="hero">
        <div className="hero-content">
          <h1 className="hero-title">Store & Share Code <span className="gradient-text">Snippets</span></h1>
          <p className="hero-subtitle">
            A simple platform for storing, organizing and sharing your code snippets with others
          </p>
          <div className="hero-buttons">
            <Link to="/editor" className="btn btn-primary">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="16 18 22 12 16 6"></polyline>
                <polyline points="8 6 2 12 8 18"></polyline>
              </svg>
              Start Coding
            </Link>
            <Link to="/register" className="btn btn-secondary">Create Account</Link>
          </div>
        </div>
        <div className="hero-image">
          <div className="code-preview">
            <div className="code-header">
              <span className="code-title">Example.js</span>
              <div className="code-dots">
                <span className="dot red"></span>
                <span className="dot yellow"></span>
                <span className="dot green"></span>
              </div>
            </div>
            <pre className="code-snippet">
              <code>{`function greet() {
  const message = "Hello, World!";
  console.log(message);
}

// Call the function
greet();`}</code>
            </pre>
          </div>
        </div>
      </section>

      <section className="features">
        <h2 className="section-title">Simple & <span className="gradient-text">Powerful</span></h2>
        
        <div className="feature-cards">
          <div className="feature-card">
            <div className="feature-icon">📝</div>
            <h3>Easy Editing</h3>
            <p>Simple code editor that's perfect for beginners and quick snippet storage</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">🔒</div>
            <h3>Private Snippets</h3>
            <p>Keep your code private or share it with others - you control your content</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">🚀</div>
            <h3>Quick Access</h3>
            <p>All your code snippets are organized and accessible from anywhere</p>
          </div>
        </div>
      </section>

      <section className="cta">
        <h2>Start Coding Now</h2>
        <p>Join thousands of developers who use CodeSpace to store and share their code</p>
        <Link to="/register" className="btn btn-primary">Create Free Account</Link>
      </section>
    </div>
  );
};

export default HomePage;