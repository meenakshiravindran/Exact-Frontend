import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Box, Typography } from '@mui/material'; // For layout
// import { NavBar } from './Navigation';

export const Home = () => {
  const [message, setMessage] = useState('');
  const [role, setRole] = useState('');
  
  useEffect(() => {
    const accessToken = localStorage.getItem('access_token');

    if (!accessToken) {
      window.location.href = '/login'; // Redirect to login page if no access token
    } else {
      // Fetch home message or greeting
      (async () => {
        try {
          const { data } = await axios.get('http://localhost:8000/user-profile/', {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${accessToken}`,
            },
          });
          setMessage(`Hi ${data.full_name}`); // Display the username
          setRole(data.role);
        } catch (error) {
          console.error('Error fetching home message:', error);
        }
      })();
    }
  }, []);

  return (
    <Box sx={{ display: 'flex' }}>
      
      {/* Main Content Area */}
      <Box component="main" sx={{ flexGrow: 1, padding: 3 }}>
        <div className="form-signin mt-5 text-center">
          <h3>{message}</h3> {/* Display the greeting message */}
          {role && <p>Your role is: {role}</p>} {/* Display the user's role */}
        </div>
      </Box>
    </Box>
  );
};
