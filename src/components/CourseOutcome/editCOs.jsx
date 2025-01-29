import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import {
  Button,
  Container,
  TextField,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Box,
} from "@mui/material";

const EditCO = () => {
  const { coId } = useParams();
  const [formData, setFormData] = useState({
    course: "",
    co_label: "",
    co_description: "",
    remember: "",
    understand: "",
    apply: "",
    analyze: "",
    evaluate: "",
    create: "",
  });
  const [courses, setCourses] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch CO details
    axios
      .get(`http://localhost:8000/get-co/${coId}/`)
      .then((response) => {
        setFormData(response.data);
      })
      .catch((error) => {
        console.error("Error fetching CO data:", error);
      });

    // Fetch courses list
    axios
      .get("http://localhost:8000/get-courses/")
      .then((response) => {
        setCourses(response.data);
      })
      .catch((error) => {
        console.error("Error fetching courses:", error);
      });
  }, [coId]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .put(`http://localhost:8000/update-co/${coId}/`, formData)
      .then(() => {
        navigate("/manage-co");
      })
      .catch((error) => {
        console.error("Error updating CO:", error);
      });
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 5 }}>
      <h2>Edit CO</h2>
      <form onSubmit={handleSubmit}>
        {/* Course Dropdown */}
        <FormControl fullWidth margin="normal">
          <InputLabel id="course-label">Course</InputLabel>
          <Select
            labelId="course-label"
            name="course"
            value={formData.course}
            onChange={handleChange}
            required
          >
            <MenuItem value="">
              <em>Select Course</em>
            </MenuItem>
            {courses.map((course) => (
              <MenuItem key={course.id} value={course.id}>
                {course.title}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* CO Label */}
        <TextField
          fullWidth
          label="CO Label"
          name="co_label"
          value={formData.co_label}
          onChange={handleChange}
          required
          margin="normal"
        />

        {/* CO Description */}
        <TextField
          fullWidth
          label="CO Description"
          name="co_description"
          multiline
          rows={3}
          value={formData.co_description}
          onChange={handleChange}
          required
          margin="normal"
        />

        {/* Bloom's Taxonomy Fields */}
        {["remember", "understand", "apply", "analyze", "evaluate", "create"].map(
          (field) => (
            <TextField
              key={field}
              fullWidth
              label={field.charAt(0).toUpperCase() + field.slice(1)}
              name={field}
              type="number"
              value={formData[field]}
              onChange={handleChange}
              required
              margin="normal"
            />
          )
        )}

        {/* Buttons */}
        <Box display="flex" justifyContent="space-between" sx={{ mt: 2 }}>
          <Button
            variant="outlined"
            color="secondary"
            onClick={() => navigate("/manage-co")}
          >
            Back
          </Button>
          <Button variant="contained" type="submit">
            Update CO
          </Button>
        </Box>
      </form>
    </Container>
  );
};

export default EditCO;
