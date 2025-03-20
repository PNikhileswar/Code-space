import React from 'react';
import { Navigate } from 'react-router-dom';

const PublicRoute = ({ component: Component }) => {
  const isAuthenticated = !!localStorage.getItem('token');
  
  if (isAuthenticated) {
    // If user is already authenticated, redirect to the editor page
    return <Navigate to="/editor" replace />;
  }
  
  // Otherwise, render the requested public component
  return <Component />;
};

export default PublicRoute;
