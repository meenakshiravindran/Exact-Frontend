import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
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
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";

export const Login = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [openDialog, setOpenDialog] = useState(false); // Dialog state
  const [formData, setFormData] = useState({ new_username: "", new_password: "" });

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const { data } = await axios.post("http://localhost:8000/token/", { username, password });

      localStorage.setItem("access_token", data.access);
      localStorage.setItem("refresh_token", data.refresh);
      localStorage.setItem("username", data.username);
      localStorage.setItem("role", data.role);
      localStorage.setItem("full_name", data.full_name);

      axios.defaults.headers.common["Authorization"] = `Bearer ${data.access}`;

      // If it's the user's first login, show the reset credentials dialog
      if (data.is_first_login && data.role=="teacher") {
        setOpenDialog(true);
      } else {
        navigate("/");
      }
    } catch (error) {
      setError("Invalid username or password. Please try again.");
    }
  };

  // Handle input changes in the reset credentials dialog
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle Reset Credentials submission
  const handleResetSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("access_token");
      await axios.post(
        "http://localhost:8000/reset-credentials/",
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert("Credentials updated successfully. Please log in with your new credentials.");
      setOpenDialog(false);
      localStorage.clear(); 
      navigate("/login");
    } catch (err) {
      setError("Error updating credentials. Please try again.");
    }
  };

  return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
      <Card
        sx={{
          minWidth: { md: "600px", sm: "400px" },
          width: "100%",
          padding: "1.5rem",
          margin: "2rem auto",
          boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
          borderRadius: "8px",
        }}
      >
        <CardHeader
          title={
            <Typography variant="h5" fontWeight="bold" sx={{ marginBottom: 1 }}>
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
            {error && <Alert severity="error" sx={{ marginBottom: 2 }}>{error}</Alert>}
            <Typography variant="subtitle2" fontWeight="bold" gutterBottom>Username</Typography>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              sx={{ marginBottom: 2 }}
            />
            <Typography variant="subtitle2" fontWeight="bold" gutterBottom>Password</Typography>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Enter your password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <Button type="submit" fullWidth variant="contained" sx={{ marginTop: 3, padding: "10px 0" }}>
              Sign In
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Reset Credentials Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Reset Credentials</DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ marginBottom: 2 }}>
            This is your first login. Please update your username and password.
          </Typography>
          <TextField
            fullWidth
            label="New Username"
            name="new_username"
            onChange={handleChange}
            required
            sx={{ marginBottom: 2 }}
          />
          <TextField
            fullWidth
            type="password"
            label="New Password"
            name="new_password"
            onChange={handleChange}
            required
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)} color="secondary">Cancel</Button>
          <Button onClick={handleResetSubmit} variant="contained">Update</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
