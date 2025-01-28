import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Box,
  Button,
  TextField,
  Typography,
  Card,
  CardContent,
  CardHeader,
  Alert,
} from "@mui/material";

export const Login = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);

    const user = { username, password };

    try {
      const { data } = await axios.post("http://localhost:8000/token/", user, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });

      localStorage.clear();
      localStorage.setItem("access_token", data.access);
      localStorage.setItem("refresh_token", data.refresh);

      const accessToken = data.access;
      const profileResponse = await axios.get(
        "http://localhost:8000/user-profile/",
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      localStorage.setItem("username", profileResponse.data.username);
      localStorage.setItem("role", profileResponse.data.role);
      localStorage.setItem("full_name", profileResponse.data.full_name);

      axios.defaults.headers.common["Authorization"] = `Bearer ${data.access}`;

      navigate("/");
    } catch (error) {
      console.error("Error during login:", error);
      setError("Invalid username or password. Please try again.");
    }
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
    >
      <Card
        sx={{
          minWidth: {md:"600px",sm:"400px"},
          width:"100%",
          padding: "1.5rem",
          margin: "2rem auto",
          boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
          borderRadius: "8px",
        }}
      >
        <CardHeader
          title={
            <Typography variant="h5" fontWeight="bold" sx={{marginBottom:1}}>
              Sign In
            </Typography>
          }
          subheader={
            <Typography variant="body2" color="text.secondary">
              Enter your credentials to access your account
            </Typography>
          }
        />
        <CardContent sx={{ paddingTop: 0 }}>
          <form onSubmit={handleLogin}>
            {error && (
              <Alert severity="error" sx={{ marginBottom: 2 }}>
                {error}
              </Alert>
            )}
            <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
              Username
            </Typography>
            <TextField
              fullWidth
              variant="outlined"
              // label="Username"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              sx={{ marginBottom: 2 }}
            />
            <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
              Password
            </Typography>
            <TextField
              fullWidth
              variant="outlined"
              // label="Password"
              placeholder="Enter your password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{
                marginTop: 3,
                padding: "10px 0",
              }}
            >
              Sign In
            </Button>
          </form>
          {/* <Typography
            variant="body2"
            color="text.secondary"
            sx={{ textAlign: "left", marginTop: 2 }}
          >
            Don't have an account?{" "}
            <Typography onClick={setIsRegister(true)}
            >
              Register here
            </Typography>
          </Typography> */}
        </CardContent>
      </Card>
    </Box>
  );
};
