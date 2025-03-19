import React, { useState } from 'react';

const Editor = () => {
    const [code, setCode] = useState('');

    const handleChange = (event) => {
        setCode(event.target.value);
    };

    const handleSave = () => {
        // Logic to save the code
        console.log('Code saved:', code);
    };

    return (
        <div>
            <h2>Code Editor</h2>
            <textarea
                value={code}
                onChange={handleChange}
                rows="10"
                cols="50"
                placeholder="Write your code here..."
            />
            <br />
            <button onClick={handleSave}>Save Code</button>
        </div>
    );
};

export default Editor;