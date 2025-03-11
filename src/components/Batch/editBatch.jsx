import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Button,
  TextField,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Box,
  Drawer,
  Typography,
  IconButton,
  Autocomplete,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import { Close } from "@mui/icons-material";

const EditBatchDrawer = ({ open, onClose, batchId, refreshBatches }) => {
  const [formData, setFormData] = useState({
    course: "",
    faculty: "",
    year: "",
    part: "",
    active: false,
  });
  const [courses, setCourses] = useState([]);
  const [faculties, setFaculties] = useState([]);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (!batchId) return;

    // Fetch the current batch details
    axios
      .get(`http://localhost:8000/batches/${batchId}/`)
      .then((response) => {
        setFormData({
          course: response.data.course,
          faculty: response.data.faculty,
          year: response.data.year,
          part: response.data.part,
          active: response.data.active,
        });
      })
      .catch((error) => console.error("Error fetching batch data:", error));

    // Fetch courses list
    axios
      .get("http://localhost:8000/get-courses/")
      .then((response) => setCourses(response.data))
      .catch((error) => console.error("Error fetching courses:", error));

    // Fetch faculties list
    axios
      .get("http://localhost:8000/get-faculty/")
      .then((response) => setFaculties(response.data))
      .catch((error) => console.error("Error fetching faculties:", error));
  }, [batchId]);

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
      await axios.put(
        `http://localhost:8000/batches/edit/${batchId}/`,
        formData
      );
      alert("Batch updated successfully.");
      onClose();
      refreshBatches();
    } catch (error) {
      console.error("Error updating batch:", error);
    }
  };

  return (
    <Drawer anchor="right" open={open} onClose={onClose}>
      <Box sx={{ width: 600, p: 3 }}>
        {/* Header */}
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h5">Edit Batch</Typography>
          <IconButton onClick={onClose}>
            <Close />
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
          <FormControl fullWidth margin="normal">
            <Autocomplete
              options={faculties}
              getOptionLabel={(faculty) => faculty.name}
              value={faculties.find((f) => f.name === formData.faculty) || null} // Ensure correct selection
              onChange={(event, newValue) => {
                setFormData({
                  ...formData,
                  faculty: newValue ? newValue.name : "",
                });
              }}
              renderInput={(params) => (
                <TextField {...params} label="Faculty" required />
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
            required
            margin="normal"
          />

          {/* Part Input */}
          <TextField
            fullWidth
            label="Part"
            name="part"
            value={formData.part}
            onChange={handleChange}
            required
            margin="normal"
          />

          {/* Active Checkbox */}
          <FormControlLabel
            control={
              <Checkbox
                name="active"
                checked={formData.active}
                onChange={(e) =>
                  setFormData({ ...formData, active: e.target.checked })
                }
              />
            }
            label="Active"
          />

          {/* Buttons */}
          <Box display="flex" justifyContent="flex-end" sx={{ mt: 2 }}>
            <Button variant="contained" type="submit">
              Update Batch
            </Button>
          </Box>
        </form>
      </Box>
    </Drawer>
  );
};

export default EditBatchDrawer;
