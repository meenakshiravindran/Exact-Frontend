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
  Typography,
  FormControlLabel,
  Radio,
  RadioGroup,
  FormLabel,
} from "@mui/material";

const EditCO = () => {
  const { coId } = useParams();
  const [formData, setFormData] = useState({
    course: "",
    co_label: "",
    co_description: "",
    bloom_taxonomy: "", // Store selected Bloom's taxonomy level
  });
  const [courses, setCourses] = useState([]);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch CO details using correct API endpoint
        const coResponse = await axios.get(`http://localhost:8000/cos/${coId}/`);
        setFormData(coResponse.data);

        // Fetch course list
        const courseResponse = await axios.get("http://localhost:8000/get-courses/");
        setCourses(courseResponse.data);

        setLoading(false);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load data. Please try again.");
        setLoading(false);
      }
    };

    fetchData();
  }, [coId]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:8000/cos/edit/${coId}/`, formData);
      navigate("/manage-co");
    } catch (err) {
      console.error("Error updating CO:", err);
      setError("Failed to update CO. Please try again.");
    }
  };

  if (loading) return <Typography>Loading...</Typography>;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <Container maxWidth="sm" sx={{ mt: 5 }}>
      <Typography variant="h4" align="center" gutterBottom>
        Edit CO
      </Typography>

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
              <MenuItem key={course.course_id} value={course.title}>
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

        {/* Bloom's Taxonomy Radio Buttons */}
        <FormControl component="fieldset" margin="normal" required>
          <FormLabel component="legend">Select Bloom's Taxonomy Level</FormLabel>
          <RadioGroup
            name="bloom_taxonomy"
            value={formData.bloom_taxonomy}
            onChange={handleChange}
          >
            {["remember", "understand", "apply", "analyze", "evaluate", "create"].map((level) => (
              <FormControlLabel
                key={level}
                value={level}
                control={<Radio />}
                label={level.charAt(0).toUpperCase() + level.slice(1)}
              />
            ))}
          </RadioGroup>
        </FormControl>

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
