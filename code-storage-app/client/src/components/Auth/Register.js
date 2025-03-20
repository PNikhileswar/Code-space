import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { register, verifyOTP, resendOTP } from '../../services/authService';
import './Register.css';

const Register = () => {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        confirmPassword: '',
        otp: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            setLoading(false);
            return;
        }

        try {
            await register({ 
                email: formData.email, 
                password: formData.password 
            });
            setStep(2);
        } catch (error) {
            setError(error.response?.data?.message || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOtp = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        
        try {
            const response = await verifyOTP({ 
                email: formData.email, 
                otp: formData.otp 
            });
            localStorage.setItem('token', response.token);
            navigate('/dashboard');
        } catch (error) {
            setError(error.response?.data?.message || 'OTP verification failed');
        } finally {
            setLoading(false);
        }
    };

    const handleResendOtp = async () => {
        setError('');
        setLoading(true);
        
        try {
            await resendOTP({ email: formData.email });
            alert('New verification code sent to your email');
        } catch (error) {
            setError(error.response?.data?.message || 'Failed to resend verification code');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="register-container">
            <div className="register-card">
                <div className="register-header">
                    <h2>{step === 1 ? 'Create Account' : 'Verify Your Email'}</h2>
                    <div className="stepper">
                        <div className={`step ${step >= 1 ? 'active' : ''}`}>1</div>
                        <div className="step-line"></div>
                        <div className={`step ${step >= 2 ? 'active' : ''}`}>2</div>
                    </div>
                </div>

                {error && <div className="error-message">{error}</div>}

                {step === 1 ? (
                    <form onSubmit={handleRegister} className="register-form">
                        <div className="form-group">
                            <label>Email</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                className="form-input"
                                placeholder="you@example.com"
                            />
                        </div>
                        <div className="form-group">
                            <label>Password</label>
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                                className="form-input"
                                placeholder="••••••••"
                                minLength="6"
                            />
                        </div>
                        <div className="form-group">
                            <label>Confirm Password</label>
                            <input
                                type="password"
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                required
                                className="form-input"
                                placeholder="••••••••"
                            />
                        </div>
                        <button 
                            type="submit" 
                            className="submit-button"
                            disabled={loading}
                        >
                            {loading ? 'Processing...' : 'Continue'}
                        </button>
                    </form>
                ) : (
                    <form onSubmit={handleVerifyOtp} className="register-form">
                        <div className="verification-message">
                            We've sent a verification code to <strong>{formData.email}</strong>.
                        </div>
                        <div className="form-group">
                            <label>Enter Verification Code</label>
                            <input
                                type="text"
                                name="otp"
                                value={formData.otp}
                                onChange={handleChange}
                                required
                                className="form-input otp-input"
                                placeholder="Enter 6-digit code"
                                maxLength="6"
                                autoFocus
                            />
                        </div>
                        <button 
                            type="submit" 
                            className="submit-button"
                            disabled={loading}
                        >
                            {loading ? 'Verifying...' : 'Complete Registration'}
                        </button>
                        <div className="form-actions">
                            <button
                                type="button"
                                className="back-button"
                                onClick={() => setStep(1)}
                                disabled={loading}
                            >
                                Back
                            </button>
                            <button 
                                type="button"
                                className="resend-button"
                                onClick={handleResendOtp}
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

export default Register;