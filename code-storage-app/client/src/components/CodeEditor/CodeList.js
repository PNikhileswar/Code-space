import React from 'react';

const CodeList = ({ codes, onSelect }) => {
    return (
        <div>
            <h2>Saved Codes</h2>
            <ul>
                {codes.map((code, index) => (
                    <li key={index} onClick={() => onSelect(code)}>
                        {code.title}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default CodeList;