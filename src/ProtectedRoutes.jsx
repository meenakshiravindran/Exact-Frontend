import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ element, allowedRoles }) => {
  const accessToken = localStorage.getItem('access_token');
  const role = localStorage.getItem('role');  // Assuming you store the role in localStorage after login

  // If the user is not authenticated, redirect to the login page
  if (!accessToken) {
    return <Navigate to="/login" />;
  }

  // If the user is authenticated but does not have the required role, redirect to the home page (or any other page)
  if (allowedRoles && !allowedRoles.includes(role)) {
    return <Navigate to="/" />;
  }

  return element;  // If all checks pass, render the protected route
};

export default ProtectedRoute;
