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
  FormGroup,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

const AddCO = () => {
  const [formData, setFormData] = useState({
    course: "",
    co_label: "",
    co_description: "",
    bloom_taxonomy: [], // Now an array to store multiple selections
  });

  const [errors, setErrors] = useState({});
  const [courses, setCourses] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get("http://localhost:8000/get-courses/");
        setCourses(response.data);
      } catch (error) {
        console.error("Error fetching courses:", error);
      }
    };
    fetchCourses();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleCheckboxChange = (e) => {
    const { value, checked } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      bloom_taxonomy: checked
        ? [...prevState.bloom_taxonomy, value]
        : prevState.bloom_taxonomy.filter((item) => item !== value),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:8000/add-cos/", formData);
      alert("CO added successfully.");
      setFormData({
        course: "",
        co_label: "",
        co_description: "",
        bloom_taxonomy: [],
      });
      navigate("/manage-co");
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
          Add CO
        </Typography>

        <FormControl fullWidth margin="normal" error={!!errors.course}>
          <InputLabel id="course-label">Course</InputLabel>
          <Select
            labelId="course-label"
            label="Course"
            name="course"
            value={formData.course}
            onChange={handleChange}
          >
            <MenuItem value="">
              <em>Select Course</em>
            </MenuItem>
            {courses.map((course) => (
              <MenuItem key={course.id} value={course.title}>
                {course.title}
              </MenuItem>
            ))}
          </Select>
          {errors.course && (
            <Typography variant="caption" color="error">
              {errors.course}
            </Typography>
          )}
        </FormControl>

        <TextField
          fullWidth
          label="CO Label"
          name="co_label"
          value={formData.co_label}
          onChange={handleChange}
          error={!!errors.co_label}
          helperText={errors.co_label}
          margin="normal"
        />

        <TextField
          fullWidth
          label="CO Description"
          name="co_description"
          multiline
          rows={3}
          value={formData.co_description}
          onChange={handleChange}
          error={!!errors.co_description}
          helperText={errors.co_description}
          margin="normal"
        />

        <FormControl component="fieldset" margin="normal" error={!!errors.bloom_taxonomy}>
          <Typography variant="h6">Select Bloom's Taxonomy Levels</Typography>
          <FormGroup>
            {[
              "remember",
              "understand",
              "apply",
              "analyze",
              "evaluate",
              "create",
            ].map((level) => (
              <FormControlLabel
                key={level}
                control={
                  <Checkbox
                    checked={formData.bloom_taxonomy.includes(level)}
                    onChange={handleCheckboxChange}
                    value={level}
                  />
                }
                label={level.charAt(0).toUpperCase() + level.slice(1)}
              />
            ))}
          </FormGroup>
          {errors.bloom_taxonomy && (
            <Typography variant="caption" color="error">
              {errors.bloom_taxonomy}
            </Typography>
          )}
        </FormControl>

        <Box display="flex" justifyContent="space-between" sx={{ mt: 2 }}>
          <Button
            variant="outlined"
            color="secondary"
            onClick={() => navigate("/manage-co")}
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

export default AddCO;
