import React, { useState } from 'react';
import axios from 'axios';

const VerifyOTP = () => {
    const [otp, setOtp] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('/api/auth/verify-otp', { otp });
            setMessage(response.data.message);
        } catch (error) {
            setMessage('OTP verification failed. Please try again.');
        }
    };

    return (
        <div>
            <h2>Verify OTP</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    placeholder="Enter OTP"
                    required
                />
                <button type="submit">Verify</button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
};

export default VerifyOTP;