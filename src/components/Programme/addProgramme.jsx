import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Drawer,
  TextField,
  Button,
  Box,
  MenuItem,
  Typography,
  Select,
  FormControl,
  InputLabel,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const AddProgramme = ({ open, onClose, refreshProgrammes }) => {
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

  useEffect(() => {
    const fetchDropdownData = async () => {
      try {
        const deptResponse = await axios.get(
          "http://localhost:8000/get-department/"
        );
        setDepartments(deptResponse.data);

        const levelResponse = await axios.get(
          "http://localhost:8000/get-level/"
        );
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
      setErrors({});
      onClose(); // Close the drawer
      refreshProgrammes(); // Refresh programme list
    } catch (error) {
      if (error.response && error.response.data) {
        setErrors(error.response.data);
      } else {
        alert("An error occurred. Please try again.");
      }
    }
  };

  return (
    <Drawer anchor="right" open={open} onClose={onClose}>
      <Box sx={{ width: 600, p: 3 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h5">Add Programme</Typography>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>

        <form onSubmit={handleSubmit}>
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
            <InputLabel>Department</InputLabel>
            <Select
              name="department"
              label="Department"
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
            <InputLabel>Level</InputLabel>
            <Select name="level" value={formData.level} label="Level" onChange={handleChange}>
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
          <Box mt={2} display="flex" justifyContent="flex-end">
            <Button variant="contained" type="submit">
              Submit
            </Button>
          </Box>
        </form>
      </Box>
    </Drawer>
  );
};

export default AddProgramme;
