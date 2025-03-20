import React from 'react';
import { useLocation } from 'react-router-dom';
import PublicEditor from '../components/CodeEditor/PublicEditor';

const PublicEditorPage = () => {
  const location = useLocation();
  const initialTitle = location.state?.initialTitle || '';

  return (
    <div className="editor-page">
      <div className="editor-header">
        <h1>Code Editor</h1>
        <p className="editor-description">
          Create and share code snippets - no account required
        </p>
      </div>
      <PublicEditor initialTitle={initialTitle} />
    </div>
  );
};

export default PublicEditorPage;