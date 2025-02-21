import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Container,
  TextField,
  Button,
  Box,
  MenuItem,
  Typography,
  Select,
  FormControl,
  InputLabel,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

const FacultyForm = () => {
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    department: "",
    email: "",
    phone_number: "",
    username: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [departments, setDepartments] = useState([]);
  const navigate = useNavigate();

  // Fetch departments on component mount
  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8000/get-department/"
        );
        setDepartments(response.data);
      } catch (error) {
        console.error("Error fetching departments:", error);
      }
    };

    fetchDepartments();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Register the faculty as a user first
      const registerResponse = await axios.post(
        "http://localhost:8000/register/",
        {
          first_name: formData.first_name,
          last_name: formData.last_name,
          email: formData.email,
          username: formData.username,
          password: formData.password,
          role: "teacher",
        }
      );

      if (registerResponse.status === 201) {
        // After successful registration, add the faculty details
        await axios.post("http://localhost:8000/add-faculty/", {
          name: `${formData.first_name} ${formData.last_name}`.trim(),
          department: formData.department,
          email: formData.email,
          phone_number: formData.phone_number,
          username: formData.username,
        });

        alert("Faculty member created successfully.");
        setFormData({
          first_name: "",
          last_name: "",
          department: "",
          email: "",
          phone_number: "",
          username: "",
          password: "",
        });

        navigate("/manage-faculties");
        setErrors({});
      }
    } catch (error) {
      if (error.response && error.response.data) {
        setErrors(error.response.data);
      } else {
        alert("An error occurred. Please try again.");
      }
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 5 }}>
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          p: 3,
          border: "1px solid #ccc",
          borderRadius: "8px",
        }}
      >
        <Typography variant="h4" align="center" gutterBottom>
          Add Faculty Member
        </Typography>

        {/* First Name Input */}
        <TextField
          fullWidth
          label="First Name"
          name="first_name"
          value={formData.first_name}
          onChange={handleChange}
          error={!!errors.first_name}
          helperText={errors.first_name}
          margin="normal"
        />

        {/* Last Name Input */}
        <TextField
          fullWidth
          label="Last Name"
          name="last_name"
          value={formData.last_name}
          onChange={handleChange}
          error={!!errors.last_name}
          helperText={errors.last_name}
          margin="normal"
        />

        {/* Department Dropdown */}
        <FormControl fullWidth margin="normal" error={!!errors.department}>
          <InputLabel id="department-label">Department</InputLabel>
          <Select
            labelId="department-label"
            label="Department"
            name="department"
            value={formData.department}
            onChange={handleChange}
          >
            <MenuItem value="">
              <em>Select Department</em>
            </MenuItem>
            {departments.map((dept) => (
              <MenuItem key={dept.dept_id} value={dept.dept_name}>
                {dept.dept_name}
              </MenuItem>
            ))}
          </Select>
          {errors.department && (
            <Typography variant="caption" color="error">
              {errors.department}
            </Typography>
          )}
        </FormControl>

        {/* Email Input */}
        <TextField
          fullWidth
          label="Email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          error={!!errors.email}
          helperText={errors.email}
          margin="normal"
          placeholder="abc@gmail.com"
        />

        {/* Phone Number Input */}
        <TextField
          fullWidth
          label="Phone Number"
          name="phone_number"
          value={formData.phone_number}
          onChange={handleChange}
          error={!!errors.phone_number}
          helperText={errors.phone_number}
          margin="normal"
        />

        {/* Username Input */}
        <TextField
          fullWidth
          label="Username"
          name="username"
          value={formData.username}
          onChange={handleChange}
          error={!!errors.username}
          helperText={errors.username}
          margin="normal"
        />

        {/* Password Input */}
        <TextField
          fullWidth
          label="Password"
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          error={!!errors.password}
          helperText={errors.password}
          margin="normal"
        />

        {/* Buttons */}
        <Box display="flex" justifyContent="space-between" sx={{ mt: 2 }}>
          <Button
            variant="outlined"
            color="secondary"
            onClick={() => navigate("/manage-faculties")}
          >
            Back
          </Button>
          <Button variant="contained" type="submit">
            Submit
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default FacultyForm;
