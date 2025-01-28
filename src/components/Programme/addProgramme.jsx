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

const AddProgramme = () => {
  const [formData, setFormData] = useState({
    programme_name: "",
    department: "",
    level: "",
    duration: "",
    no_of_pos: "",
  });

  const [errors, setErrors] = useState({});
  const [departments, setDepartments] = useState([]);
  const [levels, setLevels] = useState([]);
  const navigate = useNavigate();

  // Fetch departments and levels on component mount
  useEffect(() => {
    const fetchDropdownData = async () => {
      try {
        // Fetch departments
        const deptResponse = await axios.get("http://localhost:8000/get-department/");
        setDepartments(deptResponse.data);

        // Fetch levels
        const levelResponse = await axios.get("http://localhost:8000/get-level/");
        setLevels(levelResponse.data);
      } catch (error) {
        console.error("Error fetching dropdown data:", error);
      }
    };

    fetchDropdownData();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:8000/add-programme/", formData);
      alert("Programme added successfully.");
      setFormData({
        programme_name: "",
        department: "",
        level: "",
        duration: "",
        no_of_pos: "",
      });
      navigate("/manage-programmes");
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
          Add Programme
        </Typography>

        {/* Programme Name Input */}
        <TextField
          fullWidth
          label="Programme Name"
          name="programme_name"
          value={formData.programme_name}
          onChange={handleChange}
          error={!!errors.programme_name}
          helperText={errors.programme_name}
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

        {/* Number of POs Input */}
        <TextField
          fullWidth
          label="Number of POs"
          name="no_of_pos"
          type="number"
          value={formData.no_of_pos}
          onChange={handleChange}
          error={!!errors.no_of_pos}
          helperText={errors.no_of_pos}
          margin="normal"
        />

        {/* Level Dropdown */}
        <FormControl fullWidth margin="normal" error={!!errors.level}>
          <InputLabel id="level-label">Level</InputLabel>
          <Select
            labelId="level-label"
            label="Level"
            name="level"
            value={formData.level}
            onChange={handleChange}
          >
            <MenuItem value="">
              <em>Select Level</em>
            </MenuItem>
            {levels.map((level) => (
              <MenuItem key={level.level_id} value={level.level_name}>
                {level.level_name}
              </MenuItem>
            ))}
          </Select>
          {errors.level && (
            <Typography variant="caption" color="error">
              {errors.level}
            </Typography>
          )}
        </FormControl>

        {/* Duration Input */}
        <TextField
          fullWidth
          label="Duration (in years)"
          name="duration"
          type="number"
          value={formData.duration}
          onChange={handleChange}
          error={!!errors.duration}
          helperText={errors.duration}
          margin="normal"
        />

        {/* Submit Button */}
        <Box display="flex" justifyContent="space-between" sx={{ mt: 2 }}>
          <Button
            variant="outlined"
            color="secondary"
            onClick={() => navigate("/manage-programmes")}
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

export default AddProgramme;
