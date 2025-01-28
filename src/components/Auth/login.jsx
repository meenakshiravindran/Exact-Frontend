import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Box, Button, TextField, Typography, Card, CardContent } from '@mui/material';

export const Login = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);

    const user = { username, password };

    try {
      const { data } = await axios.post('http://localhost:8000/token/', user, {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true,
      });

      localStorage.clear();
      localStorage.setItem('access_token', data.access);
      localStorage.setItem('refresh_token', data.refresh);

      const accessToken = data.access;
      const profileResponse = await axios.get('http://localhost:8000/user-profile/', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      localStorage.setItem('username', profileResponse.data.username);
      localStorage.setItem('role', profileResponse.data.role);
      localStorage.setItem('full_name', profileResponse.data.full_name);

      axios.defaults.headers.common['Authorization'] = `Bearer ${data.access}`;

      navigate('/');
    } catch (error) {
      console.error('Error during login:', error);
      setError('Invalid username or password. Please try again.');
    }
  };

  return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
      <Card sx={{ maxWidth: 400, width: '100%', padding: 4 }}>
        <CardContent>
          <Typography variant="h5" component="div" align="center" gutterBottom>
            Sign In
          </Typography>
          {error && (
            <Box mb={2}>
              <Typography variant="body1" color="error" align="center">
                {error}
              </Typography>
            </Box>
          )}
          <form onSubmit={handleLogin}>
            <Box mb={2}>
              <TextField
                id="username"
                label="Username"
                variant="outlined"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                fullWidth
              />
            </Box>
            <Box mb={2}>
              <TextField
                id="password"
                label="Password"
                type="password"
                variant="outlined"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                fullWidth
              />
            </Box>
            <Box mb={2}>
              <Button type="submit" variant="contained" color="primary" fullWidth>
                Sign In
              </Button>
            </Box>
          </form>
          <Box textAlign="center">
            <Typography variant="body1">
              Don't have an account?{' '}
              <Link to="/register" style={{ color: '#1976d2' }}>
                Register here
              </Link>
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};