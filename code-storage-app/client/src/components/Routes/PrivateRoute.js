import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ component: Component }) => {
  const isAuthenticated = !!localStorage.getItem('token');
  
  if (!isAuthenticated) {
    // If user is not authenticated, redirect to login
    return <Navigate to="/login" replace />;
  }
  
  // If authenticated, render the requested private component
  return <Component />;
};

export default PrivateRoute;