import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { CodeProvider } from './context/CodeContext';
import Header from './components/Layout/Header';
import Footer from './components/Layout/Footer';

// Pages
import HomePage from './pages/HomePage';
import EditorPage from './pages/EditorPage';
import ViewCodePage from './pages/ViewCodePage';
import ExplorePage from './pages/ExplorePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import MyCodesPage from './pages/MyCodesPage';
import { isAuthenticated } from './services/authService';

// Styles
import './styles/global.css';

/**
 * Private Route Component - Redirects to login if not authenticated
 */
const PrivateRoute = ({ children }) => {
  return isAuthenticated() ? children : <Navigate to="/login" />;
};

/**
 * Public Route Component - Optionally redirects to editor if logged in
 */
const PublicRoute = ({ children, redirect = true }) => {
  return (!isAuthenticated() || !redirect) ? children : <Navigate to="/editor" />;
};

function App() {
  return (
    <CodeProvider>
      <BrowserRouter>
        <div className="app">
          <Header />
          <main className="main-content">
            <Routes>
              {/* Home Page - Always accessible */}
              <Route path="/" element={<PublicRoute redirect={false}><HomePage /></PublicRoute>} />
              
              {/* Authentication Routes */}
              <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
              <Route path="/register" element={<PublicRoute><RegisterPage /></PublicRoute>} />
              
              {/* Explore Page - Accessible to everyone */}
              <Route path="/explore" element={<ExplorePage />} />
              
              {/* Code Editor - Accessible to everyone but with different features */}
              <Route path="/editor" element={<EditorPage />} />
              <Route path="/editor/:id" element={<EditorPage />} />
              
              {/* View Code - Accessible to everyone */}
              <Route path="/view/:id" element={<ViewCodePage />} />
              
              {/* My Saved Codes - Only for authenticated users */}
              <Route path="/codes" element={<PrivateRoute><MyCodesPage /></PrivateRoute>} />
              
              {/* Fallback Route */}
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </BrowserRouter>
    </CodeProvider>
  );
}

export default App;