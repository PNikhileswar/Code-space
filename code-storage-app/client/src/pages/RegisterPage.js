import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { register, verifyOTP } from '../services/authService';
import './RegisterPage.css';

const RegisterPage = () => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    otp: ''
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Password validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      // Step 1: Initial registration
      await register({
        email: formData.email,
        password: formData.password
      });
      
      // Move to OTP verification step instead of navigating away
      setStep(2);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      // Step 2: Verify OTP
      const response = await verifyOTP({
        email: formData.email,
        otp: formData.otp
      });
      
      // Save token and navigate to editor on success
      localStorage.setItem('token', response.token);
      navigate('/editor');
    } catch (err) {
      setError(err.response?.data?.message || 'OTP verification failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <h1>{step === 1 ? 'Create Your Account' : 'Verify Your Email'}</h1>
          <p>
            {step === 1 
              ? 'Join CodeSpace to store and share your code snippets' 
              : `We've sent a verification code to ${formData.email}`}
          </p>
        </div>

        {error && <div className="auth-error">{error}</div>}

        {step === 1 ? (
          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="form-control"
                placeholder="you@example.com"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="form-control"
                placeholder="••••••••"
                minLength="6"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="form-control"
                placeholder="••••••••"
                minLength="6"
                required
              />
            </div>

            <button 
              type="submit" 
              className="btn btn-primary btn-block"
              disabled={loading}
            >
              {loading ? 'Processing...' : 'Create Free Account'}
            </button>

            <div className="auth-links">
              <p>
                Already have an account? <Link to="/login">Log In</Link>
              </p>
            </div>
          </form>
        ) : (
          <form className="auth-form" onSubmit={handleVerifyOTP}>
            <div className="form-group">
              <label htmlFor="otp">Verification Code</label>
              <input
                type="text"
                id="otp"
                name="otp"
                value={formData.otp}
                onChange={handleChange}
                className="form-control otp-input"
                placeholder="Enter 6-digit code"
                maxLength="6"
                autoFocus
                required
              />
            </div>

            <button 
              type="submit" 
              className="btn btn-primary btn-block"
              disabled={loading}
            >
              {loading ? 'Verifying...' : 'Verify & Continue'}
            </button>

            <div className="auth-actions">
              <button 
                type="button"
                className="btn btn-link"
                onClick={() => setStep(1)}
                disabled={loading}
              >
                Back
              </button>
              <button 
                type="button"
                className="btn btn-link"
                onClick={async () => {
                  try {
                    setLoading(true);
                    await register({
                      email: formData.email,
                      password: formData.password
                    });
                    setError('');
                    alert('New verification code sent to your email');
                  } catch (err) {
                    setError('Failed to resend verification code');
                  } finally {
                    setLoading(false);
                  }
                }}
                disabled={loading}
              >
                Resend Code
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default RegisterPage;