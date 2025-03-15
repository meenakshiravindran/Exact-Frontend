import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ element, allowedRoles }) => {
  const accessToken = localStorage.getItem('access_token');
  const role = localStorage.getItem('role');  // Assuming you store the role in localStorage after login
  useEffect(() => {
    const handleStorageChange = (event) => {
      if (event.key === "access_token" && event.key === "role") {
        // If the role/token changes in another tab, reload the page or logout
        window.location.reload();
      }
    };
  
    window.addEventListener("storage", handleStorageChange);
    
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

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
