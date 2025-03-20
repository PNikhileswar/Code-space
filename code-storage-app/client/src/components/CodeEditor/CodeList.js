import React, { useState, useEffect } from 'react';
import { getAllCodes } from '../../services/codeService';

const CodeList = () => {
    const [codes, setCodes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCodes = async () => {
            try {
                const data = await getAllCodes();
                setCodes(data);
                setLoading(false);
            } catch (err) {
                setError('Failed to fetch codes');
                setLoading(false);
            }
        };

        fetchCodes();
    }, []);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div>
            <h2>Saved Codes</h2>
            {codes.length === 0 ? (
                <p>No codes found</p>
            ) : (
                <ul>
                    {codes.map((code, index) => (
                        <li key={code._id || index}>
                            {code.title || `Code snippet ${index + 1}`}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default CodeList;