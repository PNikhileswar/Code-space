import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { login } from '../../services/authService';
import './Auth.css';

const Login = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        rememberMe: false
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({ 
            ...formData, 
            [name]: type === 'checkbox' ? checked : value 
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await login({ 
                email: formData.email, 
                password: formData.password 
            });
            
            if (formData.rememberMe) {
                localStorage.setItem('rememberMe', 'true');
            }
            
            navigate('/editor');
        } catch (error) {
            setError(error.response?.data?.message || 'Login failed. Please check your credentials.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <div className="auth-header">
                    <h1>Welcome back</h1>
                    <p>Enter your credentials to access your account</p>
                </div>

                {error && <div className="auth-error">{error}</div>}

                <form className="auth-form" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input
                            id="email"
                            type="email"
                            name="email"
                            className="form-input"
                            placeholder="you@example.com"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <div className="password-header">
                            <label htmlFor="password">Password</label>
                            <Link to="/forgot-password" className="forgot-password">
                                Forgot password?
                            </Link>
                        </div>
                        <input
                            id="password"
                            type="password"
                            name="password"
                            className="form-input"
                            placeholder="••••••••"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group checkbox-group">
                        <label className="checkbox-label">
                            <input
                                type="checkbox"
                                name="rememberMe"
                                checked={formData.rememberMe}
                                onChange={handleChange}
                            />
                            Remember me
                        </label>
                    </div>

                    <button 
                        type="submit" 
                        className={`auth-button ${loading ? 'loading' : ''}`}
                        disabled={loading}
                    >
                        {loading ? 'Signing In...' : 'Sign In'}
                    </button>
                </form>

                <div className="auth-footer">
                    <p>
                        Don't have an account?{' '}
                        <Link to="/register" className="auth-link">
                            Sign up
                        </Link>
                    </p>
                </div>

                <div className="auth-divider">
                    <span>or continue with</span>
                </div>

                <div className="social-login">
                    <button className="social-button google">
                        <svg width="20" height="20" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M19.999 10.2217C20.0111 9.53428 19.9387 8.84788 19.7834 8.17737H10.2031V11.8884H15.8266C15.7201 12.5391 15.4804 13.162 15.1219 13.7195C14.7634 14.2771 14.2935 14.7578 13.7405 15.1328L13.7209 15.2571L16.7502 17.5568L16.9609 17.5774C18.8305 15.8329 19.9997 13.2661 19.9997 10.2217" fill="#4285F4"></path>
                            <path d="M10.2055 19.9999C12.9605 19.9999 15.2734 19.111 16.9629 17.5777L13.7429 15.1331C12.8813 15.7221 11.7248 16.1333 10.2055 16.1333C8.91513 16.1259 7.65991 15.7205 6.61791 14.9745C5.57592 14.2286 4.80007 13.1801 4.40044 11.9777L4.28085 11.9877L1.13101 14.3765L1.08984 14.4887C1.93817 16.1456 3.24007 17.5386 4.84997 18.5118C6.45987 19.4851 8.31429 20.0004 10.2059 19.9999" fill="#34A853"></path>
                            <path d="M4.39899 11.9777C4.1758 11.3411 4.06063 10.673 4.05807 9.99996C4.06218 9.32799 4.1731 8.66075 4.38684 8.02225L4.38115 7.88968L1.19269 5.4624L1.0884 5.51101C0.372763 6.90343 0 8.4408 0 9.99987C0 11.5589 0.372763 13.0963 1.0884 14.4887L4.39899 11.9777Z" fill="#FBBC05"></path>
                            <path d="M10.2059 3.86663C11.668 3.84438 13.0822 4.37803 14.1515 5.35558L17.0313 2.59996C15.1843 0.901848 12.7383 -0.0298855 10.2059 -3.6784e-05C8.31431 -0.000477834 6.4599 0.514732 4.85001 1.48798C3.24011 2.46124 1.9382 3.85416 1.08984 5.51101L4.38946 8.02225C4.79303 6.82005 5.57145 5.77231 6.61498 5.02675C7.65851 4.28118 8.9145 3.87541 10.2059 3.86663Z" fill="#EB4335"></path>
                        </svg>
                        Google
                    </button>
                    <button className="social-button github">
                        <svg width="20" height="20" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                            <path fillRule="evenodd" clipRule="evenodd" d="M10 0C4.477 0 0 4.484 0 10.017C0 14.442 2.865 18.197 6.839 19.521C7.339 19.613 7.521 19.304 7.521 19.038C7.521 18.801 7.513 18.17 7.508 17.35C4.726 17.947 4.139 16.018 4.139 16.018C3.685 14.858 3.029 14.553 3.029 14.553C2.121 13.933 3.098 13.945 3.098 13.945C4.101 14.02 4.629 14.971 4.629 14.971C5.521 16.5 6.97 16.068 7.541 15.812C7.631 15.166 7.889 14.733 8.175 14.492C5.955 14.251 3.62 13.381 3.62 9.524C3.62 8.429 4.01 7.532 4.649 6.831C4.546 6.578 4.203 5.55 4.747 4.167C4.747 4.167 5.587 3.899 7.495 5.198C8.3 4.977 9.15 4.864 10 4.861C10.85 4.864 11.7 4.977 12.505 5.198C14.413 3.899 15.253 4.167 15.253 4.167C15.797 5.55 15.454 6.578 15.351 6.831C15.99 7.532 16.38 8.429 16.38 9.524C16.38 13.391 14.045 14.251 11.825 14.492C12.171 14.782 12.49 15.356 12.49 16.22C12.49 17.432 12.476 18.705 12.476 19.038C12.476 19.304 12.658 19.613 13.158 19.521C17.132 18.197 20 14.442 20 10.017C20 4.484 15.523 0 10 0Z" fill="currentColor"/>
                        </svg>
                        GitHub
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Login;