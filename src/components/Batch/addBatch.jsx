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
  FormControlLabel,
  Checkbox,
  Autocomplete,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const AddBatchDrawer = ({ open, onClose, refreshBatches }) => {
  const [formData, setFormData] = useState({
    course: "",
    faculty_id: "",
    year: "",
    part: "",
    active: false,
  });

  const [errors, setErrors] = useState({});
  const [faculties, setFaculties] = useState([]);
  const [courses, setCourses] = useState([]);

  // Fetch faculties and courses on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [facultyRes, courseRes] = await Promise.all([
          axios.get("http://localhost:8000/get-faculty/"),
          axios.get("http://localhost:8000/get-courses/"),
        ]);
        setFaculties(facultyRes.data);
        setCourses(courseRes.data);
      } catch (error) {
        console.error("Error fetching dropdown data:", error);
      }
    };

    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:8000/add-batch/", formData);
      alert("Batch created successfully.");
      setFormData({
        course: "",
        faculty_id: "",
        year: "",
        part: "",
        active: false,
      });
      setErrors({});
      onClose(); // Close drawer
      refreshBatches(); // Refresh batch list
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
      <Box sx={{ width: 500, p: 3 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h5">Add Batch</Typography>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>

        <form onSubmit={handleSubmit}>
          {/* Course Dropdown */}
          <FormControl fullWidth margin="normal" error={!!errors.course}>
            <Autocomplete
              options={courses}
              getOptionLabel={(option) => option.title}
              value={
                courses.find((course) => course.title === formData.course) ||
                null
              }
              onChange={(event, newValue) => {
                setFormData({
                  ...formData,
                  course: newValue ? newValue.title : "",
                });
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Select Course"
                  variant="outlined"
                />
              )}
            />
            {errors.course && (
              <Typography variant="caption" color="error">
                {errors.course}
              </Typography>
            )}
          </FormControl>
          {/* Faculty Dropdown */}
          <FormControl fullWidth margin="normal" error={!!errors.faculty_id}>
            <Autocomplete
              options={faculties}
              getOptionLabel={(option) => option.name}
              value={
                faculties.find(
                  (faculty) => faculty.faculty_id === formData.faculty_id
                ) || null
              }
              onChange={(event, newValue) => {
                setFormData({
                  ...formData,
                  faculty_id: newValue ? newValue.faculty_id : "",
                });
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Select Faculty"
                  variant="outlined"
                  error={!!errors.faculty_id}
                  helperText={errors.faculty_id || ""}
                />
              )}
            />
          </FormControl>
          {/* Year Input */}
          <TextField
            fullWidth
            label="Year"
            name="year"
            type="number"
            value={formData.year}
            onChange={handleChange}
            error={!!errors.year}
            helperText={errors.year}
            margin="normal"
          />
          {/* Part Input */}
          <TextField
            fullWidth
            label="Part"
            name="part"
            value={formData.part}
            onChange={handleChange}
            error={!!errors.part}
            helperText={errors.part}
            margin="normal"
          />
          {/* Active Checkbox */}
          <FormControlLabel
            control={
              <Checkbox
                name="active"
                checked={formData.active}
                onChange={handleChange}
              />
            }
            label="Active"
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

export default AddBatchDrawer;
