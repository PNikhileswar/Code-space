import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './WorkspaceSetup.css';

const WorkspaceSetup = () => {
    const [preferences, setPreferences] = useState({
        defaultPrivacy: 'private',
        useSecretKey: false,
        secretKey: '',
        theme: 'light',
    });
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setPreferences(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        // Save preferences to backend
        navigate('/editor');
    };

    return (
        <div className="setup-container">
            <div className="setup-card">
                <h2>Setup Your Workspace</h2>
                <p className="setup-description">
                    Customize your coding environment to get started
                </p>

                <form onSubmit={handleSubmit} className="setup-form">
                    <div className="form-group">
                        <label>Default Privacy</label>
                        <select
                            name="defaultPrivacy"
                            value={preferences.defaultPrivacy}
                            onChange={handleChange}
                            className="form-select"
                        >
                            <option value="private">Private</option>
                            <option value="public">Public</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label className="checkbox-label">
                            <input
                                type="checkbox"
                                name="useSecretKey"
                                checked={preferences.useSecretKey}
                                onChange={handleChange}
                            />
                            Enable Secret Key Protection
                        </label>
                    </div>

                    {preferences.useSecretKey && (
                        <div className="form-group">
                            <label>Secret Key</label>
                            <input
                                type="password"
                                name="secretKey"
                                value={preferences.secretKey}
                                onChange={handleChange}
                                className="form-input"
                                placeholder="Enter a secret key for your private codes"
                            />
                        </div>
                    )}

                    <div className="form-group">
                        <label>Theme</label>
                        <select
                            name="theme"
                            value={preferences.theme}
                            onChange={handleChange}
                            className="form-select"
                        >
                            <option value="light">Light</option>
                            <option value="dark">Dark</option>
                            <option value="system">System Default</option>
                        </select>
                    </div>

                    <button type="submit" className="setup-button">
                        Complete Setup
                    </button>
                </form>
            </div>
        </div>
    );
};

export default WorkspaceSetup;