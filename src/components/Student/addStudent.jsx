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

const StudentForm = () => {
  const [formData, setFormData] = useState({
    register_no: "",
    name: "",
    programme: "",
    year_of_admission: "",
    phone_number: "",
    email: "",
  });

  const [errors, setErrors] = useState({});
  const [programmes, setProgrammes] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProgrammes = async () => {
      try {
        const response = await axios.get("http://localhost:8000/get-programme/");
        setProgrammes(response.data);
      } catch (error) {
        console.error("Error fetching programmes:", error);
      }
    };
    fetchProgrammes();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:8000/add-student/", formData);
      alert("Student added successfully.");
      setFormData({
        register_no: "",
        name: "",
        programme: "",
        year_of_admission: "",
        phone_number: "",
        email: "",
      });
      navigate("/manage-students");
      setErrors({});
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
      <Box component="form" onSubmit={handleSubmit} sx={{ p: 3, border: "1px solid #ccc", borderRadius: "8px" }}>
        <Typography variant="h4" align="center" gutterBottom>
          Add Student
        </Typography>
        
        <TextField fullWidth label="Register Number" name="register_no" value={formData.register_no} onChange={handleChange} error={!!errors.register_no} helperText={errors.register_no} margin="normal" />
        
        <TextField fullWidth label="Name" name="name" value={formData.name} onChange={handleChange} error={!!errors.name} helperText={errors.name} margin="normal" />
        
        <FormControl fullWidth margin="normal" error={!!errors.programme}>
          <InputLabel id="programme-label">Programme</InputLabel>
          <Select labelId="programme-label" label="Programme" name="programme" value={formData.programme} onChange={handleChange}>
            <MenuItem value="">
              <em>Select Programme</em>
            </MenuItem>
            {programmes.map((prog) => (
              <MenuItem key={prog.programme_id} value={prog.programme_name}>
                {prog.programme_name}
              </MenuItem>
            ))}
          </Select>
          {errors.programme && <Typography variant="caption" color="error">{errors.programme}</Typography>}
        </FormControl>
        
        <TextField fullWidth label="Year of Admission" name="year_of_admission" type="number" value={formData.year_of_admission} onChange={handleChange} error={!!errors.year_of_admission} helperText={errors.year_of_admission} margin="normal" />
        
        <TextField fullWidth label="Phone Number" name="phone_number" value={formData.phone_number} onChange={handleChange} error={!!errors.phone_number} helperText={errors.phone_number} margin="normal" />
        
        <TextField fullWidth label="Email" name="email" type="email" value={formData.email} onChange={handleChange} error={!!errors.email} helperText={errors.email} margin="normal" />
        
        <Box display="flex" justifyContent="space-between" sx={{ mt: 2 }}>
          <Button variant="outlined" color="secondary" onClick={() => navigate("/manage-students")}>Back</Button>
          <Button variant="contained" type="submit">Submit</Button>
        </Box>
      </Box>
    </Container>
  );
};

export default StudentForm;
