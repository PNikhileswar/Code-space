import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import './Header.css';

const Header = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        // Check if user is logged in
        const token = localStorage.getItem('token');
        setIsLoggedIn(!!token);
    }, [location]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        setIsLoggedIn(false);
        navigate('/login');
    };

    const closeMenu = () => {
        setMenuOpen(false);
    };

    return (
        <header className="header">
            <div className="container header-container">
                <Link to="/" className="logo">
                    <span className="logo-icon">&#60;/&#62;</span>
                    <span className="logo-text">CodeSpace</span>
                </Link>

                <div className="mobile-menu-toggle" onClick={() => setMenuOpen(!menuOpen)}>
                    <span></span>
                    <span></span>
                    <span></span>
                </div>

                <nav className={`navigation ${menuOpen ? 'open' : ''}`}>
                    <ul className="nav-links">
                        <li>
                            <Link to="/editor" className="nav-link" onClick={closeMenu}>
                                <svg className="nav-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M9 22H15C20 22 22 20 22 15V9C22 4 20 2 15 2H9C4 2 2 4 2 9V15C2 20 4 22 9 22Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                    <path d="M9 9.51L12 6.51L15 9.51" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                    <path d="M12 6.51V14.51" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                    <path d="M6 16.51C9.89 17.81 14.11 17.81 18 16.51" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                                Editor
                            </Link>
                        </li>
                        
                        <li>
                            <Link to="/explore" className="nav-link" onClick={closeMenu}>
                                <svg className="nav-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                    <path d="M8.5 12L10.5 14L15.5 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                                Explore
                            </Link>
                        </li>
                        
                        {isLoggedIn && (
                        <li>
                            <Link to="/codes" className="nav-link" onClick={closeMenu}>
                                <svg className="nav-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M19 4C20.1046 4 21 4.89543 21 6V19C21 20.1046 20.1046 21 19 21H5C3.89543 21 3 20.1046 3 19V6C3 4.89543 3.89543 4 5 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                                    <path d="M9 10.5H15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                                    <path d="M9 14.5H15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                                </svg>
                                My Codes
                            </Link>
                        </li>
                        )}
                    </ul>

                    <div className="auth-buttons">
                        {isLoggedIn ? (
                            <>
                                <button onClick={handleLogout} className="btn btn-outline logout-btn">
                                    Logout
                                </button>
                            </>
                        ) : (
                            <>
                                <Link to="/login" className="btn btn-outline" onClick={closeMenu}>
                                    Sign In
                                </Link>
                                <Link to="/register" className="btn btn-primary" onClick={closeMenu}>
                                    Get Started
                                </Link>
                            </>
                        )}
                    </div>
                </nav>
            </div>
        </header>
    );
};

export default Header;