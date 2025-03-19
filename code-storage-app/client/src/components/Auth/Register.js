import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import authService from '../../services/authService';

const Register = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [otp, setOtp] = useState('');
    const [isOtpSent, setIsOtpSent] = useState(false);
    const history = useHistory();

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            await authService.register({ email, password });
            setIsOtpSent(true);
        } catch (error) {
            console.error('Registration error:', error);
        }
    };

    const handleVerifyOtp = async (e) => {
        e.preventDefault();
        try {
            await authService.verifyOtp({ email, otp });
            history.push('/login');
        } catch (error) {
            console.error('OTP verification error:', error);
        }
    };

    return (
        <div>
            <h2>Register</h2>
            <form onSubmit={isOtpSent ? handleVerifyOtp : handleRegister}>
                <div>
                    <label>Email:</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Password:</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                {isOtpSent && (
                    <div>
                        <label>OTP:</label>
                        <input
                            type="text"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            required
                        />
                    </div>
                )}
                <button type="submit">
                    {isOtpSent ? 'Verify OTP' : 'Register'}
                </button>
            </form>
        </div>
    );
};

export default Register;